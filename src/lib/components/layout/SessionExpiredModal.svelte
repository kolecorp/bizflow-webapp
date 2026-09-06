<script lang="ts">
  import { signIn, authStore, type LoginInput } from "$lib/stores/auth";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
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
  <div
    class="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-background/25 px-4 py-8 backdrop-blur-[2px]"
    role="presentation"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.08] to-transparent"
    ></div>
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[24vh] bg-gradient-to-b from-transparent via-primary/[0.06] to-background/80"
    ></div>
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] bg-gradient-to-t from-transparent via-primary/[0.06] to-background/80"
    ></div>
    <NoiseOverlay intensity="light" class="opacity-40 dark:opacity-30" />

    <Dialog.Root open={$authStore.sessionExpired} onOpenChange={() => {}}>
      <Dialog.Content
        class="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-primary/20 bg-background/95 p-7 text-foreground shadow-2xl shadow-primary/10 sm:p-9"
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
  </div>
{/if}
