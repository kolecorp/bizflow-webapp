<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { NativeSelect } from "$lib/components/ui/native-select";
  import { authStore } from "$lib/stores/auth";
  import {
    initializeTeam,
    inviteMember,
    removeMember,
    teamMembers,
    teamRoles,
    workspaceName,
    updateMemberRole,
    type TeamRole,
  } from "$lib/stores/team";
  import {
    grantStaffExtensionAccess,
    installedExtensionIds,
    revokeStaffExtensionAccess,
    staffAccessMap,
    syncStaffExtensionAccess,
  } from "$lib/stores/extensions";
  import {
    CheckCircle2,
    MailPlus,
    Search,
    ShieldCheck,
    Trash2,
    UsersRound,
    X,
    KeyRound,
  } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import PageLoadingSkeleton from "$lib/components/layout/PageLoadingSkeleton.svelte";

  let search = $state("");
  let inviteOpen = $state(false);
  let email = $state("");
  let role: TeamRole = $state("STAFF");
  let formError = $state("");
  let submitting = $state(false);
  let teamLoading = $state(true);

  let filteredMembers = $derived(
    $teamMembers.filter((member) => {
      const query = search.trim().toLowerCase();
      return (
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      );
    }),
  );
  let activeCount = $derived(
    $teamMembers.filter((member) => member.status === "Active").length,
  );
  let invitedCount = $derived(
    $teamMembers.filter((member) => member.status === "Invited").length,
  );

  onMount(async () => {
    try {
      await initializeTeam($authStore.user);
      if ($authStore.user?.role === "OWNER" || $authStore.user?.role === "ADMIN") {
        await syncStaffExtensionAccess();
      }
    } finally {
      teamLoading = false;
    }
  });

  async function submitInvite(event: SubmitEvent) {
    event.preventDefault();
    formError = "";
    if (!email.trim()) {
      formError = "Add an email address to send the invite.";
      return;
    }

    submitting = true;
    try {
      await inviteMember({ name: "", email: email.trim(), role });
      const invitedEmail = email.trim();
      email = "";
      role = "STAFF";
      inviteOpen = false;
      toast.success("Invitation sent", {
        description: `An invitation was sent to ${invitedEmail}.`,
      });
    } catch (err: any) {
      toast.error("Invitation failed", {
        description: err.message || "Failed to send invitation.",
      });
    } finally {
      submitting = false;
    }
  }

  function changeRole(id: string, value: string) {
    if ($teamRoles.includes(value)) {
      updateMemberRole(id, value);
    }
  }

  function openMember(id: string) {
    goto(`/team/${id}`);
  }

  async function toggleExtensionAccess(extension: string, userId: string) {
    const granted = ($staffAccessMap[extension] ?? []).includes(userId);
    if (granted) {
      await revokeStaffExtensionAccess(extension, userId);
    } else {
      await grantStaffExtensionAccess(extension, userId);
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="System"
    title="Team & staff"
    description="Give the right people access to keep your business moving."
  >
    <svelte:fragment slot="actions">
      {#if $authStore.user?.role === "OWNER" || $authStore.user?.role === "ADMIN"}
      <Button type="button" onclick={() => (inviteOpen = !inviteOpen)}>
        <MailPlus class="h-4 w-4" />
        Invite team member
      </Button>
      {/if}
    </svelte:fragment>
  </PageHeader>

  {#if teamLoading}
    <PageLoadingSkeleton rows={5} />
  {:else}
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-panel p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Total team
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {$teamMembers.length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">People in this workspace</p>
    </div>
    <div class="surface-panel p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Active now
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {activeCount}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Ready to use Bizflow</p>
    </div>
    <div class="surface-panel p-5">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Pending invites
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {invitedCount}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Awaiting acceptance</p>
    </div>
  </div>

  {#if inviteOpen}
    <section class="surface-panel overflow-hidden">
      <div class="border-b border-border/60 bg-primary/[0.04] px-6 py-5 sm:px-7">
        <div class="flex items-start justify-between gap-5">
          <div class="flex items-start gap-3">
            <div class="rounded-lg bg-primary/10 p-2.5 text-primary">
              <MailPlus class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Grow your team</p>
              <h2 class="mt-1 font-heading text-lg font-bold text-foreground">Invite someone to {$workspaceName}</h2>
              <p class="mt-1 max-w-xl text-sm text-muted-foreground">Send a secure invitation and choose the role they will use in this workspace.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close invite form"
            title="Close invite form"
            onclick={() => (inviteOpen = false)}
            class="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            ><X class="h-4 w-4" /></button
          >
        </div>
      </div>
      <form class="grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-end sm:p-7" onsubmit={submitInvite}>
        <div class="flex flex-col gap-2">
          <Label for="member-email">Email address</Label>
          <Input id="member-email" type="email" bind:value={email} placeholder="colleague@example.com" required />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="member-role">Workspace role</Label>
          <NativeSelect id="member-role" bind:value={role}>
            {#each $teamRoles.filter((teamRole) => teamRole !== "OWNER") as teamRole}
              <option value={teamRole}>{teamRole}</option>
            {/each}
          </NativeSelect>
        </div>
        <Button type="submit" disabled={submitting} class="w-full sm:w-auto">
          {#if submitting}<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>{/if}
          Send invite
        </Button>
      </form>
      {#if formError}
        <p class="px-6 pb-4 text-sm text-destructive sm:px-7">{formError}</p>
      {/if}
      <div class="flex items-center gap-2 border-t border-border/50 px-6 py-3.5 text-xs text-muted-foreground sm:px-7">
        <ShieldCheck class="h-3.5 w-3.5 shrink-0 text-primary" />
        Owners and admins can manage the team. Staff access is granted per extension.
      </div>
    </section>
  {/if}

  <section class="surface-panel p-6 sm:p-7">
    <div
      class="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="font-heading text-lg font-bold text-foreground">
          People with workspace access
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Manage roles and remove access as your team changes.
        </p>
      </div>
      <label class="relative block sm:w-64"
        ><Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        /><Input
          aria-label="Search team"
          class="pl-9"
          bind:value={search}
          placeholder="Search team"
        /></label
      >
    </div>

    <div class="mt-5 space-y-3">
      {#each filteredMembers as member (member.id)}
        <div
          class="surface-row flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          role="link"
          tabindex="0"
          onclick={() => openMember(member.id)}
          onkeydown={(event) => event.key === "Enter" && openMember(member.id)}
        >
          <div
            class="flex min-w-0 items-center gap-3 rounded-lg transition hover:bg-muted/50"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary"
            >
              {member.name === "Pending..." ? "?" : 
               member.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-foreground">
                {member.name}
              </p>
              <p class="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 sm:justify-end">
            <span
              class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${member.status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}
            >
              {#if member.status === "Active"}<CheckCircle2
                  class="h-3.5 w-3.5"
                />{:else}<MailPlus class="h-3.5 w-3.5" />{/if}{member.status}
            </span>
            
            {#if member.role === "OWNER"}
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ShieldCheck class="h-4 w-4 text-primary" />Owner
              </span>
            {:else if $authStore.user?.role === "OWNER" || $authStore.user?.role === "ADMIN"}
              <NativeSelect
                aria-label={`Role for ${member.name}`}
                value={member.role}
                onchange={(event) => (
                  event.stopPropagation(),
                  changeRole(member.id, event.currentTarget.value)
                )}
                onclick={(event) => event.stopPropagation()}
                class="w-32"
                >
                {#each $teamRoles as teamRole}
                  <option value={teamRole}>{teamRole}</option>
                {/each}
              </NativeSelect>
              <button
                type="button"
                aria-label={`Remove ${member.name}`}
                title={`Remove ${member.name}`}
                onclick={(event) => (
                  event.stopPropagation(), removeMember(member.id, member.status === 'Invited')
                )}
                class="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                ><Trash2 class="h-4 w-4" /></button
              >
            {:else}
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {member.role}
              </span>
            {/if}
          </div>
          {#if member.role === "STAFF" && ($authStore.user?.role === "OWNER" || $authStore.user?.role === "ADMIN")}
            <div class="flex w-full flex-wrap items-center gap-2 border-t border-border/50 pt-3 sm:ml-auto sm:w-auto sm:border-t-0 sm:pt-0">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <KeyRound class="h-3.5 w-3.5" /> Extension access
              </span>
              {#each $installedExtensionIds as extension}
                {@const granted = ($staffAccessMap[extension] ?? []).includes(member.id)}
                <button
                  type="button"
                  aria-pressed={granted}
                  title={`${granted ? "Revoke" : "Grant"} ${extension} access for ${member.name}`}
                  onclick={(event) => {
                    event.stopPropagation();
                    void toggleExtensionAccess(extension, member.id);
                  }}
                  class={`rounded-md border px-2 py-1 text-[11px] font-semibold transition ${granted ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"}`}
                >
                  {extension}
                </button>
              {/each}
              {#if $installedExtensionIds.length === 0}
                <span class="text-xs text-muted-foreground">No installed extensions</span>
              {/if}
            </div>
          {:else if member.role === "OWNER" || member.role === "ADMIN"}
            <span class="flex w-full items-center gap-1.5 border-t border-border/50 pt-3 text-xs font-semibold text-primary sm:ml-auto sm:w-auto sm:border-t-0 sm:pt-0">
              <KeyRound class="h-3.5 w-3.5" /> All installed extensions
            </span>
          {/if}
        </div>
      {/each}
      {#if filteredMembers.length === 0}
        <div class="py-10 text-center">
          <UsersRound class="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p class="mt-3 text-sm font-semibold text-foreground">
            No team members found
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            Try a different search or invite someone new.
          </p>
        </div>
      {/if}
    </div>
  </section>
  {/if}
</AppShell>
