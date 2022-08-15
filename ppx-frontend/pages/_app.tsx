import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import Navigator from "../components/Navigator";
import { config } from "../config";
import { ModalProvider } from "../config/context";

const WalletProvider = dynamic(
  () => import("../components/ClientWalletProvider"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={config.clusterUrl}>
      <WalletProvider>
        <Head>
          <title>PPX.BET</title>
          <meta name="description" content="PPX.BET | Betting made easy" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ModalProvider>
          <ToastContainer />
          <div className="mx-auto max-w-7xl">
            <Navigator />
            <Component {...pageProps} />
          </div>
        </ModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
