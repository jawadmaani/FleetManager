"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { Year: number; Month: number; TotalCost: number }[];
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

export default function FleetMonthlyTotalChart({ data }: Props) {
  const formatted = data.map((item) => ({
    label: `${item.Year}-${String(item.Month).padStart(2, "0")}`,
    value: item.TotalCost,
  }));

  // حساب الإحصائيات
  const totalCost = formatted.reduce((sum, item) => sum + item.value, 0);
  const avgCost = totalCost / formatted.length;
  const maxCost = Math.max(...formatted.map((item) => item.value));

  return (
    <div className="w-full h-96 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Fleet Maintenance Overview
            </h2>
            <p className="text-sm text-gray-500">
              Monthly cost trends and analytics
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-sm font-semibold">Tracking</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Cost</p>
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
            <p className="text-xs font-medium text-gray-500 mb-1">Peak Cost</p>
            <p className="text-lg font-bold text-indigo-600">
              ${maxCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={formatted}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fleetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodOpacity="0.2"
                />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
              opacity={0.5}
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
              cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#fleetGrad)"
              animationDuration={1200}
              filter="url(#shadow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
