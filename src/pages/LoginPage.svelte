<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    Moon,
    SunMedium,
    Sparkles,
    ArrowRight,
    ArrowLeft,
  } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import { signIn } from "$lib/stores/auth";
  import { Motion } from "svelte-motion";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import BetaPill from "$lib/components/ui/beta-pill.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { toast } from "svelte-sonner";

  const featureTags = [
    "Live orders",
    "Inventory",
    "Cash flow",
    "Staff planning",
    "Sales insights",
  ];

  const demoPassword = "SecurePass1!";
  const demoEmail = "owner@acme.test";
  let email = import.meta.env.DEV ? demoEmail : "";
  let password = import.meta.env.DEV ? demoPassword : "";
  let loading = false;

  async function handleSubmit() {
    loading = true;

    try {
      await signIn({ email, password });
      goto("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";
      toast.error("Sign in failed", {
        description: message,
      });
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="relative min-h-screen overflow-hidden bg-background bg-grid text-foreground"
>
  <div class="hero-ambient" aria-hidden="true">
    <span class="hero-orb hero-orb-1 opacity-50"></span>
  </div>
  <div class="login-mascot-glow" aria-hidden="true"></div>
  <img src="login-bizzy.png" alt="" aria-hidden="true" class="login-mascot" />
  <a
    href="/"
    class="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md transition hover:bg-muted hover:text-foreground"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>
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
      class="grid w-full overflow-hidden rounded-2xl glow-panel lg:grid-cols-2 relative z-10"
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
            <div class="flex items-center gap-2">
              <p
                class="font-heading text-[1.6rem] font-black tracking-[-0.06em] text-foreground"
              >
                Bizflow
              </p>
              <BetaPill class="-translate-y-px" />
            </div>
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
              class="max-w-md font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
            >
              Run your <span class="text-primary">Business</span> with clarity.
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
            <div class="flex items-center gap-2">
              <p
                class="font-heading text-[1.45rem] font-black tracking-[-0.06em] text-foreground"
              >
                Bizflow
              </p>
              <BetaPill class="hidden sm:inline-flex" />
            </div>
          </div>

          <div class="mb-6 space-y-2">
            <p
              class="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            >
              Manager portal
            </p>
            <h2
              class="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Sign in
            </h2>
          </div>

          <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
            <div class="space-y-2">
              <Label for="email">Email address</Label>
              <Input
                id="email"
                bind:value={email}
                type="email"
                autocomplete="email"
                placeholder="manager@cafe.io"
              />
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="password">Password</Label>
                <a
                  href="/login"
                  class="text-xs font-medium text-foreground/70 transition hover:text-foreground"
                  >Forgot?</a
                >
              </div>
              <PasswordInput
                id="password"
                bind:value={password}
                autocomplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} class="mt-2 w-full py-3">
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight
                class="size-4 transition-transform duration-200 group-hover/button:translate-x-1"
              />
            </Button>
          </form>

          <div class="mt-6 flex flex-col gap-3">
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <span class="h-px flex-1 bg-border"></span><span
                >or continue with</span
              ><span class="h-px flex-1 bg-border"></span>
            </div>
            <Button
              variant="outline"
              class="w-full sm:justify-center"
              onclick={() => {}}>Continue with Google</Button
            >
            <Button
              variant="outline"
              class="w-full sm:justify-center"
              onclick={() => {}}>Continue with Apple</Button
            >
          </div>

          {#if import.meta.env.DEV}
            <div class="mt-6 surface-muted p-4 text-xs text-muted-foreground">
              <p class="mb-2 font-semibold text-foreground">Demo access</p>
              <div class="space-y-1 font-mono">
                <p>{demoEmail}</p>
                <p>{demoPassword}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
