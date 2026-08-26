<script lang="ts">
  import { goto } from "$app/navigation";
  import { Moon, SunMedium } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button";

  let { active = "" }: { active?: string } = $props();

  function handleGetStarted() {
    goto("/register");
  }

  function navigate(path: string) {
    goto(path);
  }

  const navLinks = [
    { label: "Features", path: "/features" },
    { label: "Solutions", path: "/solutions" },
  ];
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
>
  <div
    class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8"
  >
    <button
      type="button"
      onclick={() => navigate("/")}
      class="flex items-center gap-1 transition hover:opacity-80"
    >
       <img
          src="/cafe-logo.png"
          alt="Bizflow logo"
          class="h-14 w-14 object-contain"
        />
      <span class="font-heading text-xl font-black tracking-[-0.04em] text-foreground"
        >Bizflow</span
      >
    </button>

    <div class="hidden items-center gap-8 md:flex">
      {#each navLinks as link}
        <button
          type="button"
          onclick={() => navigate(link.path)}
          class="text-sm font-medium transition {active === link.path
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          {link.label}
        </button>
      {/each}
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        aria-label="Toggle theme"
        onclick={toggleMode}
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted"
      >
        {#if mode.current === "dark"}
          <SunMedium class="h-4 w-4" />
        {:else}
          <Moon class="h-4 w-4" />
        {/if}
      </button>
      <button
        type="button"
        onclick={() => goto("/login")}
        class="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
      >
        Sign in
      </button>
      <Button onclick={handleGetStarted} size="sm" class="h-9 px-4">
        Get Started
      </Button>
    </div>
  </div>
</nav>
