<script lang="ts">
  import {
    Moon,
    SunMedium,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Settings,
  } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import NotificationBell from "./NotificationBell.svelte";
  import { modals } from "$lib/stores/modals";

  import { authStore } from "$lib/stores/auth";

  let {
    title = "Admin",
    subtitle = "Operations Studio",
    onLogout,
    onToggleSidebar,
    sidebarOpen = true,
  }: {
    title?: string;
    subtitle?: string;
    onLogout?: (() => void) | undefined;
    onToggleSidebar?: (() => void) | undefined;
    sidebarOpen?: boolean;
  } = $props();

  const isDarkMode = () => mode.current === "dark";
  let selectedBusiness = $derived(
    $authStore.user?.business?.name ?? "Bizflow Workspace",
  );
  let selectedRole = $derived($authStore.user?.role ?? "STAFF");
</script>

<header class="app-header sticky top-0 z-20 bg-background/78 backdrop-blur-xl">
  <div
    class="mx-auto flex min-h-12.5 w-full max-w-375 items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8"
  >
    <div class="flex min-w-0 items-center gap-3">
      {#if onToggleSidebar}
        <button
          type="button"
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          onclick={onToggleSidebar}
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
        >
          {#if sidebarOpen}
            <PanelLeftClose class="h-4 w-4" />
          {:else}
            <PanelLeft class="h-4 w-4" />
          {/if}
        </button>
      {/if}

      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
      >
        <img
          src="/business-icon.png"
          alt="Business logo"
          class="h-7 w-7 object-contain"
        />
      </div>
      <div class="relative">
        <div class="flex min-w-0 items-center gap-2 px-2 py-1.5 text-left">
          <span class="min-w-0 leading-none"
            ><span class="block truncate text-sm font-semibold text-foreground"
              >{selectedBusiness}</span
            ><span
              class="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >{selectedRole}</span
            ></span
          >
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <NotificationBell />

      <button
        type="button"
        onclick={() => modals.openSettings()}
        aria-label="Open settings"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
        ><Settings class="h-4 w-4" /></button
      >

      <button
        type="button"
        aria-label="Toggle theme"
        onclick={toggleMode}
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
      >
        {#if isDarkMode()}
          <SunMedium class="h-4 w-4" />
        {:else}
          <Moon class="h-4 w-4" />
        {/if}
      </button>

      {#if onLogout}
        <button
          type="button"
          onclick={onLogout}
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <LogOut class="h-3.5 w-3.5" />
          Sign out
        </button>
      {/if}
    </div>
  </div>
</header>
