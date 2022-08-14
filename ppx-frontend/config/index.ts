import { NodeWallet } from "@metaplex/js";
import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import { IDL } from "./types";

const network = WalletAdapterNetwork.Devnet;
const programID = "D4UrKTKSAjFvqxAWvgJS1HUfegGDwpks5EjP5VEWwGHf";
const resolver = "Cmjy6gdANoviadAxkYdxBdmzLgsUDVdqrecJahM94Vzr";
const clusterUrl = clusterApiUrl(WalletAdapterNetwork.Devnet);

const leakedKp = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from([
    208, 175, 150, 242, 88, 34, 108, 88, 177, 16, 168, 75, 115, 181, 199, 242,
    120, 4, 78, 75, 19, 227, 13, 215, 184, 108, 226, 53, 111, 149, 179, 84, 137,
    121, 79, 1, 160, 223, 124, 241, 202, 203, 220, 237, 50, 242, 57, 158, 226,
    207, 203, 188, 43, 28, 70, 110, 214, 234, 251, 15, 249, 157, 62, 80,
  ])
);

const fakeWallet = new NodeWallet(leakedKp);

export const config = {
  network,
  clusterUrl,
  fakeWallet,
  programID: new PublicKey(programID),
  IDL,
  connection: new Connection(clusterUrl),
  apiUrl: "https://ppx.ironsoul.lol",
  betResolver: new PublicKey(resolver),
};

export * from "./types";
