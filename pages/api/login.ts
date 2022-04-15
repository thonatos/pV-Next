import { SiweMessage } from 'siwe';
import { withSessionRoute } from 'lib/withSession';
import { loadSPSRbalanceOfBatch } from 'lib/ethereum';

import type { SPSRBalance } from 'lib/ethereum';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Credential } from 'next-app';

const loginRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<Credential | any>
) => {
  if (req.method !== 'POST') {
    res.status(400).json({
      success: false,
      message: 'invalid method',
    });
    return;
  }

  const { message, signature } = JSON.parse(req.body || '{}');

  if (!message || !signature) {
    res.status(422).json({
      success: false,
      message: 'invalid params',
    });
    return;
  }

  const siwe = new SiweMessage(message);
  const fileds = await siwe.validate(signature);

  const { address, chainId } = fileds;

  /**
   * Mapping Roles
   * @description: mapping SPSR(nft) position to roles
   */

  let balances: SPSRBalance[] = [];
  let roles: string[] = [];

  // bsc-testnet
  if (chainId === 97) {
    balances = await loadSPSRbalanceOfBatch(address);
    roles = balances.reduce((prev: string[], curr) => {
      if (curr.balance > 0) {
        return prev.concat(curr.name.toLowerCase());
      }
      return prev;
    }, []);
  }

  const credential: Credential = {
    siwe: fileds,
    roles,
  };

  req.session.credential = credential;

  await req.session.save();

  res.json({
    success: true,
    data: {
      credential,
      position: {
        spsr: balances,
      },
    },
  });
};

export default withSessionRoute(loginRoute);
