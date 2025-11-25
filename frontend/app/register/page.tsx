"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterSchema,
} from "@/lib/validation/auth/registerSchema";
import { registerUser } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRedirectIfAuthenticated } from "@/auth/useRedirectIfAuthenticated";
import Link from "next/link";

export default function RegisterPage() {
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit(data: RegisterSchema) {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await registerUser(data);

      const message = response.Message ?? response.message ?? "Registered";
      setSuccessMessage(message);

      setTimeout(() => {
        router.push("/login");
      }, 800);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto mt-10"
    >
      <div>
        <label className="mb-2 text-sm text-slate-900 font-medium block">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          placeholder="Choose a username"
          className="px-4 py-3 bg-[#f0f1f2] w-full border rounded-md"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 text-sm text-slate-900 font-medium block">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Create a password"
          className="px-4 py-3 bg-[#f0f1f2] w-full border rounded-md"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      {successMessage && (
        <p className="text-green-600 text-sm">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 w-full text-white bg-black rounded-md disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          {" "}
          Login
        </Link>
      </div>
    </form>
  );
}
