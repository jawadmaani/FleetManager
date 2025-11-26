"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import DriverForm from "./DriverForm";
import {
  DriverRequest,
  DriverResponse,
} from "@/lib/validation/driver/driverSchema";
import { updateDriver } from "@/lib/api/driverApi";

interface EditDriverDialogProps {
  open: boolean;
  onClose: () => void;
  driver: DriverResponse | null;
  onSuccess?: () => void;
}

export default function EditDriverDialog({
  open,
  onClose,
  driver,
  onSuccess,
}: EditDriverDialogProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: DriverRequest) => updateDriver(driver?.Id ?? 0, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open || !driver) return null;

  async function handleEdit(data: DriverRequest) {
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

        <h2 className="text-xl font-semibold mb-6">Edit Driver</h2>

        <DriverForm
          defaultValues={{
            name: driver.Name,
            licenseNumber: driver.LicenseNumber,
            phoneNumber: driver.PhoneNumber,
          }}
          onSubmit={handleEdit}
          submitText={
            updateMutation.isPending ? "Updating..." : "Update Driver"
          }
        />
      </div>
    </div>
  );
}
