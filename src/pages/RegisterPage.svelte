<script lang="ts">
  import { goto } from "$app/navigation";
  import { ArrowLeft, ArrowRight, Moon, SunMedium } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import { signUp } from "$lib/stores/auth";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import BetaPill from "$lib/components/ui/beta-pill.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { toast } from "svelte-sonner";

  let name = "";
  let email = "";
  let password = "";
  let loading = false;

  async function handleSubmit() {
    loading = true;
    try {
      const authState = await signUp({ name, email, password });
      goto("/onboarding");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account.";
      toast.error("Registration failed", {
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
  <div class="register-mascot-glow" aria-hidden="true"></div>
  <img
    src="/register-bizzy.png"
    alt="Bizzy mascot presenting the registration form"
    class="register-mascot"
  />
  <a
    href="/"
    class="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md transition hover:bg-muted hover:text-foreground"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to home
  </a>
  <Button
    variant="outline"
    size="icon"
    aria-label="Toggle theme"
    onclick={toggleMode}
    class="absolute right-4 top-4 z-20 bg-background/80 backdrop-blur-md"
  >
    {#if mode.current === "dark"}
      <SunMedium class="h-4 w-4" />
    {:else}
      <Moon class="h-4 w-4" />
    {/if}
  </Button>

  <div
    class="mx-auto flex min-h-screen w-full max-w-[75%] items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
  >
    <div
      class="relative z-10 grid w-full overflow-hidden rounded-2xl glow-panel lg:grid-cols-2"
    >
      <div
        class="register-copy relative z-30 flex w-full flex-col justify-between border-b border-border/60 bg-muted/40 p-6 sm:p-8 lg:border-b-0 lg:border-r"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
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

        <div class="max-w-sm space-y-4 py-10">
          <p
            class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground"
          >
            Start with clarity
          </p>
          <h1
            class="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
          >
            Build your business <span class="text-primary">workspace.</span>
          </h1>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Create your owner access, then tell us how your business works.
          </p>
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
              Owner portal
            </p>
            <h2
              class="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Create account
            </h2>
            <p class="text-sm text-muted-foreground">
              Already have access? <a
                href="/login"
                class="font-semibold text-primary hover:underline">Sign in</a
              >
            </p>
          </div>

          <form
            class="space-y-5"
            onsubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div class="space-y-2">
              <Label for="register-name">Your name</Label><Input
                id="register-name"
                bind:value={name}
                required
                autocomplete="name"
                placeholder="Aisha Morgan"
              />
            </div>
            <div class="space-y-2">
              <Label for="register-email">Work email</Label><Input
                id="register-email"
                bind:value={email}
                required
                type="email"
                autocomplete="email"
                placeholder="you@business.com"
              />
            </div>
            <div class="space-y-2">
              <Label for="register-password">Create password</Label><PasswordInput
                id="register-password"
                bind:value={password}
                required
                minlength={8}
                autocomplete="new-password"
                placeholder="At least 8 characters"
              />
            </div>
            <Button type="submit" disabled={loading} class="mt-2 w-full py-3">
              {loading ? "Creating account..." : "Continue to setup"}
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
            <div class="grid grid-cols-2 gap-3">
              <Button variant="outline" class="w-full" onclick={() => {}}
                >Google</Button
              >
              <Button variant="outline" class="w-full" onclick={() => {}}
                >Apple</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
