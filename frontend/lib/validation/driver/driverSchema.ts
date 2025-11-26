import { z } from "zod";

export const statusSchema = z.enum(["Active", "Inactive"]);

export const driverResponseSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  LicenseNumber: z.string(),
  PhoneNumber: z.string(),
  Status: statusSchema,
  VehicleId: z.number().nullable(),
  CreatedAt: z.string(),
});

export type DriverResponse = z.infer<typeof driverResponseSchema>;

export const driverRequestSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  phoneNumber: z.string().min(1),
});

export type DriverRequest = z.infer<typeof driverRequestSchema>;

export const driverStatusUpdateSchema = z.object({
  status: statusSchema,
});

export type DriverStatusUpdate = z.infer<typeof driverStatusUpdateSchema>;

export const driverAssignVehicleSchema = z.object({
  vehicleId: z.number(),
});

export type DriverAssignVehicle = z.infer<typeof driverAssignVehicleSchema>;
