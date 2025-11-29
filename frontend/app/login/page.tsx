"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginSchema, LoginSchema } from "@/lib/validation/auth/loginSchema";
import { useAuthStore } from "@/auth/authStore";
import { useRedirectIfAuthenticated } from "@/auth/useRedirectIfAuthenticated";
import Link from "next/link";

export default function LoginPage() {
  useRedirectIfAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setAccessToken);

  async function onSubmit(data: LoginSchema) {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { accessToken, user } = await login({
        username: data.username,
        password: data.password,
      });

      if (accessToken) {
        setToken(accessToken);
      }
      if (user) {
        setUser(user);
      }
      router.replace("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Invalid username or password";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gray-200"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-black flex items-center gap-6 justify-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fleet Manager
              </h1>

              <p className="text-lg opacity-90">
                Manage vehicles, drivers, and maintenance with ease.
              </p>

              <p className="text-lg opacity-90 mt-1">
                A complete dashboard built for efficiency and clarity.
              </p>
            </div>
          </div>

          <div className="max-w-[480px] w-full ml-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-lg">
              <h1 className="text-slate-900 text-center text-3xl font-semibold">
                Sign in
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
                    placeholder="Enter username"
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
                    placeholder="Enter password"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md 
                           text-white bg-gray-700 hover:bg-gray-900 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Sign in"}
                </button>

                <p className="text-slate-900 text-sm mt-6 text-center">
                  Don&apos;t have an account?
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline ml-1 font-semibold"
                  >
                    Register here
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
