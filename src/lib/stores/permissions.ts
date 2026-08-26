/**
 * RBAC placeholder — extend ROLE_PERMISSIONS when roles are formalized.
 * UI hides nav items the current user cannot access.
 */

export type Permission =
  | "dashboard.view"
  | "transactions.view"
  | "transactions.create"
  | "transactions.delete"
  | "printing.view"
  | "printing.manage"
  | "printing.settings"
  | "inventory.view"
  | "inventory.adjust"
  | "computers.view"
  | "computers.manage"
  | "computers.transfer"
  | "support.view"
  | "support.manage"
  | "services.view"
  | "services.manage"
  | "ai-tracking.view"
  | "settings.view"
  | "reports.view"
  | "team.manage";

export type RoleKey = "manager" | "staff" | "receptionist";

const ROLE_PERMISSIONS: Record<RoleKey, Permission[] | ["*"]> = {
  manager: ["*"],
  staff: [
    "dashboard.view",
    "transactions.view",
    "transactions.create",
    "printing.view",
    "inventory.view",
    "inventory.adjust",
    "computers.view",
    "computers.transfer",
    "services.view",
    "support.view",
  ],
  receptionist: [
    "dashboard.view",
    "transactions.view",
    "transactions.create",
    "printing.view",
    "computers.view",
    "computers.transfer",
    "services.view",
    "support.view",
  ],
};

export function resolveRoleKey(roleLabel: string): RoleKey {
  const lower = roleLabel.toLowerCase();
  if (lower.includes("manager") || lower.includes("admin")) return "manager";
  if (lower.includes("reception")) return "receptionist";
  return "staff";
}

export function canAccess(roleLabel: string, permission: Permission): boolean {
  const roleKey = resolveRoleKey(roleLabel);
  const permissions = ROLE_PERMISSIONS[roleKey];
  if (permissions[0] === "*") return true;
  return (permissions as Permission[]).includes(permission);
}

export function hasAnyPermission(
  roleLabel: string,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => canAccess(roleLabel, p));
}
