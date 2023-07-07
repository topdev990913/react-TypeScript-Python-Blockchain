// Set of helper functions to facilitate wallet setup
// import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { nodes } from "./getRpcUrl";
import { ChainId } from "../twm-finance/types";
import config from "../config";
import { chain } from "lodash";

export const BSC_BLOCK_TIME = 3;

export const BASE_ETHEREUM_SCAN_URLS = {
  [ChainId.MAINNET]: "https://etherscan.io/",
  [ChainId.GOERLI]: "https://goerli.etherscan.io/",
};

export const BASE_ETHEREUM_SCAN_URL = BASE_ETHEREUM_SCAN_URLS[ChainId.MAINNET];

export const BASE_URL = "https://twm.kylwatches.app/";

const { chainId } = config;

/**
 * Prompt the user to add Ethereum as a network on Metamask, or switch to Ethereum if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider?.request) {
    try {
      // check if the chain to connect to is installed
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }], // chainId must be in hexadecimal numbers
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          if (chainId === 5) {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: "Goerli test network",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "GETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://goerli.infura.io/v3/"],
                  blockExplorerUrls: [`https://goerli.etherscan.io/`],
                },
              ],
            });
          } else if (chainId === 1) {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                  chainName: "Ethereum Mainnet",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.infura.io/v3/"],
                  blockExplorerUrls: [`https://etherscan.io`],
                },
              ],
            });
          }
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number
) => {
  const provider = window.ethereum;
  if (provider?.request) {
    const tokenAdded = await provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
        },
      },
    });
    return tokenAdded;
  }
};
