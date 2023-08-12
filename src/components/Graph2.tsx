import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const ExpenseOverview = ({ data }) => {
  const barWidth = 30; // Desired width of each bar
  const [view, setView] = useState("daily");

 const formatData = (data, view) => {
   if (view === "daily") {
     return data.map((item) => ({
       name: item.date,
       Expenses: item.value,
     }));
   } else if (view === "weekly") {
     const weeklyData = {};
     data.forEach((item) => {
       const week = `${parseInt(item.date.split("-")[1])} - ${Math.ceil(
         parseInt(item.date.split("-")[0]) / 7
       )}`;
       if (!weeklyData[week]) {
         weeklyData[week] = 0;
       }
       weeklyData[week] += item.value;
     });
     return Object.entries(weeklyData).map(([week, value]) => ({
       name: week,
       Expenses: value,
     }));
   } else if (view === "monthly") {
     const monthlyData = {};
     data.forEach((item) => {
       const month = parseInt(item.date.split("-")[1]);
       if (!monthlyData[month]) {
         monthlyData[month] = 0;
       }
       monthlyData[month] += item.value;
     });
     return Object.entries(monthlyData).map(([month, value]) => ({
       name: getMonthName(month),
       Expenses: value,
     }));
   } else if (view === "yearly") {
     const yearlyData = {};
     data.forEach((item) => {
       const year = parseInt(item.date.split("-")[2]);
       if (!yearlyData[year]) {
         yearlyData[year] = 0;
       }
       yearlyData[year] += item.value;
     });
     return Object.entries(yearlyData).map(([year, value]) => ({
       name: year,
       Expenses: value,
     }));
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
    return monthNames[month];
  };

   const [gData, setGData] = useState(formatData(data, view));
   const [cWidth, setCWidth] = useState(gData.length * barWidth);

   const handleViewChange = (event: SelectChangeEvent<string>) => {
     const newView = event.target.value;
     setView(newView);
     const newGData = formatData(data, newView); // Pass newView directly
     setGData(newGData);
     setCWidth(newGData.length * barWidth); // Use newGData
   };
  return (
    <div style={{ position: "relative", color: "white" }}>
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
      <div style={{ overflowX: "auto" }}>
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
          {/* <CartesianGrid strokeDasharray="3 3" stroke="white" /> */}
          <XAxis stroke="white" />
          <YAxis
            stroke="white"
            tickFormatter={(tickValue) => {
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }}
          />
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "wheat" }}
          />
          {/* <Legend /> */}
          <Bar dataKey="Expenses" fill="red" />
        </BarChart>
      </div>
    </div>
  );
};

const data = require("./data.json");

const Graph2 = () => {
  return <ExpenseOverview data={data} />;
};

export default Graph2;

export {};
