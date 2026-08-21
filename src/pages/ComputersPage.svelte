<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { computers } from "$lib/stores/businessData";
  import { authStore } from "$lib/stores/auth";
  import { canAccess } from "$lib/stores/permissions";
  import { modals } from "$lib/stores/modals";
  import {
    canSendFileToComputer,
    fileTransfers,
    workstationAgents,
  } from "$lib/stores/communications";
  import { goto } from "$app/navigation";
  import {
    Monitor,
    Printer,
    User,
    Upload,
    ShieldCheck,
    ShieldOff,
    Wifi,
    WifiOff,
    MessageSquare,
  } from "@lucide/svelte";
  import type { Computer } from "$lib/types/business";

  $: userRole = $authStore.user?.role ?? "staff";
  $: canTransfer = canAccess(userRole, "computers.transfer");

  function statusLabel(status: Computer["status"]) {
    switch (status) {
      case "in-use":
        return "In use";
      case "online":
        return "Available";
      default:
        return "Offline";
    }
  }

  function statusDot(status: Computer["status"]) {
    switch (status) {
      case "in-use":
        return "bg-blue-500";
      case "online":
        return "bg-green-500";
      default:
        return "bg-muted-foreground";
    }
  }

  function agentFor(computerId: string) {
    return $workstationAgents.find((a) => a.computerId === computerId);
  }

  function openSendFile(pc: Computer) {
    modals.openSendFile({ computerId: pc.id, computerName: pc.name });
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Operations"
    title="Computer stations"
    description="Track sessions, send files to customer PCs when their Workstation Agent allows it, and coordinate support."
  >
    <svelte:fragment slot="actions">
      <button type="button" on:click={() => goto("/support")} class="btn-app-secondary">
        <MessageSquare class="h-4 w-4" />
        Staff chat & tickets
      </button>
    </svelte:fragment>
  </PageHeader>

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Total stations
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">{$computers.length}</p>
    </div>
    <div class="surface-stat border-blue-500/20 bg-blue-500/5 p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        In use now
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-blue-600">
        {$computers.filter((c) => c.status === "in-use").length}
      </p>
    </div>
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Accepting file transfers
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">
        {$workstationAgents.filter((a) => a.status === "online" && a.allowsFileTransfer).length}
      </p>
    </div>
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each $computers as pc}
      {@const agent = agentFor(pc.id)}
      {@const transferAllowed = canSendFileToComputer(pc.id)}
      <div class="surface-stat flex flex-col p-5 transition hover:border-primary/20">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-primary/10 p-2.5">
              <Monitor class="h-5 w-5 text-primary" />
            </div>
            <div>
              <p class="font-semibold text-foreground">{pc.name}</p>
              <p class="text-xs text-muted-foreground">{pc.label}</p>
            </div>
          </div>
          <span class="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <span class={`h-2 w-2 rounded-full ${statusDot(pc.status)}`}></span>
            {statusLabel(pc.status)}
          </span>
        </div>

        <div class="mt-4 space-y-2 text-sm">
          {#if pc.currentUser}
            <div class="flex items-center gap-2 text-muted-foreground">
              <User class="h-3.5 w-3.5" />
              <span>{pc.currentUser}</span>
              {#if pc.sessionStart}
                <span class="text-xs">since {pc.sessionStart}</span>
              {/if}
            </div>
          {/if}
          <div class="flex items-center justify-between text-muted-foreground">
            <span class="flex items-center gap-2">
              <Printer class="h-3.5 w-3.5" />
              {pc.printsToday} prints today
            </span>
            <span>₦{pc.hourlyRate}/hr</span>
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            {#if agent?.status === "online"}
              <span class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                <Wifi class="h-3 w-3" />
                Agent online
              </span>
            {:else if agent}
              <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <WifiOff class="h-3 w-3" />
                Agent offline
              </span>
            {:else}
              <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                No agent
              </span>
            {/if}

            {#if agent?.allowsFileTransfer}
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <ShieldCheck class="h-3 w-3" />
                Files allowed
              </span>
            {:else if agent}
              <span class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                <ShieldOff class="h-3 w-3" />
                Files blocked
              </span>
            {/if}
          </div>
        </div>

        <div class="mt-4 border-t border-border/60 pt-4">
          {#if canTransfer && transferAllowed}
            <button
              type="button"
              on:click={() => openSendFile(pc)}
              class="btn-app-primary w-full"
            >
              <Upload class="h-4 w-4" />
              Send file to PC
            </button>
          {:else if canTransfer && agent?.status === "online" && !agent.allowsFileTransfer}
            <p class="text-xs text-muted-foreground">
              Customer has not allowed incoming files on this workstation.
            </p>
          {:else if canTransfer && (!agent || agent.status !== "online")}
            <p class="text-xs text-muted-foreground">
              Workstation agent must be online to send files.
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if $fileTransfers.length > 0}
    <div class="surface-panel p-6">
      <h3 class="mb-4 text-lg font-semibold text-foreground">Recent file transfers</h3>
      <div class="space-y-3">
        {#each $fileTransfers.slice(0, 6) as job}
          <div class="surface-row flex items-center justify-between px-4 py-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{job.fileName}</p>
              <p class="text-xs text-muted-foreground">
                {job.computerName} · {job.sentBy} · {formatSize(job.fileSize)}
              </p>
            </div>
            <span
              class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                job.status === "delivered"
                  ? "bg-green-500/10 text-green-600"
                  : job.status === "uploading"
                    ? "bg-primary/10 text-primary"
                    : job.status === "failed"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {job.status}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="surface-muted p-5 text-sm text-muted-foreground">
    <strong class="text-foreground">Workstation Agent</strong> — Customers opt in on their PC to
    allow staff file transfers and RPC chat. Staff can only push files when the agent is online and
    <code class="rounded bg-muted px-1 py-0.5 text-xs">allowsFileTransfer</code> is enabled on the
    customer side.
  </div>
</AppShell>
