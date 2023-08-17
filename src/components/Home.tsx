import React, { useRef } from "react";
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
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BasicTabs from "./TabPanel";
import Graph from "./Graph";
import Graph2 from "./Graph2";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useSwipeable } from "react-swipeable";
// import { ArrowUpward, ArrowDownward } from '@material-ui/icons'; // Importing Material-UI icons

export default function Home() {
  const cardContents = [
    {
      greeting: "Welcome,",
      name: "Kartik",
      balance: "INR 80000.00",
      income: "INR 1000",
      expense: "INR 500",
    },
    {
      greeting: "Welcome,",
      name: "Rohit",
      balance: "INR 90000.00",
      income: "INR 400",
      expense: "INR 200",
    },
    // Add more card contents here
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardContent = cardContents[currentCardIndex];
  const [swipeDirection, setSwipeDirection] = useState(""); // Define state to track swipe direction
  const cardRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      setSwipeDirection("up");
      setTimeout(() => setSwipeDirection(""), 500); // Reset after 0.5s (same as transition duration)
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cardContents.length);
    },
    onSwipedDown: () => {
      setSwipeDirection("down");
      setTimeout(() => setSwipeDirection(""), 500); // Reset after 0.5s (same as transition duration)
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + cardContents.length) % cardContents.length
      );
    },
  });

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (e.target.closest(".swipeable-card")) {
        e.preventDefault();
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <Layout selectedIcon={"Home"}>
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
          paddingTop: "2px",

          overflowX: "hidden",
        }}
      >
        <div
          className="swipeable-card"
          style={{
            flexGrow: 1,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
          {...handlers}
        >
          <Card variant="outlined">
            <div
              style={{
                width: "400px",
                backgroundColor: "#f0f0f0",
                color: "black",
                display: "flex",
                flexDirection: "column" as "column",
                padding: "5px",
                transition: "all 0.5s ease",
                opacity: swipeDirection ? 0 : 1, // Animate opacity based on swipe direction
                transform:
                  swipeDirection === "up"
                    ? "translateY(-20px)"
                    : swipeDirection === "down"
                    ? "translateY(20px)"
                    : "translateY(0)", // Translate card based on swipe direction
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
                {cardContent.name}
              </span>
              <span>Available balance</span>
              <span style={{ fontWeight: 700, fontSize: "32px" }}>
                {cardContent.balance}
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
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    paddingRight: "15px",
                  }}
                >
                  <span>income</span>
                  <br />
                  <span>{cardContent.income}</span>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    backgroundColor: "#d1d1d1",
                  }}
                ></div>
                <div
                  style={{
                    flex: 1,
                    paddingLeft: "15px",
                  }}
                >
                  <span>expense</span>
                  <br />
                  <span>{cardContent.expense}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {cardContents.map((_, index) => (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  index === currentCardIndex ? "black" : "#d1d1d1",
                margin: "0 3px",
              }}
            />
          ))}
        </div>
        <BasicTabs />

        <h2>Expense Overview</h2>
        <Graph />
        <Graph2 />
      </div>
    </Layout>
  );
}
