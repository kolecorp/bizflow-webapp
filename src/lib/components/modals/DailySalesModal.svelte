<script lang="ts">
  import { modals } from "$lib/stores/modals";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { TrendingUp } from "@lucide/svelte";
  import { todayRevenue, todayTransactions } from "$lib/stores/businessData";

  $: open = $modals.dailySales;

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) modals.closeDailySales();
  }

  $: breakdown = (() => {
    const map = new Map<string, number>();
    for (const tx of $todayTransactions) {
      map.set(tx.service, (map.get(tx.service) ?? 0) + tx.amount);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  })();

  $: maxAmount = breakdown.length > 0 ? breakdown[0][1] : 1;
  $: avgTx =
    $todayTransactions.length > 0
      ? Math.round($todayRevenue / $todayTransactions.length)
      : 0;
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <TrendingUp class="h-5 w-5 text-emerald-500" />
        Today's sales
      </Dialog.Title>
      <Dialog.Description>Daily sales overview and breakdown</Dialog.Description>
    </Dialog.Header>

    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="glow-stat-card glow-emerald">
          <div class="glow-stat-card__inner p-4">
            <p class="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Total sales
            </p>
            <p class="mt-2 text-2xl font-bold tracking-[-0.05em] text-foreground">
              ₦{$todayRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div class="glow-stat-card glow-blue">
          <div class="glow-stat-card__inner p-4">
            <p class="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Transactions
            </p>
            <p class="mt-2 text-2xl font-bold tracking-[-0.05em] text-foreground">
              {$todayTransactions.length}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">Avg: ₦{avgTx.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div class="glow-panel p-4">
        <p class="mb-4 text-sm font-semibold text-foreground">Sales by service</p>
        <div class="space-y-3">
          {#each breakdown as [service, amount]}
            <div>
              <div class="mb-1 flex items-center justify-between">
                <span class="text-sm text-foreground">{service}</span>
                <span class="text-xs font-semibold text-foreground">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
              <div class="h-2 w-full rounded-full bg-muted">
                <div
                  class="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-500"
                  style="width: {(amount / maxAmount) * 100}%"
                ></div>
              </div>
            </div>
          {/each}
          {#if breakdown.length === 0}
            <p class="text-sm text-muted-foreground">No sales recorded today.</p>
          {/if}
        </div>
      </div>
    </div>

    <Dialog.Footer class="border-t-0 bg-transparent p-0 pt-2">
      <Button variant="outline" onclick={() => modals.closeDailySales()}>Close</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
