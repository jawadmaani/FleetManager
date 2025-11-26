"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  data: { VehicleId: number; PlateNumber: string; TotalCost: number }[];
}

export default function TopVehiclesCostChart({ data }: Props) {
  const formatted = data.map((item) => ({
    name: item.PlateNumber,
    cost: item.TotalCost,
  }));

  return (
    <div className="w-full h-96 p-4 rounded-xl border bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Top Vehicles by Cost</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ left: 40, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="cost"
            fill="#10b981"
            barSize={22}
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
