import { FlashOn } from "@mui/icons-material";
import { Card, Paper } from "@mui/material";
import React from "react";
import { getCategoryIcon } from "./Category";

const GroceryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 4V20H4V4H20ZM2 2H22V22H2V2Z" fill="white" />
    <path d="M6 12H18V14H6V12Z" fill="white" />
    <path d="M6 16H18V18H6V16Z" fill="white" />
    <path d="M6 8H18V10H6V8Z" fill="white" />
  </svg>
);

export default function TansactionView(props) {
  const { transactionType, amount, category, name } = props.transaction;

  return (
    <div style={{ display: "flex", color: "white" }}>
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
          {getCategoryIcon(category)}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: "10px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#fff" }}>{name}</span>
            <span style={{ fontSize: "14px", color: "#aaa", marginTop: "5px" }}>
              {category}
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
              color: transactionType === "credit" ? "#4CAF50" : "#FF5733", // green for credit, red for debit
            }}
          >
            <span>{transactionType === "credit" ? "+$90" : "-$90"}</span>
          </b>
          <span style={{ fontSize: "14px", color: "#aaa", marginTop: "5px" }}>
            total balance
          </span>
        </div>
      </div>
    </div>
  );
}
