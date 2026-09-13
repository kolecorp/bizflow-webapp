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
    getMemberPermissions,
    replaceMemberPermissions,
    type PermissionCatalogItem,
    type TeamMember,
  } from "$lib/stores/team";
  import {
    ArrowLeft,
    CheckCircle2,
    Mail,
    ShieldCheck,
    Trash2,
    UserRound,
    LockKeyhole,
    Save,
  } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import PageLoadingSkeleton from "$lib/components/layout/PageLoadingSkeleton.svelte";

  let { memberId }: { memberId: string } = $props();
  let member = $state<TeamMember | undefined>(undefined);
  let memberLoading = $state(true);
  let permissionCatalog = $state<PermissionCatalogItem[]>([]);
  let selectedPermissions = $state<string[]>([]);
  let permissionsLoading = $state(false);
  let permissionsSaving = $state(false);
  let permissionError = $state("");

  onMount(async () => {
    try {
      await initializeTeam($authStore.user);
      member = getTeamMember(memberId);
      if (member?.status === "Active" && member.role === "STAFF") {
        permissionsLoading = true;
        try {
          const data = await getMemberPermissions(member.id);
          permissionCatalog = data.catalog;
          selectedPermissions = [...data.grantedPermissions];
        } catch (error) {
          permissionError =
            error instanceof Error
              ? error.message
              : "Failed to load permissions";
        } finally {
          permissionsLoading = false;
        }
      }
    } finally {
      memberLoading = false;
    }
  });

  let permissionGroups = $derived.by(() => {
    const groups = new Map<string, PermissionCatalogItem[]>();
    for (const item of permissionCatalog) {
      const group = groups.get(item.area) ?? [];
      group.push(item);
      groups.set(item.area, group);
    }
    return groups;
  });

  function togglePermission(code: string) {
    selectedPermissions = selectedPermissions.includes(code)
      ? selectedPermissions.filter((permission) => permission !== code)
      : [...selectedPermissions, code];
  }

  async function savePermissions() {
    if (
      !member ||
      member.status !== "Active" ||
      member.role !== "STAFF" ||
      permissionError
    )
      return;
    permissionsSaving = true;
    try {
      await replaceMemberPermissions(member.id, selectedPermissions);
      toast.success("Permissions updated", {
        description: `${member.name} can now use the selected areas.`,
      });
    } catch (error) {
      toast.error("Could not update permissions", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      permissionsSaving = false;
    }
  }

  async function changeRole(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (member && $teamRoles.includes(value)) {
      const previousRole = member.role;
      try {
        await updateMemberRole(member.id, value);
        member = getTeamMember(member.id);
      } catch (error) {
        if (member) {
          member = { ...member, role: previousRole };
        }
        toast.error("Could not update member role", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    }
  }

  async function remove() {
    if (!member) return;
    try {
      await removeMember(member.id, member.status === "Invited");
      goto("/team");
    } catch (error) {
      member = getTeamMember(member.id);
      toast.error("Could not remove team member", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
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

  {#if memberLoading}
    <PageLoadingSkeleton rows={4} />
  {:else if member}
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
            {#if member.role === "OWNER"}<p
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
      {#if member.status === "Active" && member.role === "STAFF"}
        <section class="surface-panel p-6 sm:p-8 lg:col-span-2">
          <div
            class="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-primary"
              >
                Access control
              </p>
              <h2 class="mt-1 font-heading text-xl font-bold text-foreground">
                Staff permissions
              </h2>
              <p
                class="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground"
              >
                Choose the specific areas and actions this team member can
                access. Changes apply immediately.
              </p>
            </div>
            <Button
              type="button"
              onclick={savePermissions}
              disabled={permissionsLoading ||
                permissionsSaving ||
                !!permissionError}
            >
              {#if permissionsSaving}<div
                  class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                ></div>{:else}<Save class="h-4 w-4" />{/if}
              Save permissions
            </Button>
          </div>
          {#if permissionsLoading}
            <div
              class="flex items-center gap-3 py-8 text-sm text-muted-foreground"
            >
              <div
                class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
              ></div>
              Loading permissions...
            </div>
          {:else if permissionError}
            <p class="py-6 text-sm text-destructive">{permissionError}</p>
          {:else}
            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {#each [...permissionGroups.entries()] as [area, permissions]}
                <div class="rounded-lg border border-border/60 bg-muted/20 p-4">
                  <h3
                    class="flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <LockKeyhole class="h-4 w-4 text-primary" />{area}
                  </h3>
                  <div class="mt-3 space-y-2">
                    {#each permissions as permission}
                      <label
                        class="flex cursor-pointer items-start gap-3 rounded-md p-2 transition hover:bg-background/70"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            permission.code,
                          )}
                          onchange={() => togglePermission(permission.code)}
                          class="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span class="text-sm text-foreground"
                          >{permission.action}</span
                        >
                      </label>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </section>
      {/if}
      <aside class="surface-panel h-fit p-6">
        <p
          class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Danger zone
        </p>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
          Remove this person’s access to the workspace.
        </p>
        {#if member.role !== "OWNER"}<Button
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
