<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { Button } from "$lib/components/ui/button";
  import { NativeSelect } from "$lib/components/ui/native-select";
  import { authStore } from "$lib/stores/auth";
  import {
    getTeamMember,
    initializeTeam,
    removeMember,
    teamRoles,
    updateMemberRole,
    type TeamMember,
  } from "$lib/stores/team";
  import {
    ArrowLeft,
    CheckCircle2,
    Mail,
    ShieldCheck,
    Trash2,
    UserRound,
  } from "@lucide/svelte";

  let { memberId }: { memberId: string } = $props();
  let member = $state<TeamMember | undefined>(undefined);

  onMount(() => {
    initializeTeam($authStore.user);
    member = getTeamMember(memberId);
  });

  function changeRole(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (member && $teamRoles.includes(value)) {
      updateMemberRole(member.id, value);
      member = getTeamMember(member.id);
    }
  }

  function remove() {
    if (member) removeMember(member.id);
    goto("/team");
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Team & staff"
    title={member?.name ?? "Team member"}
    description="Review access, role, and account status for this workspace member."
  >
    <svelte:fragment slot="actions">
      <Button type="button" variant="outline" onclick={() => goto("/team")}
        ><ArrowLeft class="h-4 w-4" />Back to team</Button
      >
    </svelte:fragment>
  </PageHeader>

  {#if member}
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section class="surface-panel p-6 sm:p-8">
        <div class="flex items-center gap-4 border-b border-border/60 pb-6">
          <div
            class="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary"
          >
            {member.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h2 class="font-heading text-xl font-bold text-foreground">
              {member.name}
            </h2>
            <p
              class="mt-1 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Mail class="h-4 w-4" />{member.email}
            </p>
          </div>
        </div>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Workspace role
            </p>
            {#if member.role === "Business Owner"}<p
                class="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <ShieldCheck class="h-4 w-4 text-primary" />Business Owner
              </p>{:else}<NativeSelect
                class="mt-2"
                aria-label="Workspace role"
                value={member.role}
                onchange={changeRole}
                >{#each $teamRoles as role}<option>{role}</option
                  >{/each}</NativeSelect
              >{/if}
          </div>
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              Account status
            </p>
            <p
              class="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              {#if member.status === "Active"}<CheckCircle2
                  class="h-4 w-4 text-emerald-600"
                />Active{:else}<UserRound
                  class="h-4 w-4 text-amber-600"
                />Invite pending{/if}
            </p>
          </div>
        </div>
      </section>
      <aside class="surface-panel h-fit p-6">
        <p
          class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Danger zone
        </p>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
          Remove this person’s access to the workspace.
        </p>
        {#if member.role !== "Business Owner"}<Button
            type="button"
            variant="outline"
            onclick={remove}
            class="mt-5 w-full text-destructive hover:bg-destructive/10"
            ><Trash2 class="h-4 w-4" />Remove access</Button
          >{/if}
      </aside>
    </div>
  {:else}
    <section class="surface-panel p-8 text-center">
      <p class="font-heading text-lg font-bold text-foreground">
        Team member not found
      </p>
      <Button type="button" onclick={() => goto("/team")} class="mt-5"
        >Back to team</Button
      >
    </section>
  {/if}
</AppShell>
