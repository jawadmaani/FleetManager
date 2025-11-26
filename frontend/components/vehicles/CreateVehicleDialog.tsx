"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import VehicleForm from "./VehicleForm";
import { VehicleRequest } from "@/lib/validation/Vehicle/vehicleSchema";
import { createVehicle } from "@/lib/api/vehicleApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateVehicleDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: VehicleRequest) => createVehicle(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onSuccess?.();
      onClose();
    },
  });

  async function handleCreate(data: VehicleRequest) {
    await createMutation.mutateAsync(data);
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

        <h1 className="text-2xl font-semibold mb-6">Add Vehicle</h1>

        <VehicleForm
          onSubmit={handleCreate}
          submitText={
            createMutation.isPending ? "Creating..." : "Create Vehicle"
          }
        />
      </div>
    </div>
  );
}
