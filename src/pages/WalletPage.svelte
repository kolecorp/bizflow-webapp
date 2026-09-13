<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    LoaderCircle,
    RefreshCw,
    WalletCards,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";

  type Wallet = {
    id: string;
    type: string;
    currency: string;
    balance: string | number;
    status: string;
  };
  type LedgerEntry = {
    id: string;
    direction: "DEBIT" | "CREDIT";
    amount: string | number;
    currency: string;
    reference: string;
    createdAt: string;
  };
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let wallets = $state<Wallet[]>([]);
  let selectedWalletId = $state("");
  let ledger = $state<LedgerEntry[]>([]);
  let loading = $state(true);
  let ledgerLoading = $state(false);
  let transferOpen = $state(false);
  let transferLoading = $state(false);
  let error = $state("");
  let walletLoadInFlight = false;
  let form = $state({
    fromType: "MAIN",
    toType: "VTU_FLOAT",
    amount: "",
    reference: "",
  });

  const money = (value: string | number, currency = "NGN") =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  const label = (value: string) => value.replaceAll("_", " ");
  const request = async (path: string, init?: RequestInit) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init?.headers ?? {}),
      },
    });
    if (!response.ok)
      throw new Error(
        (await response.json().catch(() => null))?.message ??
          "Wallet request failed.",
      );
    return response.json();
  };

  async function loadWallets() {
    if (walletLoadInFlight) return;
    walletLoadInFlight = true;
    loading = true;
    error = "";
    try {
      await request("/wallets/provision", {
        method: "POST",
        body: JSON.stringify({ type: "MAIN", currency: "NGN" }),
      });
      wallets = await request("/wallets");
      selectedWalletId ||= wallets[0]?.id ?? "";
      if (selectedWalletId) await loadLedger(selectedWalletId);
    } catch (cause) {
      error =
        cause instanceof Error ? cause.message : "Unable to load wallets.";
    } finally {
      loading = false;
      walletLoadInFlight = false;
    }
  }

  async function loadLedger(walletId: string) {
    selectedWalletId = walletId;
    ledgerLoading = true;
    try {
      ledger = (await request(`/wallets/${walletId}/ledger?limit=8`)).entries;
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Unable to load ledger.",
      );
    } finally {
      ledgerLoading = false;
    }
  }

  async function transfer() {
    transferLoading = true;
    try {
      await request("/wallets/transfer", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Transfer completed");
      transferOpen = false;
      form = { ...form, amount: "", reference: "" };
      await loadWallets();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Transfer failed.");
    } finally {
      transferLoading = false;
    }
  }

  onMount(() => {
    void loadWallets();
  });
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · Payments"
    title="Wallet & payments"
    description="A clear view of every balance, transfer, and ledger movement across your business."
    infographic="/wallet_infographics.png"
    infographicAlt="Wallet and payments overview"
  />
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-foreground">Business wallets</p>
        <p class="text-sm text-muted-foreground">
          Balances are separated by purpose and currency.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="btn-app-secondary text-xs"
          type="button"
          onclick={() => void loadWallets()}
          disabled={loading}><RefreshCw class="h-4 w-4" /> Refresh</button
        ><button
          class="btn-app-primary text-xs"
          type="button"
          onclick={() => (transferOpen = !transferOpen)}
          ><ArrowLeftRight class="h-4 w-4" /> Transfer funds</button
        >
      </div>
    </div>

    {#if transferOpen}
      <form
        class="surface-panel grid gap-4 p-5 md:grid-cols-4"
        onsubmit={(event) => {
          event.preventDefault();
          void transfer();
        }}
      >
        <label class="text-xs font-semibold text-muted-foreground"
          >From<select
            bind:value={form.fromType}
            class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            ><option>MAIN</option><option>SALES_COLLECTIONS</option><option
              >VTU_FLOAT</option
            ><option>ESCROW</option></select
          ></label
        >
        <label class="text-xs font-semibold text-muted-foreground"
          >To<select
            bind:value={form.toType}
            class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            ><option>VTU_FLOAT</option><option>MAIN</option><option
              >ESCROW</option
            ><option>SALES_COLLECTIONS</option></select
          ></label
        >
        <label class="text-xs font-semibold text-muted-foreground"
          >Amount<input
            required
            pattern={"^\\d+(\\.\\d{1,2})?$"}
            bind:value={form.amount}
            placeholder="0.00"
            class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          /></label
        >
        <label class="text-xs font-semibold text-muted-foreground"
          >Reference<input
            required
            maxlength="128"
            bind:value={form.reference}
            placeholder="e.g. float-setup-001"
            class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          /></label
        >
        <button
          class="btn-app-primary md:col-span-4 md:justify-self-end"
          type="submit"
          disabled={transferLoading}
          >{#if transferLoading}<LoaderCircle class="h-4 w-4 animate-spin" /> Processing{:else}Complete
            transfer{/if}</button
        >
      </form>
    {/if}

    {#if loading}
      <div
        class="surface-panel flex min-h-48 items-center justify-center text-sm text-muted-foreground"
      >
        <LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Loading wallet balances
      </div>
    {:else if error}
      <div class="surface-panel p-6 text-sm text-destructive">{error}</div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {#each wallets as wallet}
          <button
            type="button"
            class={`surface-panel p-5 text-left transition ${selectedWalletId === wallet.id ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/40"}`}
            onclick={() => void loadLedger(wallet.id)}
          >
            <div class="flex items-start justify-between gap-3">
              <span
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                ><WalletCards class="h-5 w-5" /></span
              ><span
                class="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground"
                >{wallet.status}</span
              >
            </div>
            <p
              class="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {label(wallet.type)}
            </p>
            <p class="mt-2 font-heading text-2xl font-bold text-foreground">
              {money(wallet.balance, wallet.currency)}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {wallet.currency} ledger balance
            </p>
          </button>
        {:else}<div
            class="surface-panel p-8 text-sm text-muted-foreground md:col-span-2 xl:col-span-4"
          >
            No wallets have been provisioned for this business yet.
          </div>{/each}
      </div>

      <div class="surface-panel overflow-hidden">
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-5"
        >
          <div>
            <h2 class="text-lg font-bold">Ledger activity</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Append-only financial history for the selected wallet.
            </p>
          </div>
          {#if selectedWalletId}<span
              class="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
              >{ledger.length} recent entries</span
            >{/if}
        </div>
        {#if ledgerLoading}<div class="p-8 text-sm text-muted-foreground">
            Loading ledger...
          </div>{:else if ledger.length === 0}<div
            class="p-8 text-sm text-muted-foreground"
          >
            No ledger activity for this wallet yet.
          </div>{:else}<div class="divide-y divide-border/60">
            {#each ledger as entry}<div
                class="flex items-center gap-3 px-5 py-4"
              >
                <span
                  class={`flex h-9 w-9 items-center justify-center rounded-lg ${entry.direction === "CREDIT" ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}
                  >{#if entry.direction === "CREDIT"}<ArrowDownLeft
                      class="h-4 w-4"
                    />{:else}<ArrowUpRight class="h-4 w-4" />{/if}</span
                ><span class="min-w-0 flex-1"
                  ><span class="block text-sm font-semibold"
                    >{entry.reference}</span
                  ><span class="block text-xs text-muted-foreground"
                    >{new Date(entry.createdAt).toLocaleString()}</span
                  ></span
                ><span
                  class={`text-sm font-bold ${entry.direction === "CREDIT" ? "text-green-600" : "text-foreground"}`}
                  >{entry.direction === "CREDIT" ? "+" : "-"}{money(
                    entry.amount,
                    entry.currency,
                  )}</span
                >
              </div>{/each}
          </div>{/if}
      </div>
    {/if}
  </div>
</AppShell>
