import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
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
        <h2 style={{ margin: 0 }}>Income</h2>
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
        <LineChart
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
            stroke="white"
            tickFormatter={(tickValue) => {
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
          />
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "wheat" }}
          />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="Expenses" stroke="green" />
        </LineChart>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const day = dateString.split("-")[0];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(dateString.split("-")[1]) - 1];
  const year = dateString.split("-")[2];

  if (monthName === "Jan") {
    return `${day}-${monthName}-${year}`;
  }
  return `${day}-${monthName}`;
};
const data = require("./data.json");

const Graph = () => {
  return <ExpenseOverview data={data} />;
};

export default Graph;

/**
 * 
To beautify the ExpenseOverview component and make it more suitable for a dark-themed expense tracker app, we'll make the following changes:

Replace the standard dropdown with an MUI dropdown.
Adjust the positioning of the title, dropdown, and graph for better aesthetics.
Update the styles to better fit a dark theme.
Here's the updated code:

tsx
Copy code
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ExpenseOverview = ({ data }) => {
  // ... (rest of the code remains unchanged)

  return (
    <div style={{ position: "relative", padding: "20px", color: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Income</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <FormControl variant="standard" style={{ minWidth: 120 }}>
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
      <div style={{ overflow: "auto" }}>
        <LineChart
          width={Math.max(cWidth, 600)}
          height={300}
          data={gData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="white" />
          <YAxis
            stroke="white"
            tickFormatter={(tickValue) => {
              return tickValue >= 1000 ? `${tickValue / 1000}k` : tickValue;
            }}
          />
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "wheat" }}
          />
          <Legend />
          <Line type="monotone" dataKey="Expenses" stroke="white" />
        </LineChart>
      </div>
    </div>
  );
 */
