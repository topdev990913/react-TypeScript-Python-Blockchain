import { Configuration } from "./config";
import { BigNumber, Contract, ethers } from "ethers";
import { Promise } from "bluebird";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { getDefaultProvider } from "../utils/provider";
import { ReturnInfo } from "./types";
import { balanceToDecimal } from "./ether-utils";
import { whiteList } from "./whitelist";
/**
 * An API module of TWM Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class TWMFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  serverUrl: string;
  contracts: { [name: string]: Contract };
  leafNodes: string[];
  merkleTree: MerkleTree;
  rootHash: Buffer;
  constructor(cfg: Configuration) {
    const { deployments, serverUrl } = cfg;
    const provider = getDefaultProvider();
    this.myAccount = "";
    this.serverUrl = serverUrl;

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(
        deployment.address,
        deployment.abi,
        provider
      );
    }

    this.config = cfg;
    this.provider = provider;
    this.leafNodes = whiteList.map((addr) =>
      keccak256(addr).toString('hex')
    );
    this.merkleTree = new MerkleTree(this.leafNodes, keccak256, {
      sortPairs: true,
    });
    this.rootHash = this.merkleTree.getRoot();
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */

  unlockWallet(provider: any, account: string) {
    this.signer = provider.getSigner(0);
    this.myAccount = account;
    if (this.signer) {
      for (const [name, contract] of Object.entries(this.contracts)) {
        this.contracts[name] = contract.connect(this.signer);
      }
    }
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  async decimalsOfTWMT(account: string): Promise<number> {
    const { TWM_TOKEN } = this.contracts;
    let decimals: number = 0;
    if (this.myAccount === "") return decimals;
    try {
      decimals = await TWM_TOKEN.decimals();
    } catch (error) {
      console.log(error);
    }
    return decimals;
  }

  async balanceOfTWMT(account: string): Promise<BigNumber> {
    const { TWM_TOKEN } = this.contracts;
    let bigTWMTBalance: BigNumber = BigNumber.from(0);
    if (this.myAccount === "") return bigTWMTBalance;
    try {
      bigTWMTBalance = await TWM_TOKEN.balanceOf(account);
    } catch (error) {
      console.log(error);
    }
    return bigTWMTBalance;
  }

  async allowanceTWMT(owner: string): Promise<BigNumber> {
    const { TWM_TOKEN, TWM_CASINO } = this.contracts;
    let bigTWMTAllowance: BigNumber = BigNumber.from(0);
    if (this.myAccount === "") return bigTWMTAllowance;
    try {
      bigTWMTAllowance = await TWM_TOKEN.allowance(owner, TWM_CASINO.address);
    } catch (error) {
      console.log(error);
    }
    return bigTWMTAllowance;
  }

  async approveTWMT(amount: BigNumber): Promise<ReturnInfo> {
    const { TWM_TOKEN, TWM_CASINO } = this.contracts;
    try {
      const txx = await TWM_TOKEN.approve(TWM_CASINO.address, amount);
      const receipt = await txx.wait();
      console.log(
        `approve casino tx: https://etherscan.io/tx/${receipt.transactionHash}`
      );
      return {
        success: true,
        reason: "APPROVE TRANSACTION SUCCESS",
      };
    } catch (error) {
      return {
        success: false,
        reason: "APPROVE TRANSACTION FAIL",
      };
    }
  }

  async getClaimedAmountList(address: string): Promise<BigNumber[]> {
    const { TWM_CASINO } = this.contracts;
    let list: BigNumber[] = [];
    if (this.myAccount === "") return list;
    try {
      list = await TWM_CASINO.getClaimedList(address);
    } catch (error) {
      console.log(error);
    }
    return list;
  }

  async getDepositedAmountList(address: string): Promise<BigNumber[]> {
    const { TWM_CASINO } = this.contracts;
    let list: BigNumber[] = [];
    if (this.myAccount === "") return list;
    try {
      list = await TWM_CASINO.getDepositedList(address);
    } catch (error) {
      console.log(error);
    }
    return list;
  }

  async depositTWMT(amount: BigNumber): Promise<ReturnInfo> {
    const { TWM_CASINO } = this.contracts;
    try {
      const txx = await TWM_CASINO.deposit(amount);
      const receipt = await txx.wait();
      console.log(
        `deposit casino tx: https://etherscan.io/tx/${receipt.transactionHash}`
      );
      return {
        success: true,
        reason: "DEPOSIT TRANSACTION SUCCESS",
      };
    } catch (error) {
      return {
        success: false,
        reason: "DEPOSIT TRANSACTION FAIL",
      };
    }
  }

  async withdrawTWMT(wallet: string, amount: BigNumber, index: number, sig: string): Promise<ReturnInfo> {
    const { TWM_CASINO } = this.contracts;
    try {
      console.log("amount:", amount)
      const txx = await TWM_CASINO.withdraw(wallet, amount, index, sig);
      const receipt = await txx.wait();
      console.log(
        `withdraw casino tx: https://etherscan.io/tx/${receipt.transactionHash}`
      );
      return {
        success: true,
        reason: "WITHDRAW TRANSACTION SUCCESS",
      };
    } catch (error) {
      return {
        success: false,
        reason: "WITHDRAW TRANSACTION FAIL",
      };
    }
  }
}
