<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore, signOut } from "$lib/stores/auth";
  import { canAccess, hasPermission } from "$lib/stores/permissions";
  import type { Permission } from "$lib/stores/permissions";
  import { appNavItems, isNavActive } from "$lib/config/navigation";
  import { activeExtensions } from "$lib/stores/extensions";
  import {
    Puzzle,
    UserRound,
    Settings,
    LogOut,
    ChevronsUpDown,
    HelpCircle,
    Bell,
    X,
  } from "@lucide/svelte";
  import { sidebar } from "$lib/stores/sidebar";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import BetaPill from "$lib/components/ui/beta-pill.svelte";

  let { activePath = "" }: { activePath?: string } = $props();

  let userRole = $derived($authStore.user?.role ?? "staff");
  let userName = $derived($authStore.user?.name ?? "Workspace user");
  let userEmail = $derived($authStore.user?.email ?? "Not signed in");
  let userInitials = $derived(
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
  );

  // Build core sections
  let coreSections = $derived.by(() => {
    const map = new Map<string, typeof appNavItems>();
    for (const item of appNavItems) {
      const section = item.section ?? "General";
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(item);
    }
    return map;
  });

  // Build extension nav items from active extensions
  let extensionItems = $derived.by(() => {
    return $activeExtensions.flatMap((ext) =>
      (ext.navItems ?? []).map((nav) => ({
        ...nav,
        extensionName: ext.name,
      })),
    );
  });

  let visibleExtensionItems = $derived(
    extensionItems.filter((item) =>
      hasPermission(item.permission as Permission),
    ),
  );

  function navigate(path: string) {
    goto(path);
  }
</script>

<aside class="app-sidebar flex h-screen min-h-144 flex-col">
  <NoiseOverlay intensity="light" />
  <div class="app-sidebar__glow" aria-hidden="true"></div>
  <div
    class="app-sidebar__brand relative z-10 flex items-center gap-3 p-5 shrink-0"
  >
    <div
      class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
    >
      <img
        src="/cafe-logo.png"
        alt="Bizflow logo"
        class="h-8 w-8 object-contain"
      />
    </div>
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <p
          class="font-heading text-lg font-extrabold tracking-tight text-foreground"
        >
          Bizflow
        </p>
        <BetaPill class="hidden sm:inline-flex" />
      </div>
      <p
        class="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Operations workspace
      </p>
    </div>
    <button
      type="button"
      class="app-sidebar__close ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground"
      aria-label="Close sidebar"
      onclick={() => sidebar.close()}
    >
      <X class="h-4 w-4" />
    </button>
  </div>

  <div
    class="relative z-10 flex-1 space-y-6 overflow-y-auto p-4 custom-scrollbar"
  >
    <!-- Core sections -->
    {#each [...coreSections.entries()] as [section, items]}
      {@const visibleItems = items.filter((item) =>
        canAccess(userRole, item.permission),
      )}
      {#if visibleItems.length > 0}
        <div class="app-sidebar__section">
          <div
            class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {section}
          </div>
          <div class="space-y-0.5">
            {#each visibleItems as item}
              <button
                type="button"
                onclick={() => navigate(item.path)}
                class={`app-sidebar__item flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  isNavActive(item.path, activePath)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <span class="flex items-center gap-3 min-w-0">
                  <item.icon class="h-4 w-4 shrink-0" />
                  <span class="truncate">{item.label}</span>
                </span>
                {#if item.badge}
                  <span
                    class="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                  >
                    {item.badge}
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    {/each}

    <!-- Extension items -->
    {#if visibleExtensionItems.length > 0}
      <div class="app-sidebar__section">
        <div
          class="mb-2 flex items-center gap-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          <Puzzle class="h-3 w-3" />
          Extensions
        </div>
        <div class="space-y-0.5">
          {#each visibleExtensionItems as item}
            <button
              type="button"
              onclick={() => navigate(item.path)}
              class={`app-sidebar__item flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isNavActive(item.path, activePath)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <span class="flex items-center gap-3 min-w-0">
                <item.icon class="h-4 w-4 shrink-0" />
                <span class="truncate">{item.label}</span>
              </span>
              {#if item.badge}
                <span
                  class="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold text-primary"
                >
                  {item.badge}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="relative z-10 shrink-0 border-t border-border/60 p-3">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
        >
          {#if userInitials}{userInitials}{:else}<UserRound
              class="h-4 w-4"
            />{/if}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-foreground">
            {userName}
          </p>
          <p class="truncate text-[11px] text-muted-foreground">{userEmail}</p>
        </div>
        <ChevronsUpDown class="h-4 w-4 shrink-0 text-muted-foreground" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="right"
        align="end"
        sideOffset={12}
        class="w-64 rounded-xl p-1.5"
      >
        <div class="px-3 py-2.5">
          <p class="text-sm font-semibold text-foreground">{userName}</p>
          <p class="text-xs text-muted-foreground">{userEmail}</p>
          <span
            class="mt-1.5 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary"
            >{userRole}</span
          >
        </div>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item
            class="gap-2.5 rounded-lg py-2"
            onclick={() => navigate("/settings")}
          >
            <Settings class="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="gap-2.5 rounded-lg py-2"
            onclick={() => navigate("/notifications")}
          >
            <Bell class="h-4 w-4 text-muted-foreground" />
            Notifications
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="gap-2.5 rounded-lg py-2"
            onclick={() => navigate("/support")}
          >
            <HelpCircle class="h-4 w-4 text-muted-foreground" />
            Help & Support
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          class="gap-2.5 rounded-lg py-2 text-destructive focus:text-destructive"
          onclick={() => {
            signOut();
            navigate("/login");
          }}
        >
          <LogOut class="h-4 w-4" />
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</aside>
