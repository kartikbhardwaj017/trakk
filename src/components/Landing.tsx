import React from "react";
import { Button, Typography } from "@mui/material";
import { Image } from "@mui/icons-material";
import image from "./image.png"
export default function LandingPage() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">TRAKK</Typography>
      <Typography>Visualize and manage your expenses in one place.</Typography>
      <img src={image} alt="Graphic  " />

      <Button
        variant="contained"
        style={{
          width: "calc(100% - 20px)",
          margin: "10px",
        }}
      >
        Get Started
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Typography>Already a user?</Typography>
        <Button variant="text">Signin</Button>
      </div>
    </div>
  );
}
