import { FlashOn } from "@mui/icons-material";
import { Card, Paper } from "@mui/material";
import React from "react";
import { getCategoryIcon } from "./Category";
import {
  ETransactionType,
  ITransactionProps,
  ITransactionWithMetaDataType,
} from "../services/ITransactionProps";
import { DateTime } from "luxon";

export default function TansactionView({
  setCurrentTransaction = null,
  setShowDrawer = null,
  transactionProps = null,
}) {
  const transaction: ITransactionWithMetaDataType = transactionProps;
  return (
    <div
      style={{
        display: "flex",
        color: "white",
        overflowX: "auto",
      }}
      onClick={() => {
        setShowDrawer(true);
        setCurrentTransaction(transaction);
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #3a3a3a",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#2a2a2a",
          width: "100%", // fill the width of the parent container
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {getCategoryIcon(transaction.category)}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: "10px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#fff" }}>
              {transaction.recipientName
                ? transaction.recipientName
                : transaction.remarks.length > 20
                ? transaction.remarks.substring(0, 20) + "..."
                : transaction.remarks}
              {/* {transaction.remarks} */}
            </span>

            <span style={{ fontSize: "14px", color: "#aaa", marginTop: "5px" }}>
              {transaction.recipient} on{" "}
              {DateTime.fromJSDate(transaction.date).toFormat("dd/MM/yyyy")}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <b
            style={{
              fontSize: "18px",
              color:
                transaction.type === ETransactionType.CREDIT
                  ? "#4CAF50"
                  : "#FF5733", // green for credit, red for debit
            }}
          >
            <span>
              {transaction.type === ETransactionType.CREDIT
                ? `+${transaction.amount}`
                : `-${transaction.amount}`}
            </span>
          </b>
          <span style={{ fontSize: "14px", color: "#aaa", marginTop: "5px" }}>
            {transaction.mode}
          </span>
        </div>
      </div>
    </div>
  );
}
