"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles } from "@/lib/api/vehicleApi";
import { getDrivers, assignVehicleToDriver } from "@/lib/api/driverApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";
import type { DriverResponse } from "@/lib/validation/driver/driverSchema";

interface Props {
  driverId: number;
  open: boolean;
  onClose: () => void;
}

export default function AssignVehicleDialog({
  driverId,
  open,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const { data: vehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const { data: drivers } = useQuery<DriverResponse[]>({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  const assignMutation = useMutation({
    mutationFn: (vehicleId: number) =>
      assignVehicleToDriver(driverId, { vehicleId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onClose();
    },
  });

  if (!open) return null;

  const assignedVehicleIds = new Set(
    (drivers ?? []).filter((d) => d.VehicleId !== null).map((d) => d.VehicleId)
  );

  const availableVehicles =
    vehicles?.filter(
      (v) => v.Status === "Active" && !assignedVehicleIds.has(v.Id)
    ) ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Assign Active Vehicle</h2>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {availableVehicles.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No available active vehicles
            </p>
          )}

          <ul>
            {availableVehicles.map((v: VehicleResponse) => (
              <li
                key={v.Id}
                onClick={() => assignMutation.mutate(v.Id)}
                className="flex items-center px-6 py-3 hover:bg-gray-50 border-b cursor-pointer"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {v.PlateNumber.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div className="ml-4 flex-grow">
                  <div className="text-sm font-medium text-gray-900">
                    {v.PlateNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {v.Manufacturer} — {v.Model}
                  </div>
                </div>

                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Active
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
