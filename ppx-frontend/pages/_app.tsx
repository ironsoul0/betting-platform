import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

import Navigator from "../components/Navigator";
import { ModalProvider } from "../config/context";

const Wallet = dynamic(() => import("../components/WalletProvider"), {
  ssr: false,
});

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
