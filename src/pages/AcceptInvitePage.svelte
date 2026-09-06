<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { Label } from "$lib/components/ui/label";
  import { getInviteDetails, acceptInvite } from "$lib/stores/team";
  import { CheckCircle2, LockKeyhole, UserRound } from "@lucide/svelte";

  let { inviteId }: { inviteId: string } = $props();
  
  let loadingDetails = $state(true);
  let inviteDetails = $state<{ email: string; role: string; businessName: string; expiresAt: string } | null>(null);
  let fetchError = $state("");

  let name = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let error = $state("");
  let submitting = $state(false);
  let registered = $state(false);

  onMount(async () => {
    try {
      if (inviteId === "demo-invite") {
        inviteDetails = {
          email: "tosin@example.com",
          role: "STAFF",
          businessName: "Aisha Business Center",
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        };
      } else {
        inviteDetails = await getInviteDetails(inviteId);
      }
    } catch (err: any) {
      fetchError = err.message || "Invalid or expired invitation";
    } finally {
      loadingDetails = false;
    }
  });

  async function register(event: SubmitEvent) {
    event.preventDefault();
    error = "";
    
    if (!name.trim()) {
      error = "Please enter your full name.";
      return;
    }
    if (password.length < 8) {
      error = "Use at least 8 characters for your password.";
      return;
    }
    if (password !== confirmPassword) {
      error = "Passwords do not match.";
      return;
    }

    submitting = true;
    try {
      if (inviteId !== "demo-invite") {
        await acceptInvite(inviteId, name, password);
      }
      registered = true;
    } catch (err: any) {
      error = err.message || "Failed to create account. Please try again.";
    } finally {
      submitting = false;
    }
  }
</script>

<div class="relative min-h-screen overflow-hidden bg-background text-foreground">
  <header class="border-b border-border/60 bg-card/40">
    <div class="mx-auto flex h-16 w-full items-center px-6 sm:px-8 lg:w-[70%] lg:px-0">
      <a href="/" class="flex items-center gap-3">
        <img src="/cafe-logo.png" alt="Bizflow logo" class="size-9 object-contain" />
        <span class="font-heading text-lg font-black tracking-[-0.04em]">Bizflow</span>
      </a>
    </div>
  </header>

  <main class="mx-auto w-full max-w-lg px-6 py-12 sm:px-0 sm:py-16">
    {#if loadingDetails}
      <div class="flex items-center justify-center p-10">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    {:else if registered}
      <section class="surface-panel p-8 text-center sm:p-10">
        <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 class="size-7" />
        </div>
        <h1 class="mt-5 font-heading text-2xl font-bold">You’re registered</h1>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your access to {inviteDetails?.businessName} is ready. Sign in with {inviteDetails?.email} to continue.
        </p>
        <Button type="button" onclick={() => goto("/login")} class="mt-7 w-full">Go to sign in</Button>
      </section>
    {:else if inviteDetails}
      <div class="mb-10 flex items-center justify-center">
        <div class="flex min-w-0 items-center gap-3">
          <img src="/business-icon.png" alt="Business logo" class="size-10 shrink-0 object-contain" />
          <span class="max-w-32 truncate text-sm font-semibold text-foreground sm:max-w-44">{inviteDetails.businessName}</span>
        </div>
      </div>
      <section class="surface-panel p-8 sm:p-10">
        <div class="mb-8 text-center">
          <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound class="size-7" />
          </div>
          <p class="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">You’re invited</p>
          <h1 class="mt-3 font-heading text-2xl font-bold">Join {inviteDetails.businessName}</h1>
          <p class="mt-2 text-sm text-muted-foreground">Create a password to activate your Bizflow account.</p>
        </div>
        <form class="flex flex-col gap-5" onsubmit={register}>
          <div class="flex flex-col gap-2">
            <Label for="invite-name">Full Name</Label>
            <Input id="invite-name" bind:value={name} placeholder="Your full name" required />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="invite-email">Email address</Label>
            <Input id="invite-email" value={inviteDetails.email} readonly />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="invite-password">Password</Label>
            <PasswordInput id="invite-password" bind:value={password} placeholder="At least 8 characters" required />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="confirm-password">Confirm password</Label>
            <PasswordInput id="confirm-password" bind:value={confirmPassword} placeholder="Repeat your password" required />
          </div>
          {#if error}<p class="text-sm text-destructive">{error}</p>{/if}
          <Button type="submit" class="mt-2 w-full" disabled={submitting}>
            {#if submitting}
              <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            {:else}
              <LockKeyhole class="mr-2 size-4" />
            {/if}
            Create my account
          </Button>
        </form>
      </section>
    {:else}
      <section class="surface-panel p-8 text-center sm:p-10">
        <h1 class="font-heading text-2xl font-bold">Invite unavailable</h1>
        <p class="mt-3 text-sm text-muted-foreground">{fetchError || "This invite may have expired or already been used."}</p>
        <Button type="button" variant="outline" onclick={() => goto("/login")} class="mt-7">Go to sign in</Button>
      </section>
    {/if}
  </main>
</div>
