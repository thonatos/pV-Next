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

  const onChangeNetwork = async () => {
    if (!web3) {
      return;
    }

    try {
      // @ts-ignore
      await web3?.currentProvider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          // @ts-ignore
          await web3?.currentProvider?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                chainName: 'BNB Smart Chain Testnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com'],
              },
            ],
          });
        } catch (addError) {}
      }
    }
  };

  const renderChangeNetwork = () => {
    if (!web3) {
      return null;
    }

    const { chainId } = web3.givenProvider;

    if (chainId === '0x61') {
      return null;
    }

    return (
      <small>
        <button onClick={onChangeNetwork}>Switch to BSC Test Network</button>
      </small>
    );
  };

  const renderBlockchain = () => {
    if (!web3) {
      return null;
    }

    const { chainId, networkVersion } = web3.givenProvider;

    return (
      <div>
        <h4>Provider</h4>
        <p>
          ChainId: {chainId} {renderChangeNetwork()}
        </p>
        <p>NetworkVersion: {networkVersion}</p>
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
        <p>
          <small className={styles.tips}>
            Click wallet address to Sign-In with Ethereum .
          </small>
        </p>
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
        <div>
          <h2>ρV - undefined project</h2>
          <p>
            <small className={styles.tips}>
              Please install{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
              >
                MetaMask
              </a>{' '}
              or open site with DApp Browser.
            </small>
          </p>
          <p>SSO - Auth provider powered by Ethereum & Next.js .</p>
        </div>

        <div>
          <h4>Proposals</h4>
          <ul>
            <li>
              <a
                href="https://eips.ethereum.org/EIPS/eip-4361"
                target="_blank"
                rel="noreferrer"
              >
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
