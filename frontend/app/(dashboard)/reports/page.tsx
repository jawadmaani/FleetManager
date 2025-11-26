"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getMonthlyCostByVehicle,
  getTopVehiclesByMaintenanceCost,
  getMonthlyTotalMaintenanceCost,
} from "@/lib/api/maintenanceReportApi";

import { getVehicles } from "@/lib/api/vehicleApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

import VehicleMonthlyCostChart from "@/components/maintenanceReport/VehicleMonthlyCostChart";
import TopVehiclesCostChart from "@/components/maintenanceReport/TopVehiclesCostChart";
import FleetMonthlyTotalChart from "@/components/maintenanceReport/FleetMonthlyTotalChart";

export default function ReportsPage() {
  const { data: vehicles } = useQuery<VehicleResponse[]>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "All">(
    vehicles?.[0]?.Id ?? "All"
  );

  const monthlyVehicleQuery = useQuery({
    queryKey: ["monthlyCostVehicle", selectedVehicleId],
    queryFn: () =>
      selectedVehicleId !== "All"
        ? getMonthlyCostByVehicle(selectedVehicleId)
        : Promise.resolve([]),
    enabled: selectedVehicleId !== "All",
  });

  const topVehiclesQuery = useQuery({
    queryKey: ["topVehicles"],
    queryFn: () => getTopVehiclesByMaintenanceCost(5),
  });

  const fleetMonthlyQuery = useQuery({
    queryKey: ["fleetMonthlyTotal"],
    queryFn: getMonthlyTotalMaintenanceCost,
  });

  const isLoading =
    monthlyVehicleQuery.isLoading ||
    topVehiclesQuery.isLoading ||
    fleetMonthlyQuery.isLoading ||
    !vehicles;

  if (isLoading)
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Reports</h1>
        <div className="text-gray-600">Loading reports...</div>
      </div>
    );

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Maintenance Reports
        </h1>
        <p className="text-gray-600 mt-1">
          Visual insights for maintenance activity across your fleet.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <label className="text-sm font-medium">Select Vehicle</label>
        <select
          className="w-full p-3 mt-1 border rounded-md bg-white focus:ring-2 focus:ring-black outline-none"
          value={selectedVehicleId}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedVehicleId(v === "All" ? "All" : Number(v));
          }}
        >
          <option value="All">All Vehicles</option>

          {vehicles.map((v) => (
            <option key={v.Id} value={v.Id}>
              {v.PlateNumber} — {v.Model}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1">
          {selectedVehicleId === "All" ? (
            <div className="h-80 flex items-center justify-center rounded-xl border bg-white shadow text-gray-500">
              Select a vehicle to view monthly cost.
            </div>
          ) : (
            <VehicleMonthlyCostChart data={monthlyVehicleQuery.data || []} />
          )}
        </div>

        <div className="col-span-1">
          <TopVehiclesCostChart data={topVehiclesQuery.data || []} />
        </div>
      </div>

      <div className="w-full">
        <FleetMonthlyTotalChart data={fleetMonthlyQuery.data || []} />
      </div>
    </div>
  );
}
