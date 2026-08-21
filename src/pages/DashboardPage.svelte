<script lang="ts">
  import { goto } from "$app/navigation";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import GlowStatCard from "$lib/components/ui/GlowStatCard.svelte";
  import { todayRevenue, todayTransactions, printJobs, computers, printers, lowStockItems } from "$lib/stores/businessData";
  import { modals } from "$lib/stores/modals";
  import {
    ArrowRight,
    Plus,
    Printer,
    ShoppingBag,
    TrendingUp,
    Monitor,
    Package,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Bell,
    MessageSquare,
    Ticket,
    Upload,
  } from "@lucide/svelte";
  import type { Printer as PrinterType } from "$lib/types/business";
  import { notificationItems, notificationUnreadCount, markRead } from "$lib/stores/notifications";
  import {
    openTickets,
    fileTransfers,
    activeTransfers,
  } from "$lib/stores/communications";

  function printerStatusColor(status: PrinterType["status"]) {
    switch (status) {
      case "online":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  }

  function printerStatusDot(status: PrinterType["status"]) {
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
</script>

<AppShell>
  <PageHeader
    eyebrow="Overview"
    title="Business center dashboard"
    description="Today's revenue, printing health, stock alerts, and recent activity."
  >
    <svelte:fragment slot="actions">
      <button
        type="button"
        on:click={() => modals.openNewTransaction()}
        class="btn-app-primary"
      >
        <Plus class="h-4 w-4" />
        New transaction
      </button>
      <button
        type="button"
        on:click={() => modals.openDailySales()}
        class="btn-app-secondary"
      >
        Daily sales
      </button>
    </svelte:fragment>
  </PageHeader>

  <!-- Quick actions -->
  <div class="grid gap-4 sm:grid-cols-3">
    <button
      type="button"
      on:click={() => goto("/computers")}
      class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"
    >
      <div class="rounded-xl bg-primary/10 p-2.5">
        <Upload class="h-5 w-5 text-primary" />
      </div>
      <div>
        <p class="font-semibold text-foreground">Send files to PCs</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Push documents to customer workstations when their agent allows it.
        </p>
      </div>
    </button>
    <button
      type="button"
      on:click={() => goto("/support")}
      class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"
    >
      <div class="rounded-xl bg-blue-500/10 p-2.5">
        <MessageSquare class="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <p class="font-semibold text-foreground">Staff chat</p>
        <p class="mt-1 text-xs text-muted-foreground">
          RPC-backed team messaging across front desk and operations.
        </p>
      </div>
    </button>
    <button
      type="button"
      on:click={() => goto("/support")}
      class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"
    >
      <div class="rounded-xl bg-amber-500/10 p-2.5">
        <Ticket class="h-5 w-5 text-amber-600" />
      </div>
      <div>
        <p class="font-semibold text-foreground">Customer tickets</p>
        <p class="mt-1 text-xs text-muted-foreground">
          {$openTickets.length} open · resolve workstation and service issues.
        </p>
      </div>
    </button>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <GlowStatCard
      label="Revenue today"
      value="₦{$todayRevenue.toLocaleString()}"
      subtext="{$todayTransactions.length} transactions"
      icon={TrendingUp}
      variant="emerald"
    />

    <GlowStatCard
      label="Print jobs today"
      value={$printJobs.length}
      subtext="View printing queue"
      icon={Printer}
      variant="blue"
    />

    <GlowStatCard
      label="Computers active"
      value="{$computers.filter((c) => c.status === 'in-use').length} / {$computers.length}"
      subtext="Workstations in use"
      icon={Monitor}
      variant="violet"
    />

    <GlowStatCard
      label="Low stock items"
      value={$lowStockItems.length}
      subtext="Needs restocking"
      icon={Package}
      variant="amber"
    />
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Printer health -->
    <div class="surface-panel p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Printer class="h-5 w-5" />
          Printer health
        </h3>
        <button
          type="button"
          on:click={() => goto("/printing")}
          class="text-xs text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <div class="space-y-3">
        {#each $printers as printer}
          <div
            class="surface-row flex items-center justify-between px-4 py-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class={`h-2.5 w-2.5 shrink-0 rounded-full ${printerStatusDot(printer.status)}`}></span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-foreground truncate">{printer.name}</p>
                <p class="text-xs text-muted-foreground">{printer.location}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class={`text-xs font-medium ${printerStatusColor(printer.status)}`}>
                {printer.statusDetail ?? printer.status}
              </p>
              <p class="text-xs text-muted-foreground">{printer.jobsToday} jobs today</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="surface-panel p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ShoppingBag class="h-5 w-5" />
          Recent transactions
        </h3>
        <button
          type="button"
          on:click={() => goto("/transactions")}
          class="text-xs text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <div class="space-y-3">
        {#each $todayTransactions.slice(0, 5) as tx}
          <div
            class="surface-row flex items-center justify-between px-4 py-3"
          >
            <div>
              <p class="text-sm font-medium text-foreground">{tx.service}</p>
              <p class="text-xs text-muted-foreground">{tx.customer} · {tx.time}</p>
            </div>
            <p class="text-sm font-bold text-foreground">₦{tx.amount.toLocaleString()}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Alerts + activity -->
  <div class="grid gap-6 lg:grid-cols-3">
    <div class="surface-panel p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bell class="h-5 w-5 text-primary" />
          Notifications
        </h3>
        <span class="text-xs text-muted-foreground">
          {$notificationUnreadCount} unread
        </span>
      </div>
      <div class="space-y-3">
        {#each $notificationItems.slice(0, 4) as notif}
          <button
            type="button"
            on:click={() => {
              markRead(notif.id);
              if (notif.href) goto(notif.href);
            }}
            class={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition hover:bg-muted/50 ${
              notif.read ? "border-border" : "border-primary/20 bg-primary/5"
            }`}
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-foreground">{notif.title}</p>
              <p class="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="surface-panel p-6">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">
        <AlertTriangle class="h-5 w-5 text-amber-500" />
        Alerts
      </h3>
      <div class="space-y-3">
        {#each $lowStockItems as item}
          <div class="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <Package class="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-foreground">Low stock: {item.name}</p>
              <p class="text-xs text-muted-foreground">
                {item.quantity} {item.unit} remaining (min {item.minQuantity})
              </p>
            </div>
          </div>
        {/each}
        {#each $printers.filter((p) => p.status !== "online") as printer}
          <div class="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
            <Printer class="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-foreground">{printer.name}</p>
              <p class="text-xs text-muted-foreground">{printer.statusDetail ?? printer.status}</p>
            </div>
          </div>
        {/each}
        {#if $lowStockItems.length === 0 && $printers.every((p) => p.status === "online")}
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 class="h-4 w-4 text-green-500" />
            All systems operating normally
          </div>
        {/if}
      </div>
    </div>

    <div class="surface-panel p-6">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">
        <Upload class="h-5 w-5" />
        File transfers
      </h3>
      <div class="space-y-3">
        {#each $fileTransfers.slice(0, 4) as job}
          <div class="surface-row flex items-center justify-between px-4 py-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{job.fileName}</p>
              <p class="text-xs text-muted-foreground">
                {job.computerName} · {job.sentAt}
              </p>
            </div>
            <span
              class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                job.status === "delivered"
                  ? "bg-green-500/10 text-green-600"
                  : job.status === "uploading"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {job.status}
            </span>
          </div>
        {/each}
        {#if $activeTransfers.length > 0}
          <p class="text-xs text-primary">
            {$activeTransfers.length} transfer(s) in progress…
          </p>
        {/if}
        <button
          type="button"
          on:click={() => goto("/computers")}
          class="text-xs text-primary hover:underline"
        >
          Send file to a PC
        </button>
      </div>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-2">
    <div class="surface-panel p-6">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">
        <Clock3 class="h-5 w-5" />
        Print job activity
      </h3>
      <div class="space-y-3">
        {#each $printJobs.slice(0, 5) as job}
          <div class="surface-row flex items-center justify-between px-4 py-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{job.document}</p>
              <p class="text-xs text-muted-foreground">
                {job.user} · {job.printerName} · {job.time}
              </p>
            </div>
            <span
              class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {job.status === 'completed'
                ? 'bg-green-500/10 text-green-600'
                : job.status === 'failed'
                  ? 'bg-red-500/10 text-red-600'
                  : 'bg-primary/10 text-primary'}"
            >
              {job.status}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <div class="surface-panel p-6">
      <div class="flex items-center justify-between mb-5">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Ticket class="h-5 w-5 text-amber-500" />
          Open tickets
        </h3>
        <button
          type="button"
          on:click={() => goto("/support")}
          class="text-xs text-primary hover:underline"
        >
          Resolve tickets
        </button>
      </div>
      <div class="space-y-3">
        {#each $openTickets.slice(0, 4) as ticket}
          <button
            type="button"
            on:click={() => goto("/support")}
            class="surface-row flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-muted/50"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium text-foreground">{ticket.subject}</p>
              <p class="text-xs text-muted-foreground">
                {ticket.id} · {ticket.customer}
                {#if ticket.computerName}
                  · {ticket.computerName}
                {/if}
              </p>
            </div>
            <span class="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600">
              {ticket.status.replace("_", " ")}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Architecture note -->
  <div class="rounded-2xl border border-primary/20 bg-primary/5 p-6">
    <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">
      Print architecture
    </p>
    <p class="text-sm text-muted-foreground leading-relaxed">
      Bizflow Cloud → Print Agent → Local printers. Your browser never talks directly to
      printers on the LAN. Install the Bizflow Print Agent on a network computer and pair it
      in <button type="button" class="text-primary hover:underline" on:click={() => goto("/printing/settings")}>Print Settings</button>.
    </p>
  </div>
</AppShell>
