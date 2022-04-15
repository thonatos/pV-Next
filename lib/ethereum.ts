import { BigNumber, ethers } from 'ethers';
import { SPSR } from '../constants/contract';

const PUBLIC_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

export const COLLECTION_ENUM = {
  PLATINUM: 0,
  GOLD: 1,
  SILVER: 2,
  COPPER: 3,
};

export const loadSPSRbalanceOfBatch = async (
  account: string
): Promise<SPSRBalance[]> => {
  const provider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
  const daiContract = new ethers.Contract(SPSR.address, SPSR.abi, provider);

  const names = Object.keys(COLLECTION_ENUM);
  const ids = Object.values(COLLECTION_ENUM);

  const balances = await daiContract.balanceOfBatch(
    new Array(ids.length).fill(account),
    ids
  );

  return balances.map((balance: BigNumber, index: number) => {
    return {
      id: ids[index],
      name: names[index],
      balance: balance.toNumber(),
    };
  });
};

export interface SPSRBalance {
  id: number;
  name: string;
  balance: number;
}
