import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";
import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
import { useNavigate } from "react-router-dom";
const getTop5Recipients = (data: ITransactionProps[], topK: number) => {
  const recipients = data.reduce((acc, transaction) => {
    if (!acc[transaction.recipient]) {
      acc[transaction.recipient] = 0;
    }
    acc[transaction.recipient] += transaction.amount;
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
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a83279",
    "#abac2a",
  ]; // Customize colors
  const recipientsData = getTop5Recipients(data, topK);
  const navigate = useNavigate(); // Get the navigate function

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
          <span>{`Amount: ${payload[0].payload.value}`}</span>
          <br />
          <a
            href="/community"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/community?search=${encodeURIComponent(
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
    if (index >= 3) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.85; // Adjusting the line's distance from the pie
    const x1 = cx + radius * Math.cos(-midAngle * RADIAN);
    const y1 = cy + radius * Math.sin(-midAngle * RADIAN);
    const x2 = cx + outerRadius * Math.cos(-midAngle * RADIAN); // Line's endpoint
    const y2 = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const x3 = cx > x2 ? x2 - 20 : x2 + 20; // Label's x position
    const y3 = y2; // Label's y position

    if (index === 0) {
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
            {`${payload.name.substring(0, 5)}${(percent * 100).toFixed(0)}%`}
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
      >
        {recipientsData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip trigger="click" content={CustomTooltip} />
      <Legend
        wrapperStyle={{ fontSize: "12px" }} // Adjust the font size as needed
      />
    </PieChart>
  );
};
