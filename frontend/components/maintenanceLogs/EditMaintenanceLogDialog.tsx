"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import MaintenanceLogForm from "./MaintenanceLogForm";

import {
  MaintenanceLogUpdate,
  MaintenanceLogResponse,
} from "@/lib/validation/maintenanceLog/maintenanceLogSchema";

import { updateMaintenanceLog } from "@/lib/api/maintenanceLogApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

interface EditMaintenanceLogDialogProps {
  open: boolean;
  onClose: () => void;
  log: MaintenanceLogResponse | null;
  vehicles: VehicleResponse[];
  onSuccess?: () => void;
}

export default function EditMaintenanceLogDialog({
  open,
  onClose,
  log,
  vehicles,
  onSuccess,
}: EditMaintenanceLogDialogProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: MaintenanceLogUpdate) =>
      updateMaintenanceLog(log?.Id ?? 0, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open || !log) return null;

  const defaultValues: Partial<MaintenanceLogUpdate> = {
    maintenanceType: log.MaintenanceType,
    maintenanceDate: log.MaintenanceDate.split("T")[0],
    cost: log.Cost,
    description: log.Description ?? "",
    performedBy: log.PerformedBy,
  };

  async function handleEdit(data: MaintenanceLogUpdate) {
    await updateMutation.mutateAsync(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Maintenance Log</h2>

        <MaintenanceLogForm
          onSubmit={handleEdit}
          defaultValues={defaultValues}
          vehicles={vehicles}
          hideVehicleField={true}
          submitText={updateMutation.isPending ? "Updating..." : "Update Log"}
        />
      </div>
    </div>
  );
}
