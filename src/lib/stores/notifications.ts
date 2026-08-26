import { derived, writable } from "svelte/store";
import { toast } from "svelte-sonner";
import type {
  AppNotification,
  NotificationCategory,
  NotificationKind,
} from "$lib/types/communications";

const nowIso = () => new Date().toISOString();

const seedNotifications: AppNotification[] = [];

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
