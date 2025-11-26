"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getDrivers,
  deleteDriver,
  updateDriverStatus,
} from "@/lib/api/driverApi";

import type { DriverResponse } from "@/lib/validation/driver/driverSchema";

import EditDriverDialog from "@/components/drivers/EditDriverDialog";
import DeleteDriverModal from "@/components/drivers/DeleteDriverModal";
import CreateDriverDialog from "@/components/drivers/CreateDriverDialog";

import StatusToggle from "@/components/common/StatusToggle";
import StatusFilter from "@/components/common/StatusFilter";
import SearchBar from "@/components/common/SearchBar";
import StatsCards from "@/components/common/StatsCards";

import { EditIcon } from "@/components/ui/EditIcon";
import { DeleteIcon } from "@/components/ui/DeleteIcon";

import AssignVehicleButton from "@/components/drivers/AssignVehicleButton";

import { useAuthStore } from "@/auth/authStore";
import { getVehicles } from "@/lib/api/vehicleApi";
import type { VehicleResponse } from "@/lib/validation/Vehicle/vehicleSchema";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DriversPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const canCreate = user?.Role === "Admin";
  const canEdit = user?.Role === "Admin";
  const canDelete = user?.Role === "Admin";
  const canToggleStatus = user?.Role === "Admin";

  const {
    data: drivers,
    isLoading,
    error,
  } = useQuery<DriverResponse[]>({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  const { data: vehicles } = useQuery<VehicleResponse[]>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const [selectedDriver, setSelectedDriver] = useState<DriverResponse | null>(
    null
  );

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setOpenDelete(false);
      setSelectedDriver(null);
    },
  });

  async function handleConfirmDelete() {
    if (!selectedDriver) return;
    await deleteMutation.mutateAsync(selectedDriver.Id);
  }

  function handleOpenEdit(driver: DriverResponse) {
    setSelectedDriver(driver);
    setOpenEdit(true);
  }

  function handleOpenDelete(driver: DriverResponse) {
    setSelectedDriver(driver);
    setOpenDelete(true);
  }

  async function handleStatusChange(
    id: number,
    newStatus: "Active" | "Inactive"
  ) {
    await updateDriverStatus(id, { status: newStatus });

    queryClient.invalidateQueries({ queryKey: ["drivers"] });
    queryClient.invalidateQueries({ queryKey: ["vehicles"] }); 
  }
  const stats = useMemo(
    () => ({
      total: drivers?.length ?? 0,
      active: drivers?.filter((d) => d.Status === "Active").length ?? 0,
      inactive: drivers?.filter((d) => d.Status === "Inactive").length ?? 0,
    }),
    [drivers]
  );

  const filteredDrivers = useMemo(() => {
    if (!drivers) return [];

    const lower = searchTerm.trim().toLowerCase();

    return drivers
      .filter((driver) => {
        const matchesSearch =
          `${driver.Name} ${driver.LicenseNumber} ${driver.PhoneNumber}`
            .toLowerCase()
            .includes(lower);

        const matchesStatus =
          statusFilter === "All" || driver.Status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.Name.localeCompare(b.Name));
  }, [drivers, searchTerm, statusFilter]);

  if (isLoading)
    return <p className="text-gray-600">Loading drivers, please wait...</p>;
  if (error)
    return (
      <p className="text-red-600">Unable to load drivers. Please try again.</p>
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
          placeholder="Search by name, license, or phone"
        />

        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600 shadow">
          <p className="text-lg font-semibold text-gray-900">
            {searchTerm || statusFilter !== "All"
              ? "No drivers match your filters"
              : "No drivers found"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try changing your filters or add a new driver.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">License</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Vehicle</th>
                  <th className="p-3 font-medium">Added</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDrivers.map((d) => {
                  const assignedVehicle = vehicles?.find(
                    (v) => v.Id === d.VehicleId
                  );

                  return (
                    <tr key={d.Id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">
                        {d.Name}
                      </td>
                      <td className="p-3">{d.LicenseNumber}</td>
                      <td className="p-3">{d.PhoneNumber}</td>

                      <td className="p-3">
                        <StatusToggle
                          id={d.Id}
                          status={d.Status}
                          onChangeStatus={handleStatusChange}
                          disabled={!canToggleStatus}
                        />
                      </td>

                      <td className="p-3">
                        <AssignVehicleButton
                          driverId={d.Id}
                          plateNumber={assignedVehicle?.PlateNumber ?? null}
                        />
                      </td>

                      <td className="p-3 text-gray-600">
                        {formatDate(d.CreatedAt)}
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(d)}
                            disabled={!canEdit}
                            className={`rounded-full p-2 transition ${
                              canEdit
                                ? "text-gray-700 hover:bg-gray-100"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <EditIcon />
                          </button>

                          <button
                            onClick={() => handleOpenDelete(d)}
                            disabled={!canDelete}
                            className={`rounded-full p-2 transition ${
                              canDelete
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

              <span className="relative z-10">Add Driver</span>
            </button>
          </div>
        </>
      )}

      <CreateDriverDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditDriverDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        driver={selectedDriver}
      />

      <DeleteDriverModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        driverName={selectedDriver?.Name ?? ""}
      />
    </div>
  );
}
