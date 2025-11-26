import { api } from "@/lib/api/apiClient";
import { z } from "zod";

import {
  maintenanceLogRequestSchema,
  maintenanceLogUpdateSchema,
  maintenanceLogResponseSchema,
  MaintenanceLogRequest,
  MaintenanceLogUpdate,
  MaintenanceLogResponse,
} from "@/lib/validation/maintenanceLog/maintenanceLogSchema";

export async function getMaintenanceLogs(): Promise<MaintenanceLogResponse[]> {
  const response = await api.get("/maintenanceLog");
  return z.array(maintenanceLogResponseSchema).parse(response.data);
}

export async function getMaintenanceLog(
  id: number
): Promise<MaintenanceLogResponse> {
  const response = await api.get(`/maintenanceLog/${id}`);
  return maintenanceLogResponseSchema.parse(response.data);
}

export async function getMaintenanceLogsByVehicle(
  vehicleId: number
): Promise<MaintenanceLogResponse[]> {
  const response = await api.get(`/maintenanceLog/vehicle/${vehicleId}`);
  return z.array(maintenanceLogResponseSchema).parse(response.data);
}

export async function createMaintenanceLog(
  data: MaintenanceLogRequest
): Promise<MaintenanceLogResponse> {
  maintenanceLogRequestSchema.parse(data);
  const response = await api.post("/maintenanceLog", data);
  return maintenanceLogResponseSchema.parse(response.data);
}

export async function updateMaintenanceLog(
  id: number,
  data: MaintenanceLogUpdate
): Promise<MaintenanceLogResponse> {
  maintenanceLogUpdateSchema.parse(data);
  const response = await api.put(`/maintenanceLog/${id}`, data);
  return maintenanceLogResponseSchema.parse(response.data);
}

export async function deleteMaintenanceLog(id: number): Promise<void> {
  await api.delete(`/maintenanceLog/${id}`);
}
