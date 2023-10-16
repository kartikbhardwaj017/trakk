import React, { useState } from "react";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
import { useNavigate } from "react-router-dom";

interface TransactionsTableProps {
  transactions: ITransactionProps[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [topK, setTopK] = useState<number>(10);
  const [transactionType, setTransactionType] =
    useState<ETransactionType | null>(null);
  const [rankBy, setRankBy] = useState<"frequency" | "amount">("frequency");

  const filteredTransactions = transactions.filter((transaction) =>
    transactionType ? transaction.type === transactionType : true
  );

  const groupedByRecipient = filteredTransactions.reduce<{
    [key: string]: { frequency: number; totalAmount: number };
  }>((acc, trans) => {
    if (!acc[trans.recipient]) {
      acc[trans.recipient] = { frequency: 0, totalAmount: 0 };
    }
    acc[trans.recipient].frequency++;
    acc[trans.recipient].totalAmount += trans.amount;
    return acc;
  }, {});

  const tickFormatter = (tickValue) => {
    if (tickValue === 1) return "0";

    if (tickValue >= 100000) {
      return `${(tickValue / 100000).toFixed(1)}L`;
    } else if (tickValue >= 1000) {
      return `${(tickValue / 1000).toFixed(1)}k`;
    }

    return tickValue.toFixed(1); // Show 1 decimal place for other values
  };
  const sortedRecipients = Object.entries(groupedByRecipient)
    .sort((a, b) => {
      if (rankBy === "frequency") {
        return b[1].frequency - a[1].frequency;
      }
      return b[1].totalAmount - a[1].totalAmount;
    })
    .slice(0, topK);
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: "20px", overflowX: "auto" }}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <Chip
            label="By Frequency"
            clickable
            onClick={() => setRankBy("frequency")}
            color={rankBy === "frequency" ? "primary" : "default"}
            style={{ marginRight: "10px" }}
          />
          <Chip
            label="By Amount"
            clickable
            onClick={() => setRankBy("amount")}
            color={rankBy === "amount" ? "primary" : "default"}
          />
        </Grid>
        <Grid item>
          <Chip
            label="Credit"
            clickable
            onClick={() => setTransactionType(ETransactionType.CREDIT)}
            color={
              transactionType === ETransactionType.CREDIT
                ? "primary"
                : "default"
            }
            style={{ marginRight: "10px" }}
          />
          <Chip
            label="Debit"
            clickable
            onClick={() => setTransactionType(ETransactionType.DEBIT)}
            color={
              transactionType === ETransactionType.DEBIT ? "primary" : "default"
            }
          />
        </Grid>
      </Grid>
      <div style={{ overflowX: "auto" }}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell align="right">Frequency</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRecipients.map(([recipient, data]) => (
                <TableRow key={recipient}>
                  <TableCell
                    onClick={(event) => {
                      navigate(
                        `/community?search=${encodeURIComponent(recipient)}`
                      );
                    }}
                  >
                    {recipient}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={(event) => {
                      navigate(
                        `/community?search=${encodeURIComponent(recipient)}`
                      );
                    }}
                  >
                    {data.frequency}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={(event) => {
                      navigate(
                        `/community?search=${encodeURIComponent(recipient)}`
                      );
                    }}
                  >
                    {tickFormatter(data.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
};

export default TransactionsTable;
