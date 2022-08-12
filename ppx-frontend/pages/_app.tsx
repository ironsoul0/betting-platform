import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import Navigator from "../components/Navigator";
import { Wallet } from "../components/WalletProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Wallet>
      <ToastContainer />
      <div className="mx-auto max-w-7xl">
        <Navigator />
        <Component {...pageProps} />
      </div>
    </Wallet>
  );
}

export default MyApp;
