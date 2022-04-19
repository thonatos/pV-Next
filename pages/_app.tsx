import 'antd/dist/antd.css';
import './globals.css';

import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default App;
