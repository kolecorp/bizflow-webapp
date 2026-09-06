<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { UsersRound, Search } from "@lucide/svelte";

  let { open = false, onOpenChange } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
  }>();

  const customers = [
    { name: "Ibrahim Musa", phone: "0803•••218", balance: 14500 },
    { name: "Chinedu Okafor", phone: "0806•••901", balance: 8200 },
    { name: "Aisha Bello", phone: "0814•••442", balance: 4000 },
    { name: "Adeola Johnson", phone: "0701•••331", balance: 1250 },
  ];
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <UsersRound class="h-5 w-5 text-primary" />
        Customer Balances
      </Dialog.Title>
      <Dialog.Description>
        Overview of all active customer wallets.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-2">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search customers..." 
          class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm"
        />
      </div>
      
      <div class="custom-scrollbar max-h-[300px] overflow-y-auto space-y-2">
        {#each customers as customer}
          <div class="flex items-center justify-between rounded-xl border border-border/60 p-3 transition hover:bg-muted/30">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p class="text-sm font-semibold text-foreground">{customer.name}</p>
                <p class="text-xs text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
            <p class="text-sm font-bold text-foreground">₦{customer.balance.toLocaleString()}</p>
          </div>
        {/each}
      </div>
    </div>

    <Dialog.Footer class="border-t-0 bg-transparent p-0 pt-2">
      <Button onclick={() => onOpenChange(false)}>Done</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
