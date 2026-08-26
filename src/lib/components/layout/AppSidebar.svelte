<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import { canAccess } from "$lib/stores/permissions";
  import { appNavItems, isNavActive } from "$lib/config/navigation";
  import { activeExtensions } from "$lib/stores/extensions";
  import { Lock, Puzzle, UserRound } from "@lucide/svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";

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

  function navigate(path: string) {
    goto(path);
  }
</script>

<aside class="app-sidebar flex h-[calc(100vh-50px)] min-h-144 flex-col">
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
      <p
        class="font-heading text-lg font-extrabold tracking-tight text-foreground"
      >
        Bizflow
      </p>
      <p
        class="truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
      >
        Operations workspace
      </p>
    </div>
  </div>

  <div
    class="relative z-10 flex-1 space-y-6 overflow-y-auto p-4 custom-scrollbar"
  >
    <!-- Core sections -->
    {#each [...coreSections.entries()] as [section, items]}
      <div class="app-sidebar__section">
        <div
          class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          {section}
        </div>
        <div class="space-y-0.5">
          {#each items as item}
            {@const allowed = canAccess(userRole, item.permission)}
            <button
              type="button"
              disabled={!allowed}
              onclick={() => allowed && navigate(item.path)}
              class={`app-sidebar__item flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isNavActive(item.path, activePath)
                  ? "bg-primary/10 text-primary"
                  : allowed
                    ? "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    : "text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              <span class="flex items-center gap-3 min-w-0">
                {#if !allowed}
                  <Lock class="h-4 w-4 shrink-0" />
                {:else}
                  <item.icon class="h-4 w-4 shrink-0" />
                {/if}
                <span class="truncate">{item.label}</span>
              </span>
              {#if item.badge && allowed}
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
    {/each}

    <!-- Extension items -->
    {#if extensionItems.length > 0}
      <div class="app-sidebar__section">
        <div
          class="mb-2 flex items-center gap-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          <Puzzle class="h-3 w-3" />
          Extensions
        </div>
        <div class="space-y-0.5">
          {#each extensionItems as item}
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

  <div class="relative z-10 shrink-0 border-t border-border/60 p-4">
    <div
      class="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3"
    >
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
      >
        {#if userInitials}{userInitials}{:else}<UserRound
            class="h-4 w-4"
          />{/if}
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-foreground">{userName}</p>
        <p class="truncate text-xs text-muted-foreground">{userRole}</p>
        <p class="truncate text-[10px] text-muted-foreground/80">{userEmail}</p>
      </div>
    </div>
  </div>
</aside>
