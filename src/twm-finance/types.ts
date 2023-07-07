import { BigNumber } from "@ethersproject/bignumber";

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export type ContractName = string;

export interface ReturnInfo {
  success: boolean;
  reason: string;
}

export interface NftInfo {
  imageUrl: string;
  name: string;
  normalReward: number;
  id: number;
}

export interface DashboardInfo {
  totalBNB: string;
  totalBNBValue: number;
  BNBPrice: number;
  currentBalance: number;
  maxtransvalue: string;
  realvalue: string;
  realtotalliquidity: string;
}

export interface PoolInfo {
  factory: string;
  pair: string;
  token0: string;
  token1: string;
  decimals0: BigNumber;
  decimals1: BigNumber;
  reserves0: BigNumber;
  reserves1: BigNumber;
}

export interface TradeInfo {
  id: number;
  blockNumber: number;
  minAgo: number;
  tradedAmount: number;
  tokenPrice: number;
  usdValue: number;
  dex: string;
  buyFlag: number;
  transactinHash: string;
  symbol: string;
}
