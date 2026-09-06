<script lang="ts">
  import {
    Moon,
    SunMedium,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    ChevronDown,
    Settings,
    Check,
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
  let businessMenuOpen = $state(false);
  let selectedBusiness = $derived($authStore.user?.business?.name ?? "Bizflow Workspace");
  let selectedRole = $derived($authStore.user?.role ?? "STAFF");
  
  let businesses = $derived(
    $authStore.user?.business
      ? [{ name: $authStore.user.business.name, detail: "Main workspace" }]
      : []
  );
  
  const roles = ["OWNER", "ADMIN", "STAFF"];

  function handleWindowKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") businessMenuOpen = false;
  }

  $effect(() => {
    window.addEventListener("keydown", handleWindowKeydown);
    return () => window.removeEventListener("keydown", handleWindowKeydown);
  });
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
        <button
          type="button"
          onclick={() => (businessMenuOpen = !businessMenuOpen)}
          class="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-muted"
          aria-label="Switch business"
          ><span class="min-w-0 leading-none"
            ><span class="block truncate text-sm font-semibold text-foreground"
              >{selectedBusiness}</span
            ><span
              class="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >{selectedRole}</span
            ></span
          ><ChevronDown
            class={`h-4 w-4 shrink-0 text-muted-foreground transition ${businessMenuOpen ? "rotate-180" : ""}`}
          /></button
        >
        {#if businessMenuOpen}
          <div
            class="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
          >
            <p
              class="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Switch business
            </p>
            {#each businesses as business}
              <button
                type="button"
                onclick={() => {
                  // selectedBusiness = business.name;
                  businessMenuOpen = false;
                }}
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
              >
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
                  >{business.name.slice(0, 1)}</span
                >
                <span class="min-w-0 flex-1"
                  ><span class="block truncate text-sm font-medium"
                    >{business.name}</span
                  ><span class="block truncate text-xs text-muted-foreground"
                    >{business.detail}</span
                  ></span
                >
                {#if selectedBusiness === business.name}<Check
                    class="h-4 w-4 text-primary"
                  />{/if}
              </button>
            {/each}
            <div class="my-2 border-t border-border/60"></div>
            <p
              class="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Switch role
            </p>
            {#each roles as role}
              <button
                type="button"
                onclick={() => {
                  // selectedRole = role;
                  businessMenuOpen = false;
                }}
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                ><span>{role}</span>{#if selectedRole === role}<Check
                    class="h-4 w-4 text-primary"
                  />{/if}</button
              >
            {/each}
          </div>
        {/if}
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
