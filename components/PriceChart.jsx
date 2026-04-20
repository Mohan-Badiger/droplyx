"use client";
import { useState, useMemo } from "react";

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
  const [range, setRange] = useState("all");

  const processedData = useMemo(() => {
    if (!history || history.length === 0) return [];

    // 1. Sort history by date (just in case)
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 2. Map history into a Map for easy lookup by date string (YYYY-MM-DD)
    const priceMap = new Map();
    sortedHistory.forEach(h => {
      const d = new Date(h.date).toISOString().split('T')[0];
      priceMap.set(d, h.price);
    });

    // 3. Find start and end dates
    const startDate = new Date(sortedHistory[0].date);
    startDate.setHours(0, 0, 0, 0); // Normalize start to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    const fullData = [];
    let lastPrice = sortedHistory[0].price;

    // 4. Fill every single day from the first tracking point to today
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      if (priceMap.has(dateStr)) {
        lastPrice = priceMap.get(dateStr);
      }

      fullData.push({
        rawDate: new Date(d),
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: lastPrice,
      });
    }

    return fullData;
  }, [history]);

  const filteredData = useMemo(() => {
    if (range === "all") return processedData;

    const today = new Date();
    let cutoffDate = new Date();

    if (range === "1m") cutoffDate.setMonth(today.getMonth() - 1);
    else if (range === "3m") cutoffDate.setMonth(today.getMonth() - 3);

    return processedData.filter(d => d.rawDate >= cutoffDate);
  }, [processedData, range]);

  const ranges = [
    { label: "1 Month", value: "1m" },
    { label: "3 Months", value: "3m" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-6">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              range === r.value
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
    </div>
  );
}
