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
  | "audit.view"
  | "settings.view"
  | "settings.profile.edit"
  | "wallet.view"
  | "reports.view"
  | "team.manage"
  | "extensions.manage";

import { get } from "svelte/store";
import { authStore } from "./auth";

export type RoleKey = "OWNER" | "ADMIN" | "STAFF";

export function resolveRoleKey(roleLabel: string): RoleKey {
  const upper = roleLabel.toUpperCase();
  if (upper === "OWNER") return "OWNER";
  if (upper === "ADMIN") return "ADMIN";
  return "STAFF";
}

const BACKEND_PERMISSION: Partial<Record<Permission, string>> = {
  "transactions.view": "TRANSACTIONS_VIEW",
  "transactions.create": "TRANSACTIONS_MANAGE",
  "transactions.delete": "TRANSACTIONS_MANAGE",
  "printing.view": "PRINTING_VIEW",
  "printing.manage": "PRINTING_MANAGE",
  "printing.settings": "PRINTING_SETTINGS",
  "inventory.view": "INVENTORY_VIEW",
  "inventory.adjust": "INVENTORY_MANAGE",
  "services.view": "SERVICES_VIEW",
  "computers.view": "COMPUTERS_VIEW",
  "computers.manage": "COMPUTERS_MANAGE",
  "computers.transfer": "COMPUTERS_TRANSFER",
  "support.view": "SUPPORT_VIEW",
  "support.manage": "SUPPORT_MANAGE",
  "audit.view": "ACTIVITY_VIEW",
  "services.manage": "SERVICES_MANAGE",
  "settings.view": "SETTINGS_VIEW",
  "settings.profile.edit": "SETTINGS_PROFILE_EDIT",
  "wallet.view": "WALLET_VIEW",
  "reports.view": "REPORTS_VIEW",
  "team.manage": "TEAM_VIEW",
  "extensions.manage": "EXTENSIONS_VIEW",
};

function resolvePermission(permission: Permission): string | null {
  return BACKEND_PERMISSION[permission] ?? null;
}

export function hasPermission(permission: Permission): boolean {
  if (permission === "dashboard.view") {
    return get(authStore).isAuthenticated;
  }
  const backendPermission = resolvePermission(permission);
  return backendPermission
    ? get(authStore).permissions.includes(backendPermission)
    : false;
}

export function canAccess(roleLabel: string, permission: Permission): boolean {
  void roleLabel;
  return hasPermission(permission);
}

export function hasAnyPermission(
  roleLabel: string,
  permissions: Permission[],
): boolean {
  void roleLabel;
  return permissions.some((permission) => hasPermission(permission));
}
