import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Box, Input } from "@mui/material";
import image from "./uploadFile.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Layout from "./Layout";

import Transaction from "./Tansaction";
import Filter from "./FIlter";
import {
  ITransactionProps,
  ITransactionFilter,
  ETransactionType,
} from "../services/ITransactionProps";
import TransactionRepository from "../services/Dexie/DbService";
import TansactionView from "./Tansaction";

export default function Playgoround() {
  const startTransactionArray: ITransactionProps[] = [];
  const [currentTransactions, setCurrentTransactions] = useState(
    startTransactionArray
  );
  const transactionRepository = new TransactionRepository();

  const onFiltersChange = (filters: ITransactionFilter) => {
    // use repo method to apply filter and fetch transactions
    // update the state
    transactionRepository
      .readTransactions(filters)
      .then((filteredTransactions) => {
        // Update the state with the filtered transactions
        console.log(filteredTransactions);
        setCurrentTransactions(
          filteredTransactions.filter((trans) => trans.remarks?.length > 0)
        );
      });
  };
  // Fetch transactions from database when the component mounts
  useEffect(() => {
    transactionRepository
      .readTransactions({}) // Fetch all transactions, or apply filters as needed
      .then((loadedTransactions) => {
        setCurrentTransactions(
          loadedTransactions.filter((trans) => trans.remarks?.length > 0)
        );
      });
  }, []); // Empty dependency array ensures this runs once after mount

  const totalIncome = currentTransactions.reduce(
    (sum, transaction) =>
      transaction.type === ETransactionType.CREDIT
        ? sum + transaction.amount
        : sum,
    0
  );
  const totalExpense = currentTransactions.reduce(
    (sum, transaction) =>
      transaction.type === ETransactionType.DEBIT
        ? sum + transaction.amount
        : sum,
    0
  );
  const net = totalIncome - totalExpense;
  return (
    <Layout selectedIcon={"Community"}>
      <Filter onFilterChange={onFiltersChange} />
      <Box
        padding={2}
        border={1}
        borderColor="grey.300"
        borderRadius={4}
        marginBottom={4}
        bgcolor="#2C2C2C" // Dark background color
        color="#FFFFFF" // White text color
      >
        <Typography variant="h6" style={{ color: "#FFD700" }}>
          Statistics
        </Typography>
        <Typography>Total Income: {totalIncome.toFixed(2)}</Typography>
        <Typography>Total Expense: {totalExpense.toFixed(2)}</Typography>
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          Net (Income - Expense):{" "}
          <span
            style={{
              color: net > 0 ? "#4CAF50" : net < 0 ? "#FF0000" : "#FFFFFF", // Green if positive, Red if negative
            }}
          >
            {net.toFixed(2)}
          </span>
        </Typography>
      </Box>
      {currentTransactions.map((transaction) => (
        <TansactionView transaction={transaction} />
      ))}
    </Layout>
  );
}
