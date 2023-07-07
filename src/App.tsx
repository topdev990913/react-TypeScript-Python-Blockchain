import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { ethers } from "ethers";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MetamaskProvider from "./contexts/MetamaskProvider";
import { SocketContextProvider } from "./contexts/SocketContext";
import { PersonalInfoContextProvider } from "./contexts/PersonalInfoContext";
import { TWMFinanceProvider } from "./contexts/TWMFinanceProvider/TWMFinanceProvider";
import PreloaderComponent from "./components/PreloaderComponent";
import VerticalSocialComponent from "./components/VerticalSocialComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import LandingPage from "./pages/LandingPage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";

import "./App.css";

function App() {
  const POLLING_INTERVAL = 12000;
  const getLibrary = (provider: any): ethers.providers.Web3Provider => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = POLLING_INTERVAL;
    return library;
  };

  return (
    <SocketContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetamaskProvider>
          <TWMFinanceProvider>
            <PersonalInfoContextProvider>
              <PreloaderComponent />
              <Router>
                {/* <VerticalSocialComponent /> */}
                <HeaderComponent />
                <div className="content-wrapper">
                  <div className="content-body">
                    <Switch>
                      <Route path="/" component={LandingPage} />
                      <Route path="/deposit" component={DepositPage} />
                      <Route path="/withdraw" component={WithdrawPage} />
                    </Switch>
                  </div>
                </div>
                <ToastContainer pauseOnFocusLoss={false} />
                <FooterComponent />
              </Router>
            </PersonalInfoContextProvider>
          </TWMFinanceProvider>
        </MetamaskProvider>
      </Web3ReactProvider>
    </SocketContextProvider>
  );
}

export default App;
