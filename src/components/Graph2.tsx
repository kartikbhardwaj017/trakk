import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { ETransactionType, ITransactionProps } from "../services/ITransactionProps";
import TransactionRepository from "../services/Dexie/DbService";

const ExpenseOverview = ({ data }) => {
  const barWidth = 30; // Desired width of each bar
  const [view, setView] = useState("daily");

  const formatData = (data: ITransactionProps[], view) => {
    if (view === "daily") {
      return groupBy(data, (item) => item.date.toLocaleDateString(), "amount");
    } else if (view === "weekly") {
      return groupBy(
        data,
        (item) =>
          `${item.date.getMonth() + 1} - ${Math.ceil(item.date.getDate() / 7)}`,
        "amount"
      );
    } else if (view === "monthly") {
      return groupBy(
        data,
        (item) => item.date.getMonth() + 1,
        "amount",
        getMonthName
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
      name: nameFn(key),
      Expenses: value === 0 ? 1 : value,
    }));
  };

  useEffect(() => {
    const newGData = formatData(data, view);
    setGData(newGData);
    setCWidth(newGData.length * barWidth);
  }, [data, view]);
  const [gData, setGData] = useState([]);
  const [cWidth, setCWidth] = useState(0);

  const handleViewChange = (event: SelectChangeEvent<string>) => {
    const newView = event.target.value;
    setView(newView);
    const newGData = formatData(data, newView); // Pass newView directly
    setGData(newGData);
    setCWidth(newGData.length * barWidth); // Use newGData
  };
  return (
    <div style={{ position: "relative", padding: "20px", color: "white" }}>
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
        <FormControl
          variant="standard"
          style={{ minWidth: 120, position: "absolute", right: 0 }}
        >
          <InputLabel id="view-select-label" style={{ color: "white" }}>
            Timeline
          </InputLabel>
          <Select
            labelId="view-select-label"
            id="view-select"
            value={view}
            onChange={handleViewChange}
            label="Timeline"
            style={{ color: "white" }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ overflowX: "auto", position: "relative", width: "100%" }}>
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
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" stroke="white" />
          <YAxis
            scale="log"
            domain={["auto", "auto"]}
            stroke="white"
            tickFormatter={(tickValue) => {
              // If the tick value is the small positive number, display it as "0"
              if (tickValue === 1) return "0";
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
          />
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "wheat" }}
          />
          {/* <Legend /> */}
          <Bar dataKey="Expenses" fill="red" />

          {/* <Line type="monotone" dataKey="Expenses" stroke="green" /> */}
        </BarChart>
      </div>
    </div>
  );
};

const Graph2 = () => {
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
    <ExpenseOverview
      data={transactions.filter(
        (transs) => transs.type === ETransactionType.DEBIT
      )}
    />
  );
};

export default Graph2;

export {};
