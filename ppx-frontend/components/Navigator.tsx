import { FunctionComponent } from "react";
import Link from "next/link";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const Navigator: FunctionComponent = () => {
  const wallet = useWallet();
  return (
    <div className="flex items-center justify-between flex-wrap p-6">
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <Link href="/" passHref>
          PPX
        </Link>
      </div>
      <WalletModalProvider>
        {wallet.connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </WalletModalProvider>
    </div>
  );
};

export default Navigator;