import * as anchor from "@project-serum/anchor";
import { AnchorProvider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";

import { BettingPlatform, config } from "../config";

const connection = new Connection(config.clusterUrl);

export const useSolana = () => {
  const wallet = useWallet();

  const provider = useMemo(() => {
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
  }, [wallet]);

  const program = useMemo(() => {
    return new anchor.Program<BettingPlatform>(
      config.IDL,
      config.programID,
      provider
    );
  }, [provider]);

  return { wallet, provider, program };
};
