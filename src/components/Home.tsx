import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  Divider,
} from "@mui/material";
import {
  Restore,
  Favorite,
  LocationOn,
  Home as HomeIcon,
  Margin,
  UploadFile,
} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BasicTabs from "./TabPanel";
import Graph from "./Graph";
import Graph2 from "./Graph2";
import { useEffect } from "react";
import Layout from "./Layout";

export default function Home() {
  // useEffect(() => {
  //   // This is a basic check to determine if the device might be a desktop
  //   if (window.innerWidth > 800 || window.innerHeight > 800) {
  //     alert("Please open this page on a mobile device.");
  //   }
  // }, []);

  return (
    <Layout selectedIcon={"Home"}>
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
          padding: "10px",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <Card variant="outlined">
            <div
              style={{
                width: "400px",
                backgroundColor: "#f0f0f0",
                color: "black",
                display: "flex",
                flexDirection: "column",
                padding: "5px",
              }}
            >
              <span>Welcome,</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "32px",
                  marginLeft: "10px",
                }}
              >
                Kartik
              </span>
              <span>Available balance</span>
              <span style={{ fontWeight: 700, fontSize: "32px" }}>
                INR 80000.00
              </span>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#d1d1d1",
                  height: "3px",
                  margin: "2px",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center", // for vertical centering
                  padding: "10px", // space around the edges
                }}
              >
                <div
                  style={{
                    flex: 1, // take up equal width
                    textAlign: "right", // right align the left section for better aesthetics
                    paddingRight: "15px", // space before the divider
                  }}
                >
                  <span>income</span>
                  <br />
                  <span>INR 1000</span>
                </div>
                <div
                  style={{
                    width: "px",
                    height: "40px", // reduce the height for aesthetics
                    backgroundColor: "#d1d1d1", // use a softer color
                  }}
                ></div>
                <div
                  style={{
                    flex: 1, // take up equal width
                    paddingLeft: "15px", // space after the divider
                  }}
                >
                  <span>expense</span>
                  <br />
                  <span>INR 500</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <BasicTabs />

        <h2>Expense Overview</h2>
        <Graph />
        <Graph2 />
      </div>
    </Layout>
  );
}
