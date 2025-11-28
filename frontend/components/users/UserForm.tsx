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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          {...register("username")}
          className="w-full border rounded p-2"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...register("password")}
          type="password"
          className="w-full border rounded p-2"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select {...register("role")} className="w-full border rounded p-2">
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
        className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
      >
        {submitText}
      </button>
    </form>
  );
}
