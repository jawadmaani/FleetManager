import axios from "axios";
import { useAuthStore } from "@/auth/authStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const authStore = useAuthStore.getState();
    const { clearAuth, setAccessToken, setUser } = authStore;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh", {});

        const newAccessToken =
          refreshResponse.data.AccessToken ?? refreshResponse.data.accessToken;

        if (!newAccessToken) {
          clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        setAccessToken(newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        try {
          const meResponse = await api.get("/auth/me");
          if (meResponse.data) {
            setUser(meResponse.data);
          }
        } catch {

        }

        return api(originalRequest);
      } catch (refreshError) {

        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
