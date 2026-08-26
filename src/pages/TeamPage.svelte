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
    createRole,
    updateMemberRole,
    type TeamRole,
  } from "$lib/stores/team";
  import {
    CheckCircle2,
    MailPlus,
    Search,
    ShieldCheck,
    Trash2,
    UsersRound,
    X,
  } from "@lucide/svelte";

  let search = $state("");
  let inviteOpen = $state(false);
  let name = $state("");
  let email = $state("");
  let role: TeamRole = $state("Staff");
  let formError = $state("");
  let roleName = $state("");
  let roleError = $state("");

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

  onMount(() => initializeTeam($authStore.user));

  function submitInvite(event: SubmitEvent) {
    event.preventDefault();
    formError = "";
    if (!name.trim() || !email.trim()) {
      formError = "Add a name and email address to send the invite.";
      return;
    }

    inviteMember({ name: name.trim(), email: email.trim(), role });
    name = "";
    email = "";
    role = "Staff";
    inviteOpen = false;
  }

  function addRole(event: SubmitEvent) {
    event.preventDefault();
    roleError = "";
    if (!roleName.trim()) {
      roleError = "Enter a role name first.";
      return;
    }
    if (!createRole(roleName)) {
      roleError = "That role already exists.";
      return;
    }
    roleName = "";
  }

  function changeRole(id: string, value: string) {
    if ($teamRoles.includes(value)) {
      updateMemberRole(id, value);
    }
  }

  function openMember(id: string) {
    goto(`/team/${id}`);
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="System"
    title="Team & staff"
    description="Give the right people access to keep your business moving."
  >
    <svelte:fragment slot="actions">
      <Button type="button" onclick={() => (inviteOpen = !inviteOpen)}>
        <MailPlus class="h-4 w-4" />
        Invite team member
      </Button>
    </svelte:fragment>
  </PageHeader>

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-panel p-5">
      <p
        class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        Total team
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {$teamMembers.length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">People in this workspace</p>
    </div>
    <div class="surface-panel p-5">
      <p
        class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        Active now
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {activeCount}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Ready to use Bizflow</p>
    </div>
    <div class="surface-panel p-5">
      <p
        class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
      >
        Pending invites
      </p>
      <p class="mt-3 font-heading text-3xl font-bold text-foreground">
        {invitedCount}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Awaiting acceptance</p>
    </div>
  </div>

  {#if inviteOpen}
    <section class="surface-panel p-6 sm:p-7">
      <div class="flex items-start gap-3">
        <div class="rounded-lg bg-primary/10 p-2 text-primary">
          <MailPlus class="h-5 w-5" />
        </div>
        <div>
          <div class="flex min-w-0 items-center justify-between gap-3">
            <h2 class="font-heading text-lg font-bold text-foreground">
              Invite someone to {$workspaceName}
            </h2>
            <button
              type="button"
              aria-label="Close invite form"
              title="Close invite form"
              onclick={() => (inviteOpen = false)}
              class="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              ><X class="h-4 w-4" /></button
            >
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            They will join with the role and access level you choose.
          </p>
        </div>
      </div>
      <form
        class="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_220px_auto] sm:items-end"
        onsubmit={submitInvite}
      >
        <div class="flex flex-col gap-2">
          <Label for="member-name">Full name</Label><Input
            id="member-name"
            bind:value={name}
            placeholder="Tosin Adeyemi"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="member-email">Email address</Label><Input
            id="member-email"
            type="email"
            bind:value={email}
            placeholder="tosin@example.com"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Label for="member-role">Workspace role</Label><NativeSelect
            id="member-role"
            bind:value={role}
            >{#each $teamRoles as teamRole}<option>{teamRole}</option
              >{/each}</NativeSelect
          >
        </div>
        <Button type="submit">Send invite</Button>
      </form>
      {#if formError}<p class="mt-3 text-sm text-destructive">
          {formError}
        </p>{/if}
    </section>
  {/if}

  <section class="surface-panel p-6 sm:p-7">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="font-heading text-lg font-bold text-foreground">
          Workspace roles
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Create role names that match how your business operates.
        </p>
      </div>
      <form class="flex w-full gap-2 sm:w-auto" onsubmit={addRole}>
        <Label for="new-role" class="sr-only">New role name</Label><Input
          id="new-role"
          bind:value={roleName}
          placeholder="e.g. Front desk"
        /><Button type="submit" variant="outline">Create role</Button>
      </form>
    </div>
    {#if roleError}<p class="mt-3 text-sm text-destructive">{roleError}</p>{/if}
    <div class="mt-4 flex flex-wrap gap-2">
      {#each $teamRoles as teamRole}<span
          class="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
          >{teamRole}</span
        >{/each}
    </div>
  </section>

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
              {member.name
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
            {#if member.role === "Business Owner"}
              <span
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
                ><ShieldCheck class="h-4 w-4 text-primary" />Business Owner</span
              >
            {:else}
              <NativeSelect
                aria-label={`Role for ${member.name}`}
                value={member.role}
                onchange={(event) => (
                  event.stopPropagation(),
                  changeRole(member.id, event.currentTarget.value)
                )}
                onclick={(event) => event.stopPropagation()}
                class="w-48"
                >{#each $teamRoles as teamRole}<option>{teamRole}</option
                  >{/each}</NativeSelect
              >
              <button
                type="button"
                aria-label={`Remove ${member.name}`}
                title={`Remove ${member.name}`}
                onclick={(event) => (
                  event.stopPropagation(), removeMember(member.id)
                )}
                class="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                ><Trash2 class="h-4 w-4" /></button
              >
            {/if}
          </div>
        </div>
      {/each}
      {#if filteredMembers.length === 0}<div class="py-10 text-center">
          <UsersRound class="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p class="mt-3 text-sm font-semibold text-foreground">
            No team members found
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            Try a different search or invite someone new.
          </p>
        </div>{/if}
    </div>
  </section>
</AppShell>
