import { api } from "@/lib/api/apiClient";
import { useAuthStore } from "@/auth/authStore";
import { fetchCurrentUser } from "@/lib/api/authApi";

export async function bootstrapAuth() {
  const { accessToken, setAccessToken, setUser, clearAuth, markInitialized } =
    useAuthStore.getState();

  try {

    if (accessToken) {
      const me = await fetchCurrentUser();
      setUser(me);
      return;
    }

    const refreshResponse = await api.post("/auth/refresh", {});
    const newToken =
      refreshResponse.data.AccessToken ?? refreshResponse.data.accessToken;

    if (!newToken) {
      clearAuth();
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
