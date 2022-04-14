import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { SiweMessage } from 'siwe';

const useWallet = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

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

      console.debug('===siweMessage', siweMessage);

      const message = siweMessage.prepareMessage();
      console.debug('===message', message);

      const signature = await web3.eth.personal.sign(message, address, '');
      console.debug('===signature', signature);

      return {
        message,
        signature,
      };

      // const endpoint =
      //   domain === 'console.implements.io' ? BASE_URL : 'http://localhost:7001';
      // const { data } = await request(`${endpoint}/openApi/oauth/ethereum`, {
      //   method: 'post',
      //   data: {
      //     message,
      //     signature,
      //   },
      // });
      // console.debug('===data', data);
      // updateUser(data.user || '');
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

  return {
    // base
    web3,
    setWeb3,

    // accounts
    accounts,
    setAccounts,

    // handlers
    requestAccounts,
    personalSign,
  };
};

export default useWallet;
