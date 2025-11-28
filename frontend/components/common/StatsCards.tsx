"use client";

interface StatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  activeLabel?: string;
  inactiveLabel?: string;
}

export default function StatsCards({
  total,
  active,
  inactive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: StatsCardsProps) {
  return (
    <div className="flex gap-6 items-center mb-4">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white flex items-center justify-center border border-gray-300 rounded-full shadow-sm">
          <span className="text-blue-600 text-lg font-semibold">{total}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 font-medium">Total</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white flex items-center justify-center border border-gray-300 rounded-full shadow-sm">
          <span className="text-green-600 text-lg font-semibold">{active}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 font-medium">{activeLabel}</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white flex items-center justify-center border border-gray-300 rounded-full shadow-sm">
          <span className="text-red-600 text-lg font-semibold">{inactive}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 font-medium">
          {inactiveLabel}
        </p>
      </div>
    </div>
  );
}
