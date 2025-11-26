"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import MaintenanceLogForm from "./MaintenanceLogForm";

import { MaintenanceLogRequest } from "@/lib/validation/maintenanceLog/maintenanceLogSchema";

import { createMaintenanceLog } from "@/lib/api/maintenanceLogApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicles: VehicleResponse[];
}

export default function CreateMaintenanceLogDialog({
  open,
  onClose,
  onSuccess,
  vehicles,
}: Props) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: MaintenanceLogRequest) => createMaintenanceLog(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs"] });
      onSuccess?.();
      onClose();
    },
  });

  async function handleCreate(data: MaintenanceLogRequest | Omit<MaintenanceLogRequest, 'vehicleId'>) {
    if ('vehicleId' in data) {
      await createMutation.mutateAsync(data);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6">Add Maintenance Log</h1>

        <MaintenanceLogForm
          vehicles={vehicles}
          onSubmit={handleCreate}
          submitText={createMutation.isPending ? "Creating..." : "Create Log"}
        />
      </div>
    </div>
  );
}
