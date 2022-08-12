import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { FunctionComponent } from "react";

const Navigator: FunctionComponent = () => {
  const wallet = useWallet();

  return (
    <div className="flex items-center justify-between p-6">
      <Link href="/" passHref>
        <h1 className="text-2xl font-bold">PPX.GG</h1>
      </Link>
      <div className="flex items-center">
        <button
          type="button"
          className="px-5 py-3 mr-2 text-sm font-medium text-white rounded-lg"
        >
          Create Bet
        </button>
        <WalletModalProvider>
          {wallet.connected ? (
            <WalletDisconnectButton />
          ) : (
            <WalletMultiButton />
          )}
        </WalletModalProvider>
      </div>
    </div>
  );
};

export default Navigator;
