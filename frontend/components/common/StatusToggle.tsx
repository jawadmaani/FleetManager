"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface StatusToggleProps {
  id: number;
  status: "Active" | "Inactive";
  onChangeStatus: (
    id: number,
    newStatus: "Active" | "Inactive"
  ) => Promise<void>;
  disabled?: boolean;
}

export default function StatusToggle({
  id,
  status,
  onChangeStatus,
  disabled,
}: StatusToggleProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: "Active" | "Inactive") =>
      onChangeStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const next = status === "Active" ? "Inactive" : "Active";

  return (
    <button
      disabled={disabled || mutation.isPending}
      onClick={() => mutation.mutate(next)}
      className={`px-2 py-1 rounded text-xs border transition ${
        status === "Active"
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {mutation.isPending ? "..." : status}
    </button>
  );
}
