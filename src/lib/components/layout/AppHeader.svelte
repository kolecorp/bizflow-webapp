<script lang="ts">
  import { Moon, SunMedium, LogOut, PanelLeftClose, PanelLeft } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import NotificationBell from "./NotificationBell.svelte";

  export let title = "Admin";
  export let subtitle = "Operations Studio";
  export let onLogout: (() => void) | undefined = undefined;
  export let onToggleSidebar: (() => void) | undefined = undefined;
  export let sidebarOpen = true;

  const isDarkMode = () => mode.current === "dark";
</script>

<header
  class="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl"
>
  <div
    class="mx-auto flex min-h-[50px] w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8"
  >
    <div class="flex min-w-0 items-center gap-3">
      {#if onToggleSidebar}
        <button
          type="button"
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          on:click={onToggleSidebar}
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
        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"
      >
        <img
          src="/cafe-logo.png"
          alt="Bizflow logo"
          class="h-7 w-7 object-contain"
        />
      </div>

      <div class="min-w-0 leading-none">
        <p
          class="truncate text-base font-semibold tracking-[-0.04em] text-foreground"
        >
          {title}
        </p>
        <p
          class="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          {subtitle}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <NotificationBell />

      <button
        type="button"
        aria-label="Toggle theme"
        on:click={toggleMode}
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
          on:click={onLogout}
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <LogOut class="h-3.5 w-3.5" />
          Sign out
        </button>
      {/if}
    </div>
  </div>
</header>
