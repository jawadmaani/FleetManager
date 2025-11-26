"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AssignVehicleDialog from "./AssignVehicleDialog";
import { unassignVehicleFromDriver } from "@/lib/api/driverApi";
import { useAuthStore } from "@/auth/authStore";

interface Props {
  driverId: number;
  plateNumber?: string | null;
}

export default function AssignVehicleButton({ driverId, plateNumber }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.Role === "Admin";

  const unassignMutation = useMutation({
    mutationFn: () => unassignVehicleFromDriver(driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });


  if (!isAdmin) {
    return plateNumber ? (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
        {plateNumber}
      </span>
    ) : (
      <span className="text-gray-600">-</span>
    );
  }


  if (plateNumber) {
    return (
      <div className="flex items-center gap-2">
        <span
          onClick={() => setOpen(true)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 cursor-pointer"
        >
          {plateNumber}
        </span>

        <button
          onClick={() => unassignMutation.mutate()}
          disabled={unassignMutation.isPending}
          className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 disabled:opacity-50"
        >
          {unassignMutation.isPending ? "..." : "Unassign"}
        </button>

        <AssignVehicleDialog
          driverId={driverId}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-300"
      >
        Assign Vehicle
      </button>

      <AssignVehicleDialog
        driverId={driverId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
