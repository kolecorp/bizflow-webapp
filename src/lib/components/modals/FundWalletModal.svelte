<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { WalletCards, ArrowRight, CreditCard, Banknote } from "@lucide/svelte";

  let { open = false, onOpenChange, onConfirm } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (amount: number, method: string) => void;
  }>();

  let amount = $state(10000);
  let method = $state("transfer");
  let isProcessing = $state(false);

  function handleConfirm() {
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      onConfirm(amount, method);
    }, 1500);
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <WalletCards class="h-5 w-5 text-primary" />
        Fund Business Wallet
      </Dialog.Title>
      <Dialog.Description>
        Add funds to your main float for VTU and payouts.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <label class="block text-sm font-medium">
        Amount (₦)
        <input
          type="number"
          bind:value={amount}
          class="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-lg font-semibold shadow-sm"
        />
      </label>

      <div class="space-y-3">
        <p class="text-sm font-medium">Payment Method</p>
        
        <label class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-muted/50 {method === 'transfer' ? 'border-primary bg-primary/5' : 'border-border/60'}">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <Banknote class="h-4 w-4" />
            </div>
            <div>
              <p class="text-sm font-semibold">Bank Transfer</p>
              <p class="text-xs text-muted-foreground">Virtual account transfer</p>
            </div>
          </div>
          <input type="radio" bind:group={method} value="transfer" class="h-4 w-4 accent-primary text-primary" />
        </label>

        <label class="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-muted/50 {method === 'card' ? 'border-primary bg-primary/5' : 'border-border/60'}">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <CreditCard class="h-4 w-4" />
            </div>
            <div>
              <p class="text-sm font-semibold">Debit Card</p>
              <p class="text-xs text-muted-foreground">Instant card payment</p>
            </div>
          </div>
          <input type="radio" bind:group={method} value="card" class="h-4 w-4 accent-primary text-primary" />
        </label>
      </div>
    </div>

    <Dialog.Footer class="gap-2 border-t-0 bg-transparent p-0 pt-2 sm:gap-0">
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
      <Button onclick={handleConfirm} disabled={isProcessing}>
        {isProcessing ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
        {#if !isProcessing}<ArrowRight class="ml-2 h-4 w-4" />{/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
