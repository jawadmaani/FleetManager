import { api } from "@/lib/api/apiClient";
import { setAccessToken, clearAccessToken } from "@/lib/api/apiClient";

export async function bootstrapAuth() {
  try {
    const response = await api.post("/auth/refresh", {});
    const newToken = response.data.accessToken;

    if (newToken) {
      setAccessToken(newToken);
    }
  } catch {
    clearAccessToken();
  }
}
