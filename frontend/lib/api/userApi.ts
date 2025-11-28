import { api } from "@/lib/api/apiClient";
import {
  userResponseSchema,
  userSaveSchema,
  UserResponse,
  UserSaveRequest,
  userRoleSchema,
} from "@/lib/validation/auth/userSchema";
import { z } from "zod";

export async function getUsers(): Promise<UserResponse[]> {
  const response = await api.get("/user");
  return z.array(userResponseSchema).parse(response.data);
}

export async function getUser(id: number): Promise<UserResponse> {
  const response = await api.get(`/user/${id}`);
  return userResponseSchema.parse(response.data);
}

export async function createUser(data: UserSaveRequest): Promise<UserResponse> {
  userSaveSchema.parse(data);
  const response = await api.post("/user", data);
  return userResponseSchema.parse(response.data);
}

export async function updateUser(
  id: number,
  data: UserSaveRequest
): Promise<UserResponse> {
  userSaveSchema.parse(data);
  const response = await api.put(`/user/${id}`, data);
  return userResponseSchema.parse(response.data);
}

export async function updateUserRole(
  id: number,
  role: "Admin" | "Mechanic" | "Viewer"
): Promise<UserResponse> {
  userRoleSchema.parse(role);
  const response = await api.patch(`/user/${id}/role`, { role });
  return userResponseSchema.parse(response.data);
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/user/${id}`);
}
