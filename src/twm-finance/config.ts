import { ChainId } from "./types";
import { Deployments } from "./deployments";

export type Configuration = {
  chainId: ChainId;
  networkName: string;
  ethscanUrl: string;
  defaultProvider: string;
  deployments: Deployments;
  config?: EtherConfig;
  refreshInterval: number;
  serverUrl: string;
  casinoUrl: string;
};

export type EtherConfig = {
  testing: boolean;
  autoGasMultiplier: number;
  defaultConfirmations: number;
  defaultGas: string;
  defaultGasPrice: string;
  bscNodeTimeout: number;
};

export type TokenInfo = {
  address: string;
  decimal: number;
};

export const defaultEtherConfig = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: "6000000",
  defaultGasPrice: "1000000000000",
  etherNodeTimeout: 10000,
};
