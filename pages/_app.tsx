import './globals.css';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  console.log('_app.pageProps', pageProps);
  return <Component {...pageProps} />;
}

export default App;
