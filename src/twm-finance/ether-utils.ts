import Web3 from "web3";
import { defaultEtherConfig, EtherConfig } from "./config";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export function web3ProviderFrom(endpoint: string, config?: EtherConfig): any {
  const ethConfig = Object.assign(defaultEtherConfig, config || {});

  const providerClass = endpoint.includes("wss")
    ? Web3.providers.WebsocketProvider
    : Web3.providers.HttpProvider;

  return new providerClass(endpoint, {
    timeout: ethConfig.etherNodeTimeout,
  });
}

export function balanceToDecimal(s: string, decimals = 18): string {
  return formatUnits(s, decimals);
}

export function decimalToBalance(d: string | number, decimals = 18): BigNumber {
  return parseUnits(String(d), decimals);
}
