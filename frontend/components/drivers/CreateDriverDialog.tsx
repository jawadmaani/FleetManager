"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import DriverForm from "./DriverForm";
import { DriverRequest } from "@/lib/validation/driver/driverSchema";
import { createDriver } from "@/lib/api/driverApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDriverDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: DriverRequest) => createDriver(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      onSuccess?.();
      onClose();
    },
  });

  async function handleCreate(data: DriverRequest) {
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

        <h1 className="text-2xl font-semibold mb-6">Add Driver</h1>

        <DriverForm
          onSubmit={handleCreate}
          submitText={
            createMutation.isPending ? "Creating..." : "Create Driver"
          }
        />
      </div>
    </div>
  );
}
