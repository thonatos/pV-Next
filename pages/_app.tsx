import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  console.log('_app.pageProps', pageProps);
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default App;
