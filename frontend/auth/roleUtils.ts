export type Role = "Admin" | "Mechanic" | "Viewer";

export function userHasRole(userRole: string, allowed: Role[]) {
  return allowed.includes(userRole as Role);
}
