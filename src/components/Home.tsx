import React, { useEffect, useRef, useState } from "react";
import { Card } from "@mui/material";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import cloneDeep from "lodash/cloneDeep";
import { useSwipeable } from "react-swipeable";
import BasicTabs from "./TabPanel";
import Graph from "./IncomeGraph";
import Graph2 from "./ExpenseGraph";
import Layout from "./Layout";
import TransactionRepository from "../services/Dexie/DbService";
import { ITransactionProps } from "../services/ITransactionProps";
import TransactionsTable from "./Table";
import ScrollIndicator from "./ScrollIndicator";

export default function Home() {
  // State & Refs
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [dateRange, setDateRange] = useState({
    min: new Date(), // Initialize with current date; will update in useEffect
    max: new Date(),
  });
  const [selectedDateRange, setSelectedDateRange] = useState({
    min: new Date(), // Initialize with current date; will update in useEffect
    max: new Date(),
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const startTransactionArray: ITransactionProps[] = [];
  const transactionRepository = new TransactionRepository();
  const [transactions, setTransactions] = useState(startTransactionArray);
  const [isSliderExpanded, setIsSliderExpanded] = useState(false);

  const toggleSliderExpand = () => {
    setIsSliderExpanded(!isSliderExpanded);
  };

  useEffect(() => {
    transactionRepository.readTransactions({}).then((loadedTransactions) => {
      setTransactions(
        loadedTransactions.filter((trans) => trans.remarks?.length > 0)
      );
      setFilteredTransactions(
        loadedTransactions.filter((trans) => trans.remarks?.length > 0)
      );
      setDateRange({
        min: loadedTransactions[loadedTransactions.length - 1]?.date,
        max: loadedTransactions[0].date,
      });
      setSelectedDateRange({
        min: loadedTransactions[loadedTransactions.length - 1]?.date,
        max: loadedTransactions[0].date,
      });
    });
  }, []);

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

  const cardContent = cardContents[currentCardIndex];

  const handlers = useSwipeable({
    onSwipedUp: () => {
      handleSwipe("up");
    },
    onSwipedDown: () => {
      handleSwipe("down");
    },
  });

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(""), 500);
    const newIndex =
      direction === "up"
        ? (currentCardIndex + 1) % cardContents.length
        : (currentCardIndex - 1 + cardContents.length) % cardContents.length;
    setCurrentCardIndex(newIndex);
  };
  const handleDateRangeChange = (minDate, maxDate) => {
    const filtered = transactions.filter((t) => {
      const transDate = t.date;
      console.log(t.date, transDate >= minDate && transDate <= maxDate);
      return transDate >= minDate && transDate <= maxDate;
    });
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (e.target.closest(".swipeable-card")) {
        e.preventDefault();
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // 4. JSX Render

  return (
    <Layout selectedIcon={"Home"}>
      <ScrollIndicator parentId="scrollingConatiner" />
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
          paddingTop: "2px",

          overflowX: "hidden",
        }}
        id="scrollingConatiner"
      >
        <div
          className="swipeable-card"
          style={{
            flexGrow: 1,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            marginTop: "10px",
          }}
          {...handlers}
        >
          <Card variant="outlined">
            <div
              style={{
                width: "380px",
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
        <div style={{ padding: "10px" }}>
          <BasicTabs transactions={cloneDeep(filteredTransactions)} />

          <Box
            sx={{
              width: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <Typography id="range-slider" gutterBottom>
              Date Range
            </Typography>

            <Slider
              value={[
                selectedDateRange.min.getTime(),
                selectedDateRange.max.getTime(),
              ]}
              onChange={(event, newValue: number[]) => {
                setSelectedDateRange({
                  min: new Date(newValue[0]),
                  max: new Date(newValue[1]),
                });
                handleDateRangeChange(
                  new Date(newValue[0]),
                  new Date(newValue[1])
                );
              }}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => new Date(value).toLocaleDateString()}
              min={new Date(dateRange.min).getTime()}
              max={new Date(dateRange.max).getTime()}
              sx={{ width: "100%" }}
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>
                {new Date(dateRange.min).toLocaleDateString()}
              </Typography>
              <Typography>
                {new Date(dateRange.max).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <ExpandableSlider
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            handleDateRangeChange={handleDateRangeChange}
            dateRange={dateRange}
          />

          <h2>Expense Overview</h2>
          <Graph transactions={cloneDeep(filteredTransactions)} />
          <Graph2 transactions={cloneDeep(filteredTransactions)} />
          <TransactionsTable transactions={cloneDeep(filteredTransactions)} />
        </div>
      </div>
    </Layout>
  );
}

const ExpandableSlider = ({
  selectedDateRange,
  setSelectedDateRange,
  dateRange,
  handleDateRangeChange,
}) => {
  const [isSliderExpanded, setIsSliderExpanded] = useState(false);

  const toggleSliderExpand = () => {
    setIsSliderExpanded(!isSliderExpanded);
  };

  return (
    <div
      style={{
        position: "fixed",
        // top: `${sliderTop}px`,
        bottom: "60px",
        left: 0, // or left: 0 if you want it to float on the left
        zIndex: 10,
        width: "100%",
        transition: "width 0.5s ease-in-out",
      }}
    >
      {isSliderExpanded ? (
        <div style={{ backgroundColor: "black" }}>
          <div
            onClick={toggleSliderExpand}
            style={{
              position: "absolute",
              left: 2,
              bottom: 25,
              // top: "5px",
              zIndex: 11,
            }}
          >
            <ArrowBackIosIcon
              style={{
                fontSize: 30,
                color: "white",
              }}
            />
          </div>
          <Box
            sx={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 auto",
              opacity: 1,
              marginLeft: "40px", // Add margin-left
            }}
          >
            <Typography id="range-slider" gutterBottom>
              Date Range
            </Typography>

            <Slider
              value={[
                selectedDateRange.min.getTime(),
                selectedDateRange.max.getTime(),
              ]}
              onChange={(event, newValue: number[]) => {
                setSelectedDateRange({
                  min: new Date(newValue[0]),
                  max: new Date(newValue[1]),
                });
                handleDateRangeChange(
                  new Date(newValue[0]),
                  new Date(newValue[1])
                );
              }}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => new Date(value).toLocaleDateString()}
              min={new Date(dateRange.min).getTime()}
              max={new Date(dateRange.max).getTime()}
              sx={{ width: "100%" }}
            />
          </Box>
        </div>
      ) : (
        <div
          onClick={toggleSliderExpand}
          style={{
            position: "absolute",
            left: 2,
            bottom: 25,
            // top: "5px",
            zIndex: 11,
            background: "black",
          }}
        >
          <ArrowForwardIosIcon style={{ fontSize: 30, color: "white" }} />
        </div>
      )}
    </div>
  );
};
