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
          <a href="https://ibb.co/yP2vCNL">
            <img
              src="https://i.ibb.co/g9Yq8rs/logo-v4-horizontal-transparent.png"
              alt="logo-v4-horizontal-transparent"
              className="fill-current h-8 w-8 mr-2" width="54" height="54" 
            />
          </a>
        </Link>
        <Link href="/jupiter">
          <a >Jupiter</a>
        </Link>
        <Link href="/raydium">
          <a >Raydium</a>
        </Link>
      </div>
      <WalletModalProvider>
        {wallet.connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </WalletModalProvider>
    </div>
  );
};

export default Navigator;