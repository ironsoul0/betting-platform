import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BettingPlatform } from "../target/types/betting_platform";

describe("betting-platform", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BettingPlatform as Program<BettingPlatform>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
