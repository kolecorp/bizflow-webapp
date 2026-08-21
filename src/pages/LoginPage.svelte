<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    Moon,
    SunMedium,
    BarChart3,
    Sparkles,
    ArrowRight,
  } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import { signIn } from "$lib/stores/auth";
  import { Motion } from "svelte-motion";

  const featureTags = [
    "Live orders",
    "Inventory",
    "Cash flow",
    "Staff planning",
    "Sales insights",
  ];

  let email = "manager@cafe.io";
  let password = "password123";
  let loading = false;

  async function handleSubmit() {
    loading = true;

    try {
      await signIn({ email, password });
      goto("/dashboard");
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="relative min-h-screen overflow-hidden bg-background text-foreground"
>
  <button
    type="button"
    aria-label="Toggle theme"
    on:click={toggleMode}
    class="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-md transition hover:bg-muted"
  >
    {#if mode.current === "dark"}
      <SunMedium class="h-4 w-4" />
    {:else}
      <Moon class="h-4 w-4" />
    {/if}
  </button>

  <div
    class="mx-auto flex min-h-screen w-full max-w-[75%] items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
  >
    <div
      class="grid w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_24px_80px_rgba(0,82,204,0.12)] lg:grid-cols-2"
    >
      <div
        class="flex flex-col justify-between border-b border-border/60 bg-muted/40 p-6 sm:p-8 lg:border-b-0 lg:border-r w-full"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"
          >
            <img
              src="/cafe-logo.png"
              alt="Bizflow logo"
              class="h-14 w-14 object-contain"
            />
          </div>
          <div class="leading-none">
            <p
              class="font-heading text-[1.6rem] font-black tracking-[-0.06em] text-foreground"
            >
              Bizflow
            </p>
            <p
              class="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              Operations
            </p>
          </div>
        </div>

        <div class="space-y-7 py-10">
          <div class="space-y-4">
            <p
              class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
            >
              Designed for service
            </p>
            <h1
              class="max-w-md font-heading text-4xl font-black leading-tight tracking-tighter text-foreground sm:text-5xl"
            >
              Run your <span class="text-blue-600">Business</span> with clarity.
            </h1>
            <p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Smarter operations, better service, and a clearer view of the day.
            </p>
          </div>

          <div class="overflow-hidden">
            <Motion
              let:motion
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            >
              <div
                use:motion
                class="flex w-max items-center gap-2 text-sm text-muted-foreground"
              >
                {#each [...featureTags, ...featureTags] as tag}
                  <span
                    class="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5"
                  >
                    <Sparkles class="h-3.5 w-3.5 text-foreground" />
                    {tag}
                  </span>
                {/each}
              </div>
            </Motion>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-center bg-background px-5 py-8 sm:px-8 lg:px-10"
      >
        <div class="w-full">
          <div class="mb-8 flex items-center gap-3 lg:hidden">
            <div
              class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
            >
              <img
                src="/cafe-logo.png"
                alt="Bizflow logo"
                class="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <p
                class="font-heading text-[1.45rem] font-black tracking-[-0.06em] text-foreground"
              >
                Bizflow
              </p>
            </div>
          </div>

          <div class="mb-6 space-y-2">
            <p
              class="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            >
              Manager portal
            </p>
            <h2
              class="font-heading text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl"
            >
              Sign in
            </h2>
          </div>

          <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-foreground"
                >Email address</label
              >
              <input
                id="email"
                bind:value={email}
                type="email"
                autocomplete="email"
                class="w-full rounded-lg border border-input bg-background px-3.5 py-2.75 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="manager@cafe.io"
              />
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="text-sm font-medium text-foreground">Password</label
                >
                <a
                  href="/login"
                  class="text-xs font-medium text-foreground/70 transition hover:text-foreground"
                  >Forgot?</a
                >
              </div>
              <input
                id="password"
                bind:value={password}
                type="password"
                autocomplete="current-password"
                class="w-full rounded-lg border border-input bg-background px-3.5 py-2.75 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              class="btn-app-primary mt-2 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div
            class="mt-6 surface-muted p-4 text-xs text-muted-foreground"
          >
            <p class="mb-2 font-semibold text-foreground">Demo access</p>
            <div class="space-y-1 font-mono">
              <p>manager@cafe.io</p>
              <p>password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
