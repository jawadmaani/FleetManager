import { z } from "zod";


export const userRoleSchema = z.enum(["Admin", "Mechanic", "Viewer"]);
export type UserRole = z.infer<typeof userRoleSchema>;


export const userResponseSchema = z.object({
  Id: z.number(),
  Username: z.string(),
  Role: userRoleSchema,
  CreatedAt: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;


export const userSaveSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-zA-Z0-9._-]{3,}$/,
      "Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or dashes."
    ),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: userRoleSchema,
});

export type UserSaveRequest = z.infer<typeof userSaveSchema>;
