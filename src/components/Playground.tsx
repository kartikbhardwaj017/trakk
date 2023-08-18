import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Layout from "./Layout";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const onFiltersChange = (filters: ITransactionFilter) => {
    // use repo method to apply filter and fetch transactions
    // update the state
    transactionRepository
      .readTransactions(filters)
      .then((filteredTransactions) => {
        // Update the state with the filtered transactions
        setCurrentTransactions(
          filteredTransactions.filter((trans) => trans.remarks?.length > 0)
        );
      });
  };
  // Fetch transactions from database when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get("date");
    const search = queryParams.get("search");
    const transactionType = queryParams.get("type") as
      | "income"
      | "all"
      | "expense";

    if (date) {
      transactionRepository
        .readTransactions({
          startDate: date,
          endDate: date,
          type: transactionType,
        }) // Fetch all transactions, or apply filters as needed
        .then((loadedTransactions) => {
          setCurrentTransactions(
            loadedTransactions.filter((trans) => trans.remarks?.length > 0)
          );
        });
    } else if (search) {
      transactionRepository
        .readTransactions({ remarks: search, type: transactionType }) // Fetch all transactions, or apply filters as needed
        .then((loadedTransactions) => {
          setCurrentTransactions(
            loadedTransactions.filter((trans) => trans.remarks?.length > 0)
          );
        });
    } else {
      transactionRepository
        .readTransactions({}) // Fetch all transactions, or apply filters as needed
        .then((loadedTransactions) => {
          setCurrentTransactions(
            loadedTransactions.filter((trans) => trans.remarks?.length > 0)
          );
        });
    }
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
        paddingX={2}
        paddingY={1}
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
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
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
      {currentTransactions
        .sort((t1, t2) => (t1.date < t2.date ? 1 : -1))
        .map((transaction) => (
          <TansactionView transaction={transaction} />
        ))}
    </Layout>
  );
}
