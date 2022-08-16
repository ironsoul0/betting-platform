import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { FunctionComponent } from "react";
import { BsTwitter } from "react-icons/bs";
import { useModalContext } from "../config/context";

const Navigator: FunctionComponent = () => {
  const { setShow } = useModalContext();
  const wallet = useWallet();

  return (
    <div className="items-center justify-between p-6 md:flex">
      <Link href="/" passHref>
        <div className="cursor-pointer">
          <img src="/PPX.png" alt="PPX" className="w-16 mx-auto md:mx-0" />
          <p className="mt-1 text-sm text-center medium md:text-left">
            Currently on Devnet
          </p>
        </div>
      </Link>

      <div className="items-center justify-between md:flex">
        <div className="mr-6">
          <Link
            href="https://twitter.com/PPXBet?s=20&t=Zjuk60SAH89bPvXt6V5Lwg/"
            passHref
          >
            <BsTwitter />
          </Link>
        </div>
        <div className="flex justify-center mx-auto my-3 md:my-0">
          {wallet.connected && (
            <>
              <Link href="/bets">
                <a className="px-5 py-3 mr-2 text-sm font-medium text-white rounded-lg">
                  My bets
                </a>
              </Link>
              <button
                type="button"
                className="block px-5 py-3 mr-2 text-sm font-medium text-white rounded-lg"
                onClick={() => setShow(true)}
              >
                Create Bet
              </button>
            </>
          )}
          <Link href="/about">
            <a className="px-5 py-3 text-sm font-medium text-white rounded-lg md:mr-6 md:my-0">
              About
            </a>
          </Link>
        </div>
        {wallet.connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </div>
    </div>
  );
};

export default Navigator;
