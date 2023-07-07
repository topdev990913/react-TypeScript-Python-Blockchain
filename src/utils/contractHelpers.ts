import { ethers } from "ethers";
import { simpleRpcProvider } from "./providers";

export const getContract = (
  abi: any,
  address: string,
  signer?:
    | ethers.Signer
    | ethers.providers.Provider
    | ethers.providers.Web3Provider
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
