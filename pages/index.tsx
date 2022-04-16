import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import type { NextPage, NextPageContext } from 'next';
import { Spacer, Button, Text } from '@nextui-org/react';

import HomeLayout from 'layout/HomeLayout';
import useWallet from 'hooks/useWallet';

const Home: NextPage = () => {
  const [nonce, setNonce] = useState('');
  const {
    web3,
    chainId,
    initProvider,
    addEthereumChain,
    switchEthereumChain,

    accounts,
    personalSign,
  } = useWallet();

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`/api/init`);
      const { data } = await res.json();
      console.debug('===init', data);

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
    console.debug('===onLogin.data', data);
  };

  const onChangeNetwork = async () => {
    if (!web3) {
      return;
    }

    const switchChain = await switchEthereumChain();

    if (switchChain?.success) {
      window.location.reload();
      return;
    }

    if (switchChain?.error.code === 4902) {
      await addEthereumChain();
      window.location.reload();
    }
  };

  const renderChangeNetwork = () => {
    if (!web3) {
      return null;
    }

    if (chainId === '0x61') {
      return null;
    }

    return (
      <>
        <Button size="sm" onClick={onChangeNetwork}>
          Switch to BSC Test Network
        </Button>
        <Spacer />
      </>
    );
  };

  const renderBlockchain = () => {
    if (!web3 || !web3.givenProvider) {
      return null;
    }

    const { networkVersion } = web3.givenProvider;

    return (
      <div>
        <Text h4>Provider</Text>
        <Spacer />
        <Text>ChainId: {chainId}</Text>
        <Text>NetworkVersion: {networkVersion}</Text>
        <Spacer />
        {renderChangeNetwork()}
      </div>
    );
  };

  const renderAccountInfo = () => {
    if (!accounts || accounts.length === 0) {
      return null;
    }

    return (
      <div>
        <Text h4>Accounts</Text>
        <Spacer />
        <Text blockquote>Click wallet address to Sign-In with Ethereum .</Text>
        <Spacer />
        <div>
          {accounts.map((account) => {
            return (
              <Text
                key={account}
                onClick={() => {
                  if (chainId !== '0x61') {
                    alert('please switch to Switch to BSC Test Network!');
                    return;
                  }
                  onLogin(account);
                }}
              >
                {account}
              </Text>
            );
          })}
        </div>
        <Spacer />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Home - ρV</title>
        <meta name="description" content="undefined project - ρV" />
        <link rel="icon" href="//s.implements.io/a/f/favicon.png" />
      </Head>

      <Script
        id="web3"
        src="//cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
        onLoad={() => {
          initProvider();
        }}
      />

      <HomeLayout>
        <div>
          <Text h2>ρV - undefined project</Text>
          <Spacer />
          <Text blockquote>
            Please install{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
            >
              MetaMask
            </a>{' '}
            or open site with DApp Browser.
          </Text>
          <Spacer />
          <Text>SSO - Auth provider powered by Ethereum & Next.js .</Text>
          <Spacer />
        </div>

        <div>
          <Text h4>Proposals</Text>
          <Spacer />
          <Text>
            <a
              href="https://eips.ethereum.org/EIPS/eip-4361"
              target="_blank"
              rel="noreferrer"
            >
              EIP-4361: Sign-In with Ethereum.
            </a>
          </Text>
          <Spacer />
        </div>

        {renderBlockchain()}
        {renderAccountInfo()}
      </HomeLayout>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  console.log('===index.getServerSideProps', context.query);

  return {
    props: {}, // will be passed to the page component as props
  };
}
