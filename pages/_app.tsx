import type { AppProps } from 'next/app'
import {RecoilRoot} from 'recoil'  
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import Layout from '../components/layout/layout';

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "375px",
  lg: "425px",
  xl: "768px",
  "2xl": "1024px",
});

const colors = {
  brand: {
    "lbrn": "#EFD09E",
    "brn": "#D4AA7D",
    "dbrn": "#483D3F",
    "lgrn": "#D2D8B3",
    "dgrn": "#52796F",
  },
};

const theme = extendTheme({ colors, breakpoints });

function MyApp({ Component, pageProps, ...AppProps }: AppProps) {

  if ([`/`].includes(AppProps.router.pathname))
    return (
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ChakraProvider>)
  else return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </ChakraProvider>
  );
}
export default MyApp;
