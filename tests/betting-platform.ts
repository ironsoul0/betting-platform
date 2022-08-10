import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { BN } from "bn.js";
import { nanoid } from "nanoid";
import { SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

import { BettingPlatform } from "../target/types/betting_platform";

const BET_EVENT_ID_SIZE = 8;
const TAKER_BET_SIZE = 1e8;
const TAKER_FEE_SIZE = 2e6;
const LAMPORTS_PER_SOL = 1e9;

const getAirdrop = async (
  provider: AnchorProvider,
  pk: anchor.web3.PublicKey,
  amount: number
) => {
  const airdropSig = await provider.connection.requestAirdrop(pk, amount * LAMPORTS_PER_SOL);
  const latestSellerBlockhash = await provider.connection.getLatestBlockhash();
  await provider.connection.confirmTransaction({
    blockhash: latestSellerBlockhash.blockhash,
    lastValidBlockHeight: latestSellerBlockhash.lastValidBlockHeight,
    signature: airdropSig,
  });
};

describe("betting-platform", () => {
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.BettingPlatform as Program<BettingPlatform>;

  anchor.setProvider(provider);

  it("Creates a bet with bet size 3 SOL", async () => {
    const initializer = anchor.web3.Keypair.generate();
    await getAirdrop(provider, initializer.publicKey, 5);

    const betResolver = anchor.web3.Keypair.generate();
    const betAccount = anchor.web3.Keypair.generate();
    const event_id = nanoid(BET_EVENT_ID_SIZE);
    const betSize = new BN(3 * LAMPORTS_PER_SOL);

    await program.methods
      .createBet(event_id, 0, betSize)
      .accounts({
        initializer: initializer.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([initializer, betAccount])
      .rpc();

    const resolverBalance = await provider.connection.getBalance(
      betResolver.publicKey
    );
    assert.equal(resolverBalance, betSize.toNumber());

    const bet = (await program.account.bet.all()).filter(
      (bet) => bet.publicKey.toString() == betAccount.publicKey.toString()
    )[0];
    assert.equal(bet.account.betSize.toNumber(), betSize.toNumber());
    assert.equal(bet.account.eventId, event_id);
    assert.equal(bet.account.makerSide, 0);
    assert.equal(
      bet.account.maker.toString(),
      initializer.publicKey.toString()
    );
    assert.equal(
      bet.account.betResolver.toString(),
      betResolver.publicKey.toString()
    );
    assert.ok(!!bet.account.status["inProgress"]);
  });

  it("Successfully matches bet", async () => {
    const initializer = anchor.web3.Keypair.generate();
    await getAirdrop(provider, initializer.publicKey, 5);

    const betResolver = anchor.web3.Keypair.generate();
    const betAccount = anchor.web3.Keypair.generate();
    const event_id = nanoid(BET_EVENT_ID_SIZE);
    const betSize = new BN(3 * LAMPORTS_PER_SOL);

    await program.methods
      .createBet(event_id, 1, betSize)
      .accounts({
        initializer: initializer.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([initializer, betAccount])
      .rpc();

    const resolverBalanceInit = await provider.connection.getBalance(
      betResolver.publicKey
    );
    assert.equal(resolverBalanceInit, betSize.toNumber());

    const taker = anchor.web3.Keypair.generate();
    await getAirdrop(provider, taker.publicKey, 5);

    await program.methods
      .matchBet()
      .accounts({
        initializer: taker.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([taker])
      .rpc();

    const bet = (await program.account.bet.all()).filter(
      (bet) => bet.publicKey.toString() == betAccount.publicKey.toString()
    )[0];
    assert.equal(bet.account.betSize.toNumber(), betSize.toNumber());
    assert.equal(bet.account.eventId, event_id);
    assert.equal(bet.account.makerSide, 1);
    assert.equal(
      bet.account.betResolver.toString(),
      betResolver.publicKey.toString()
    );
    assert.equal(bet.account.taker.toString(), taker.publicKey.toString());
    assert.equal(
      bet.account.maker.toString(),
      initializer.publicKey.toString()
    );
    assert.ok(!!bet.account.status["matched"]);

    const resolverBalance = await provider.connection.getBalance(
      betResolver.publicKey
    );
    assert.equal(
      resolverBalance,
      betSize.toNumber() + TAKER_BET_SIZE + TAKER_FEE_SIZE
    );
  });

  it("Match bet and resolve it", async () => {
    const initializer = anchor.web3.Keypair.generate();
    await getAirdrop(provider, initializer.publicKey, 5);

    const betResolver = anchor.web3.Keypair.generate();
    const betAccount = anchor.web3.Keypair.generate();
    const event_id = nanoid(BET_EVENT_ID_SIZE);
    const betSize = new BN(3 * LAMPORTS_PER_SOL);

    await program.methods
      .createBet(event_id, 1, betSize)
      .accounts({
        initializer: initializer.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([initializer, betAccount])
      .rpc();

    const taker = anchor.web3.Keypair.generate();
    await getAirdrop(provider, taker.publicKey, 5);

    await program.methods
      .matchBet()
      .accounts({
        initializer: taker.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([taker])
      .rpc();

    const resolverBalanceBefore = await provider.connection.getBalance(
      betResolver.publicKey
    );
    const makerBalanceBefore = await provider.connection.getBalance(
      initializer.publicKey
    );
    const takerBalanceBefore = await provider.connection.getBalance(
      taker.publicKey
    );

    await program.methods
      .resolveBet(1)
      .accounts({
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        makerAccount: initializer.publicKey,
        takerAccount: taker.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([betResolver])
      .rpc();

    const resolverBalanceAfter = await provider.connection.getBalance(
      betResolver.publicKey
    );
    const makerBalanceAfter = await provider.connection.getBalance(
      initializer.publicKey
    );
    const takerBalanceAfter = await provider.connection.getBalance(
      taker.publicKey
    );
    assert.equal(
      resolverBalanceBefore,
      betSize.toNumber() + TAKER_BET_SIZE + TAKER_FEE_SIZE
    );
    assert.equal(resolverBalanceAfter, TAKER_FEE_SIZE);

    assert.equal(makerBalanceAfter - makerBalanceBefore, 0);
    assert.equal(
      takerBalanceAfter - takerBalanceBefore,
      betSize.toNumber() + TAKER_BET_SIZE
    );

    const bet = (await program.account.bet.all()).filter(
      (bet) => bet.publicKey.toString() == betAccount.publicKey.toString()
    )[0];
    assert.ok(!!bet.account.status["completed"]);
  });

  it("Try to resolve unmatched bet", async () => {
    const initializer = anchor.web3.Keypair.generate();
    await getAirdrop(provider, initializer.publicKey, 5);

    const betResolver = anchor.web3.Keypair.generate();
    const betAccount = anchor.web3.Keypair.generate();
    const event_id = nanoid(BET_EVENT_ID_SIZE);
    const betSize = new BN(3 * LAMPORTS_PER_SOL);

    await program.methods
      .createBet(event_id, 1, betSize)
      .accounts({
        initializer: initializer.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([initializer, betAccount])
      .rpc();

    const bet = (await program.account.bet.all()).filter(
      (bet) => bet.publicKey.toString() == betAccount.publicKey.toString()
    )[0];
    assert.ok(!!bet.account.status["inProgress"]);

    const resolverBalanceBefore = await provider.connection.getBalance(
      betResolver.publicKey
    );
    const makerBalanceBefore = await provider.connection.getBalance(
      initializer.publicKey
    );

    await program.methods
      .resolveBet(1)
      .accounts({
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        makerAccount: initializer.publicKey,
        takerAccount: bet.account.taker,
        systemProgram: SystemProgram.programId,
      })
      .signers([betResolver])
      .rpc();

    const resolverBalanceAfter = await provider.connection.getBalance(
      betResolver.publicKey
    );
    const makerBalanceAfter = await provider.connection.getBalance(
      initializer.publicKey
    );

    assert.equal(
      resolverBalanceBefore - resolverBalanceAfter,
      betSize.toNumber()
    );
    assert.equal(makerBalanceAfter - makerBalanceBefore, betSize.toNumber());

    const betAfter = (await program.account.bet.all()).filter(
      (bet) => bet.publicKey.toString() == betAccount.publicKey.toString()
    )[0];
    assert.ok(!!betAfter.account.status["completed"]);
  });
});
