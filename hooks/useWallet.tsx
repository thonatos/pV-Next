import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { SiweMessage } from 'siwe';

const useWallet = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [chainId, setChainId] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);

  const initProvider = useCallback(() => {
    const ethereum = window?.ethereum;
    if (!ethereum) {
      return;
    }

    const _web3 = new window.Web3(ethereum);
    // @ts-ignore
    window._web3 = _web3;
    setWeb3(_web3);

    const _chainId = _web3?.currentProvider?.chainId;
    if (_chainId) {
      setChainId(_chainId);
    }
  }, []);

  const addEthereumChain = useCallback(async () => {
    if (!web3) {
      return;
    }

    const BscTestNetwork = {
      chainId: '0x61',
      chainName: 'BNB Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    };

    try {
      // @ts-ignore
      await web3?.currentProvider?.request({
        method: 'wallet_addEthereumChain',
        params: [BscTestNetwork],
      });

      return {
        success: true,
        data: BscTestNetwork,
      };
    } catch (addError) {
      return {
        success: false,
        error: addError,
      };
    }
  }, [web3]);

  const switchEthereumChain = useCallback(async () => {
    if (!web3) {
      return;
    }

    const BscTestNetwork = {
      chainId: '0x61',
    };

    try {
      // @ts-ignore
      await web3?.currentProvider?.request({
        method: 'wallet_switchEthereumChain',
        params: [BscTestNetwork],
      });

      return {
        success: true,
        data: BscTestNetwork,
      };
    } catch (switchError: any) {
      // switchError.code === 4902

      return {
        success: false,
        error: switchError,
      };
    }
  }, [web3]);

  const requestAccounts = useCallback(async () => {
    if (!web3) {
      return;
    }

    const accounts = await web3.eth.requestAccounts();
    console.debug('===useWallet.requestAccounts', accounts);

    setAccounts(accounts);

    return accounts;
  }, [web3]);

  const personalSign = useCallback(
    async (account: string, nonce: string) => {
      if (!web3) {
        return;
      }

      const domain = window.location.host;
      const origin = window.location.origin;
      // @ts-ignore
      const chainId = web3?.currentProvider?.chainId || '0x1';
      const statement = 'Sign in with Binance Smart Chain to the app.';

      if (!account) {
        return;
      }

      const address = Web3.utils.toChecksumAddress(account);

      const siweMessage = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        nonce: nonce,
        chainId: parseInt(chainId),
        // expirationTime: dayjs().add(1, 'd').toISOString(),
      });

      console.debug('===useWallet.personalSign.siweMessage', siweMessage);

      const message = siweMessage.prepareMessage();
      console.debug('===useWallet.personalSign.message', message);

      const signature = await web3.eth.personal.sign(message, address, '');
      console.debug('===useWallet.personalSign.signature', signature);

      return {
        message,
        signature,
      };
    },
    [web3]
  );

  useEffect(() => {
    if (!web3) {
      return;
    }

    if (accounts.length > 0) {
      return;
    }

    requestAccounts();
  }, [web3, accounts]);

  useEffect(() => {
    if (!web3) {
      return;
    }

    web3?.givenProvider?.on('chainChanged', (chainId: string) => {
      setChainId(chainId);
    });

    web3?.givenProvider?.on('accountsChanged', (_accounts: string[]) => {
      setAccounts(_accounts);
    });
  }, [web3]);

  return {
    web3,
    chainId,
    accounts,

    initProvider,
    addEthereumChain,
    switchEthereumChain,

    personalSign,
    requestAccounts,
  };
};

export default useWallet;
