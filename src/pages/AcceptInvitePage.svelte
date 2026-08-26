<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    acceptInvite,
    ensureDemoInvite,
    getTeamMember,
    loadTeam,
    workspaceName,
    type TeamMember,
  } from "$lib/stores/team";
  import { CheckCircle2, LockKeyhole, UserRound } from "@lucide/svelte";

  let { inviteId }: { inviteId: string } = $props();
  let member = $state<TeamMember | undefined>(
    inviteId === "demo-invite"
      ? {
          id: "demo-invite",
          name: "Tosin Adeyemi",
          email: "tosin@example.com",
          role: "Staff",
          status: "Invited",
          joinedAt: "",
        }
      : undefined,
  );
  let password = $state("");
  let confirmPassword = $state("");
  let error = $state("");
  let registered = $state(false);

  onMount(() => {
    loadTeam();
    member = ensureDemoInvite(inviteId) ?? getTeamMember(inviteId) ?? member;
  });

  function register(event: SubmitEvent) {
    event.preventDefault();
    error = "";
    if (password.length < 8) {
      error = "Use at least 8 characters for your password.";
      return;
    }
    if (password !== confirmPassword) {
      error = "Passwords do not match.";
      return;
    }
    acceptInvite(inviteId);
    registered = true;
  }
</script>

<div
  class="relative min-h-screen overflow-hidden bg-background text-foreground"
>
  <header class="border-b border-border/60 bg-card/40">
    <div
      class="mx-auto flex h-16 w-full items-center px-6 sm:px-8 lg:w-[70%] lg:px-0"
    >
      <a href="/" class="flex items-center gap-3">
        <img
          src="/cafe-logo.png"
          alt="Bizflow logo"
          class="size-9 object-contain"
        />
        <span class="font-heading text-lg font-black tracking-[-0.04em]"
          >Bizflow</span
        >
      </a>
    </div>
  </header>

  <main class="mx-auto w-full max-w-lg px-6 py-12 sm:px-0 sm:py-16">
    <div class="mb-10 flex items-center justify-center">
      <div class="flex min-w-0 items-center gap-3">
        <img
          src="/business-icon.png"
          alt="Business logo"
          class="size-10 shrink-0 object-contain"
        />
        <span
          class="max-w-32 truncate text-sm font-semibold text-foreground sm:max-w-44"
          >{$workspaceName}</span
        >
      </div>
    </div>
    {#if registered}
      <section class="surface-panel p-8 text-center sm:p-10">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
        >
          <CheckCircle2 class="size-7" />
        </div>
        <h1 class="mt-5 font-heading text-2xl font-bold">You’re registered</h1>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your access to {$workspaceName} is ready. Sign in with {member?.email}
          to continue.
        </p>
        <Button type="button" onclick={() => goto("/login")} class="mt-7 w-full"
          >Go to sign in</Button
        >
      </section>
    {:else if member && member.status === "Invited"}
      <section class="surface-panel p-8 sm:p-10">
        <div class="mb-8 text-center">
          <div
            class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <UserRound class="size-7" />
          </div>
          <p
            class="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            You’re invited
          </p>
          <h1 class="mt-3 font-heading text-2xl font-bold">
            Join {$workspaceName}
          </h1>
          <p class="mt-2 text-sm text-muted-foreground">
            Create a password to activate your Bizflow account.
          </p>
        </div>
        <form class="flex flex-col gap-5" onsubmit={register}>
          <div class="flex flex-col gap-2">
            <Label for="invite-email">Email address</Label><Input
              id="invite-email"
              value={member.email}
              readonly
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="invite-password">Password</Label><Input
              id="invite-password"
              type="password"
              bind:value={password}
              placeholder="At least 8 characters"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="confirm-password">Confirm password</Label><Input
              id="confirm-password"
              type="password"
              bind:value={confirmPassword}
              placeholder="Repeat your password"
            />
          </div>
          {#if error}<p class="text-sm text-destructive">{error}</p>{/if}
          <Button type="submit" class="mt-2 w-full"
            ><LockKeyhole class="size-4" />Create my account</Button
          >
        </form>
      </section>
    {:else}
      <section class="surface-panel p-8 text-center sm:p-10">
        <h1 class="font-heading text-2xl font-bold">Invite unavailable</h1>
        <p class="mt-3 text-sm text-muted-foreground">
          This invite may have expired or already been used.
        </p>
        <Button
          type="button"
          variant="outline"
          onclick={() => goto("/login")}
          class="mt-7">Go to sign in</Button
        >
      </section>
    {/if}
  </main>
</div>
