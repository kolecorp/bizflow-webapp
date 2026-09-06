<script lang="ts">
  import { signIn, authStore, type LoginInput } from "$lib/stores/auth";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { ArrowRight, LockKeyhole } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let email = $state($authStore.user?.email ?? "");
  let password = $state("");
  let loading = $state(false);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    loading = true;
    try {
      const credentials: LoginInput = { email, password };
      await signIn(credentials);
      password = "";
    } catch (error) {
      toast.error("Login failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      loading = false;
    }
  }
</script>

{#if $authStore.sessionExpired}
  <Dialog.Root open={$authStore.sessionExpired} onOpenChange={() => {}}>
    <div class="session-expired-atmosphere" aria-hidden="true">
      <div class="session-expired-fade session-expired-fade--top"></div>
      <NoiseOverlay intensity="light" class="opacity-35 dark:opacity-25" />
      <div class="session-expired-fade session-expired-fade--bottom"></div>
    </div>
    <Dialog.Content
      overlayClass="session-expired-overlay"
      class="z-60 w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-background/95 p-7 text-foreground shadow-2xl shadow-primary/10 sm:p-9"
      showCloseButton={false}
    >
      <div class="mb-7 flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <LockKeyhole class="h-5 w-5" />
        </div>
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary"
          >
            Bizflow security
          </p>
          <p class="text-xs text-muted-foreground">
            Re-authentication required
          </p>
        </div>
      </div>
      <div class="mb-7 space-y-2">
        <Dialog.Title
          id="session-expired-title"
          class="font-heading text-2xl font-bold"
          >Your session expired, please login again</Dialog.Title
        >
        <Dialog.Description
          class="text-sm leading-relaxed text-muted-foreground"
          >Your workspace is still here. Sign in again to continue the action
          you started.</Dialog.Description
        >
      </div>
      <form class="space-y-5" onsubmit={submit}>
        <div class="space-y-2">
          <Label for="expired-email">Email address</Label><Input
            id="expired-email"
            type="email"
            bind:value={email}
            autocomplete="email"
            required
          />
        </div>
        <div class="space-y-2">
          <Label for="expired-password">Password</Label><PasswordInput
            id="expired-password"
            bind:value={password}
            autocomplete="current-password"
            required
          />
        </div>
        <Button type="submit" disabled={loading} class="w-full py-3">
          {#if loading}<span
              class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></span>{/if}
          {loading ? "Signing in..." : "Continue to Bizflow"}
          {#if !loading}<ArrowRight class="h-4 w-4" />{/if}
        </Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{/if}

<style>
  :global(.session-expired-overlay) {
    background: color-mix(
      in srgb,
      var(--background) 34%,
      transparent
    ) !important;
    backdrop-filter: blur(2px);
  }

  .session-expired-atmosphere {
    position: fixed;
    inset: 0;
    z-index: 55;
    overflow: hidden;
    pointer-events: none;
  }

  .session-expired-fade {
    position: absolute;
    left: 0;
    right: 0;
    height: 24vh;
  }

  .session-expired-fade--top {
    top: 0;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--background) 48%, transparent),
      transparent
    );
  }

  .session-expired-fade--bottom {
    bottom: 0;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--background) 48%, transparent),
      transparent
    );
  }
</style>
