import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { BN } from "bn.js";
import { nanoid } from 'nanoid';
import { SystemProgram } from "@solana/web3.js";

const BET_EVENT_ID_SIZE = 8;

import { BettingPlatform } from "../target/types/betting_platform";

const getAirdrop = async (provider: AnchorProvider, pk: anchor.web3.PublicKey, amount: number) => {
  const airdropSig = await provider.connection.requestAirdrop(
    pk,
    amount * 1e9
  );
  const latestSellerBlockhash = await provider.connection.getLatestBlockhash();
  await provider.connection.confirmTransaction({
    blockhash: latestSellerBlockhash.blockhash,
    lastValidBlockHeight: latestSellerBlockhash.lastValidBlockHeight,
    signature: airdropSig,
  });
}

describe("betting-platform", () => {
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.BettingPlatform as Program<BettingPlatform>;

  anchor.setProvider(provider);

  it("Creates a bet with multiplier 1", async () => {
    await getAirdrop(provider, provider.wallet.publicKey, 5);

    const providerBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    console.log("providerBalance", providerBalance);

    const betAccount = anchor.web3.Keypair.generate();
    const betResolver = anchor.web3.Keypair.generate();
    const event_id = nanoid(BET_EVENT_ID_SIZE);

    console.log(event_id);

    await program.methods
      .createBet(event_id, 0, new BN(1e9))
      .accounts({
        initializer: provider.wallet.publicKey,
        betAccount: betAccount.publicKey,
        betResolver: betResolver.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([betAccount])
      .rpc();

    const initializerBalance = await provider.connection.getBalance(betResolver.publicKey);
    console.log(initializerBalance);
  });
});
