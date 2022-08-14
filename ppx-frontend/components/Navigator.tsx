import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { FunctionComponent } from "react";

import { useModalContext } from "../config/context";

const Navigator: FunctionComponent = () => {
  const { setShow } = useModalContext();
  const wallet = useWallet();

  return (
    <div className="items-center justify-between p-6 md:flex">
      <Link href="/" passHref>
        <img
          src="/PPX.png"
          alt="PPX"
          className="w-16 mx-auto cursor-pointer md:mx-0"
        />
      </Link>
      <div className="items-center justify-between md:flex">
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
