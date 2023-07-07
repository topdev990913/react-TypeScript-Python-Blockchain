import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { ethers, BigNumber } from "ethers";
import useTWMFinance from "../../hooks/useTWMFinance";
import usePersonalInfo from "../../hooks/usePersonalInfo";
import useSocket from "../../hooks/useSocket";
import "./style.css";

const DepositComponent = () => {
  const { account } = useWeb3React();
  const twmFinance = useTWMFinance();
  const curSocket = useSocket();
  const {
    handleDepositSol,
    updateFund,
    updateFundStatus,
    depositingFlag,
    setDepositingFlag,
    poolState,
  } = usePersonalInfo();
  const [solAmount, setSolAmount] = useState<string>("");
  const [recvAmount, setRecvAmount] = useState<number>(0);
  const [depositFlag, setDepositFlag] = useState<boolean>(true);
  const [pendingDepositFlag, setPendingDepositFlag] = useState<boolean>(false);
  const [pendingWithdrawFlag, setPendingWithdrawFlag] =
    useState<boolean>(false);
  const [pendingDepositAmount, setPendingDepositAmount] = useState<number>(0);
  const rate = 100;

  const [approveStatus, setApproveStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateFund();
    updateFundStatus();
  }, []);

  useEffect(() => {
    async function fetchInfo() {
      try {
        if (twmFinance?.myAccount) {
          let allowanceAmount = await twmFinance.allowanceTWMT(twmFinance.myAccount);
          if (allowanceAmount > BigNumber.from(1)) {
            setApproveStatus(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchInfo();
  }, [twmFinance, account]);

  useEffect(() => {
    if (poolState.status == "default") {
      setPendingDepositFlag(false);
      setPendingWithdrawFlag(false);
      setPendingDepositAmount(0);
    } else if (poolState.status == "deposited") {
      setPendingDepositFlag(true);
      setPendingDepositAmount(
        (Number(poolState.amount)) * rate
      );
      updateFund();
    } else if (poolState.status == "withdraw required") {
      setPendingWithdrawFlag(true);
    }
  }, [poolState.status]);

  useEffect(() => {
    if (depositingFlag) {
      setDepositFlag(true);
      setDepositingFlag(false);
      toast.warn(`Deposit Fail!`, {
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
  }, [depositingFlag]);

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "deposit_fund") {
          if (data[0].ok) {
            updateFund();
            toast.success(`Deposit Success!`, {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            updateFund();
            toast.warn(`Deposit Fail! Please try again`, {
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
          setDepositFlag(true);
          setPendingDepositFlag(false);
        }
      });
    }
  }, [curSocket]);

  const checkNumber = (value: string) => {
    const reg = /^-?\d*(\.\d*)?$/;
    if (
      (!isNaN(Number(value)) && reg.test(value)) ||
      value === "" ||
      value === "-"
    ) {
      return true;
    }
    return false;
  };

  const handleSolChange = (event: any) => {
    if (checkNumber(event.target.value)) {
      setSolAmount(event.target.value);
      setRecvAmount(Number(event.target.value) * rate);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    let res = await twmFinance?.approveTWMT(ethers.constants.MaxUint256);
    console.log("approve res:", res)
    if(res?.success) {
      setApproveStatus(true)
    }
    setLoading(false);
  };

  return (
    <main>
      {account ? (
        !approveStatus ? (
          <section id="contact" className="contact section-padding">
            <div className="container">
              <div className="heading text-center mb-0">
                <div
                  className="animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.3s"
                >
                  <h6 className="sub-title">REJECT RUMBLE</h6>
                  <h2 className="title">DEPOSIT SOLANA</h2>
                </div>
                <p
                  className="content-desc animated"
                  data-animation="fadeInUpShorter"
                  data-animation-delay="0.4s"
                >
                  There are some pending deposit for you. You should resolve it
                  first to deposit more.
                </p>
              </div>
              <div className="row">
                <div className="col-xl-8 col-md-12 mx-auto">
                  <div className="text-center d-flex flex-column align-items-center">
                    <button
                      onClick={() => {
                        handleApprove();
                      }}
                      className="btn btn-lg btn-gradient-purple btn-glow animated"
                      data-animation="fadeInUpShorter"
                      data-animation-delay="1.1s"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>) : (!pendingDepositFlag && !pendingWithdrawFlag ? (
            <section id="contact" className="contact section-padding">
              <div className="container">
                <div className="heading text-center mb-0">
                  <div
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.3s"
                  >
                    <h6 className="sub-title">REJECT RUMBLE</h6>
                    <h2 className="title">DEPOSIT SOLANA</h2>
                  </div>
                  <p
                    className="content-desc animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    Input S@L to deposit.
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
                        placeholder="Input sol to deposit."
                        value={solAmount}
                        onChange={handleSolChange}
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
                          src="theme-assets/images/dice-gold-coin.png"
                          alt="team-profile-1"
                          className="rounded-circle"
                          style={{ width: "2.5rem" }}
                        />
                        <p className="ml-2 mb-0">{recvAmount}</p>
                      </div>
                      {depositFlag ? (
                        <button
                          onClick={() => {
                            if (Number(solAmount) >= 0.01) {
                              setDepositFlag(false);
                              handleDepositSol(solAmount);
                              setSolAmount("");
                              setRecvAmount(0);
                            } else {
                              toast.warn(
                                `Depositing sol amount is small, you should deposit over 0.01 sol!`,
                                {
                                  position: "bottom-left",
                                  autoClose: 1500,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "dark",
                                }
                              );
                            }
                          }}
                          className="btn btn-lg btn-gradient-purple btn-glow animated"
                          data-animation="fadeInUpShorter"
                          data-animation-delay="1.1s"
                        >
                          Deposit
                        </button>
                      ) : (
                        <button
                          onClick={() => { }}
                          className="btn btn-lg btn-gradient-purple btn-glow animated"
                          data-animation="fadeInUpShorter"
                          data-animation-delay="1.1s"
                          disabled
                        >
                          Depositing...
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : pendingDepositFlag ? (
            <section id="contact" className="contact section-padding">
              <div className="container">
                <div className="heading text-center mb-0">
                  <div
                    className="animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.3s"
                  >
                    <h6 className="sub-title">REJECT RUMBLE</h6>
                    <h2 className="title">DEPOSIT SOLANA</h2>
                  </div>
                  <p
                    className="content-desc animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    There are some pending deposit for you. You should resolve it
                    first to deposit more.
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
                          src="theme-assets/images/dice-gold-coin.png"
                          alt="team-profile-1"
                          className="rounded-circle"
                          style={{ width: "2.5rem" }}
                        />
                        <p className="ml-2 mb-0">{pendingDepositAmount}</p>
                      </div>
                      {depositFlag ? (
                        <button
                          onClick={() => {
                            setDepositFlag(false);
                            handleDepositSol(pendingDepositAmount / rate);
                          }}
                          className="btn btn-lg btn-gradient-purple btn-glow animated"
                          data-animation="fadeInUpShorter"
                          data-animation-delay="1.1s"
                        >
                          Solve Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => { }}
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
                    <h2 className="title">DEPOSIT SOLANA</h2>
                  </div>
                  <p
                    className="content-desc animated"
                    data-animation="fadeInUpShorter"
                    data-animation-delay="0.4s"
                  >
                    There are some pending withdraw, you should solve it first to
                    deposit.
                  </p>
                </div>
              </div>
            </section>
          ))


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
                <h2 className="title">DEPOSIT SOLANA</h2>
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

export default DepositComponent;
