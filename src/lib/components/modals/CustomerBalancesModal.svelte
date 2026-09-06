<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { UsersRound, Search } from "@lucide/svelte";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

  let { open = false, onOpenChange } = $props<{
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
  }>();

  let customers = $state<{ name: string; phone: string; balance: number }[]>(
    [],
  );
  let query = $state("");
  let error = $state("");
  let filteredCustomers = $derived(
    customers.filter((customer) =>
      `${customer.name} ${customer.phone}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
  );

  onMount(() => void loadCustomers());

  async function loadCustomers() {
    try {
      const token = $authStore.accessToken;
      const response = await fetch(`${API_BASE_URL}/wallet/customers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to load customer wallets.");
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : payload?.data;
      customers = (Array.isArray(rows) ? rows : [])
        .filter((row) => row?.isActive !== false)
        .map((row) => ({
          name: row.name ?? row.customer?.name ?? "Unnamed customer",
          phone: row.phone ?? row.customer?.phone ?? "",
          balance: Number.isFinite(Number(row.balance ?? row.walletBalance))
            ? Number(row.balance ?? row.walletBalance)
            : 0,
        }));
    } catch (loadError) {
      error =
        loadError instanceof Error
          ? loadError.message
          : "Unable to load customer wallets.";
    }
  }
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
        <Search
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          bind:value={query}
          placeholder="Search customers..."
          class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm"
        />
      </div>

      <div class="custom-scrollbar max-h-[300px] overflow-y-auto space-y-2">
        {#if error}<p class="text-sm text-destructive">{error}</p>{/if}
        {#each filteredCustomers as customer}
          <div
            class="flex items-center justify-between rounded-xl border border-border/60 p-3 transition hover:bg-muted/30"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary"
              >
                {customer.name.charAt(0)}
              </div>
              <div>
                <p class="text-sm font-semibold text-foreground">
                  {customer.name}
                </p>
                <p class="text-xs text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
            <p class="text-sm font-bold text-foreground">
              ₦{customer.balance.toLocaleString()}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <Dialog.Footer class="border-t-0 bg-transparent p-0 pt-2">
      <Button onclick={() => onOpenChange(false)}>Done</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
