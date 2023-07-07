import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import useTWMFinance from "../../hooks/useTWMFinance";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import "./style.css";
import useSocket from "../../hooks/useSocket";

const WithdrawComponent = () => {
  const { account } = useWeb3React();
  const twmFinance = useTWMFinance();
  const curSocket = useSocket();
  const {
    updateFund,
    updateWithdrawStatus,
    handleWithdrawSol,
    withdrawingFlag,
    withdrawSuccessFlag,
    setWithdrawingFlag,
    setWithdrawSuccessFlag,
    poolState,
    setRequestWithdraw
  } = usePersonalInfo();
  const [diceAmount, setDiceAmount] = useState<string>("");
  const [recvAmount, setRecvAmount] = useState<number>(0);
  const [withdrawFlag, setWithdrawFlag] = useState<boolean>(true);
  const [pendingDepositFlag, setPendingDepositFlag] = useState<boolean>(false);
  const [pendingWithdrawFlag, setPendingWithdrawFlag] =
    useState<boolean>(false);
  const [pendingWithdrawAmount, setPendingWithdrawAmount] = useState<number>(0);
  const rate = 100;

  useEffect(() => {
    updateFund();
    updateWithdrawStatus();
  }, []);

  useEffect(() => {

    console.log("pool state:", poolState)
    if (poolState.status == "default") {
      setPendingDepositFlag(false);
      setPendingWithdrawFlag(false);
      setPendingWithdrawAmount(0);
    } else if (poolState.status == "deposited") {
      setPendingDepositFlag(true);
    } else if (poolState.status == "withdraw required") {
      setPendingWithdrawFlag(true);
      setPendingWithdrawAmount(
        (Number(poolState.amount)) * rate
      );
    }
  }, [poolState.status]);

  useEffect(() => {
    if (withdrawingFlag) {
      console.log("withdrawingFlag:", withdrawingFlag);
      setWithdrawFlag(true);
      setWithdrawingFlag(false);
      toast.warn(`Withdrawing Fail!`, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [withdrawingFlag]);

  useEffect(() => {
    if (withdrawSuccessFlag) {
      setWithdrawFlag(true);
      setWithdrawSuccessFlag(false);
      toast.success(`Withdraw Success!`, {
        position: "bottom-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [withdrawSuccessFlag]);

  const handleDiceChange = (event: any) => {
    // if (Number(event.target.value) <= fund) {
    setDiceAmount(event.target.value);
    setRecvAmount(Number(event.target.value) / rate);
    // } else {
    //   toast.warn(`Please check the amount of dice and input correct amount!`, {
    //     position: "bottom-left",
    //     autoClose: 1500,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "dark",
    //   });
    // }
  };

  return (
    <main>
      {account ? (
        !pendingDepositFlag && !pendingWithdrawFlag ? (
          <section id="contact" className="contact section-padding">
            <div className="container">
              <div className="heading text-center mb-0">
                <div
                  className="animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.3s"
                >
                  <h6 className="sub-title">REJECT RUMBLE</h6>
                  <h2 className="title">WITHDRAW SOL</h2>
                </div>
                <p
                  className="content-desc animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.4s"
                >
                  Input DICE to withdraw.
                </p>
              </div>
              <div className="row">
                <div className="col-xl-8 col-md-12 mx-auto">
                  <div className="text-center d-flex flex-column align-items-center">
                    <input
                      type="text"
                      className="form-control animated col-6"
                      data-animation="fadeInUpShorter"
                      data-animation-delay="0.8s"
                      name="name"
                      placeholder="Input DICE to withdraw."
                      value={diceAmount}
                      onChange={handleDiceChange}
                    />
                    <p
                      className="content-desc animated"
                      data-animation="fadeInUpShorter"
                      data-animation-delay="0.4s"
                    >
                      You will receive:
                    </p>
                    <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                      <img
                        src="theme-assets/images/solana-sol-icon.png"
                        alt="team-profile-1"
                        className="rounded-circle"
                        style={{ width: "2.5rem" }}
                      />
                      <p className="ml-2 mb-0">{recvAmount}</p>
                    </div>
                    {withdrawFlag ? (
                      <button
                        onClick={() => {
                          setWithdrawFlag(false);
                          handleWithdrawSol(diceAmount);
                          setDiceAmount("");
                          setRecvAmount(0);
                        }}
                        className="btn btn-lg btn-gradient-purple btn-glow animated"
                        data-animation="fadeInUpShorter"
                        data-animation-delay="1.1s"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <button
                        onClick={() => {}}
                        className="btn btn-lg btn-gradient-purple btn-glow animated"
                        data-animation="fadeInUpShorter"
                        data-animation-delay="1.1s"
                        disabled
                      >
                        Withdrawing...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : pendingWithdrawFlag ? (
          <section id="contact" className="contact section-padding">
            <div className="container">
              <div className="heading text-center mb-0">
                <div
                  className="animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.3s"
                >
                  <h6 className="sub-title">REJECT RUMBLE</h6>
                  <h2 className="title">WITHDRAW SOL</h2>
                </div>
                <p
                  className="content-desc animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.4s"
                >
                  There are some pending withdraw for you. You should resolve it
                  first to withdraw more.
                </p>
              </div>
              <div className="row">
                <div className="col-xl-8 col-md-12 mx-auto">
                  <div className="text-center d-flex flex-column align-items-center">
                    <p
                      className="content-desc animated"
                      data-animation="fadeInUpShorter"
                      data-animation-delay="0.4s"
                    >
                      You will receive:
                    </p>
                    <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                      <img
                        src="theme-assets/images/solana-sol-icon.png"
                        alt="team-profile-1"
                        className="rounded-circle"
                        style={{ width: "2.5rem" }}
                      />
                      <p className="ml-2 mb-0">
                        {pendingWithdrawAmount / rate}
                      </p>
                    </div>
                    {withdrawFlag ? (
                      <button
                        onClick={() => {
                          setWithdrawFlag(false);
                          // handleWithdrawSol(pendingWithdrawAmount);
                          setRequestWithdraw(true);
                        }}
                        className="btn btn-lg btn-gradient-purple btn-glow animated"
                        data-animation="fadeInUpShorter"
                        data-animation-delay="1.1s"
                      >
                        Solve Withdrawing
                      </button>
                    ) : (
                      <button
                        onClick={() => {}}
                        className="btn btn-lg btn-gradient-purple btn-glow animated"
                        data-animation="fadeInUpShorter"
                        data-animation-delay="1.1s"
                        disabled
                      >
                        Solving...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section id="contact" className="contact section-padding">
            <div className="container">
              <div className="heading text-center mb-0">
                <div
                  className="animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.3s"
                >
                  <h6 className="sub-title">REJECT RUMBLE</h6>
                  <h2 className="title">WITHDRAW SOLANA</h2>
                </div>
                <p
                  className="content-desc animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.4s"
                >
                  There are some pending deposit, you should solve it first to
                  deposit.
                </p>
              </div>
            </div>
          </section>
        )
      ) : (
        <section id="contact" className="contact section-padding">
          <div className="container">
            <div className="heading text-center mb-0">
              <div
                className="animated"
                data-animation="fadeInUpShorter"
                data-animation-delay="0.3s"
              >
                <h6 className="sub-title">REJECT RUMBLE</h6>
                <h2 className="title">WITHDRAW SOL</h2>
              </div>
              <p
                className="content-desc animated"
                data-animation="fadeInUpShorter"
                data-animation-delay="0.4s"
              >
                Please connect wallet first.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default WithdrawComponent;
