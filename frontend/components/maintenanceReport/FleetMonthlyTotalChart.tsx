"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { Year: number; Month: number; TotalCost: number }[];
}

export default function FleetMonthlyTotalChart({ data }: Props) {
  const formatted = data.map((item) => ({
    label: `${item.Year}-${String(item.Month).padStart(2, "0")}`,
    total: item.TotalCost,
  }));

  return (
    <div className="w-full h-80 p-4 rounded-xl border bg-white shadow">
      <h2 className="text-lg font-semibold mb-3">
        Fleet Monthly Maintenance Total
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="90%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            fill="url(#grad)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
