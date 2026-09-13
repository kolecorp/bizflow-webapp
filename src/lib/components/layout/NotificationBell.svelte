<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    notificationItems,
    notificationUnreadCount,
    markRead,
    markAllRead,
  } from "$lib/stores/notifications";
  import {
    Bell,
    CheckCheck,
    FileUp,
    MessageSquare,
    Ticket,
  } from "@lucide/svelte";
  import type { NotificationCategory } from "$lib/types/communications";

  let open = false;

  function togglePanel() {
    open = !open;
  }

  function closePanel() {
    open = false;
  }

  function categoryIcon(category: NotificationCategory) {
    switch (category) {
      case "file_transfer":
        return FileUp;
      case "chat":
        return MessageSquare;
      case "ticket":
        return Ticket;
      default:
        return Bell;
    }
  }

  function handleOpen(notification: (typeof $notificationItems)[number]) {
    markRead(notification.id);
    closePanel();
    if (notification.href) {
      goto(notification.href);
    }
  }

  function handleMarkAllRead() {
    markAllRead();
  }
</script>

<svelte:window on:click={closePanel} />

<div class="relative">
  <button
    type="button"
    aria-label="Notifications"
    onclick={(event) => {
      event.stopPropagation();
      togglePanel();
    }}
    class="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
  >
    <Bell class="h-4 w-4" />
    {#if $notificationUnreadCount > 0}
      <span
        class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
      >
        {$notificationUnreadCount > 9 ? "9+" : $notificationUnreadCount}
      </span>
    {/if}
  </button>

  {#if open}
    <div
      class="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
    >
      <div
        class="flex items-center justify-between border-b border-border px-4 py-3"
      >
        <p class="text-sm font-semibold text-foreground">Notifications</p>
        {#if $notificationUnreadCount > 0}
          <button
            type="button"
            onclick={handleMarkAllRead}
            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <CheckCheck class="h-3.5 w-3.5" />
            Mark all read
          </button>
        {/if}
      </div>

      <div class="max-h-80 overflow-y-auto">
        {#if $notificationItems.length === 0}
          <p class="px-4 py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </p>
        {:else}
          {#each $notificationItems as notification (notification.id)}
            {@const Icon = categoryIcon(notification.category)}
            <button
              type="button"
              onclick={() => handleOpen(notification)}
              class={`flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition hover:bg-muted/60 ${
                notification.read ? "opacity-70" : "bg-primary/5"
              }`}
            >
              <div
                class={`mt-0.5 rounded-lg p-1.5 ${
                  notification.kind === "success"
                    ? "bg-green-500/10 text-green-600"
                    : notification.kind === "error"
                      ? "bg-red-500/10 text-red-600"
                      : notification.kind === "warning"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-primary/10 text-primary"
                }`}
              >
                <Icon class="h-3.5 w-3.5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-foreground">
                  {notification.title}
                </p>
                <p class="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
              </div>
              {#if !notification.read}
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                ></span>
              {/if}
            </button>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>
