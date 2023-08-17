import React, { useState, useEffect, useRef } from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import TransactionRepository from "../services/Dexie/DbService";
import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
import Chip from "@mui/material/Chip";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import IconButton from "@mui/material/IconButton";
import { RecipientsPieChart } from "./RecipientChart";

const ExpenseOverview = ({ data }) => {
  const barWidth = 10; // Desired width of each bar
  const [view, setView] = useState("daily");

  const scrollRef = useRef(null); // Create a ref for the container
  // ... rest of the code remains same

  const containerRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 100; // Adjust the value as needed
    }
  }, []);

  const formatData = (data: ITransactionProps[], view) => {
    if (view === "daily") {
      return groupBy(data, (item) => item.date.toLocaleDateString(), "amount");
    } else if (view === "weekly") {
      return groupBy(
        data,
        (item) =>
          `${item.date.getFullYear()}-${getMonthName(
            item.date.getMonth() + 1
          )}-Week${Math.ceil(item.date.getDate() / 7)}`,
        "amount"
      );
    } else if (view === "monthly") {
      return groupBy(
        data,
        (item) =>
          `${item.date.getFullYear()} ${getMonthName(
            item.date.getMonth() + 1
          )}`,
        "amount"
      );
    } else if (view === "yearly") {
      return groupBy(data, (item) => item.date.getFullYear(), "amount");
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "",
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return monthNames[parseInt(month)];
  };

  const groupBy = (data, keyFn, valueKey, nameFn = (key) => key) => {
    const groupedData = data.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item[valueKey];
      return acc;
    }, {});

    return Object.entries(groupedData).map(([key, value]) => ({
      date: nameFn(key),
      Expenses: value === 0 ? 1 : value,
    }));
  };

  const tickFormatter = (tickValue) => {
    if (tickValue === 1) return "0";
    return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
  };

  // const toggleFullScreen = () => {
  //   const elem = containerRef.current;

  //   if (
  //     elem &&
  //     !document.fullscreenElement &&
  //     !(document as any).webkitIsFullScreen
  //   ) {
  //     const requestFullScreen =
  //       elem.requestFullscreen || (elem as any).webkitRequestFullscreen;
  //     requestFullScreen.call(elem);
  //   } else {
  //     const exitFullscreen =
  //       document.exitFullscreen || (document as any).webkitExitFullscreen;
  //     exitFullscreen.call(document);
  //   }
  // };

  // const toggleFullScreen = () => {
  //   setIsFullscreen(!isFullscreen);
  // };
  // const containerStyle = isFullscreen
  //   ? {
  //       position: "fixed" as "fixed",
  //       top: 0,
  //       left: 0,
  //       width: "100%",
  //       height: "100%",
  //       zIndex: 9999,
  //       color: "white",
  //     }
  //   : {
  //       position: "relative" as "relative",
  //       paddingTop: "10px",
  //       color: "white",
  //     };

  // Custom render function for the labels, now using tickFormatter
  const renderCustomizedLabel = (props) => {
    const { x, y, value } = props;
    const formattedValue = tickFormatter(value); // Apply the same formatter
    return (
      <text
        x={x}
        y={y + 10}
        dy={-5}
        fill="white"
        fontSize={10}
        textAnchor="middle"
      >
        {formattedValue}
      </text>
    );
  };
  useEffect(() => {
    const newGData = formatData(data, view);
    setGData(newGData);
    setCWidth(newGData.length * barWidth);
  }, [data, view]);
  const [gData, setGData] = useState([]);
  const [cWidth, setCWidth] = useState(0);

  const handleViewChange = (newView: string) => {
    setView(newView);
    const newGData = formatData(data, newView); // Pass newView directly
    console.log("newData", newGData);
    setGData(newGData);
    setCWidth(newGData.length * barWidth); // Use newGData
  };

  return (
    <div
      style={{
        position: "relative",
        paddingTop: "10px",
        color: "white",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <h2 style={{ margin: 0 }}>Xpenses</h2>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "15px solid red",
            marginLeft: "10px",
            animation: "blink 0.5s linear infinite",
            WebkitAnimation: "blink 1s linear infinite", // For compatibility with Safari
          }}
        ></div>
      </div>
      <div
        style={{
          overflowX: "auto",
          width: "100%",
          overflowY: "hidden",
        }}
        ref={scrollRef}
      >
        <BarChart
          width={Math.max(cWidth, 600)}
          height={300}
          data={gData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" stroke="white" />
          <YAxis
            scale="log"
            domain={["auto", "auto"]}
            stroke="white"
            tickFormatter={(tickValue) => {
              if (tickValue === 1) return "0";
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
          />
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "white" }}
          />
          <Bar dataKey="Expenses" fill="red">
            <LabelList dataKey="Expenses" content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {["daily", "weekly", "monthly", "yearly"].map((option) => (
          <Chip
            label={option.charAt(0).toUpperCase() + option.slice(1)}
            clickable
            color={view === option ? "primary" : "default"}
            onClick={() => handleViewChange(option)}
          />
        ))}
      </div>
    </div>
  );
};

const Graph = () => {
  const startTransactionArray: ITransactionProps[] = [];
  const [transactions, setTransactions] = useState(startTransactionArray);
  const transactionRepository = new TransactionRepository();

  // Fetch transactions from database when the component mounts
  useEffect(() => {
    transactionRepository
      .readTransactions({}) // Fetch all transactions, or apply filters as needed
      .then((loadedTransactions) => {
        setTransactions(
          loadedTransactions.filter((trans) => trans.remarks?.length > 0)
        );
      });
  }, []); // Empty dependency array ensures this runs once after mount

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExpenseOverview
        data={transactions.filter(
          (transs) => transs.type === ETransactionType.DEBIT
        )}
      />
      <RecipientsPieChart
        topK={5}
        data={transactions.filter(
          (transs) => transs.type === ETransactionType.DEBIT
        )}
      />
    </div>
  );
};

export default Graph;
