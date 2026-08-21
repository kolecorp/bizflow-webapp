<script lang="ts">
  import { goto } from "$app/navigation";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    printers,
    printJobs,
    printAgents,
  } from "$lib/stores/businessData";
  import {
    Printer,
    Settings2,
    ChevronRight,
    FileText,
    Users,
  } from "@lucide/svelte";
  import type { Printer as PrinterType, PrintJob } from "$lib/types/business";

  let selectedPrinterId: string | null = null;

  $: selectedPrinter = selectedPrinterId
    ? $printers.find((p) => p.id === selectedPrinterId)
    : null;

  function statusDot(status: PrinterType["status"]) {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-muted-foreground";
    }
  }

  function jobStatusClass(status: PrintJob["status"]) {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "cancelled":
        return "bg-muted text-muted-foreground";
      case "printing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default:
        return "bg-primary/10 text-primary";
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Printing"
    title="Printers & print jobs"
    description="Monitor printer health, queues, and every job routed through Bizflow Cloud → Print Agent → printer."
  >
    <svelte:fragment slot="actions">
      <button
        type="button"
        on:click={() => goto("/printing/settings")}
        class="btn-app-secondary"
      >
        <Settings2 class="h-4 w-4" />
        Print settings
      </button>
    </svelte:fragment>
  </PageHeader>

  <!-- Agents summary -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each $printAgents as agent}
      <div class="surface-stat p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-foreground">{agent.name}</p>
          <span
            class={`h-2 w-2 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-muted-foreground"}`}
          ></span>
        </div>
        <p class="mt-1 text-xs text-muted-foreground">{agent.machine}</p>
        <p class="mt-3 text-xs text-muted-foreground">
          {agent.printersConnected} printers · v{agent.version} · {agent.lastSeen}
        </p>
      </div>
    {/each}
  </div>

  <!-- Printers table -->
  <div class="surface-panel overflow-hidden">
    <div class="border-b border-border/60 px-6 py-4">
      <h3 class="text-lg font-semibold text-foreground">Printers</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th class="px-6 py-3 font-semibold">Printer</th>
            <th class="px-4 py-3 font-semibold">Location</th>
            <th class="px-4 py-3 font-semibold">Status</th>
            <th class="px-4 py-3 font-semibold">Jobs today</th>
            <th class="px-4 py-3 font-semibold">Pages today</th>
            <th class="px-4 py-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {#each $printers as printer}
            <tr
              class="border-b border-border/40 hover:bg-muted/30 transition cursor-pointer"
              on:click={() => (selectedPrinterId = printer.id)}
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Printer class="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p class="font-medium text-foreground">{printer.name}</p>
                    <p class="text-xs text-muted-foreground">{printer.model}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-muted-foreground">{printer.location}</td>
              <td class="px-4 py-4">
                <span class="flex items-center gap-2">
                  <span class={`h-2 w-2 rounded-full ${statusDot(printer.status)}`}></span>
                  <span class="text-foreground">{printer.statusDetail ?? printer.status}</span>
                </span>
              </td>
              <td class="px-4 py-4 text-foreground">{printer.jobsToday}</td>
              <td class="px-4 py-4 text-foreground">{printer.pagesToday}</td>
              <td class="px-4 py-4">
                <ChevronRight class="h-4 w-4 text-muted-foreground" />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Printer detail panel -->
  {#if selectedPrinter}
    <div class="surface-panel border-primary/20 p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-xl font-semibold text-foreground">{selectedPrinter.name}</h3>
          <p class="text-sm text-muted-foreground mt-1">
            {selectedPrinter.ip} · {selectedPrinter.protocol} · {selectedPrinter.connectionType}
          </p>
        </div>
        <button
          type="button"
          on:click={() => (selectedPrinterId = null)}
          class="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="surface-muted p-4">
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">Pages today</p>
          <p class="mt-1 text-2xl font-bold text-foreground">{selectedPrinter.pagesToday}</p>
        </div>
        <div class="surface-muted p-4">
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">This month</p>
          <p class="mt-1 text-2xl font-bold text-foreground">{selectedPrinter.pagesMonth}</p>
        </div>
        <div class="surface-muted p-4">
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">B&W / Colour</p>
          <p class="mt-1 text-2xl font-bold text-foreground">
            {selectedPrinter.bwPages} / {selectedPrinter.colorPages}
          </p>
        </div>
        <div class="surface-muted p-4">
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">Queue</p>
          <p class="mt-1 text-2xl font-bold text-foreground">{selectedPrinter.queueCount} jobs</p>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span class="rounded-lg border border-border px-2 py-1">
          Colour: {selectedPrinter.supportsColor ? "Yes" : "No"}
        </span>
        <span class="rounded-lg border border-border px-2 py-1">
          Duplex: {selectedPrinter.supportsDuplex ? "Yes" : "No"}
        </span>
        <span class="rounded-lg border border-border px-2 py-1">
          Paper: {selectedPrinter.paperSizes.join(", ")}
        </span>
        {#if selectedPrinter.tonerLevel !== undefined}
          <span class="rounded-lg border border-border px-2 py-1">
            Toner: {selectedPrinter.tonerLevel}%
          </span>
        {/if}
        <span class="rounded-lg border border-border px-2 py-1">
          Failed jobs: {selectedPrinter.failedJobs}
        </span>
      </div>
    </div>
  {/if}

  <!-- Print jobs -->
  <div class="surface-panel overflow-hidden">
    <div class="border-b border-border/60 px-6 py-4">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
        <FileText class="h-5 w-5" />
        Print jobs
      </h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th class="px-6 py-3 font-semibold">Time</th>
            <th class="px-4 py-3 font-semibold">User</th>
            <th class="px-4 py-3 font-semibold">Document</th>
            <th class="px-4 py-3 font-semibold">Printer</th>
            <th class="px-4 py-3 font-semibold">Copies</th>
            <th class="px-4 py-3 font-semibold">Pages</th>
            <th class="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each $printJobs as job}
            <tr class="border-b border-border/40 hover:bg-muted/30">
              <td class="px-6 py-4 text-muted-foreground">{job.time}</td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <Users class="h-3.5 w-3.5 text-muted-foreground" />
                  <span class="text-foreground">{job.user}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-foreground">{job.document}</td>
              <td class="px-4 py-4 text-muted-foreground">{job.printerName}</td>
              <td class="px-4 py-4 text-foreground">{job.copies}</td>
              <td class="px-4 py-4 text-foreground">{job.pages}</td>
              <td class="px-4 py-4">
                <span class={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${jobStatusClass(job.status)}`}>
                  {job.status}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</AppShell>
