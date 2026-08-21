<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { canAccess } from "$lib/stores/permissions";
  import {
    inventory,
    stockAdjustments,
    lowStockItems,
    adjustStock,
  } from "$lib/stores/businessData";
  import { Package, AlertTriangle, Plus, Minus, ClipboardList } from "@lucide/svelte";

  let selectedItemId = "";
  let adjustType: "add" | "remove" | "count" = "count";
  let adjustQty = "";
  let adjustReason = "";

  $: userRole = $authStore.user?.role ?? "staff";
  $: canAdjust = canAccess(userRole, "inventory.adjust");
  $: selectedItem = $inventory.find((i) => i.id === selectedItemId);

  function handleAdjust() {
    if (!selectedItemId || !adjustQty || !canAdjust) return;
    adjustStock(
      selectedItemId,
      adjustType,
      parseInt(adjustQty, 10),
      adjustReason || "Stock adjustment",
      $authStore.user?.name ?? "Staff",
    );
    adjustQty = "";
    adjustReason = "";
  }

  function isLowStock(item: { quantity: number; minQuantity: number }) {
    return item.quantity <= item.minQuantity;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Inventory"
    title="Stock taking"
    description="Count stock, record adjustments, and monitor low-stock alerts for paper, ink, and supplies."
  />

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Total items
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">{$inventory.length}</p>
    </div>
    <div class="surface-stat border-amber-500/30 bg-amber-500/5 p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Low stock alerts
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-amber-600">
        {$lowStockItems.length}
      </p>
    </div>
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Adjustments today
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">
        {$stockAdjustments.length}
      </p>
    </div>
  </div>

  {#if !canAdjust}
    <div class="surface-muted px-4 py-3 text-sm text-muted-foreground">
      Stock adjustments require inventory privileges. View-only access for your role.
    </div>
  {/if}

  <!-- Stock adjustment form -->
  {#if canAdjust}
    <div class="surface-panel p-6">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
        <ClipboardList class="h-5 w-5" />
        Record stock adjustment
      </h3>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Item
          </label>
          <select
            bind:value={selectedItemId}
            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="">Select item</option>
            {#each $inventory as item}
              <option value={item.id}>{item.name}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Type
          </label>
          <select
            bind:value={adjustType}
            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="count">Physical count</option>
            <option value="add">Add stock</option>
            <option value="remove">Remove stock</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quantity
          </label>
          <input
            type="number"
            bind:value={adjustQty}
            placeholder="0"
            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reason
          </label>
          <input
            type="text"
            bind:value={adjustReason}
            placeholder="e.g. Weekly count"
            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          />
        </div>
      </div>
      {#if selectedItem}
        <p class="mt-3 text-sm text-muted-foreground">
          Current stock: <strong class="text-foreground">{selectedItem.quantity} {selectedItem.unit}</strong>
          (min {selectedItem.minQuantity})
        </p>
      {/if}
      <button
        type="button"
        on:click={handleAdjust}
        class="btn-app-primary mt-4"
      >
        Save adjustment
      </button>
    </div>
  {/if}

  <!-- Inventory table -->
  <div class="surface-panel overflow-hidden">
    <div class="border-b border-border/60 px-6 py-4">
      <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Package class="h-5 w-5" />
        Stock levels
      </h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th class="px-6 py-3 font-semibold">Item</th>
            <th class="px-4 py-3 font-semibold">Category</th>
            <th class="px-4 py-3 font-semibold">SKU</th>
            <th class="px-4 py-3 font-semibold">Quantity</th>
            <th class="px-4 py-3 font-semibold">Min</th>
            <th class="px-4 py-3 font-semibold">Location</th>
            <th class="px-4 py-3 font-semibold">Last counted</th>
          </tr>
        </thead>
        <tbody>
          {#each $inventory as item}
            <tr class="border-b border-border/40 hover:bg-muted/30">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  {#if isLowStock(item)}
                    <AlertTriangle class="h-4 w-4 text-amber-500 shrink-0" />
                  {/if}
                  <span class="font-medium text-foreground">{item.name}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-muted-foreground">{item.category}</td>
              <td class="px-4 py-4 font-mono text-xs text-muted-foreground">{item.sku}</td>
              <td class="px-4 py-4">
                <span class={isLowStock(item) ? "font-bold text-amber-600" : "text-foreground"}>
                  {item.quantity} {item.unit}
                </span>
              </td>
              <td class="px-4 py-4 text-muted-foreground">{item.minQuantity}</td>
              <td class="px-4 py-4 text-muted-foreground">{item.location}</td>
              <td class="px-4 py-4 text-muted-foreground">{item.lastCounted ?? "—"}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Recent adjustments -->
  <div class="surface-panel p-6">
    <h3 class="text-lg font-semibold text-foreground mb-4">Recent adjustments</h3>
    <div class="space-y-3">
      {#each $stockAdjustments as adj}
        <div class="surface-row flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-3">
            {#if adj.type === "add"}
              <Plus class="h-4 w-4 text-green-600" />
            {:else if adj.type === "remove"}
              <Minus class="h-4 w-4 text-red-500" />
            {:else}
              <ClipboardList class="h-4 w-4 text-primary" />
            {/if}
            <div>
              <p class="text-sm font-medium text-foreground">{adj.itemName}</p>
              <p class="text-xs text-muted-foreground">{adj.reason} · {adj.by}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-foreground">
              {adj.type === "count" ? "Count:" : adj.type === "add" ? "+" : "−"}
              {adj.quantity}
            </p>
            <p class="text-xs text-muted-foreground">{adj.time}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</AppShell>
