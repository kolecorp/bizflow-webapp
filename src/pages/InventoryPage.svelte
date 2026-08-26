<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import * as Dialog from "$lib/components/ui/dialog";
  import { canAccess } from "$lib/stores/permissions";
  import {
    inventory,
    stockAdjustments,
    lowStockItems,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } from "$lib/stores/businessData";
  import {
    Package,
    AlertTriangle,
    Plus,
    Minus,
    ClipboardList,
    Edit3,
    Trash2,
    X,
    BellRing,
  } from "@lucide/svelte";

  let selectedItemId = "";
  let adjustType: "add" | "remove" | "count" = "count";
  let adjustQty = "";
  let adjustReason = "";
  let showItemForm = false;
  let editingItemId = "";
  let itemName = "";
  let itemCategory = "Supplies";
  let itemSku = "";
  let itemQuantity = "";
  let itemMinQuantity = "";
  let itemUnit = "units";
  let itemLocation = "Main store";
  let itemCost = "";
  let itemError = "";

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

  function openNewItem() {
    editingItemId = "";
    itemName = "";
    itemCategory = "Supplies";
    itemSku = "";
    itemQuantity = "";
    itemMinQuantity = "";
    itemUnit = "units";
    itemLocation = "Main store";
    itemCost = "";
    itemError = "";
    showItemForm = true;
  }

  function openEditItem(item: (typeof $inventory)[number]) {
    editingItemId = item.id;
    itemName = item.name;
    itemCategory = item.category;
    itemSku = item.sku;
    itemQuantity = String(item.quantity);
    itemMinQuantity = String(item.minQuantity);
    itemUnit = item.unit;
    itemLocation = item.location;
    itemCost = item.costPerUnit ? String(item.costPerUnit) : "";
    itemError = "";
    showItemForm = true;
  }

  function saveItem(event: SubmitEvent) {
    event.preventDefault();
    const quantity = Number(itemQuantity);
    const minQuantity = Number(itemMinQuantity);
    const costPerUnit = itemCost ? Number(itemCost) : undefined;
    if (
      !itemName.trim() ||
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      !Number.isFinite(minQuantity) ||
      minQuantity < 0 ||
      !itemUnit.trim() ||
      !itemLocation.trim()
    ) {
      itemError = "Enter an item name, valid quantities, unit, and location.";
      return;
    }
    const values = {
      name: itemName.trim(),
      category: itemCategory.trim() || "Supplies",
      sku: itemSku.trim() || "-",
      quantity,
      minQuantity,
      unit: itemUnit.trim(),
      location: itemLocation.trim(),
      costPerUnit,
    };
    if (editingItemId) updateInventoryItem(editingItemId, values);
    else addInventoryItem(values);
    showItemForm = false;
    itemError = "";
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
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Total items
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">
        {$inventory.length}
      </p>
    </div>
    <div class="surface-stat border-amber-500/30 bg-amber-500/5 p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Low stock alerts
      </p>
      <p
        class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-amber-600"
      >
        {$lowStockItems.length}
      </p>
    </div>
    <div class="surface-stat p-5">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Adjustments today
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">
        {$stockAdjustments.length}
      </p>
    </div>
  </div>

  {#if $lowStockItems.length > 0}
    <section
      class="surface-panel border-amber-500/30 bg-amber-500/5 p-5 sm:p-6"
    >
      <div class="flex items-start gap-3">
        <BellRing class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h3 class="text-sm font-bold text-foreground">
            Stock alerts need attention
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {$lowStockItems.length}
            {$lowStockItems.length === 1 ? "item is" : "items are"} at or below its
            alert threshold.
          </p>
        </div>
      </div>
      <div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {#each $lowStockItems as item}<div
            class="flex items-center justify-between rounded-lg border border-amber-500/20 bg-background/60 px-3 py-2"
          >
            <span class="truncate text-sm font-medium text-foreground"
              >{item.name}</span
            ><span class="ml-3 shrink-0 text-xs font-bold text-amber-700"
              >{item.quantity}/{item.minQuantity} {item.unit}</span
            >
          </div>{/each}
      </div>
    </section>
  {/if}

  {#if canAdjust}
    <Dialog.Root
      open={showItemForm}
      onOpenChange={(open) => (showItemForm = open)}
    >
      <Dialog.Content
        class="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl"
      >
        <Dialog.Header>
          <Dialog.Title
            >{editingItemId
              ? "Edit stock item"
              : "Add stock item"}</Dialog.Title
          >
          <Dialog.Description
            >Set the current quantity and the threshold that should trigger a
            stock alert.</Dialog.Description
          >
        </Dialog.Header>
        <form
          class="mt-6 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-2 lg:grid-cols-4"
          onsubmit={saveItem}
        >
          <label class="text-sm font-medium text-foreground sm:col-span-2"
            >Item name<input
              bind:value={itemName}
              placeholder="A4 paper"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Category<input
              bind:value={itemCategory}
              placeholder="Supplies"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >SKU<input
              bind:value={itemSku}
              placeholder="A4-80GSM"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Quantity<input
              bind:value={itemQuantity}
              type="number"
              min="0"
              step="1"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Alert below<input
              bind:value={itemMinQuantity}
              type="number"
              min="0"
              step="1"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Unit<input
              bind:value={itemUnit}
              placeholder="packs"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Location<input
              bind:value={itemLocation}
              placeholder="Main store"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <label class="text-sm font-medium text-foreground"
            >Cost per unit<input
              bind:value={itemCost}
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional"
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            /></label
          >
          <div class="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <button type="submit" class="btn-app-primary"
              >{editingItemId ? "Save item" : "Create item"}</button
            ><button
              type="button"
              onclick={() => (showItemForm = false)}
              class="btn-app-secondary"><X class="h-4 w-4" />Cancel</button
            >
          </div>
          {#if itemError}<p
              class="text-xs font-medium text-red-500 sm:col-span-2 lg:col-span-4"
            >
              {itemError}
            </p>{/if}
        </form>
      </Dialog.Content>
    </Dialog.Root>
  {/if}

  {#if !canAdjust}
    <div class="surface-muted px-4 py-3 text-sm text-muted-foreground">
      Stock adjustments require inventory privileges. View-only access for your
      role.
    </div>
  {/if}

  <!-- Stock adjustment form -->
  {#if canAdjust}
    <div class="surface-panel p-6">
      <div
        class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <h3
          class="flex items-center gap-2 text-lg font-semibold text-foreground"
        >
          <ClipboardList class="h-5 w-5" />
          Record stock adjustment
        </h3>
        <button type="button" onclick={openNewItem} class="btn-app-primary"
          ><Plus class="h-4 w-4" />Add stock item</button
        >
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="space-y-2">
          <label
            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
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
          <label
            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
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
          <label
            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
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
          <label
            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
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
          Current stock: <strong class="text-foreground"
            >{selectedItem.quantity} {selectedItem.unit}</strong
          >
          (min {selectedItem.minQuantity})
        </p>
      {/if}
      <button type="button" onclick={handleAdjust} class="btn-app-primary mt-4">
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
    {#if $inventory.length === 0}
      <div class="flex flex-col items-center justify-center p-12 text-center">
        <div
          class="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        >
          <Package class="h-8 w-8" />
        </div>
        <h3 class="font-heading text-xl font-bold text-foreground mb-2">
          No items in inventory
        </h3>
        <p class="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
          Track your paper, ink, and supplies. Add your first item to start
          receiving low-stock alerts.
        </p>
        <button type="button" onclick={openNewItem} class="btn-app-primary">
          Add stock item
        </button>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"
            >
              <th class="px-6 py-3 font-semibold">Item</th>
              <th class="px-4 py-3 font-semibold">Category</th>
              <th class="px-4 py-3 font-semibold">SKU</th>
              <th class="px-4 py-3 font-semibold">Quantity</th>
              <th class="px-4 py-3 font-semibold">Min</th>
              <th class="px-4 py-3 font-semibold">Location</th>
              <th class="px-4 py-3 font-semibold">Last counted</th>
              {#if canAdjust}<th class="px-4 py-3 text-right font-semibold"
                  >Manage</th
                >{/if}
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
                <td class="px-4 py-4 font-mono text-xs text-muted-foreground"
                  >{item.sku}</td
                >
                <td class="px-4 py-4">
                  <span
                    class={isLowStock(item)
                      ? "font-bold text-amber-600"
                      : "text-foreground"}
                  >
                    {item.quantity}
                    {item.unit}
                  </span>
                </td>
                <td class="px-4 py-4 text-muted-foreground"
                  >{item.minQuantity}</td
                >
                <td class="px-4 py-4 text-muted-foreground">{item.location}</td>
                <td class="px-4 py-4 text-muted-foreground"
                  >{item.lastCounted ?? "—"}</td
                >
                {#if canAdjust}<td class="px-4 py-4"
                    ><div class="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${item.name}`}
                        title={`Edit ${item.name}`}
                        onclick={() => openEditItem(item)}
                        class="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        ><Edit3 class="h-4 w-4" /></button
                      ><button
                        type="button"
                        aria-label={`Delete ${item.name}`}
                        title={`Delete ${item.name}`}
                        onclick={() => deleteInventoryItem(item.id)}
                        class="rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600"
                        ><Trash2 class="h-4 w-4" /></button
                      >
                    </div></td
                  >{/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Recent adjustments -->
  <div class="surface-panel p-6">
    <h3 class="text-lg font-semibold text-foreground mb-4">
      Recent adjustments
    </h3>
    {#if $stockAdjustments.length === 0}
      <div
        class="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
      >
        <ClipboardList class="h-6 w-6 mb-2 opacity-50" />
        <p class="text-xs">No adjustments recorded yet.</p>
      </div>
    {:else}
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
                <p class="text-sm font-medium text-foreground">
                  {adj.itemName}
                </p>
                <p class="text-xs text-muted-foreground">
                  {adj.reason} · {adj.by}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-foreground">
                {adj.type === "count"
                  ? "Count:"
                  : adj.type === "add"
                    ? "+"
                    : "−"}
                {adj.quantity}
              </p>
              <p class="text-xs text-muted-foreground">{adj.time}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</AppShell>
