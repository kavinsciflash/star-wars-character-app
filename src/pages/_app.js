import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import Head from 'next/head';

const GlobalStyle = () => (
  <Global
    styles={css`
      body {
        background-color: white;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    `}
  />
);

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <GlobalStyle />
      <Head>
        <title>Star Wars Character App</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
