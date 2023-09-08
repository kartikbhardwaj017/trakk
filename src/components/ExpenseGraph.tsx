import React, { useState, useEffect, useRef } from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
import Chip from "@mui/material/Chip";
import { RecipientsPieChart } from "./RecipientChart";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

const ExpenseOverview = ({ data }) => {
  const barWidth = 10; // Desired width of each bar
  const [view, setView] = useState("daily");

  const scrollRef = useRef(null); // Create a ref for the container

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 100; // Adjust the value as needed
    }
  }, []);

  const formatData = (data: ITransactionProps[], view) => {
    if (view === "daily") {
      return groupBy(
        data,
        (item) => DateTime.fromJSDate(item.date).toFormat("dd/MM/yyyy"),
        "amount"
      );
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

    if (tickValue >= 100000) {
      // If tickValue is greater or equal to 100K, divide by 100000 and show in "L" format with 1 decimal place
      return `${(tickValue / 100000).toFixed(1)}L`;
    } else if (tickValue >= 1000) {
      // If tickValue is greater or equal to 1000, divide by 1000 and show in "k" format with 1 decimal place
      return `${(tickValue / 1000).toFixed(1)}k`;
    }

    return tickValue.toFixed(1); // Show 1 decimal place for other values
  };

  // Custom render function for the labels, now using tickFormatter
  const renderCustomizedLabel = (props) => {
    const { x, y, value } = props;
    if (value < 10000) {
      return null;
    }
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    const navigate = useNavigate();

    if (active && payload && payload.length) {
      const date = payload[0].payload.date;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "5px",
            color: "black",
            border: "1px solid #ccc",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation
          onMouseOver={(e) => e.stopPropagation()} // Prevent tooltip from disappearing
        >
          <span>{`Date: ${date}`}</span>
          <br />
          <span>{`Expenses: ${tickFormatter(payload[0].value)}`}</span>
          <br />
          <a
            href={`/community/?date=${date}`} // Replace with your desired path
            style={{ pointerEvents: "auto" }}
            onClick={(e) => {
              e.preventDefault(); // Prevent the default behavior
              navigate(
                `/community?date=${encodeURIComponent(
                  payload[0].payload.date
                )}&type=${encodeURIComponent("expense")}`
              );
            }}
          >
            Go to details
          </a>
        </div>
      );
    }
    return null;
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
          />
          <Tooltip trigger="click" content={CustomTooltip} />

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

const ExpenseGraph = ({ transactions }) => {
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
        type={"expense"}
      />
    </div>
  );
};

export default ExpenseGraph;
