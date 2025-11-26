import { z } from "zod";

export const monthlyVehicleCostSchema = z.object({
  Year: z.number(),
  Month: z.number(),
  TotalCost: z.number(),
});

export type MonthlyVehicleCost = z.infer<typeof monthlyVehicleCostSchema>;

export const vehicleTotalCostSchema = z.object({
  VehicleId: z.number(),
  PlateNumber: z.string(),
  TotalCost: z.number(),
});

export type VehicleTotalCost = z.infer<typeof vehicleTotalCostSchema>;

export const monthlyTotalCostSchema = z.object({
  Year: z.number(),
  Month: z.number(),
  TotalCost: z.number(),
});

export type MonthlyTotalCost = z.infer<typeof monthlyTotalCostSchema>;

export const monthlyVehicleCostListSchema = z.array(monthlyVehicleCostSchema);
export const vehicleTotalCostListSchema = z.array(vehicleTotalCostSchema);
export const monthlyTotalCostListSchema = z.array(monthlyTotalCostSchema);
