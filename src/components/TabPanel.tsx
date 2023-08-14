import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import TansactionView from "./Tansaction";
import TransactionRepository from "../services/Dexie/DbService";
import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const transactions = [
//   {
//     transactionType: "debit",
//     amount: 90,
//     category: "groceries",
//     name: "Tomatoes",
//   },
//   {
//     transactionType: "debit",
//     amount: 10,
//     category: "food",
//     name: "Seawise",
//   },
//   {
//     transactionType: "debit",
//     amount: 45,
//     name: "apples",
//     category: "other",
//   },
//   {
//     transactionType: "credit",
//     amount: 45,
//     name: "Vinay",
//     category: "send",
//   },
// ];
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const startTransactionArray: ITransactionProps[] = [];
  const [transactions, setTransactions] = useState(startTransactionArray);
  const transactionRepository = new TransactionRepository();

  // Fetch transactions from database when the component mounts
  useEffect(() => {
    transactionRepository
      .readTransactions({}) // Fetch all transactions, or apply filters as needed
      .then((loadedTransactions) => {
        setTransactions(
          loadedTransactions.filter((trans) => trans.remarks?.length > 0)
        );
      });
  }); // Empty dependency array ensures this runs once after mount

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Filter transactions for each tab
  const allTransactions = transactions;
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === ETransactionType.DEBIT
  );
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === ETransactionType.CREDIT
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Expenses" {...a11yProps(1)} />
          <Tab label="Income" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {transactions
          .sort((t1, t2) => {
            return t1.date < t2.date ? 1 : -1;
          })
          .splice(0, 10)
          .map((transaction) => (
            <TansactionView transaction={transaction} />
          ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {transactions
          .filter((transaction) => transaction.type === ETransactionType.DEBIT)
          .map((transaction) => (
            <TansactionView transaction={transaction} />
          ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {transactions
          .filter((transaction) => transaction.type === ETransactionType.CREDIT)
          .map((transaction) => (
            <TansactionView transaction={transaction} />
          ))}
      </CustomTabPanel>
    </Box>
  );
}
