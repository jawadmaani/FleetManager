"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface Props {
  data: { VehicleId: number; PlateNumber: string; TotalCost: number }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {payload[0].payload.name}
        </p>
        <p className="text-lg font-bold text-blue-600">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function TopVehiclesCostChart({ data }: Props) {
  const formatted = data.map((item) => ({
    name: item.PlateNumber,
    cost: item.TotalCost,
  }));

  
  const colors = [
    "#0ea5e9", 
    "#06b6d4",
    "#14b8a6", 
    "#10b981", 
    "#84cc16", 
  ];

  return (
    <div className="w-full h-96 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Top Vehicles by Cost
            </h2>
            <p className="text-sm text-gray-500">
              Ranked by total cost expenditure
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={formatted}
            barSize={40}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              {colors.map((color, index) => (
                <linearGradient
                  key={index}
                  id={`colorGradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 13, fill: "#6b7280", fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />

            <YAxis
              tick={{ fontSize: 13, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
            />

            <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
              {formatted.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#colorGradient${index % colors.length})`}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
