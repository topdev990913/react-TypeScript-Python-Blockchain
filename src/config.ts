import { Configuration } from "./twm-finance/config";
import { ChainId } from "./twm-finance/types";

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.GOERLI,
    networkName: "Goerli Ethereum Testnet",
    ethscanUrl: "https://goerli.etherscan.io/",
    defaultProvider:
      "https://eth-goerli.g.alchemy.com/v2/26t6Od2wqkhFyeYUyM9wUH1k9T-nMx_J",
    deployments: require("./twm-finance/deployments/deployments.testing.json"),
    refreshInterval: 10000,
    serverUrl: "https://twm-backend1.herokuapp.com/api/",
    casinoUrl: "https://twm-backend1.herokuapp.com"
  },
  production: {
    chainId: ChainId.GOERLI,
    networkName: "Goerli Ethereum Testnet",
    ethscanUrl: "https://goerli.etherscan.io/",
    defaultProvider:
      "https://eth-goerli.g.alchemy.com/v2/26t6Od2wqkhFyeYUyM9wUH1k9T-nMx_J",
    deployments: require("./twm-finance/deployments/deployments.testing.json"),
    refreshInterval: 10000,
    serverUrl: "https://twm-backend1.herokuapp.com/api/",
    casinoUrl: "https://twm-backend1.herokuapp.com"
  },
};

export default configurations[process.env.NODE_ENV || "development"];
