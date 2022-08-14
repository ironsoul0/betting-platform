import * as anchor from "@project-serum/anchor";
import { AnchorProvider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";

import { BettingPlatform, config } from "../config";
import { useIsClient } from "./useIsClient";

const connection = new Connection(config.clusterUrl);

export const useSolana = () => {
  const wallet = useWallet();
  const client = useIsClient();

  const provider = useMemo(() => {
    if (!client) return null;
    console.log("provider?..");

    const { signTransaction, signAllTransactions, publicKey } = wallet;
    const anchorProvider = new AnchorProvider(
      connection,
      publicKey && signTransaction && signAllTransactions
        ? { publicKey, signTransaction, signAllTransactions }
        : config.fakeWallet,
      AnchorProvider.defaultOptions()
    );
    anchor.setProvider(anchorProvider);

    return anchorProvider;
  }, [wallet, client]);

  const program = useMemo(() => {
    if (!provider || !client) return null;
    console.log("program?..");

    return new anchor.Program<BettingPlatform>(
      config.IDL,
      config.programID,
      provider
    );
  }, [provider, client]);

  return { wallet, provider, program };
};
