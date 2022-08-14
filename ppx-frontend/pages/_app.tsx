import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import Navigator from "../components/Navigator";
import { Wallet } from "../components/WalletProvider";
import { ModalProvider } from "../config/context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Wallet>
      <Head>
        <title>PPX.GG</title>
        <meta name="description" content="PPX.GG | Betting made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ModalProvider>
        <ToastContainer />
        <div className="mx-auto max-w-7xl">
          <Navigator />
          <Component {...pageProps} />
        </div>
      </ModalProvider>
    </Wallet>
  );
}

export default MyApp;
