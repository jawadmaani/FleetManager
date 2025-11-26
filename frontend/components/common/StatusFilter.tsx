"use client";

interface StatusFilterProps {
  value: "All" | "Active" | "Inactive";
  onChange: (value: "All" | "Active" | "Inactive") => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const filters: ("All" | "Active" | "Inactive")[] = [
    "All",
    "Active",
    "Inactive",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            value === filter
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
