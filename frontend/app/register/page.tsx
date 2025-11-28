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
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <div className="absolute inset-0 bg-gray-200"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-black flex items-center gap-6 justify-center">
            <img
              src="/output.svg"
              alt="App Logo"
              className="w-24 h-24 md:w-28 md:h-28"
            />

            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 whitespace-nowrap">
                Fleet Manager
              </h1>

              <p className="text-lg opacity-90 whitespace-nowrap">
                Manage vehicles, drivers, and maintenance with ease.
              </p>

              <p className="text-lg opacity-90 mt-1 whitespace-nowrap">
                A complete dashboard built for efficiency and clarity.
              </p>
            </div>
          </div>

          <div className="max-w-[480px] w-full ml-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-lg">
              <h1 className="text-slate-900 text-center text-3xl font-semibold">
                Register
              </h1>

              <form
                className="mt-12 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Username
                  </label>

                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Choose a username"
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                  />

                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Password
                  </label>

                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Create a password"
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600"
                  />

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-green-600 text-sm">{successMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md 
                           text-white bg-gray-700 hover:bg-gray-900 disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-slate-900 text-sm mt-6 text-center">
                  Already have an account?
                  <Link
                    href="/login"
                    className="text-blue-600 hover:underline ml-1 font-semibold"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
