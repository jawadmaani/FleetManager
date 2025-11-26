"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import VehicleForm from "./VehicleForm";
import {
  VehicleRequest,
  VehicleResponse,
} from "@/lib/validation/vehicle/vehicleSchema";
import { updateVehicle } from "@/lib/api/vehicleApi";

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleResponse | null;
  onSuccess?: () => void;
}

export default function EditVehicleDialog({
  open,
  onClose,
  vehicle,
  onSuccess,
}: EditVehicleDialogProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: VehicleRequest) => updateVehicle(vehicle?.Id ?? 0, data), 

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open || !vehicle) return null;

  async function handleEdit(data: VehicleRequest) {
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

        <h2 className="text-xl font-semibold mb-6">Edit Vehicle</h2>

        <VehicleForm
          defaultValues={{
            plateNumber: vehicle.PlateNumber,
            model: vehicle.Model,
            manufacturer: vehicle.Manufacturer,
            year: vehicle.Year,
            odometer: vehicle.Odometer,
            fuelType: vehicle.FuelType,
          }}
          onSubmit={handleEdit}
          submitText={
            updateMutation.isPending ? "Updating..." : "Update Vehicle"
          }
        />
      </div>
    </div>
  );
}
