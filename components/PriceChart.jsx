"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function PriceChart({ history }) {
  const data = history.map((h) => ({
    date: new Date(h.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: h.price,
  }));

  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#f97316" }}
          />
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value) => [formatCurrency(value), "Price"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
