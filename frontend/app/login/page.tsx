"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginSchema, LoginSchema } from "@/lib/validation/auth/loginSchema";
import { useAuthStore } from "@/auth/authStore";
import { useRedirectIfAuthenticated } from "@/auth/useRedirectIfAuthenticated";

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

      setToken(accessToken);
      setUser(user);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-4 max-w-md mx-auto mt-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label className="mb-2 text-sm text-slate-900 font-medium block">
          Username
        </label>

        <input
          {...register("username")}
          type="text"
          placeholder="Enter Username"
          className="px-4 py-3 pr-10 bg-[#f0f1f2] focus:bg-transparent 
                     w-full text-sm border border-gray-200 focus:border-black 
                     outline-0 rounded-md transition-all"
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
          placeholder="Enter Password"
          className="px-4 py-3 pr-10 bg-[#f0f1f2] focus:bg-transparent 
                     w-full text-sm border border-gray-200 focus:border-black 
                     outline-0 rounded-md transition-all"
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 w-full cursor-pointer !mt-4 text-[15px] 
                   font-medium bg-black hover:bg-[#111] text-white rounded-md
                   disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div className="text-center text-sm mt-4">
        Do not have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </div>
    </form>
  );
}
