import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  ETransactionType,
  ITransactionProps,
} from "../services/ITransactionProps";
const getTop5Recipients = (data: ITransactionProps[]) => {
  const recipients = data.reduce((acc, transaction) => {
    if (!acc[transaction.recipient]) {
      acc[transaction.recipient] = 0;
    }
    acc[transaction.recipient] += transaction.amount;
    return acc;
  }, {});

  const sortedRecipients = Object.entries(recipients)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 4);

  const others = Object.entries(recipients)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(4)
    .reduce((acc: number, [, amount]: [string, number]) => acc + amount, 0);

  if (others > 0) {
    sortedRecipients.push(["Others", others]);
  }

  return sortedRecipients.map(([name, value]) => ({
    name,
    value,
  }));
};

export const RecipientsPieChart = ({ data }) => {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a83279",
    "#abac2a",
  ]; // Customize colors
  const recipientsData = getTop5Recipients(data);

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
      >
        {recipientsData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        wrapperStyle={{ fontSize: "12px" }} // Adjust the font size as needed
      />
    </PieChart>
  );
};
