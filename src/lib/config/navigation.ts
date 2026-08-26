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
    label: "AI Tracking",
    path: "/ai-tracking",
    icon: TerminalSquare,
    permission: "ai-tracking.view",
    badge: "Dev",
    section: "System",
  },
  {
    label: "Extensions",
    path: "/extensions",
    icon: Puzzle,
    permission: "dashboard.view",
    section: "System",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    permission: "dashboard.view",
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
