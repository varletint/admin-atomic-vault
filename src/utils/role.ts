import type { UserRole } from "@/types";

/** Roles allowed to use the admin app UI — backend must enforce the same. */
const ADMIN_APP_ROLES: UserRole[] = ["ADMIN", "SUPPORT"];

export function canAccessAdmin(role: UserRole): boolean {
  return ADMIN_APP_ROLES.includes(role);
}
