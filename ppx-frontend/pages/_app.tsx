import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Navigator from "../components/Navigator";
import { Wallet } from "../components/WalletProvider";



function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Wallet>
        <Navigator />
        <Component {...pageProps} />  
      </Wallet>
    </>
  )
    
}

export default MyApp
