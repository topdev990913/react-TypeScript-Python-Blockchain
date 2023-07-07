import { useContext } from "react";
import { Context } from "../contexts/TWMFinanceProvider";

const useTWMFinance = () => {
  const { twmFinance } = useContext(Context);
  return twmFinance;
};

export default useTWMFinance;
