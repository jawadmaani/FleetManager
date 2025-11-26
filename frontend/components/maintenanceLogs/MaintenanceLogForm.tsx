"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  MaintenanceLogRequest,
  maintenanceLogRequestSchema,
  MaintenanceLogUpdate,
  maintenanceLogUpdateSchema,
} from "@/lib/validation/maintenanceLog/maintenanceLogSchema";

import type { VehicleResponse } from "@/lib/validation/vehicle/vehicleSchema";

interface MaintenanceLogFormProps {
  defaultValues?: Partial<MaintenanceLogRequest | MaintenanceLogUpdate>;
  onSubmit: (
    data: MaintenanceLogRequest | MaintenanceLogUpdate
  ) => Promise<void>;
  submitText: string;
  vehicles: VehicleResponse[];
  hideVehicleField?: boolean; 
}

export default function MaintenanceLogForm({
  defaultValues,
  onSubmit,
  submitText,
  vehicles,
  hideVehicleField = false,
}: MaintenanceLogFormProps) {
  const schema = hideVehicleField
    ? maintenanceLogUpdateSchema
    : maintenanceLogRequestSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceLogRequest | MaintenanceLogUpdate>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: null,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (values: MaintenanceLogRequest | MaintenanceLogUpdate) => {
    const isoDate = new Date(values.maintenanceDate).toISOString();

    const finalData = {
      ...values,
      maintenanceDate: isoDate,
    };

    return onSubmit(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Maintenance Type</label>
        <input
          {...register("maintenanceType")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. Oil Change"
        />
        {errors.maintenanceType && (
          <span className="text-red-500 text-sm">
            {errors.maintenanceType.message as string}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Maintenance Date</label>
        <input
          type="date"
          {...register("maintenanceDate")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
        />
        {errors.maintenanceDate && (
          <span className="text-red-500 text-sm">
            {errors.maintenanceDate.message as string}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Cost</label>
        <input
          type="number"
          step="0.01"
          {...register("cost", { valueAsNumber: true })}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. 120.50"
        />
        {errors.cost && (
          <span className="text-red-500 text-sm">
            {errors.cost.message as string}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Performed By</label>
        <input
          {...register("performedBy")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. AutoFix"
        />
        {errors.performedBy && (
          <span className="text-red-500 text-sm">
            {errors.performedBy.message as string}
          </span>
        )}
      </div>

      {!hideVehicleField && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Vehicle</label>
          <select
            {...register("vehicleId", { valueAsNumber: true })}
            className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          >
            <option value="">Select vehicle...</option>
            {vehicles.map((v) => (
              <option key={v.Id} value={v.Id}>
                {v.PlateNumber} — {v.Model}
              </option>
            ))}
          </select>
          {"vehicleId" in errors && errors.vehicleId && (
            <span className="text-red-500 text-sm">
              {errors.vehicleId.message as string}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col col-span-full">
        <label className="text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="Optional notes..."
          rows={4}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message as string}
          </span>
        )}
      </div>

      <div className="col-span-full">
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
