"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  userSaveSchema,
  UserSaveRequest,
  userRoleSchema,
} from "@/lib/validation/auth/userSchema";

interface UserFormProps {
  defaultValues?: Partial<UserSaveRequest>;
  onSubmit: (data: UserSaveRequest) => Promise<void>;
  submitText: string;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  submitText,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSaveRequest>({
    resolver: zodResolver(userSaveSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "Viewer",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-800">
          Username
        </label>
        <input
          {...register("username")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/60"
          placeholder="Enter username"
          autoComplete="username"
        />
        <p className="text-xs text-gray-500">
          Use letters, numbers, dots, underscores, or dashes.
        </p>
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-800">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/60"
          placeholder="Create a secure password"
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-800">Role</label>
        <select
          {...register("role")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/60"
        >
          {userRoleSchema.options.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {errors.role && (
          <p className="text-red-600 text-sm">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white shadow hover:bg-gray-900"
      >
        {submitText}
      </button>
    </form>
  );
}
