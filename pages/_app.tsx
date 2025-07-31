// D:\BPS_Dashboard\ai-data-dashboard\pages\_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import gtag from "../lib/gtag"; 

// Import Chakra UI dan tema 
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme'; 
import Head from 'next/head'; 

gtag.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID); 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}