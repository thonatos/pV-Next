import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import type { NextPage, NextPageContext } from 'next';
import { Button, Typography } from 'antd';

const { Title, Paragraph, Link } = Typography;

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
      <Button size="small" onClick={onChangeNetwork}>
        Switch to BSC Test Network
      </Button>
    );
  };

  const renderBlockchain = () => {
    if (!web3 || !web3.givenProvider) {
      return null;
    }

    const { networkVersion } = web3.givenProvider;

    return (
      <Typography>
        <Title level={4}>Providers</Title>
        <Paragraph>
          <ul>
            <li>ChainId: {chainId}</li>
            <li>
              NetworkVersion: {networkVersion} {renderChangeNetwork()}
            </li>
          </ul>
        </Paragraph>
      </Typography>
    );
  };

  const renderAccountInfo = () => {
    if (!accounts || accounts.length === 0) {
      return null;
    }

    return (
      <Typography>
        <Title level={4}>Accounts</Title>
        <Paragraph>
          <blockquote>
            Click wallet address to Sign-In with Ethereum .
          </blockquote>
        </Paragraph>
        <Paragraph>
          <ul>
            {accounts.map((account) => {
              return (
                <li
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
                </li>
              );
            })}
          </ul>
        </Paragraph>
      </Typography>
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
        <Typography>
          <Title level={4}>Intro</Title>
          <Paragraph>
            <blockquote>
              Please install{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
              >
                MetaMask
              </a>{' '}
              or open site with DApp Browser.
            </blockquote>
          </Paragraph>
          <Paragraph>
            SSO - Auth provider powered by Ethereum & Next.js .
          </Paragraph>
        </Typography>

        <Typography>
          <Title level={4}>Proposals</Title>
          <Paragraph>
            <Link href="https://eips.ethereum.org/EIPS/eip-4361">
              EIP-4361: Sign-In with Ethereum.
            </Link>
          </Paragraph>
        </Typography>

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
