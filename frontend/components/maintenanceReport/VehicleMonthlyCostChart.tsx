"use client";

import {
  LineChart,
  Line,
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

export default function VehicleMonthlyCostChart({ data }: Props) {
  const formatted = data.map((item) => ({
    label: `${item.Year}-${String(item.Month).padStart(2, "0")}`,
    total: item.TotalCost,
  }));

  return (
    <div className="w-full h-80 p-4 rounded-xl border bg-white shadow">
      <h2 className="text-lg font-semibold mb-3">
        Monthly Maintenance Cost (Vehicle)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
