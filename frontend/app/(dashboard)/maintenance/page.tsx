"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMaintenanceLogs,
  deleteMaintenanceLog,
} from "@/lib/api/maintenanceLogApi";
import type { MaintenanceLogResponse } from "@/lib/validation/maintenanceLog/maintenanceLogSchema";

import { getVehicles } from "@/lib/api/vehicleApi";
import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

import SearchBar from "@/components/common/SearchBar";

import CreateMaintenanceLogDialog from "@/components/maintenanceLogs/CreateMaintenanceLogDialog";
import EditMaintenanceLogDialog from "@/components/maintenanceLogs/EditMaintenanceLogDialog";
import DeleteMaintenanceLogModal from "@/components/maintenanceLogs/DeleteMaintenanceLogModal";

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

export default function MaintenanceLogsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const canCreate = user?.Role === "Admin" || user?.Role === "Mechanic";
  const canEdit = user?.Role === "Admin" || user?.Role === "Mechanic";
  const canDelete = user?.Role === "Admin";

  const {
    data: logs,
    isLoading,
    error,
  } = useQuery<MaintenanceLogResponse[]>({
    queryKey: ["maintenanceLogs"],
    queryFn: getMaintenanceLogs,
  });

  const { data: vehicles } = useQuery<VehicleResponse[]>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const vehicleLookup = useMemo(
    () => new Map(vehicles?.map((v) => [v.Id, v]) ?? []),
    [vehicles]
  );

  const [selectedLog, setSelectedLog] = useState<MaintenanceLogResponse | null>(
    null
  );

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMaintenanceLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenanceLogs"] });
      setOpenDelete(false);
      setSelectedLog(null);
    },
  });

  async function handleConfirmDelete() {
    if (!selectedLog) return;
    await deleteMutation.mutateAsync(selectedLog.Id);
  }

  function handleOpenEdit(log: MaintenanceLogResponse) {
    setSelectedLog(log);
    setOpenEdit(true);
  }

  function handleOpenDelete(log: MaintenanceLogResponse) {
    setSelectedLog(log);
    setOpenDelete(true);
  }

  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    const lower = searchTerm.trim().toLowerCase();

    return logs
      .filter((log) => {
        const vehicle = vehicleLookup.get(log.VehicleId);
        const searchBlob = `${log.MaintenanceType} ${log.PerformedBy} ${
          log.Description ?? ""
        } ${vehicle?.PlateNumber ?? ""} ${log.Cost} ${formatDate(
          log.MaintenanceDate
        )}`
          .toLowerCase()
          .includes(lower);

        return searchBlob;
      })
      .sort(
        (a, b) =>
          new Date(b.MaintenanceDate).getTime() -
          new Date(a.MaintenanceDate).getTime()
      );
  }, [logs, searchTerm, vehicleLookup]);

  if (isLoading)
    return (
      <p className="text-gray-600">Loading maintenance logs, please wait...</p>
    );

  if (error)
    return (
      <p className="text-red-600">
        Unable to load maintenance logs. Please try again.
      </p>
    );

  return (
    <div className="space-y-6 mt-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-1">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by type, vehicle, performer"
        />

        <div className="text-sm text-gray-600">
          Total logs: <span className="font-semibold">{logs?.length ?? 0}</span>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600 shadow">
          <p className="text-lg font-semibold text-gray-900">
            {searchTerm
              ? "No maintenance logs match your search"
              : "No maintenance logs found"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try changing your search or add a new maintenance log.
          </p>

          {canCreate && (
            <button
              onClick={() => setOpenCreate(true)}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow hover:bg-gray-900"
            >
              Add Maintenance Log
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Cost</th>
                  <th className="p-3 font-medium">Performed By</th>
                  <th className="p-3 font-medium">Vehicle</th>
                  <th className="p-3 font-medium">Created At</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => {
                  const vehicle = vehicleLookup.get(log.VehicleId);

                  return (
                    <tr key={log.Id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">
                        {log.MaintenanceType}
                      </td>

                      <td className="p-3">{formatDate(log.MaintenanceDate)}</td>

                      <td className="p-3">
                        {log.Cost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="p-3">{log.PerformedBy}</td>

                      <td className="p-3">
                        {vehicle
                          ? `${vehicle.PlateNumber} (${vehicle.Model})`
                          : `#${log.VehicleId}`}
                      </td>

                      <td className="p-3 text-gray-600">
                        {formatDate(log.CreatedAt)}
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(log)}
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
                            onClick={() => handleOpenDelete(log)}
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
                px-6 py-3 rounded-lg text-sm font-semibold text-white
                ${
                  canCreate
                    ? "bg-black hover:bg-gray-900"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              Add Maintenance Log
            </button>
          </div>
        </>
      )}

      <CreateMaintenanceLogDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        vehicles={vehicles ?? []}
      />

      <EditMaintenanceLogDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        log={selectedLog}
        vehicles={vehicles ?? []}
      />

      <DeleteMaintenanceLogModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        maintenanceType={selectedLog?.MaintenanceType ?? ""}
      />
    </div>
  );
}
