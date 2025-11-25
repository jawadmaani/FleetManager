import { api } from "./apiClient";
import { useAuthStore } from "@/auth/authStore";

export interface LoginRequest {
  username: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);

  const accessToken = response.data.AccessToken;
  const user = response.data.User;

  if (accessToken) {
    useAuthStore.getState().setAccessToken(accessToken);
  }
  if (user) {
    useAuthStore.getState().setUser(user);
  }

  return { accessToken, user };
}

export async function registerUser(data: {
  username: string;
  password: string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
  useAuthStore.getState().clearAuth();
}
