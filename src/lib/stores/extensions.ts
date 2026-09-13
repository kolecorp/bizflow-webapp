import { writable, derived, get } from "svelte/store";
import { browser } from "$app/environment";
import type { Component } from "svelte";
import { authStore, handleUnauthorized, type AuthUser } from "$lib/stores/auth";
import type { Permission } from "$lib/stores/permissions";
import {
  Printer,
  Monitor,
  MessageCircle,
  Send,
  Smartphone,
  Zap,
  Settings2,
  MessageSquare,
  Mail,
  Hash,
  SmartphoneNfc,
  WalletCards,
  Megaphone,
  LayoutTemplate,
  ListChecks,
  BarChart3,
  ShieldCheck,
  QrCode,
  CalendarClock,
  Globe,
} from "@lucide/svelte";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export type ExtensionStatus = "active" | "inactive" | "coming-soon";

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: Component<{ class?: string }>;
  status: ExtensionStatus;
  category: "channels" | "operations" | "automation" | "analytics";
  infographic?: string;
  connected?: boolean;
  connectionData?: Record<string, unknown>;
  navItems?: {
    label: string;
    path: string;
    icon: Component<{ class?: string }>;
    permission: Permission;
    badge?: string;
  }[];
  serverRendered?: boolean;
  subscribed?: boolean;
  price?: string;
  expiresAt?: string;
}

const defaultExtensions: Extension[] = [
  // ── Channels ──
  {
    id: "WHATSAPP_BUSINESS",
    name: "WhatsApp for Business",
    description:
      "Receive instant sales alerts, daily summaries, and manage approvals directly from WhatsApp.",
    icon: MessageCircle,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "WhatsApp Business",
        path: "/extensions/whatsapp/business",
        icon: MessageCircle,
        permission: "dashboard.view",
      },
    ],
    price: "₦3,000/mo",
    subscribed: false,
  },
  {
    id: "WHATSAPP_CUSTOMERS",
    name: "WhatsApp for Customers",
    description:
      "Automated receipts, order updates, and a direct support channel for your customers.",
    icon: Smartphone,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "WhatsApp Customers",
        path: "/extensions/whatsapp/customers",
        icon: Smartphone,
        permission: "dashboard.view",
      },
    ],
    price: "₦2,500/mo",
    subscribed: false,
  },
  {
    id: "TELEGRAM",
    name: "Telegram",
    description:
      "Plan Telegram bots and Mini Apps that connect conversations to your business workflows.",
    icon: Send,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "Telegram",
        path: "/extensions/telegram",
        icon: Send,
        permission: "dashboard.view",
      },
    ],
    price: "Free",
    subscribed: false,
  },
  {
    id: "SMS",
    name: "SMS Notifications",
    description:
      "Send transaction confirmations, receipts, and promotional alerts to customers and staff via SMS.",
    icon: Mail,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "SMS Dashboard",
        path: "/extensions/sms",
        icon: Mail,
        permission: "dashboard.view",
      },
      {
        label: "SMS Templates",
        path: "/extensions/sms/templates",
        icon: Settings2,
        permission: "dashboard.view",
      },
    ],
    price: "₦2,000/mo",
    subscribed: false,
  },
  {
    id: "USSD",
    name: "USSD Access",
    description:
      "Allow staff and customers to log transactions, check balances, and interact with Bizflow via USSD codes.",
    icon: Hash,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "USSD Dashboard",
        path: "/extensions/ussd",
        icon: Hash,
        permission: "dashboard.view",
      },
    ],
    price: "₦3,500/mo",
    subscribed: false,
  },
  {
    id: "WEB_STOREFRONT",
    name: "Web Storefront",
    description:
      "Launch a public-facing online store connected to your Bizflow inventory for walk-in and delivery orders.",
    icon: Globe,
    status: "inactive",
    category: "channels",
    serverRendered: true,
    navItems: [
      {
        label: "Storefront",
        path: "/extensions/storefront",
        icon: Globe,
        permission: "dashboard.view",
      },
    ],
    price: "₦6,000/mo",
    subscribed: false,
  },
  // ── Operations ──
  {
    id: "VTU",
    name: "VTU Platform",
    description:
      "Sell airtime, data, electricity, cable TV, and education pins from one connected platform.",
    icon: SmartphoneNfc,
    status: "inactive",
    category: "operations",
    infographic: "/vtu_infographics.png",
    serverRendered: true,
    navItems: [
      {
        label: "VTU Dashboard",
        path: "/extensions/vtu",
        icon: SmartphoneNfc,
        permission: "dashboard.view",
      },
    ],
    price: "₦5,000/mo",
    subscribed: false,
  },
  {
    id: "WALLET",
    name: "Wallet & Payments",
    description:
      "Manage your business wallet, customer balances, funding, and payment providers.",
    icon: WalletCards,
    status: "active", // Always active basic wallet
    category: "operations",
    infographic: "/wallet_infographics.png",
    serverRendered: true,
    navItems: [
      {
        label: "Wallet & Payments",
        path: "/extensions/wallet",
        icon: WalletCards,
        permission: "wallet.view",
      },
    ],
    price: "Free",
    subscribed: true,
  },
  {
    id: "PRINTING",
    name: "Printing & Print Agent",
    description:
      "Print queue management, printer health monitoring, and the Bizflow Print Agent integration.",
    icon: Printer,
    status: "inactive",
    category: "operations",
    navItems: [
      {
        label: "Printing",
        path: "/printing",
        icon: Printer,
        permission: "printing.view",
      },
      {
        label: "Print Settings",
        path: "/printing/settings",
        icon: Settings2,
        permission: "printing.settings",
      },
    ],
    price: "₦1,500/mo",
    subscribed: false,
  },
  {
    id: "COMPUTERS",
    name: "Computer Management",
    description:
      "Track workstation sessions, rental fees, and file transfers to customer PCs.",
    icon: Monitor,
    status: "inactive",
    category: "operations",
    navItems: [
      {
        label: "Computers",
        path: "/computers",
        icon: Monitor,
        permission: "computers.view",
      },
    ],
    price: "₦2,000/mo",
    subscribed: false,
  },
  {
    id: "SUPPORT_CHAT",
    name: "Support & Staff Chat",
    description:
      "Internal team messaging and customer ticket management across operations.",
    icon: MessageSquare,
    status: "inactive",
    category: "operations",
    navItems: [
      {
        label: "Support & Chat",
        path: "/support",
        icon: MessageSquare,
        permission: "support.view",
      },
    ],
    price: "Free",
    subscribed: true,
  },
  {
    id: "QR_PAYMENTS",
    name: "QR Code Payments",
    description:
      "Generate dynamic QR codes for instant NFC-free payments at point of sale.",
    icon: QrCode,
    status: "inactive",
    category: "operations",
    serverRendered: true,
    navItems: [
      {
        label: "QR Payments",
        path: "/extensions/qr-payments",
        icon: QrCode,
        permission: "dashboard.view",
      },
    ],
    price: "₦1,000/mo",
    subscribed: false,
  },
  // ── Automation ──
  {
    id: "MARKETING",
    name: "Marketing Studio",
    description:
      "Create campaigns, landing pages, forms, coupons, and WhatsApp-led customer journeys.",
    icon: Megaphone,
    status: "inactive",
    category: "automation",
    infographic: "/marketing_infographics.png",
    serverRendered: true,
    navItems: [
      {
        label: "Marketing",
        path: "/extensions/marketing",
        icon: Megaphone,
        permission: "dashboard.view",
      },
    ],
    price: "₦8,500/mo",
    subscribed: false,
  },
  {
    id: "AUTOMATIONS",
    name: "Workflow Automations",
    description:
      "Set up automated workflows triggered by transactions, stock levels, or schedules.",
    icon: Zap,
    status: "inactive",
    category: "automation",
    serverRendered: true,
    navItems: [
      {
        label: "Automations",
        path: "/extensions/automations",
        icon: Zap,
        permission: "dashboard.view",
      },
    ],
    price: "₦4,000/mo",
    subscribed: false,
  },
  {
    id: "SCHEDULED_REPORTS",
    name: "Scheduled Reports",
    description:
      "Automatically generate and deliver daily, weekly, or monthly business reports.",
    icon: CalendarClock,
    status: "inactive",
    category: "automation",
    serverRendered: true,
    navItems: [
      {
        label: "Scheduled Reports",
        path: "/extensions/reports",
        icon: CalendarClock,
        permission: "dashboard.view",
      },
    ],
    price: "₦2,000/mo",
    subscribed: false,
  },
  {
    id: "FRAUD_SHIELD",
    name: "Fraud Shield",
    description:
      "Real-time anomaly detection for transactions, flagging suspicious activity and preventing loss.",
    icon: ShieldCheck,
    status: "inactive",
    category: "automation",
    serverRendered: true,
    navItems: [
      {
        label: "Fraud Shield",
        path: "/extensions/fraud-shield",
        icon: ShieldCheck,
        permission: "dashboard.view",
      },
    ],
    price: "₦3,000/mo",
    subscribed: false,
  },
  // ── Analytics ──
  {
    id: "ADVANCED_ANALYTICS",
    name: "Advanced Analytics",
    description:
      "Deep business intelligence dashboards with trend analysis, customer insights, and revenue forecasting.",
    icon: BarChart3,
    status: "inactive",
    category: "analytics",
    serverRendered: true,
    navItems: [
      {
        label: "Analytics",
        path: "/extensions/analytics",
        icon: BarChart3,
        permission: "dashboard.view",
      },
    ],
    price: "₦7,000/mo",
    subscribed: false,
  },
];

export const extensions = writable<Extension[]>([...defaultExtensions]);
export const staffAccessMap = writable<Record<string, string[]>>({}); // extensionId -> array of userIds with access
export const installedExtensionIds = writable<string[]>([]);
export const extensionsLoaded = writable(false);

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = get(authStore).accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Sync extensions and access from the API */
export async function syncExtensions(user: AuthUser | null) {
  if (!user || typeof window === "undefined") {
    extensionsLoaded.set(true);
    return;
  }

  extensionsLoaded.set(false);

  try {
    const isOwnerOrAdmin = user.role === "OWNER" || user.role === "ADMIN";

    // Determine which endpoint to call based on role
    const endpoint = isOwnerOrAdmin ? "/extensions" : "/extensions/me";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { ...getAuthHeader() },
      signal: controller.signal,
    }).finally(() => window.clearTimeout(timeout));
    handleUnauthorized(res);

    if (res.ok) {
      const data = await res.json();

      // data format depends on endpoint.
      // If /extensions (OWNER/ADMIN): returns full list with isInstalled boolean (and staffAccess if I added it)
      // If /extensions/me (STAFF): returns only the ones installed AND accessible by staff.

      extensions.update((exts) => {
        return exts.map((baseExt) => {
          // Find matching backend info
          const backendExt = Array.isArray(data)
            ? data.find(
                (d: any) => d.extension === baseExt.id || d.id === baseExt.id,
              )
            : null;

          if (isOwnerOrAdmin) {
            // Owner/Admin sees everything. Status is 'active' if installed.
            const isInstalled = backendExt ? backendExt.isInstalled : false;

            // Staff can be populated if we want, but for now we just mark installed.
            return {
              ...baseExt,
              status:
                isInstalled || baseExt.price === "Free" ? "active" : "inactive",
              subscribed: isInstalled || baseExt.price === "Free",
            };
          } else {
            // Staff only sees what is returned by /extensions/me
            const hasAccess = !!backendExt;
            return {
              ...baseExt,
              status: hasAccess ? "active" : "inactive",
              subscribed: hasAccess,
            };
          }
        });
      });
      if (Array.isArray(data)) {
        const installed = data
          .filter((item: any) => item && item.isInstalled === true)
          .map((item: any) => item.extension)
          .filter((id: unknown): id is string => typeof id === "string");
        installedExtensionIds.set(installed);
      }
    }
  } catch (error) {
    console.error("Failed to sync extensions", error);
  } finally {
    extensionsLoaded.set(true);
  }
}

export async function syncStaffExtensionAccess() {
  if (typeof window === "undefined") return;
  const res = await fetch(`${API_BASE_URL}/extensions/access`, {
    headers: getAuthHeader(),
  });
  handleUnauthorized(res);
  if (!res.ok) throw new Error("Failed to load extension access");
  const rows = (await res.json()) as { extension: string; userId: string }[];
  const next: Record<string, string[]> = {};
  for (const row of rows)
    next[row.extension] = [...(next[row.extension] ?? []), row.userId];
  staffAccessMap.set(next);
}

export const activeExtensions = derived(extensions, ($ext) =>
  $ext.filter((e) => e.status === "active"),
);

export const extensionNavItems = derived(activeExtensions, ($active) =>
  $active.flatMap((ext) => ext.navItems ?? []),
);

/** Send install request to API */
export async function toggleExtension(id: string) {
  // If it's active, uninstall. If inactive, install.
  const ext = get(extensions).find((e) => e.id === id);
  if (!ext) return;

  const isInstalling = ext.status !== "active";

  try {
    if (isInstalling) {
      const response = await fetch(`${API_BASE_URL}/extensions/install`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ extension: id }),
      });
      handleUnauthorized(response);
      if (!response.ok) throw new Error("Failed to install extension");
    } else {
      const response = await fetch(`${API_BASE_URL}/extensions/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      handleUnauthorized(response);
      if (!response.ok) throw new Error("Failed to uninstall extension");
    }

    // Optimistic update
    extensions.update((exts) =>
      exts.map((e) =>
        e.id === id
          ? {
              ...e,
              status: isInstalling ? "active" : "inactive",
              subscribed: isInstalling,
            }
          : e,
      ),
    );
  } catch (error) {
    console.error("Failed to toggle extension", error);
    throw error;
  }
}

export async function subscribeExtension(id: string) {
  return toggleExtension(id); // For now, subscription is just an install action
}

export function getDaysRemaining(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function connectExtension(
  id: string,
  data: Record<string, unknown> = {},
) {
  extensions.update((exts) =>
    exts.map((e) => {
      if (e.id === id) {
        return { ...e, connected: true, connectionData: data };
      }
      return e;
    }),
  );
}

export function disconnectExtension(id: string) {
  extensions.update((exts) =>
    exts.map((e) => {
      if (e.id === id) {
        return { ...e, connected: false, connectionData: undefined };
      }
      return e;
    }),
  );
}

/** Grant a staff member access to an installed extension (OWNER/ADMIN only) */
export async function grantStaffExtensionAccess(
  extensionId: string,
  userId: string,
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/extensions/${extensionId}/access/${userId}`,
      {
        method: "POST",
        headers: { ...getAuthHeader() },
      },
    );
    handleUnauthorized(response);
    if (!response.ok) throw new Error("Failed to grant extension access");
    staffAccessMap.update((map) => ({
      ...map,
      [extensionId]: Array.from(new Set([...(map[extensionId] ?? []), userId])),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Revoke a staff member access to an installed extension (OWNER/ADMIN only) */
export async function revokeStaffExtensionAccess(
  extensionId: string,
  userId: string,
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/extensions/${extensionId}/access/${userId}`,
      {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      },
    );
    handleUnauthorized(response);
    if (!response.ok) throw new Error("Failed to revoke extension access");
    staffAccessMap.update((map) => ({
      ...map,
      [extensionId]: (map[extensionId] ?? []).filter((id) => id !== userId),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
