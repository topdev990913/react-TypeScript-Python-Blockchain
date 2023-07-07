import React, { createContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import TWMFinance from "../../twm-finance";
import config from "../../config";

export interface TWMFinanceContext {
  twmFinance?: TWMFinance | null;
}

export const Context = createContext<TWMFinanceContext>({
  twmFinance: null,
});

export const TWMFinanceProvider: React.FC = ({ children }) => {
  const { library, account } = useWeb3React();
  const [twmFinance, setTWMFinance] = useState<TWMFinance>();

  useEffect(() => {
    if (!twmFinance) {
      const twm = new TWMFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        twm.unlockWallet(library, account);
      }
      setTWMFinance(twm);
    } else if (account) {
      twmFinance.unlockWallet(library, account);
    }
  }, [account, library, twmFinance]);

  return <Context.Provider value={{ twmFinance }}>{children}</Context.Provider>;
};
