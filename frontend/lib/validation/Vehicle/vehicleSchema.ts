import { z } from "zod";

export const fuelTypeSchema = z.enum([
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
]);
export type FuelType = z.infer<typeof fuelTypeSchema>;

export const statusSchema = z.enum(["Active", "Inactive"]);
export type Status = z.infer<typeof statusSchema>;

export const vehicleResponseSchema = z.object({
  Id: z.number(),
  PlateNumber: z.string(),
  Model: z.string(),
  Manufacturer: z.string(),
  Year: z.number(),
  Odometer: z.number(),
  FuelType: fuelTypeSchema,
  Status: statusSchema,
  CreatedAt: z.string(),
});

export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;

export const vehicleRequestSchema = z.object({
  plateNumber: z.string().min(1),
  model: z.string().min(1),
  manufacturer: z.string().min(1),
  year: z.number().min(1900).max(2100), 
  odometer: z.number().min(0), 
  fuelType: fuelTypeSchema,
});


export type VehicleRequest = z.infer<typeof vehicleRequestSchema>;
