import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import type { NextPage, NextPageContext } from 'next';

import styles from './index.module.css';
import useWallet from 'hooks/useWallet';

const Home: NextPage = () => {
  const [nonce, setNonce] = useState('');
  const { web3, setWeb3, accounts, personalSign } = useWallet();

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`/api/init`);
      const { data } = await res.json();
      console.debug('===HomePage', data);

      setNonce(data.nonce);
    };

    init();
  }, []);

  const onLogin = async (account: string) => {
    const signData = await personalSign(account, nonce);
    const res = await fetch('/api/login', {
      method: 'post',
      body: JSON.stringify(signData),
    });
    const { data } = await res.json();
    console.debug('===HomePage.onLogin.data', data);
  };

  const renderBlockchain = () => {
    if (!web3) {
      return null;
    }

    const { chainId, networkVersion } = web3.givenProvider;

    return (
      <div>
        <h4>Provider</h4>
        <div>ChainId: {chainId}</div>
        <div>NetworkVersion: {networkVersion}</div>
      </div>
    );
  };

  const renderAccountInfo = () => {
    if (!accounts || accounts.length === 0) {
      return null;
    }

    return (
      <div>
        <h4>Accounts</h4>
        <p>Click wallet address to Sign-In with Ethereum .</p>
        <div>
          {accounts.map((account) => {
            return (
              <div
                key={account}
                className={styles.account}
                onClick={() => {
                  onLogin(account);
                }}
              >
                {account}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Home - ρV</title>
        <meta name="description" content="undefined project - ρV" />
        <link rel="icon" href="//s.implements.io/a/f/favicon.png" />
      </Head>

      <Script
        id="web3"
        src="//cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
        onLoad={() => {
          const _web3 = new window.Web3(window?.ethereum);
          // @ts-ignore
          window._web3 = _web3;
          setWeb3(_web3);
          console.debug('===HomePage.web3.loaded');
        }}
      />

      <main className={styles.main}>
        <h2>
          ρV{`   `}
          <small>undefined project</small>
        </h2>
        <div>
          <p>SSO - Auth provider powered by Ethereum & Next.js .</p>
          <p>Proposals:</p>
          <ul>
            <li>
              <a href="https://eips.ethereum.org/EIPS/eip-4361" target="_blank">
                EIP-4361: Sign-In with Ethereum.
              </a>
            </li>
          </ul>
        </div>

        {renderBlockchain()}
        {renderAccountInfo()}
      </main>

      <footer className={styles.footer}>
        {`@${new Date().getFullYear()} - implements.io`}
      </footer>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  console.log('===index.context', context.query);

  return {
    props: {}, // will be passed to the page component as props
  };
}
