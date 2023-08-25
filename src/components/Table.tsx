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

  const sortedRecipients = Object.entries(groupedByRecipient)
    .sort((a, b) => {
      if (rankBy === "frequency") {
        return b[1].frequency - a[1].frequency;
      }
      return b[1].totalAmount - a[1].totalAmount;
    })
    .slice(0, topK);

  return (
    <div style={{ marginTop: "20px", overflowX:'auto' }}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          {[3, 5, 10, 15].map((k) => (
            <Chip
              label={`Top ${k}`}
              clickable
              onClick={() => setTopK(k)}
              color={topK === k ? "primary" : "default"}
              style={{ marginRight: "10px" }}
            />
          ))}
        </Grid>
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
                  <TableCell>{recipient}</TableCell>
                  <TableCell align="right">{data.frequency}</TableCell>
                  <TableCell align="right">{data.totalAmount}</TableCell>
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
