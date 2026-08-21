<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { todayTransactions, todayRevenue } from "$lib/stores/businessData";
  import { modals } from "$lib/stores/modals";
  import { BarChart3, Plus } from "@lucide/svelte";

  $: serviceBreakdown = (() => {
    const map = new Map<string, number>();
    for (const tx of $todayTransactions) {
      map.set(tx.service, (map.get(tx.service) ?? 0) + tx.amount);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  })();

  $: maxAmount = serviceBreakdown.length > 0 ? serviceBreakdown[0][1] : 1;
</script>

<AppShell>
  <PageHeader
    eyebrow="Reports"
    title="Daily sales"
    description="Today's revenue breakdown by service type."
  >
    <svelte:fragment slot="actions">
      <button
        type="button"
        on:click={() => modals.openNewTransaction()}
        class="btn-app-primary"
      >
        <Plus class="h-4 w-4" />
        Add transaction
      </button>
    </svelte:fragment>
  </PageHeader>

  <div class="grid gap-4 sm:grid-cols-2">
    <div class="surface-stat p-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Total revenue today
      </p>
      <p class="mt-2 font-heading text-4xl font-black tracking-[-0.06em] text-foreground">
        ₦{$todayRevenue.toLocaleString()}
      </p>
    </div>
    <div class="surface-stat p-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Transactions
      </p>
      <p class="mt-2 font-heading text-4xl font-black tracking-[-0.06em] text-foreground">
        {$todayTransactions.length}
      </p>
    </div>
  </div>

  <div class="surface-panel p-6">
    <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
      <BarChart3 class="h-5 w-5" />
      Revenue by service
    </h3>
    <div class="space-y-4">
      {#each serviceBreakdown as [service, amount]}
        <div>
          <div class="flex items-center justify-between text-sm mb-1.5">
            <span class="font-medium text-foreground">{service}</span>
            <span class="text-muted-foreground">₦{amount.toLocaleString()}</span>
          </div>
          <div class="h-2 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full rounded-full bg-primary transition-all"
              style="width: {(amount / maxAmount) * 100}%"
            ></div>
          </div>
        </div>
      {/each}
      {#if serviceBreakdown.length === 0}
        <p class="text-sm text-muted-foreground">No transactions recorded today.</p>
      {/if}
    </div>
  </div>

  <div class="surface-panel p-6">
    <h3 class="text-lg font-semibold text-foreground mb-4">Transaction log</h3>
    <div class="space-y-2">
      {#each $todayTransactions as tx}
        <div class="surface-row flex items-center justify-between px-4 py-3">
          <div>
            <p class="text-sm font-medium text-foreground">{tx.service}</p>
            <p class="text-xs text-muted-foreground">{tx.customer} · {tx.time}</p>
          </div>
          <p class="font-bold text-foreground">₦{tx.amount.toLocaleString()}</p>
        </div>
      {/each}
    </div>
  </div>
</AppShell>
