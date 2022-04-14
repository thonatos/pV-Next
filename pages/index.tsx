import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import type { NextPage, NextPageContext } from 'next';

import styles from './index.module.css';
import useWallet from 'hooks/useWallet';

const Home: NextPage = () => {
  const { accounts, setWeb3 } = useWallet();

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`/api/init`);
      const { data } = await res.json();
      console.debug('===HomePage', data);
    };

    init();
  }, []);

  console.debug('===HomePage.accounts', accounts);

  const renderAccountList = () => {
    if (!accounts || accounts.length === 0) {
      return null;
    }

    return (
      <div>
        <h4>accounts</h4>
        <ul className={styles.ul}>
          {accounts.map((account) => {
            return <li key={account}>{account}</li>;
          })}
        </ul>
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
        <h3>ρV - undefined project</h3>

        {renderAccountList()}
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
