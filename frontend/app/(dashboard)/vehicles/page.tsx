"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicles,
  deleteVehicle,
  updateVehicleStatus,
} from "@/lib/api/vehicleApi";
import type { VehicleResponse } from "@/lib/validation/Vehicle/vehicleSchema";

import EditVehicleDialog from "@/components/vehicles/EditVehicleDialog";
import DeleteVehicleModal from "@/components/vehicles/DeleteVehicleModal";
import CreateVehicleDialog from "@/components/vehicles/CreateVehicleDialog";

import { EditIcon } from "@/components/ui/EditIcon";
import { DeleteIcon } from "@/components/ui/DeleteIcon";

import StatusToggle from "@/components/common/StatusToggle";
import { useAuthStore } from "@/auth/authStore";

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const canCreate = user?.Role === "Admin" || user?.Role === "Mechanic";
  const canEdit = user?.Role === "Admin" || user?.Role === "Mechanic";
  const canDelete = user?.Role === "Admin";
  const canToggleStatus = user?.Role === "Admin";

  const { data, isLoading, error } = useQuery<VehicleResponse[]>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleResponse | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setOpenDelete(false);
      setSelectedVehicle(null);
    },
  });

  async function handleConfirmDelete() {
    if (!selectedVehicle) return;
    await deleteMutation.mutateAsync(selectedVehicle.Id);
  }

  function handleOpenEdit(vehicle: VehicleResponse) {
    setSelectedVehicle(vehicle);
    setOpenEdit(true);
  }

  function handleOpenDelete(vehicle: VehicleResponse) {
    setSelectedVehicle(vehicle);
    setOpenDelete(true);
  }

  async function handleStatusChange(
    id: number,
    newStatus: "Active" | "Inactive"
  ) {
    await updateVehicleStatus(id, newStatus);
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
  }

  if (isLoading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Vehicles</h1>

        {canCreate && (
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            Add Vehicle
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-sm font-medium">Plate Number</th>
              <th className="p-3 text-sm font-medium">Model</th>
              <th className="p-3 text-sm font-medium">Manufacturer</th>
              <th className="p-3 text-sm font-medium">Year</th>
              <th className="p-3 text-sm font-medium">Fuel</th>
              <th className="p-3 text-sm font-medium">Status</th>
              <th className="p-3 text-sm font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data!.map((v) => (
              <tr key={v.Id} className="border-b hover:bg-gray-50">
                <td className="p-3">{v.PlateNumber}</td>
                <td className="p-3">{v.Model}</td>
                <td className="p-3">{v.Manufacturer}</td>
                <td className="p-3">{v.Year}</td>
                <td className="p-3">{v.FuelType}</td>

                <td className="p-3">
                  <StatusToggle
                    id={v.Id}
                    status={v.Status}
                    onChangeStatus={handleStatusChange}
                    disabled={!canToggleStatus}
                  />
                </td>

                <td className="p-3 text-right flex justify-end gap-4">
                  {canEdit && (
                    <button
                      onClick={() => handleOpenEdit(v)}
                      title="Edit"
                      className="cursor-pointer"
                    >
                      <EditIcon />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => handleOpenDelete(v)}
                      title="Delete"
                      className="cursor-pointer"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateVehicleDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["vehicles"] })
        }
      />

      <EditVehicleDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        vehicle={selectedVehicle}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["vehicles"] })
        }
      />

      <DeleteVehicleModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        plateNumber={selectedVehicle?.PlateNumber ?? ""}
      />
    </div>
  );
}
