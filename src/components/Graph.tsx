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

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value;
    setView(newView);
    const newGData = formatData(data, newView); // Pass newView directly
    setGData(newGData);
    setCWidth(newGData.length * barWidth); // Use newGData
  };
  return (
    <div style={{ position: "relative" }}>
      {" "}
      {/* Added color to parent div to make label color white */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <label htmlFor="view-select" style={{ marginRight: 8 }}>
          Timeline:
        </label>
        <select id="view-select" onChange={handleViewChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 16, color: "white" }}>
        {" "}
        {/* Update text color */}
        Income
      </h2>
      <div style={{ overflow: "auto" }}>
        {" "}
        {/* Add this div */}
        <LineChart
          width={Math.max(cWidth, 600)} // Make this larger than the container div
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
          />{" "}
          {/* Update axis color */}
          <Tooltip
            contentStyle={{ color: "black", backgroundColor: "wheat" }}
          />
          <Legend />
          {/* <Bar dataKey="Expenses" fill="white" /> Update bar color */}
          <Line type="monotone" dataKey="Expenses" stroke="white" />{" "}
          {/* Update Line component */}
        </LineChart>
      </div>
    </div>
  );
};

const data = require("./data.json");

const Graph = () => {
  return <ExpenseOverview data={data} />;
};

export default Graph;
