import type { Web3 } from 'web3';
export declare global {
  interface Window {
    ethereum?: any;
    Web3: Web3;
  }
}
