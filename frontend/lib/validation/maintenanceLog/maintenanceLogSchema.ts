import { z } from "zod";

export const maintenanceLogResponseSchema = z.object({
  Id: z.number(),
  MaintenanceType: z.string(),
  MaintenanceDate: z.string(),
  Cost: z.number(),
  Description: z.string().nullable(),
  PerformedBy: z.string(),
  VehicleId: z.number(),
  CreatedByUserId: z.number(),
  CreatedAt: z.string(),
});

export type MaintenanceLogResponse = z.infer<
  typeof maintenanceLogResponseSchema
>;

export const maintenanceLogRequestSchema = z.object({
  maintenanceType: z.string().min(1).max(100),
  maintenanceDate: z.string(),
  cost: z.number().positive(),
  description: z.string().max(500).nullable(),
  performedBy: z.string().min(1).max(100),
  vehicleId: z.number(),
});

export type MaintenanceLogRequest = z.infer<typeof maintenanceLogRequestSchema>;

export const maintenanceLogUpdateSchema = z.object({
  maintenanceType: z.string().min(1).max(100),
  maintenanceDate: z.string(),
  cost: z.number().positive(),
  description: z.string().max(500).nullable(),
  performedBy: z.string().min(1).max(100),
});

export type MaintenanceLogUpdate = z.infer<typeof maintenanceLogUpdateSchema>;
