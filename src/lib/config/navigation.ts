import type { Permission } from "$lib/stores/permissions";
import type { Component } from "svelte";
import {
  LayoutGrid,
  ShoppingBag,
  Printer,
  Settings2,
  Package,
  Monitor,
  BriefcaseBusiness,
  TerminalSquare,
  BarChart3,
  MessageSquare,
} from "@lucide/svelte";

export type NavItem = {
  label: string;
  path: string;
  icon: Component;
  permission: Permission;
  badge?: string;
  section?: string;
};

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
    label: "Printing",
    path: "/printing",
    icon: Printer,
    permission: "printing.view",
    section: "Operations",
  },
  {
    label: "Print Settings",
    path: "/printing/settings",
    icon: Settings2,
    permission: "printing.settings",
    section: "Operations",
  },
  {
    label: "Stock Taking",
    path: "/inventory",
    icon: Package,
    permission: "inventory.view",
    section: "Operations",
  },
  {
    label: "Computers",
    path: "/computers",
    icon: Monitor,
    permission: "computers.view",
    section: "Operations",
  },
  {
    label: "Support & Chat",
    path: "/support",
    icon: MessageSquare,
    permission: "support.view",
    section: "Operations",
  },
  {
    label: "Services",
    path: "/services",
    icon: BriefcaseBusiness,
    permission: "services.view",
    section: "Operations",
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
];

export function isNavActive(path: string, currentPath: string): boolean {
  if (path === "/dashboard") {
    return currentPath === "/dashboard" || currentPath === "/overview";
  }
  if (path === "/printing") {
    return currentPath === "/printing";
  }
  return currentPath === path || currentPath.startsWith(path + "/");
}
