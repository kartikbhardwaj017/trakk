import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import {
  ETransactionType,
  ITransactionProps,
  ITransactionWithMetaDataType,
} from "../services/ITransactionProps";
import { useNavigate } from "react-router-dom";
const getTop5Recipients = (
  data: ITransactionWithMetaDataType[],
  topK: number
) => {
  const recipients = data.reduce((acc, transaction) => {
    if (!acc[transaction.recipientName || transaction.recipient]) {
      acc[transaction.recipientName || transaction.recipient] = 0;
    }
    acc[transaction.recipientName || transaction.recipient] +=
      transaction.amount;
    return acc;
  }, {});

  const sortedRecipients = Object.entries(recipients)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, topK);

  const others = Object.entries(recipients)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(topK)
    .reduce((acc: number, [, amount]: [string, number]) => acc + amount, 0);

  if (others > 0) {
    sortedRecipients.push(["Others", others]);
  }


  return sortedRecipients.map(([name, value]) => ({
    name,
    value,
  }));
};

export const RecipientsPieChart = ({ data, topK, type }) => {
  const COLORS = [
    "#a83279",
    "#00C49F",
    "#a8a8a8",
    "#c2c2c2",
    "#dcdcdc",
    "#e6e6e6",
  ]; // Customize colors
  const recipientsData = getTop5Recipients(data, topK);
  console.log("pieChart", recipientsData);
  const navigate = useNavigate(); // Get the navigate function
  const tickFormatter = (tickValue) => {
    if (tickValue === 1) return "0";

    if (tickValue >= 100000) {
      return `${(tickValue / 100000).toFixed(1)}L`;
    } else if (tickValue >= 1000) {
      return `${(tickValue / 1000).toFixed(1)}k`;
    }

    return tickValue.toFixed(1); // Show 1 decimal place for other values
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            color: "black",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation
          onMouseOver={(e) => e.stopPropagation()}
        >
          <span>{`${payload[0].payload.name}`}</span>
          <br />
          <span>{`Amount: ${tickFormatter(payload[0].payload.value)}`}</span>
          <br />
          <a
            href="/search"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/search?search=${encodeURIComponent(
                  payload[0].payload.name
                )}&type=${encodeURIComponent(type)}`
              );
            }}
          >
            View Details
          </a>
        </div>
      );
    }

    return null;
  };

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
  }) => {
    if (index >= 4) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.85; // Adjusting the line's distance from the pie
    const x1 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y1 = cy + radius * Math.sin(-midAngle * RADIAN);
    const x2 = cx + outerRadius * Math.cos(-midAngle * RADIAN); // Line's endpoint
    const y2 = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const x3 = cx > x2 ? x2 - 20 : x2 + 20; // Label's x position
    const y3 = y2; // Label's y position

    if (index <= 5) {
      return (
        <>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" />
          <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="white" />
          <text
            x={x3}
            y={y3}
            fill="white"
            textAnchor={cx > x2 ? "end" : "start"}
            dominantBaseline="central"
          >
            {`${payload.name.substring(0, 10)}${(percent * 100).toFixed(0)}%`}
          </text>
        </>
      );
    }
    return (
      <>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" />
        <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="white" />
        <text
          x={x3}
          y={y3}
          fill="white"
          textAnchor={cx > x2 ? "end" : "start"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={recipientsData}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        animationBegin={200} // Animation will begin after 200ms
        animationDuration={800} // Animation duration is set to 800ms
        label={renderLabel}
        innerRadius={60}
      >
        {recipientsData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip trigger="click" content={CustomTooltip} />
    </PieChart>
  );
};
