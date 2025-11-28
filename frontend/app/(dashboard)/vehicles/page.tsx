"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicles,
  deleteVehicle,
  updateVehicleStatus,
} from "@/lib/api/vehicleApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

import EditVehicleDialog from "@/components/vehicles/EditVehicleDialog";
import DeleteVehicleModal from "@/components/vehicles/DeleteVehicleModal";
import CreateVehicleDialog from "@/components/vehicles/CreateVehicleDialog";

import StatusToggle from "@/components/common/StatusToggle";
import StatusFilter from "@/components/common/StatusFilter";
import SearchBar from "@/components/common/SearchBar";
import StatsCards from "@/components/common/StatsCards";

import { EditIcon } from "@/components/ui/EditIcon";
import { DeleteIcon } from "@/components/ui/DeleteIcon";

import { useAuthStore } from "@/auth/authStore";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const stats = useMemo(
    () => ({
      total: data?.length ?? 0,
      active: data?.filter((v) => v.Status === "Active").length ?? 0,
      inactive: data?.filter((v) => v.Status === "Inactive").length ?? 0,
    }),
    [data]
  );

  const filteredVehicles = useMemo(() => {
    if (!data) return [];

    const lowerSearch = searchTerm.trim().toLowerCase();

    return data
      .filter((vehicle) => {
        const matchesSearch =
          `${vehicle.PlateNumber} ${vehicle.Model} ${vehicle.Manufacturer}`
            .toLowerCase()
            .includes(lowerSearch);

        const matchesStatus =
          statusFilter === "All" || vehicle.Status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.PlateNumber.localeCompare(b.PlateNumber));
  }, [data, searchTerm, statusFilter]);

  if (isLoading)
    return <p className="text-gray-600">Loading vehicles, please wait...</p>;
  if (error)
    return (
      <p className="text-red-600">Unable to load vehicles. Please try again.</p>
    );

  return (
    <div className="space-y-6 mt-2">
      <div className="flex items-center justify-between mt-1">
        <StatsCards
          total={stats.total}
          active={stats.active}
          inactive={stats.inactive}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-1">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by plate, model, or manufacturer"
        />

        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600 shadow">
          <p className="text-lg font-semibold text-gray-900">
            {searchTerm || statusFilter !== "All"
              ? "No vehicles match your filters"
              : "No vehicles found"}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Try changing your filters or add a new vehicle.
          </p>

          {canCreate && (
            <button
              onClick={() => setOpenCreate(true)}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow hover:bg-gray-900"
            >
              Add Vehicle
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-medium">Plate Number</th>
                  <th className="p-3 font-medium">Model</th>
                  <th className="p-3 font-medium">Manufacturer</th>
                  <th className="p-3 font-medium">Year</th>
                  <th className="p-3 font-medium">Odometer</th>
                  <th className="p-3 font-medium">Fuel</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Added</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((v) => (
                  <tr key={v.Id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">
                      {v.PlateNumber}
                    </td>

                    <td className="p-3">{v.Model}</td>
                    <td className="p-3">{v.Manufacturer}</td>
                    <td className="p-3">{v.Year}</td>
                    <td className="p-3">{v.Odometer.toLocaleString()} km</td>
                    <td className="p-3">{v.FuelType}</td>

                    <td className="p-3">
                      <StatusToggle
                        id={v.Id}
                        status={v.Status}
                        onChangeStatus={handleStatusChange}
                        disabled={!canToggleStatus}
                      />
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatDate(v.CreatedAt)}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => canEdit && handleOpenEdit(v)}
                          disabled={!canEdit}
                          className={`rounded-full p-2 transition
        ${
          canEdit
            ? "text-gray-700 hover:bg-gray-100"
            : "text-gray-400 cursor-not-allowed"
        }`}
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => canDelete && handleOpenDelete(v)}
                          disabled={!canDelete}
                          className={`rounded-full p-2 transition
        ${
          canDelete
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setOpenCreate(true)}
              disabled={!canCreate}
              className={`
                relative px-6 py-3 rounded-lg text-sm font-semibold text-white
                overflow-hidden group select-none
                ${
                  canCreate
                    ? "bg-black hover:bg-gray-900"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span
                className="absolute top-0 left-0 w-12 h-12 bg-white/20 rotate-45
                           -translate-x-full group-hover:translate-x-[180%]
                           transition-transform duration-700 ease-in-out rounded-full"
              ></span>

              <span className="relative z-10">Add Vehicle</span>
            </button>
          </div>
        </>
      )}

      <CreateVehicleDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditVehicleDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        vehicle={selectedVehicle}
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
