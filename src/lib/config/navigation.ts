import { get } from "svelte/store";
import { extensionNavItems } from "$lib/stores/extensions";
import type { Permission } from "$lib/stores/permissions";
import type { Component } from "svelte";
import {
  LayoutGrid,
  ShoppingBag,
  Package,
  BriefcaseBusiness,
  TerminalSquare,
  BarChart3,
  Puzzle,
  Settings,
  UsersRound,
} from "@lucide/svelte";

export type NavItem = {
  label: string;
  path: string;
  icon: Component;
  permission: Permission;
  badge?: string;
  section?: string;
};

/** Core navigation — always visible regardless of extensions */
export const appNavItems: NavItem[] = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutGrid,
    permission: "dashboard.view",
    section: "Workspace",
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ShoppingBag,
    permission: "transactions.view",
    section: "Workspace",
  },
  {
    label: "Stock & Inventory",
    path: "/inventory",
    icon: Package,
    permission: "inventory.view",
    section: "Workspace",
  },
  {
    label: "Services",
    path: "/services",
    icon: BriefcaseBusiness,
    permission: "services.view",
    section: "Workspace",
  },
  {
    label: "Daily Sales",
    path: "/reports",
    icon: BarChart3,
    permission: "reports.view",
    section: "Reports",
  },
  {
    label: "Activity Log",
    path: "/audit",
    icon: TerminalSquare,
    permission: "audit.view",
    section: "Workspace",
  },
  {
    label: "Extensions",
    path: "/extensions",
    icon: Puzzle,
    permission: "extensions.manage",
    section: "System",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    permission: "settings.view",
    section: "System",
  },
  {
    label: "Team & staff",
    path: "/team",
    icon: UsersRound,
    permission: "team.manage",
    section: "System",
  },
];

export function isNavActive(path: string, currentPath: string): boolean {
  if (path === "/dashboard") {
    return currentPath === "/dashboard" || currentPath === "/overview";
  }
  if (path === "/printing") {
    return currentPath === "/printing";
  }
  if (path === "/extensions") {
    return currentPath === "/extensions";
  }
  // Extension sub-pages are sibling destinations. A parent dashboard must
  // not remain highlighted when the user opens its configuration page.
  if (path.startsWith("/extensions/")) {
    return currentPath === path;
  }
  return currentPath === path || currentPath.startsWith(path + "/");
}

export function permissionForPath(path: string): Permission | null {
  if (path === "/dashboard" || path === "/overview") return "dashboard.view";
  if (path === "/transactions" || path.startsWith("/transactions/")) {
    return "transactions.view";
  }
  if (path === "/inventory" || path.startsWith("/inventory/")) {
    return "inventory.view";
  }
  if (path === "/services" || path.startsWith("/services/")) {
    return "services.view";
  }
  if (path === "/printing" || path.startsWith("/printing/")) {
    return "printing.view";
  }
  if (path === "/computers" || path.startsWith("/computers/")) {
    return "computers.view";
  }
  if (path === "/support" || path.startsWith("/support/")) {
    return "support.view";
  }
  if (path === "/audit" || path.startsWith("/audit/")) {
    return "audit.view";
  }
  if (path === "/settings" || path.startsWith("/settings/")) {
    return "settings.view";
  }
  if (path === "/reports" || path.startsWith("/reports/"))
    return "reports.view";
  if (path === "/team" || path.startsWith("/team/")) return "team.manage";
  if (path === "/extensions") return "extensions.manage";
  if (path.startsWith("/extensions/")) {
    const extensionItem = get(extensionNavItems).find(
      (item) => path === item.path || path.startsWith(`${item.path}/`),
    );
    if (extensionItem) return extensionItem.permission;
    if (
      path === "/extensions/wallet" ||
      path.startsWith("/extensions/wallet/")
    ) {
      return "wallet.view";
    }
    return "dashboard.view";
  }
  return null;
}
