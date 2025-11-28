import { api } from "@/lib/api/apiClient";
import { z } from "zod";

import {
  monthlyVehicleCostListSchema,
  vehicleTotalCostListSchema,
  monthlyTotalCostListSchema,
  MonthlyVehicleCost,
  VehicleTotalCost,
  MonthlyTotalCost,
} from "@/lib/validation/maintenanceReport/maintenanceReportSchemas";

export async function getMonthlyCostByVehicle(
  vehicleId: number
): Promise<MonthlyVehicleCost[]> {
  const response = await api.get(
    `/maintenanceReport/vehicle/${vehicleId}/monthly-cost`
  );
  return monthlyVehicleCostListSchema.parse(response.data);
}

export async function getTopVehiclesByMaintenanceCost(
  top: number = 3
): Promise<VehicleTotalCost[]> {
  const response = await api.get(`/maintenanceReport/top-vehicles`, {
    params: { top },
  });

  return vehicleTotalCostListSchema.parse(response.data);
}

export async function getMonthlyTotalMaintenanceCost(): Promise<
  MonthlyTotalCost[]
> {
  const response = await api.get(`/maintenanceReport/monthly-total`);
  return monthlyTotalCostListSchema.parse(response.data);
}
