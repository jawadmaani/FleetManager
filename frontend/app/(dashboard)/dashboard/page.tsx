"use client";

import { useState } from "react";
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

export default function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">
                Loading analytics...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Vehicles
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      {vehicles.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Active Reports
                    </p>
                    <p className="text-xl font-black text-gray-800">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Last Updated
                    </p>
                    <p className="text-xl font-black text-gray-800">Today</p>
                  </div>
                </div>
              </div>
            </div>
            

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="col-span-1">
                <VehicleMonthlyCostChart
                  data={monthlyVehicleQuery.data || []}
                  vehicles={vehicles}
                  selectedVehicleId={selectedVehicleId}
                  onVehicleChange={setSelectedVehicleId}
                />
              </div>

              <div className="col-span-1">
                <TopVehiclesCostChart data={topVehiclesQuery.data || []} />
              </div>
            </div>

            <div className="w-full">
              <FleetMonthlyTotalChart data={fleetMonthlyQuery.data || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
