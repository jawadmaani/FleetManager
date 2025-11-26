import { api } from "@/lib/api/apiClient";
import {
  vehicleRequestSchema,
  vehicleResponseSchema,
  VehicleRequest,
  VehicleResponse,
  statusSchema,
} from "@/lib/validation/Vehicle/vehicleSchema";
import { z } from "zod";

export async function getVehicles(): Promise<VehicleResponse[]> {
  const response = await api.get("/vehicle");
  return z.array(vehicleResponseSchema).parse(response.data);
}

export async function getVehicle(id: number): Promise<VehicleResponse> {
  const response = await api.get(`/vehicle/${id}`);
  return vehicleResponseSchema.parse(response.data);
}

export async function createVehicle(
  data: VehicleRequest
): Promise<VehicleResponse> {
  vehicleRequestSchema.parse(data);
  const response = await api.post("/vehicle", data);
  return vehicleResponseSchema.parse(response.data);
}

export async function updateVehicle(
  id: number,
  data: VehicleRequest
): Promise<VehicleResponse> {
  vehicleRequestSchema.parse(data);
  const response = await api.put(`/vehicle/${id}`, data);
  return vehicleResponseSchema.parse(response.data);
}

export async function updateVehicleStatus(
  id: number,
  status: "Active" | "Inactive"
): Promise<VehicleResponse> {
  statusSchema.parse(status);
  const response = await api.patch(`/vehicle/${id}/status`, { status });
  return vehicleResponseSchema.parse(response.data);
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/vehicle/${id}`);
}
