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
import Layout from "./Layout";
import TransactionRepository from "../services/Dexie/DbService";
import { ITransactionProps } from "../services/ITransactionProps";
import TransactionsTable from "./Table";
import ScrollIndicator from "./ScrollIndicator";
import IncomeGraph from "./IncomeGraph";
import ExpenseGraph from "./ExpenseGraph";
import { CheckCircle } from "@mui/icons-material";

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
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const startTransactionArray: ITransactionProps[] = [];

  const transactionRepository = new TransactionRepository();
  const [transactions, setTransactions] = useState(startTransactionArray);
  const [accounts, setAccounts] = useState([
    { accountNumber: "Loading", name: "Loading" },
  ]);

  useEffect(() => {
    transactionRepository.fetchAccounts().then((loadedAccounts) => {
      console.log("accounts", loadedAccounts);
      if (loadedAccounts.length > 0) setAccounts(loadedAccounts);
    });
  }, []);

  useEffect(() => {
    const transactionRepository = new TransactionRepository();
    transactionRepository
      .readTransactions({
        accountNumber: accounts[currentCardIndex].accountNumber,
      })
      .then((loadedTransactions) => {
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
  }, [accounts, currentCardIndex]);

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
        ? (currentCardIndex + 1) % accounts.length
        : (currentCardIndex - 1 + accounts.length) % accounts.length;
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

  return (
    <Layout selectedIcon={"Home"}>
      <ScrollIndicator parentId="scrollingConatiner" />
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
          paddingTop: "60px",

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
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                    />
                    <CheckCircle
                      style={{ cursor: "pointer" }}
                      onClick={async (event) => {
                        event.stopPropagation();
                        if (inputName.length > 0) {
                          // Update the name in accounts at the current index
                          let updatedAccounts = [...accounts];
                          updatedAccounts[currentCardIndex].name = inputName;
                          setAccounts(updatedAccounts);
                          await transactionRepository.updateAccountHolderName(
                            inputName,
                            updatedAccounts[currentCardIndex].accountNumber
                          );
                          setIsEditing(false);
                        }
                      }}
                    />
                  </>
                ) : accounts[currentCardIndex].name.length > 0 ? (
                  accounts[currentCardIndex].name
                ) : (
                  "Enter your name"
                )}
              </span>
              <span>Account Number</span>
              <span style={{ fontWeight: 700, fontSize: "32px" }}>
                {`XXXXXX${accounts[currentCardIndex].accountNumber.slice(-4)}`}
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
                  <span>{"5000 INR"}</span>
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
                  <span>{"600 INR"}</span>
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
          {accounts.map((_, index) => (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: index === currentCardIndex ? "red" : "#d1d1d1",
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
          <IncomeGraph transactions={cloneDeep(filteredTransactions)} />
          <ExpenseGraph transactions={cloneDeep(filteredTransactions)} />
          <TransactionsTable transactions={cloneDeep(filteredTransactions)} />
          <div style={{ height: "150px" }}></div>
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
