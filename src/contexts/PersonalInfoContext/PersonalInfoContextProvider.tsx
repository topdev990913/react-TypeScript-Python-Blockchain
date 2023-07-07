import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import useSocket from "../../hooks/useSocket";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { toast } from "react-toastify";
import { BigNumber } from "ethers";
import useTWMFinance from "../../hooks/useTWMFinance";
import { decimalToBalance, balanceToDecimal } from "../../twm-finance/ether-utils";

export interface PersonalInfoInterface {
  tapFlag: number;
  fund: number;
  bettingFlag: boolean;
  depositingFlag: boolean;
  withdrawingFlag: boolean;
  withdrawSuccessFlag: boolean;
  betColor: string;
  winColor: string;
  poolState: poolStateInterface;
  setTapFlag: Function;
  setDepositingFlag: Function;
  setWithdrawingFlag: Function;
  setWithdrawSuccessFlag: Function;
  whithdraw: Function;
  depositSol: Function;
  withdrawSol: Function;
  updateFund: Function;
  updateFundStatus: Function;
  updateWithdrawStatus: Function;
  setRequestWithdraw: Function;
}

export interface poolStateInterface {
  owner: string;
  pool: string;
  amount: number;
  status: string;
  stateAddr: string;
}

export interface withdrawParaInterface {
  player: string;
  amount: BigNumber;
  index: number;
  signature: string;
}

export const PersonalInfoContext = React.createContext<PersonalInfoInterface>({
  tapFlag: 1,
  fund: 0,
  bettingFlag: false,
  depositingFlag: false,
  withdrawingFlag: false,
  withdrawSuccessFlag: false,
  betColor: "",
  winColor: "",
  poolState: {
    owner: "",
    pool: "",
    amount: 0,
    status: "",
    stateAddr: "default",
  },
  setTapFlag: () => { },
  setDepositingFlag: () => { },
  setWithdrawingFlag: () => { },
  setWithdrawSuccessFlag: () => { },
  whithdraw: async (amount: number) => {
    return false;
  },
  depositSol: async (amount: number) => {
    return false;
  },
  withdrawSol: async (amount: number) => {
    return false;
  },
  updateFund: () => { },
  updateFundStatus: () => { },
  updateWithdrawStatus: () => { },
  setRequestWithdraw: () => { }
});

export const PersonalInfoContextProvider: React.FC = ({
  children
}) => {
  const { account } = useWeb3React();
  const curSocket = useSocket();
  const twmFinance = useTWMFinance();
  const [fund, setFund] = useState<number>(0);
  const [bettingFlag, setBettingFlag] = useState<boolean>(false);
  const [depositingFlag, setDepositingFlag] = useState<boolean>(false);
  const [withdrawingFlag, setWithdrawingFlag] = useState<boolean>(false);
  const [withdrawSuccessFlag, setWithdrawSuccessFlag] =
    useState<boolean>(false);
  const [betColor, setBetColor] = useState<string>("");
  const [winColor, setWinColor] = useState<string>("");
  const [poolState, setPoolState] = useState<poolStateInterface>({
    owner: "",
    pool: "",
    amount: 0,
    status: "default",
    stateAddr: "",
  });
  const [tapFlag, setTapFlag] = useState<number>(1);
  const rate = 100;


  const getStateData = async () => {
    try {

    } catch (err) {
      console.log(err);
      return {};
    }
  };

  const deposit = async (depositAmount: number) => {
    try {
    } catch (err) {
      setDepositingFlag(true);
      console.log(err);
      return false;
    }
  };

  const whithdraw = async (withdrawAmount: number) => {
    const rate = 100;
    try {
    } catch (err) {
      console.log(err);
      setWithdrawingFlag(true);
    }
  };

  const updateFund = () => {
    if (account && curSocket.connected) {
      curSocket.emit(
        "get_fund",
        JSON.stringify({ wallet: account })
      );
    }
  };

  const updateFundStatus = () => {
    if (account && curSocket.connected) {
      curSocket.emit(
        "get_fund_status",
        JSON.stringify({ wallet: account })
      );
    }
  };

  const updateWithdrawStatus = () => {
    if (account && curSocket.connected) {
      curSocket.emit(
        "get_withdraw_status",
        JSON.stringify({ wallet: account })
      );
    }
  };



  const depositSol = useCallback(
    async (amount: number) => {
      if (account) {
        let stateData: any = {
          amount: 0,
          status: "default",
          pendingFlag: false,
        };
        try {
          let res = await axios.get(
            "http://localhost:5000/api/treasury/state/" + account,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          );
          let state = res.data;
          console.log("state:", state)
          let depositedList = await twmFinance?.getDepositedAmountList(account);
          if (depositedList && (res.data.depositIndex < depositedList?.length)) {
            stateData.status = "deposit";
            stateData.pendingFlag = true;
            for (let i = res.data.depositIndex; i < depositedList?.length; i++) {
              stateData.amount += depositedList[i];
            }
          }
          console.log(state);
        } catch (error) {
          console.log(error);
        }
        // pending check
        if (
          !stateData.pendingFlag &&
          (await twmFinance?.depositTWMT(decimalToBalance(amount.toString())))
        ) {
          curSocket.emit(
            "deposit_fund",
            JSON.stringify({
              wallet: account,
              amount: amount,
            })
          );
        } else if (stateData.status == "deposit" && stateData.amount > 0) {
          toast.warn(`Deposit is pending!`, {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          curSocket.emit(
            "deposit_fund",
            JSON.stringify({
              wallet: account,
              amount: stateData.amount,
            })
          );
        } else if (
          stateData.amount &&
          stateData.status === "withdraw required"
        ) {
          toast.warn(`Withdraw is pending!`, {
            position: "bottom-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setDepositingFlag(true);
        }
      } else {
        toast.warn(`No wallet Connected!`, {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setDepositingFlag(true);
      }
    },
    [curSocket, twmFinance?.myAccount]
  );

  const withdrawSol = useCallback(
    async (amount: BigNumber) => {
      if (account) {
        let stateData: any = {
          amount: 0,
          status: "default",
          pendingFlag: false,
        };

        try {
          let res = await axios.get(
            "http://localhost:5000/api/treasury/state/" + account,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              },
            }
          );
          let state = res.data;
          console.log("state:", state)
          if (state.amount >= amount) {
            curSocket.emit(
              "withdraw_fund",
              JSON.stringify({
                wallet: account,
                amount: amount,
              })
            );
          } else {
            toast.warn(`Fund is not enough`, {
              position: "bottom-left",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setWithdrawingFlag(true);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        toast.warn(`No wallet Connected!`, {
          position: "bottom-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setWithdrawingFlag(true);
      }
    }, [curSocket, twmFinance?.myAccount]
  )

  const [requestWithdraw, setRequestWithdraw] = useState<boolean>(false);
  const [requestWithdrawAmount, setRequestWithdrawAmount] = useState<withdrawParaInterface>({
    player: "",
    amount: BigNumber.from(0),
    index: 0,
    signature: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (requestWithdraw && requestWithdrawAmount) {
        console.log("requestWithdrawAmount:", requestWithdrawAmount)
        let res = await twmFinance?.withdrawTWMT(requestWithdrawAmount.player, requestWithdrawAmount.amount, requestWithdrawAmount.index, requestWithdrawAmount.signature)
        if(res?.success) {
          setWithdrawSuccessFlag(true);
        } else {
          setWithdrawingFlag(true);
        }
        setRequestWithdraw(false);
        updateFund();
        setRequestWithdrawAmount({
          player: "",
          amount: BigNumber.from(0),
          index: 0,
          signature: "",
        });
        setPoolState({
          owner: "",
          pool: "",
          amount: 0,
          status: "success",
          stateAddr: "",
        })
        updateWithdrawStatus();
        // console.log(res)
        // if (res?.success) {
        //   setWithdrawingFlag(false);
        //   setRequestWithdraw(false);
        //   updateFund();
        //   updateWithdrawStatus();
        // }
        // updateFund();
        // setRequestWithdraw(false);
        // setRequestWithdrawAmount({
        //   player: "",
        //   amount: BigNumber.from(0),
        //   index: 0,
        //   signature: "",
        // });
        // setPoolState({
        //   owner: "",
        //   pool: "",
        //   amount: 0,
        //   status: "success",
        //   stateAddr: "",
        // })
      }
    };
    fetchData();
  }, [requestWithdraw, requestWithdrawAmount]);

  useEffect(() => {
    if (curSocket) {
      curSocket.on("message", async (...data: any) => {
        if (data[0].type === "get_fund") {
          if (data[0].ok) {
            setFund(Number(data[0].amount));
          } else {
          }
        } else if (data[0].type === "get_fund_status") {
          if (data[0].ok) {
            console.log("deposit status: ", data[0])
            if (data[0].data["amount"]) {
              setPoolState({
                owner: "",
                pool: "",
                amount: data[0].data["amount"],
                status: "deposited",
                stateAddr: "",
              })
            }
          } else {
            console.log("deposit status: ", data[0])
          }
        } else if (data[0].type === "get_withdraw_status") {
          if (data[0].ok) {
            console.log("withdraw status: ", data[0])

            if (data[0].message == "success") {
              setPoolState({
                owner: "",
                pool: "",
                amount: 0,
                status: "success",
                stateAddr: "",
              })
            } else {
              setPoolState({
                owner: "",
                pool: "",
                amount: Number(balanceToDecimal(data[0].data["amount"], 18)),
                status: "withdraw required",
                stateAddr: "",
              })
              setRequestWithdrawAmount({
                player: data[0].data.wallet,
                amount: data[0].data.amount,
                index: data[0].data.index,
                signature: data[0].data.signature,
              });
            }
          } else {
            console.log("withdraw status: ", data[0])
          }
        } else if (data[0].type === "betting_start") {
          setBettingFlag(true);
          setBetColor("");
          setWinColor("");
        } else if (data[0].type === "roll_start") {
          if (data[0].ok) {
            setBettingFlag(false);
          } else {
          }
        } else if (data[0].type === "roll_end") {
          if (data[0].ok) {
            updateFund();
            setBettingFlag(false);
            setWinColor(data[0].result);
          } else {
          }
        } else if (data[0].type === "withdraw_fund") {
          console.log(data[0])
          if (data[0].ok) {
            setRequestWithdrawAmount({
              player: data[0].data.wallet,
              amount: data[0].data.amount,
              index: data[0].data.index,
              signature: data[0].data.signature,
            });
            setRequestWithdraw(true);
          } else {
            setWithdrawingFlag(true);
            updateFund();
          }
        }
      });
    }
  }, [curSocket]);

  return (
    <PersonalInfoContext.Provider
      value={{
        tapFlag,
        fund,
        bettingFlag,
        depositingFlag,
        withdrawingFlag,
        withdrawSuccessFlag,
        betColor,
        winColor,
        poolState,
        setTapFlag,
        setDepositingFlag,
        setWithdrawingFlag,
        setWithdrawSuccessFlag,
        whithdraw,
        depositSol,
        withdrawSol,
        updateFund,
        updateFundStatus,
        updateWithdrawStatus,
        setRequestWithdraw
      }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
};
