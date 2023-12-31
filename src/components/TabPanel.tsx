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
        <Box sx={{ p: 1 }}>
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
export default function BasicTabs({
  transactions,
  setShowDrawer,
  setCurrentTransaction,
}) {
  const [value, setValue] = React.useState(0);
  // Fetch transactions from database when the component mounts

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          .slice(0, 5)
          .map((transaction) => (
            <TansactionView
              transactionProps={transaction}
              setShowDrawer={setShowDrawer}
              setCurrentTransaction={setCurrentTransaction}
            />
          ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {transactions
          .filter((transaction) => transaction.type === ETransactionType.DEBIT)
          .slice(0, 5)
          .map((transaction) => (
            <TansactionView
              transactionProps={transaction}
              setShowDrawer={setShowDrawer}
              setCurrentTransaction={setCurrentTransaction}
            />
          ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {transactions
          .filter((transaction) => transaction.type === ETransactionType.CREDIT)
          .slice(0, 5)
          .map((transaction) => (
            <TansactionView
              transactionProps={transaction}
              setShowDrawer={setShowDrawer}
              setCurrentTransaction={setCurrentTransaction}
            />
          ))}
      </CustomTabPanel>
    </Box>
  );
}
