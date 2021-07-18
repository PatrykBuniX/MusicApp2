import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <title>MusicApp2</title>
        <meta
          name="description"
          content="MusicApp2 - simple music app built with react, redux and Deezer API."
        />
      </Head>
    </>
  );
};
export default MyApp;
