import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../utils/web3React";

export const MetamaskContext = React.createContext({ loaded: true });

export const MetamaskProvider: React.FC = ({ children }) => {
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      setLoaded(true);
      if (isAuthorized && !networkActive && !networkError) {
        activateNetwork(injected);
      }
    });
  }, [activateNetwork, networkError, networkActive]);

  return (
    <MetamaskContext.Provider value={{ loaded }}>
      {children}
    </MetamaskContext.Provider>
  );
};
