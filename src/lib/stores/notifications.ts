import { derived, writable } from "svelte/store";
import { toast } from "svelte-sonner";
import type {
  AppNotification,
  NotificationCategory,
  NotificationKind,
} from "$lib/types/communications";

const nowIso = () => new Date().toISOString();

const seedNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "File transfer ready",
    message: "PC-03 (Training Room) accepted incoming files from staff.",
    kind: "success",
    category: "file_transfer",
    read: false,
    createdAt: nowIso(),
    href: "/computers",
  },
  {
    id: "notif-2",
    title: "New support ticket",
    message: "TKT-1042 — Customer cannot open saved document on PC-01.",
    kind: "warning",
    category: "ticket",
    read: false,
    createdAt: nowIso(),
    href: "/support",
  },
  {
    id: "notif-3",
    title: "Staff message",
    message: "Grace: Please check toner on Canon before the training session.",
    kind: "info",
    category: "chat",
    read: true,
    createdAt: nowIso(),
    href: "/support",
  },
];

function createNotificationStore() {
  const items = writable<AppNotification[]>(seedNotifications);

  const unreadCount = derived(items, ($items) =>
    $items.filter((n) => !n.read).length,
  );

  function push(input: {
    title: string;
    message: string;
    kind?: NotificationKind;
    category?: NotificationCategory;
    href?: string;
    toast?: boolean;
  }) {
    const notification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: input.title,
      message: input.message,
      kind: input.kind ?? "info",
      category: input.category ?? "system",
      read: false,
      createdAt: nowIso(),
      href: input.href,
    };

    items.update((list) => [notification, ...list]);

    if (input.toast !== false) {
      const toastFn =
        notification.kind === "success"
          ? toast.success
          : notification.kind === "error"
            ? toast.error
            : notification.kind === "warning"
              ? toast.warning
              : toast.info;
      toastFn(notification.title, { description: notification.message });
    }

    return notification;
  }

  function markRead(id: string) {
    items.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    items.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  function remove(id: string) {
    items.update((list) => list.filter((n) => n.id !== id));
  }

  return {
    items,
    unreadCount,
    push,
    markRead,
    markAllRead,
    remove,
  };
}

const _notifications = createNotificationStore();

export const notifications = _notifications;
export const notificationItems = _notifications.items;
export const notificationUnreadCount = _notifications.unreadCount;
export const { push: pushNotification, markRead, markAllRead, remove } = _notifications;
