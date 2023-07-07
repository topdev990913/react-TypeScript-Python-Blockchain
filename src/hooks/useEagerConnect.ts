import { useEffect } from "react";
import useAuth from "./useAuth";

export const connectorLocalStorageKey = "connectorId";
export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
}

const useEagerConnect = () => {
  const { login } = useAuth();

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey
    ) as ConnectorNames;

    if (connectorId) {
      login(connectorId);
    }
  }, [login]);
};

export default useEagerConnect;
