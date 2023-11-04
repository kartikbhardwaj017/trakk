import React from "react";
import { Button } from "@mui/material"; // Import the Button component if you're using Material-UI
import noTransactions from "./Stop.svg";
import { useNavigate } from "react-router-dom";

const OnlyMobile = () => {
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
      <h2>Only available for Mobile</h2>

      <p style={{ margin: 0 }}>
        {" "}
        {/* Remove default paragraph margins */}
        We want you to have the best experience, trakk is optimised for mobile devices.
      </p>
    </div>
  );
};

export default OnlyMobile;
