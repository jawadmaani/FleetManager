import { api } from "./apiClient";
import { setAccessToken, clearAccessToken } from "./apiClient";

export interface LoginRequest {
  username: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);

  const accessToken = response.data.AccessToken; 
  const user = response.data.User; 

  if (accessToken) {
    setAccessToken(accessToken);
  }

  return { accessToken, user };
}


export async function registerUser(data: { username: string; password: string }) {
  const response = await api.post("/auth/register", data);
  return response.data;
}




export async function logout() {
  await api.post("/auth/logout");
  clearAccessToken();
}
