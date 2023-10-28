import React from "react";
import { Button } from "@mui/material"; // Import the Button component if you're using Material-UI
import noTransactions from "./EmptyTransaction2.svg";
import { useNavigate } from "react-router-dom";

const NoTransactions = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginTop: "-40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // This ensures the box takes the full viewport height
        textAlign: "center", // Center align text for all children
      }}
    >
      <img
        style={{ height: "400px", width: "300px" }}
        src={noTransactions}
        alt="No transactions page"
      />
      <h2>No Transaction Data !</h2>
      <p style={{ margin: 0 }}>
        {" "}
        {/* Remove default paragraph margins */}
        Trakk could not find transactions, have you uploaded the transactions
        file?
      </p>
      <Button
        variant="contained"
        style={{
          width: "90%",
          color: "black",
          backgroundColor: "white",
          margin: "0", // Remove default margins and alignments
          marginBottom: "20px", // Add bottom margin only
          marginTop: "10px",
        }}
        onClick={() => navigate("/upload")}
      >
        Upload Transactions --&gt;
      </Button>
    </div>
  );
};

export default NoTransactions;
