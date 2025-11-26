"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DriverRequest,
  driverRequestSchema,
} from "@/lib/validation/driver/driverSchema";

interface DriverFormProps {
  defaultValues?: DriverRequest;
  onSubmit: (data: DriverRequest) => Promise<void>;
  submitText: string;
}

export default function DriverForm({
  defaultValues,
  onSubmit,
  submitText,
}: DriverFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverRequest>({
    resolver: zodResolver(driverRequestSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Name</label>
        <input
          {...register("name")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. John Doe"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      {/* License Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">License Number</label>
        <input
          {...register("licenseNumber")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. A1234567"
        />
        {errors.licenseNumber && (
          <span className="text-red-500 text-sm">
            {errors.licenseNumber.message}
          </span>
        )}
      </div>

      {/* Phone Number */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Phone Number</label>
        <input
          {...register("phoneNumber")}
          className="p-3 border rounded-md focus:ring-2 focus:ring-black outline-none"
          placeholder="e.g. 079xxxxxxx"
        />
        {errors.phoneNumber && (
          <span className="text-red-500 text-sm">
            {errors.phoneNumber.message}
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
