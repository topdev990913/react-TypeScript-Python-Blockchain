import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../../hooks/useAuth";
import { ConnectorNames } from "../../hooks/useEagerConnect";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import "./style.css";
const HeaderComponent = () => {
  const { fund, tapFlag, setTapFlag, updateFund } = usePersonalInfo();
  const { deactivate, account } = useWeb3React();
  const { login } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnectWallet = () => {
    login(ConnectorNames.Injected);
  };

  const handleDeactivateAccount = () => {
    deactivate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (account) {
      updateFund();
      const interval = setInterval(() => {
        updateFund();
      }, 20000);
    }
  }, [account]);

  return (
    <>
      <header className="page-header">
        {/* <!-- Horizontal Menu Start--> */}
        <nav className="main-menu static-top navbar-dark navbar navbar-expand-lg fixed-top mb-1">
          <div className="container">
            <Link
              className="navbar-brand animated"
              data-animation="fadeInDown"
              data-animation-delay="1s"
              to={"/"}
              onClick={() => {
                setTapFlag(1);
              }}
            >
              <img
                src="./theme-assets/images/dice.png"
                style={{ maxHeight: "35px" }}
                alt="Logo"
              />
              <span
                className="brand-text font-weight-bold"
                style={{ fontSize: "16px" }}
              >
                Reject Rumble
              </span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => toggleMobileMenu()}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={
                mobileMenuOpen
                  ? "collapse navbar-collapse show"
                  : "collapse navbar-collapse"
              }
              id="navbarCollapse"
            >
              <div
                id="navigation"
                className="navbar-nav ml-auto"
                style={{ paddingTop: "3px" }}
              >
                <ul className="navbar-nav mt-1">
                  <li
                    className="nav-item animated"
                    data-animation="fadeInDown"
                    data-animation-delay="1.1s"
                  >
                    <a
                      className="nav-link"
                      href="/#"
                      onClick={() => {
                        setTapFlag(2);
                      }} // onClick={() => toggleMobileMenu()}
                    >
                      Deposit
                    </a>
                  </li>
                  <li
                    className="nav-item animated"
                    data-animation="fadeInDown"
                    data-animation-delay="1.2s"
                  >
                    <a
                      className="nav-link"
                      href="/#"
                      onClick={() => {
                        setTapFlag(3);
                      }} // onClick={() => toggleMobileMenu()}
                    >
                      Withdraw
                    </a>
                  </li>
                  <li
                    className="nav-item animated"
                    data-animation="fadeInDown"
                    data-animation-delay="1.2s"
                  >
                    <a
                      className="nav-link"
                      href="/#"
                    >
                      {"Dice: " + fund}
                    </a>
                  </li>
                </ul>
                <span id="slide-line"></span>
                {!account ? (
                  <button
                    onClick={handleConnectWallet}
                    className="btn btn-gradient-purple btn-glow animated fadeInUpShorter col-4 px-0"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                  >
                    Connect
                  </button>
                ) : (
                  <button
                    onClick={handleDeactivateAccount}
                    className="btn btn-gradient-purple btn-glow animated fadeInUpShorter col-4 px-0"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="1.1s"
                  >
                    {account?.slice(0, 4) +
                      "..." +
                      account?.slice(account?.length - 4, account?.length)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
        {/* <!-- /Horizontal Menu End--> */}
      </header >
    </>
  );
};

export default HeaderComponent;
