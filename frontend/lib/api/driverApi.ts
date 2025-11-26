import { api } from "@/lib/api/apiClient";
import {
  driverRequestSchema,
  driverResponseSchema,
  driverStatusUpdateSchema,
  DriverRequest,
  DriverResponse,
  DriverStatusUpdate,
  driverAssignVehicleSchema,
  DriverAssignVehicle,
} from "@/lib/validation/driver/driverSchema";
import { z } from "zod";

export async function getDrivers(): Promise<DriverResponse[]> {
  const response = await api.get("/driver");
  return z.array(driverResponseSchema).parse(response.data);
}

export async function getDriver(id: number): Promise<DriverResponse> {
  const response = await api.get(`/driver/${id}`);
  return driverResponseSchema.parse(response.data);
}

export async function createDriver(
  data: DriverRequest
): Promise<DriverResponse> {
  driverRequestSchema.parse(data);
  const response = await api.post("/driver", data);
  return driverResponseSchema.parse(response.data);
}

export async function updateDriver(
  id: number,
  data: DriverRequest
): Promise<DriverResponse> {
  driverRequestSchema.parse(data);
  const response = await api.put(`/driver/${id}`, data);
  return driverResponseSchema.parse(response.data);
}

export async function updateDriverStatus(
  id: number,
  data: DriverStatusUpdate
): Promise<DriverResponse> {
  driverStatusUpdateSchema.parse(data);
  const response = await api.patch(`/driver/${id}/status`, data);
  return driverResponseSchema.parse(response.data);
}

export async function assignVehicleToDriver(
  driverId: number,
  data: DriverAssignVehicle
): Promise<DriverResponse> {
  driverAssignVehicleSchema.parse(data);
  const response = await api.patch(`/driver/${driverId}/assign-vehicle`, data);
  return driverResponseSchema.parse(response.data);
}

export async function unassignVehicleFromDriver(
  driverId: number
): Promise<DriverResponse> {
  const response = await api.patch(`/driver/${driverId}/unassign-vehicle`);
  return driverResponseSchema.parse(response.data);
}

export async function deleteDriver(id: number): Promise<void> {
  await api.delete(`/driver/${id}`);
}
