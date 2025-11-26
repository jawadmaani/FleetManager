"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VehicleRequest,
  vehicleRequestSchema,
  fuelTypeSchema,
} from "@/lib/validation/vehicle/vehicleSchema";

interface VehicleFormProps {
  defaultValues?: VehicleRequest;
  onSubmit: (data: VehicleRequest) => Promise<void>;
  submitText: string;
}

export default function VehicleForm({
  defaultValues,
  onSubmit,
  submitText,
}: VehicleFormProps) {
  const fuelTypeOptions = fuelTypeSchema.options;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleRequest>({
    resolver: zodResolver(vehicleRequestSchema),
    defaultValues: defaultValues ?? { fuelType: fuelTypeOptions[0] },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Plate Number</label>
        <input
          {...register("plateNumber")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. ABC-1234"
        />
        {errors.plateNumber && (
          <span className="text-red-500 text-sm">
            {errors.plateNumber.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Model</label>
        <input
          {...register("model")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. Corolla"
        />
        {errors.model && (
          <span className="text-red-500 text-sm">{errors.model.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Manufacturer</label>
        <input
          {...register("manufacturer")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. Toyota"
        />
        {errors.manufacturer && (
          <span className="text-red-500 text-sm">
            {errors.manufacturer.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Year</label>
        <input
          type="number"
          {...register("year", { valueAsNumber: true })}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. 2020"
        />
        {errors.year && (
          <span className="text-red-500 text-sm">{errors.year.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Odometer (km)</label>{" "}
        <input
          type="number"
          {...register("odometer", { valueAsNumber: true })}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. 50000"
        />
        {errors.odometer && (
          <span className="text-red-500 text-sm">
            {errors.odometer.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Fuel Type</label>
        <select
          {...register("fuelType")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
        >
          {fuelTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.fuelType && (
          <span className="text-red-500 text-sm">
            {errors.fuelType.message}
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
