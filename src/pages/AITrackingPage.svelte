<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Clock3,
    FileText,
    MoreHorizontal,
    User,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { authStore } from "$lib/stores/auth";

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let activities = $state<any[]>([]);
  let loadError = $state("");

  onMount(() => void loadActivities());

  async function loadActivities() {
    loadError = "";
    try {
      const response = await fetch(`${API_BASE_URL}/audit`, {
        headers: $authStore.accessToken
          ? { Authorization: `Bearer ${$authStore.accessToken}` }
          : {},
        credentials: "include",
      });
      if (!response.ok) {
        loadError = "Unable to load workspace activity.";
        return;
      }
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : payload?.data;
      activities = (Array.isArray(rows) ? rows : []).map((event: any) => ({
        id: event.id ?? event.reference ?? "AUDIT",
        action:
          event.action ?? event.description ?? event.type ?? "Workspace action",
        status: event.status ?? "Success",
        date: event.createdAt ?? event.timestamp ?? event.date,
        actor:
          (typeof event.actor?.name === "string" && event.actor.name) ||
          (typeof event.user?.name === "string" && event.user.name) ||
          "System",
        tags: Array.isArray(event.tags) ? event.tags : [],
      }));
    } catch {
      loadError = "Unable to load workspace activity.";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "Success":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Warning":
        return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "Pending":
        return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default:
        return "border-border bg-muted text-muted-foreground";
    }
  }

  function getStatusIcon(status: string) {
    if (status === "Success") return CheckCircle2;
    if (status === "Warning") return AlertCircle;
    if (status === "Pending") return Clock3;
    return Activity;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Workspace"
    title="Activity Log"
    description="Track system events, user actions, and business operations."
  />

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Actions Today
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {activities.filter(
          (activity) =>
            new Date(activity.date).toDateString() ===
            new Date().toDateString(),
        ).length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Across the workspace</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        System Alerts
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {activities.filter((task) => task.status === "Warning").length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Requires attention</p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Pending Tasks
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
      >
        {activities.filter((task) => task.status === "Pending").length}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">Awaiting resolution</p>
    </div>
  </div>

  <div class="surface-panel overflow-hidden">
    {#if loadError}
      <p class="border-b border-border/60 px-6 py-4 text-sm text-destructive">
        {loadError}
      </p>
    {/if}
    <div
      class="flex items-center justify-between border-b border-border/60 px-6 py-5"
    >
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-primary/10 p-2 text-primary">
          <FileText class="h-4 w-4" />
        </div>
        <div>
          <h3 class="font-heading text-lg font-semibold text-foreground">
            Recent Activity
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            A comprehensive audit trail of your business operations.
          </p>
        </div>
      </div>
      <span class="hidden text-xs text-muted-foreground sm:block"
        >{activities.length} records</span
      >
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"
          >
            <th class="px-6 py-3 font-semibold">Ref</th>
            <th class="px-4 py-3 font-semibold">Action</th>
            <th class="px-4 py-3 font-semibold">Status</th>
            <th class="px-4 py-3 font-semibold">User</th>
            <th class="px-4 py-3 font-semibold">Date</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {#each activities as activity}
            {@const StatusIcon = getStatusIcon(activity.status)}
            <tr
              class="border-b border-border/40 hover:bg-muted/30 group transition"
            >
              <td class="px-6 py-4 font-mono text-xs text-muted-foreground"
                >{activity.id}</td
              >
              <td class="px-4 py-4">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-foreground"
                    >{activity.action}</span
                  >
                  {#each activity.tags as tag}
                    <span
                      class="rounded-md border border-border/60 bg-muted/60 px-2 py-1 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  {/each}
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  class={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusClass(activity.status)}`}
                >
                  <StatusIcon class="h-3.5 w-3.5" />
                  {activity.status}
                </span>
              </td>
              <td
                class="px-4 py-4 text-muted-foreground flex items-center gap-1.5"
              >
                <User class="h-3.5 w-3.5" />
                {activity.actor}
              </td>
              <td class="px-4 py-4 text-muted-foreground text-xs"
                >{activity.date &&
                !Number.isNaN(new Date(activity.date).getTime())
                  ? new Date(activity.date).toLocaleString()
                  : "—"}</td
              >
              <td class="px-4 py-4 text-right">
                <button
                  type="button"
                  class="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-muted transition"
                >
                  <MoreHorizontal class="h-4 w-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</AppShell>
