"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Vehicle {
  Id: number;
  PlateNumber: string;
  Model: string;
}

interface Props {
  data: { Year: number; Month: number; TotalCost: number }[];
  vehicles: Vehicle[];
  selectedVehicleId: number | "All";
  onVehicleChange: (vehicleId: number | "All") => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-2xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-blue-600">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">Monthly Cost</p>
      </div>
    );
  }
  return null;
};

export default function VehicleMonthlyCostChart({
  data,
  vehicles,
  selectedVehicleId,
  onVehicleChange,
}: Props) {
  const formatted = data.map((item) => ({
    label: `${item.Year}-${String(item.Month).padStart(2, "0")}`,
    total: item.TotalCost,
  }));

  const costs = formatted.map((item) => item.total);
  const totalCost = costs.reduce((sum, cost) => sum + cost, 0);
  const avgCost = costs.length > 0 ? totalCost / costs.length : 0;
  const maxCost = costs.length > 0 ? Math.max(...costs) : 0;

  const isAllSelected = selectedVehicleId === "All";

  return (
    <div className="w-full h-96 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Monthly Maintenance Cost
            </h2>
            <p className="text-sm text-gray-500">
              Vehicle expense tracking over time
            </p>
          </div>

          <div className="relative">
            <select
              className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer hover:border-gray-400 shadow-sm"
              value={selectedVehicleId}
              onChange={(e) => {
                const v = e.target.value;
                onVehicleChange(v === "All" ? "All" : Number(v));
              }}
            >
              <option value="All">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v.Id} value={v.Id}>
                  {v.PlateNumber} — {v.Model}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {isAllSelected ? (
          <div className="h-72 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Select a Vehicle
            </h3>
            <p className="text-gray-500 max-w-xs">
              Choose a specific vehicle from the dropdown to view its monthly
              maintenance cost trends
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Total Cost
                </p>
                <p className="text-lg font-bold text-gray-800">
                  ${totalCost.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Average/Month
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ${Math.round(avgCost).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Peak Cost
                </p>
                <p className="text-lg font-bold text-indigo-600">
                  ${maxCost.toLocaleString()}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={formatted}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  opacity={0.5}
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                  dy={10}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  dx={-10}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#fff",
                    stroke: "#3b82f6",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
