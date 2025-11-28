"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserForm from "./UserForm";

import {
  UserSaveRequest,
  UserResponse,
} from "@/lib/validation/auth/userSchema";

import { updateUser } from "@/lib/api/userApi";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onSuccess?: () => void;
}

export default function EditUserDialog({
  open,
  onClose,
  user,
  onSuccess,
}: EditUserDialogProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UserSaveRequest) => updateUser(user?.Id ?? 0, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
      onClose();
    },
  });

  if (!open || !user) return null;

  async function handleEdit(data: UserSaveRequest) {
    await updateMutation.mutateAsync(data);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit User</h2>

        <UserForm
          defaultValues={{
            username: user.Username,
            password: "",
            role: user.Role,
          }}
          onSubmit={handleEdit}
          submitText={updateMutation.isPending ? "Updating..." : "Update User"}
        />
      </div>
    </div>
  );
}
