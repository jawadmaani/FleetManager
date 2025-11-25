import { api } from "@/lib/api/apiClient";
import { useAuthStore } from "@/auth/authStore";

export async function bootstrapAuth() {
  const { setAccessToken, setUser, clearAuth, markInitialized } =
    useAuthStore.getState();

  try {
    // 1) أولاً: محاولة تحديث الـ Access Token
    const refreshResponse = await api.post("/auth/refresh", {});
    const newToken =
      refreshResponse.data.AccessToken ?? refreshResponse.data.accessToken;

    if (!newToken) {
      clearAuth();
      markInitialized();
      return;
    }

    setAccessToken(newToken);

    const meResponse = await api.get("/auth/me");
    setUser(meResponse.data);
  } catch {
    clearAuth();
  } finally {
    markInitialized();
  }
}
