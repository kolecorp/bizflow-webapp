import { writable, derived, get } from "svelte/store";
import { browser } from "$app/environment";
import type { Component } from "svelte";
import {
  Printer,
  Monitor,
  MessageCircle,
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
} from "@lucide/svelte";

export type ExtensionStatus = "active" | "inactive" | "coming-soon";

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: Component<{ class?: string }>;
  status: ExtensionStatus;
  category: "channels" | "operations" | "automation";
  /** Whether the extension has completed its onboarding/setup flow */
  connected?: boolean;
  /** Arbitrary configuration data stored after onboarding completes */
  connectionData?: Record<string, unknown>;
  navItems?: {
    label: string;
    path: string;
    icon: Component<{ class?: string }>;
    permission: string;
    badge?: string;
  }[];
  /** When true, the extension page is server-rendered and loaded on activation */
  serverRendered?: boolean;
}

const defaultExtensions: Extension[] = [
  {
    id: "whatsapp-business",
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
        permission: "extensions.whatsapp",
      },
    ],
  },
  {
    id: "whatsapp-customers",
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
        permission: "extensions.whatsapp-customers",
      },
    ],
  },
  {
    id: "vtu",
    name: "VTU Platform",
    description: "Sell airtime, data, electricity, cable TV, and education pins from one connected platform.",
    icon: SmartphoneNfc,
    status: "inactive",
    category: "operations",
    serverRendered: true,
    navItems: [
      { label: "VTU Dashboard", path: "/extensions/vtu", icon: SmartphoneNfc, permission: "dashboard.view" },
      { label: "VTU Rules & Pricing", path: "/extensions/vtu/pricing", icon: Settings2, permission: "dashboard.view" },
    ],
  },
  {
    id: "wallet",
    name: "Wallet & Payments",
    description: "Manage your business wallet, customer balances, funding, and payment providers.",
    icon: WalletCards,
    status: "inactive",
    category: "operations",
    serverRendered: true,
    navItems: [{ label: "Wallet & Payments", path: "/extensions/wallet", icon: WalletCards, permission: "dashboard.view" }],
  },
  {
    id: "marketing",
    name: "Marketing Studio",
    description: "Create campaigns, landing pages, forms, coupons, and WhatsApp-led customer journeys.",
    icon: Megaphone,
    status: "inactive",
    category: "automation",
    serverRendered: true,
    navItems: [
      { label: "Marketing", path: "/extensions/marketing", icon: Megaphone, permission: "dashboard.view" },
      { label: "Landing Page Builder", path: "/extensions/marketing/builder", icon: LayoutTemplate, permission: "dashboard.view" },
      { label: "Forms & Lead Actions", path: "/extensions/marketing/forms", icon: ListChecks, permission: "dashboard.view" },
    ],
  },
  {
    id: "printing",
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
  },
  {
    id: "computers",
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
  },
  {
    id: "support-chat",
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
  },
  {
    id: "automations",
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
        permission: "extensions.automations",
      },
    ],
  },
  {
    id: "sms",
    name: "SMS Notifications",
    description:
      "Send transaction confirmations and alerts to customers and staff via SMS.",
    icon: Mail,
    status: "coming-soon",
    category: "channels",
    serverRendered: true,
  },
  {
    id: "ussd",
    name: "USSD Access",
    description:
      "Allow staff to log transactions and check balances via USSD codes on any phone.",
    icon: Hash,
    status: "coming-soon",
    category: "channels",
    serverRendered: true,
  },
];

const extensionStorageKey = "bizflow.extensions";

function getInitialExtensions() {
  if (!browser) return defaultExtensions;

  try {
    const saved = JSON.parse(localStorage.getItem(extensionStorageKey) ?? "{}") as Record<string, Partial<Extension>>;
    return defaultExtensions.map((extension) => ({
      ...extension,
      ...(saved[extension.id] ?? {}),
      icon: extension.icon,
      navItems: extension.navItems,
    }));
  } catch {
    return defaultExtensions;
  }
}

export const extensions = writable<Extension[]>(getInitialExtensions());

if (browser) {
  extensions.subscribe((currentExtensions) => {
    const persisted = Object.fromEntries(
      currentExtensions.map((extension) => [extension.id, {
        status: extension.status,
        connected: extension.connected,
        connectionData: extension.connectionData,
      }]),
    );
    localStorage.setItem(extensionStorageKey, JSON.stringify(persisted));
  });
}

export const activeExtensions = derived(extensions, ($ext) =>
  $ext.filter((e) => e.status === "active")
);

export const extensionNavItems = derived(activeExtensions, ($active) =>
  $active.flatMap((ext) => ext.navItems ?? [])
);

export function toggleExtension(id: string) {
  extensions.update((exts) =>
    exts.map((e) => {
      if (e.id === id && e.status !== "coming-soon") {
        return { ...e, status: e.status === "active" ? "inactive" : "active" } as Extension;
      }
      return e;
    })
  );
}

/** Mark an extension as connected with its configuration data */
export function connectExtension(id: string, data: Record<string, unknown> = {}) {
  extensions.update((exts) =>
    exts.map((e) => {
      if (e.id === id) {
        return { ...e, connected: true, connectionData: data };
      }
      return e;
    })
  );
}

/** Disconnect an extension, clearing its configuration data */
export function disconnectExtension(id: string) {
  extensions.update((exts) =>
    exts.map((e) => {
      if (e.id === id) {
        return { ...e, connected: false, connectionData: undefined };
      }
      return e;
    })
  );
}

/** Get a single extension by its ID */
export function getExtension(id: string): Extension | undefined {
  return get(extensions).find((e) => e.id === id);
}

