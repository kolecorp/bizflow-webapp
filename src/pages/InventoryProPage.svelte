<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { extensions } from "$lib/stores/extensions";
  import {
    inventory,
    lowStockItems,
    stockAdjustments,
  } from "$lib/stores/businessData";
  import {
    AlertTriangle,
    ArrowUpRight,
    Package,
    TrendingUp,
  } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "INVENTORY_PRO"));
  let recentAdjustments = $derived($stockAdjustments.slice(0, 4));
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title={extension?.name || "Inventory Pro"}
    description="Track stock movement, monitor low-stock risk, and keep replenishment decisions moving without leaving the workspace."
  />

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <div class="flex items-center justify-between gap-3">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Total items
        </p>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
        >
          <Package class="h-4 w-4" />
        </span>
      </div>
      <p class="mt-4 font-heading text-3xl font-black tracking-[-0.06em]">
        {$inventory.length}
      </p>
    </div>

    <div class="surface-stat border-amber-500/30 bg-amber-500/5 p-5">
      <div class="flex items-center justify-between gap-3">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Low stock
        </p>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"
        >
          <AlertTriangle class="h-4 w-4" />
        </span>
      </div>
      <p
        class="mt-4 font-heading text-3xl font-black tracking-[-0.06em] text-amber-600"
      >
        {$lowStockItems.length}
      </p>
    </div>

    <div class="surface-stat p-5">
      <div class="flex items-center justify-between gap-3">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Adjustments
        </p>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600"
        >
          <TrendingUp class="h-4 w-4" />
        </span>
      </div>
      <p class="mt-4 font-heading text-3xl font-black tracking-[-0.06em]">
        {$stockAdjustments.length}
      </p>
    </div>
  </div>

  <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
    <section class="surface-panel p-5 sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Stock health
          </p>
          <h2 class="mt-2 text-lg font-bold text-foreground">
            Needs attention
          </h2>
        </div>
        <span
          class="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Live
        </span>
      </div>

      {#if $lowStockItems.length > 0}
        <div class="mt-5 space-y-2">
          {#each $lowStockItems as item}
            <div
              class="flex items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p class="text-xs text-muted-foreground">{item.location}</p>
              </div>
              <span class="shrink-0 text-xs font-semibold text-amber-700">
                {item.quantity}/{item.minQuantity}
                {item.unit}
              </span>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="mt-5 rounded-lg border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
        >
          All tracked inventory items are above minimum thresholds.
        </div>
      {/if}
    </section>

    <aside class="surface-panel p-5 sm:p-6">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Quick actions
      </p>
      <div class="mt-4 space-y-2">
        <a
          href="/extensions/inventory"
          class="block rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-sm text-foreground hover:bg-muted"
        >
          Review low stock list
        </a>
        <button
          type="button"
          onclick={() => {
            const csv = $inventory
              .map((item) => `${item.name},${item.quantity},${item.unit}`)
              .join("\n");
            const blob = new Blob([`Item,Quantity,Unit\n${csv}`], {
              type: "text/csv",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "inventory-report.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
          class="w-full rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted"
        >
          Export current stock report
        </button>
        <a
          href="/transactions"
          class="block rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-sm text-foreground hover:bg-muted"
        >
          Check pending adjustments
        </a>
      </div>
    </aside>
  </div>

  <section class="surface-panel mt-4 p-5 sm:p-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          Recent activity
        </p>
        <h3 class="mt-2 text-lg font-bold text-foreground">
          Stock adjustments
        </h3>
      </div>
      <a
        href="/transactions"
        class="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground"
      >
        View log
        <ArrowUpRight class="h-3.5 w-3.5" />
      </a>
    </div>

    <div class="mt-5 space-y-2">
      {#if recentAdjustments.length > 0}
        {#each recentAdjustments as adjustment}
          <div
            class="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/80 px-3 py-2.5"
          >
            <div>
              <p class="text-sm font-medium text-foreground">
                {adjustment.itemName}
              </p>
              <p class="text-xs text-muted-foreground">{adjustment.reason}</p>
            </div>
            <span class="text-sm font-semibold text-foreground"
              >{adjustment.type === "add" ? "+" : adjustment.type === "remove" ? "-" : ""}{adjustment.quantity}</span
            >
          </div>
        {/each}
      {:else}
        <div
          class="rounded-lg border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
        >
          No stock adjustments logged yet.
        </div>
      {/if}
    </div>
  </section>
</AppShell>
