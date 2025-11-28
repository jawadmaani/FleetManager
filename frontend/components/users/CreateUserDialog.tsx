"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserForm from "./UserForm";

import { UserSaveRequest } from "@/lib/validation/auth/userSchema";
import { createUser } from "@/lib/api/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateUserDialog({ open, onClose, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: UserSaveRequest) => createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open) return null;

  async function handleCreate(data: UserSaveRequest) {
    await createMutation.mutateAsync(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-6">Create User</h1>

        <UserForm
          onSubmit={handleCreate}
          submitText={createMutation.isPending ? "Creating..." : "Create User"}
        />
      </div>
    </div>
  );
}
