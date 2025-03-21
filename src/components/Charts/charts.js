import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./styles.css"
function ChartsComponent({ sortedtransactions }) {
    sortedtransactions.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
      });
  let balance = 0;
  const balanceData = sortedtransactions.map((t) => {
    balance += t.type === "income" ? t.amount : -t.amount;
    return { date: t.date, balance };
  });
  return (
    <div className="charts-container">
      <h2>Total Balanace</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={balanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default ChartsComponent;