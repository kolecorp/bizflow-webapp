<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import {
    Activity,
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    Code2,
    PlugZap,
    RefreshCw,
    ShieldCheck,
    Smartphone,
    Zap,
  } from "@lucide/svelte";

  type Config = {
    mode: "BIZFLOW_HOSTED" | "BYO";
    status: string;
    walletId?: string | null;
  } | null;
  type Transaction = {
    reference: string;
    productType: string;
    network?: string;
    recipient: string;
    amountCharged: string | number;
    status: string;
    createdAt: string;
    updatedAt?: string;
    providerReference?: string | null;
    message?: string | null;
  };
  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let config = $state<Config>(null);
  let transactions = $state<Transaction[]>([]);
  let loading = $state(true);
  let error = $state("");
  const services = [
    { label: "Airtime", detail: "All major networks", icon: Smartphone },
    { label: "Data", detail: "Bundles and plans", icon: Zap },
    { label: "Bills", detail: "Electricity and cable", icon: PlugZap },
  ];
  async function load() {
    loading = true;
    error = "";
    try {
      const headers = { Authorization: `Bearer ${$authStore.accessToken}` };
      const [configResponse, transactionsResponse] = await Promise.all([
        fetch(`${api}/vtu/config`, { credentials: "include", headers }),
        fetch(`${api}/vtu/transactions`, { credentials: "include", headers }),
      ]);
      const configText = await configResponse.text();
      const transactionText = await transactionsResponse.text();
      const configPayload = configText ? JSON.parse(configText) : null;
      const transactionPayload = transactionText
        ? JSON.parse(transactionText)
        : [];
      if (!configResponse.ok)
        throw new Error(
          configPayload?.message ??
            `Unable to load VTU configuration (${configResponse.status})`,
        );
      if (!transactionsResponse.ok)
        throw new Error(
          transactionPayload?.message ??
            `Unable to load VTU transactions (${transactionsResponse.status})`,
        );
      config = configPayload;
      transactions = await refreshPendingTransactions(transactionPayload);
    } catch (cause) {
      error =
        cause instanceof Error ? cause.message : "Unable to load VTU overview.";
    } finally {
      loading = false;
    }
  }

  async function refreshPendingTransactions(items: Transaction[]) {
    const pending = items.filter((item) => item.status === "PENDING");
    if (!pending.length) return items;
    const headers = { Authorization: `Bearer ${$authStore.accessToken}` };
    const refreshed = await Promise.all(
      pending.map(async (item) => {
        try {
          const response = await fetch(
            `${api}/vtu/transactions/${encodeURIComponent(item.reference)}/status`,
            { credentials: "include", headers },
          );
          return response.ok ? ((await response.json()) as Transaction) : item;
        } catch {
          return item;
        }
      }),
    );
    const byReference = new Map(
      refreshed.map((item) => [item.reference, item]),
    );
    return items.map((item) => byReference.get(item.reference) ?? item);
  }

  function statusClass(status: string) {
    return status === "SUCCESS"
      ? "bg-emerald-500/10 text-emerald-700"
      : status === "FAILED"
        ? "bg-red-500/10 text-red-700"
        : "bg-amber-500/10 text-amber-700";
  }
  onMount(() => {
    void load();
    const poll = window.setInterval(() => {
      if (transactions.some((transaction) => transaction.status === "PENDING"))
        void load();
    }, 15000);
    return () => window.clearInterval(poll);
  });
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · VTU"
    title="VTU platform"
    description="A provider-agnostic control room for airtime, data, bills, pricing, and fulfillment."
    infographic="/vtu_infographics.png"
    infographicAlt="VTU products and fulfillment overview"
  />
  <nav
    class="flex flex-wrap gap-2 border-b border-border/60 pb-4"
    aria-label="VTU workspace"
  >
    <a
      href="/extensions/vtu"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >Overview</a
    ><a
      href="/extensions/vtu/deployment"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Customer deployment</a
    ><a
      href="/extensions/vtu/provider"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Provider setup</a
    ><a
      href="/extensions/vtu/purchase"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >New purchase</a
    ><a
      href="/extensions/vtu/transactions"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Transactions</a
    ><a
      href="/extensions/vtu/pricing"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Pricing</a
    >
  </nav>
  {#if loading}<div
      class="surface-panel flex min-h-56 items-center justify-center text-sm text-muted-foreground"
    >
      <RefreshCw class="mr-2 h-4 w-4 animate-spin" />Loading overview
    </div>{:else if error}<div
      class="surface-panel flex items-center gap-3 p-6 text-sm text-destructive"
    >
      <CircleAlert class="h-5 w-5" />{error}<button
        type="button"
        class="ml-auto"
        onclick={() => void load()}><RefreshCw class="h-4 w-4" /></button
      >
    </div>{:else}<div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="font-heading text-xl font-bold">Your VTU control room</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            Setup, pricing, fulfillment, and reporting each have their own
            focused workspace.
          </p>
        </div>
        <a href="/extensions/vtu/purchase" class="btn-app-primary text-xs"
          ><Zap class="h-4 w-4" />New purchase</a
        >
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Active mode</p>
          <p class="mt-2 font-heading text-xl font-bold">
            {config?.mode === "BYO"
              ? "Bring your provider"
              : config?.mode === "BIZFLOW_HOSTED"
                ? "BizFlow hosted"
                : "Not configured"}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            {config?.status ?? "Choose a setup path"}
          </p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Recent requests</p>
          <p class="mt-2 font-heading text-xl font-bold">
            {transactions.length}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">Across all channels</p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Provider seam</p>
          <p class="mt-2 font-heading text-xl font-bold">Ready</p>
          <p class="mt-1 text-xs text-muted-foreground">
            VTpass, MTN, Airtel, JED, or custom
          </p>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
              >
                Coverage
              </p>
              <h2 class="mt-2 font-heading text-xl font-bold">
                What you can sell
              </h2>
            </div>
            <ShieldCheck class="h-5 w-5 text-primary" />
          </div>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            {#each services as service}<div
                class="rounded-xl border border-border/60 p-4"
              >
                <svelte:component
                  this={service.icon}
                  class="h-5 w-5 text-primary"
                />
                <p class="mt-4 text-sm font-semibold">{service.label}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {service.detail}
                </p>
              </div>{/each}
          </div>
        </section>
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Next actions
              </p>
              <h2 class="mt-2 font-heading text-xl font-bold">Keep moving</h2>
            </div>
            <Code2 class="h-5 w-5 text-primary" />
          </div>
          <div class="mt-5 space-y-2">
            <a
              href="/extensions/vtu/provider"
              class="flex items-center justify-between rounded-xl border border-border/60 p-4 text-sm font-semibold hover:border-primary/40"
              ><span
                >{config
                  ? "Manage provider setup"
                  : "Choose a provider path"}</span
              ><ArrowRight class="h-4 w-4 text-primary" /></a
            ><a
              href="/extensions/vtu/pricing"
              class="flex items-center justify-between rounded-xl border border-border/60 p-4 text-sm font-semibold hover:border-primary/40"
              ><span>Review pricing rules</span><ArrowRight
                class="h-4 w-4 text-primary"
              /></a
            ><a
              href="/extensions/vtu/transactions"
              class="flex items-center justify-between rounded-xl border border-border/60 p-4 text-sm font-semibold hover:border-primary/40"
              ><span>View transaction history</span><ArrowRight
                class="h-4 w-4 text-primary"
              /></a
            >
          </div>
        </section>
      </div>
      <section class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 p-5"
        >
          <div>
            <h2 class="flex items-center gap-2 font-heading text-lg font-bold">
              <Activity class="h-5 w-5 text-primary" />Recent activity
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              A quick read of the latest requests.
            </p>
          </div>
          <a
            href="/extensions/vtu/transactions"
            class="text-xs font-semibold text-primary">View all</a
          >
        </div>
        {#if transactions.length === 0}<p
            class="p-8 text-sm text-muted-foreground"
          >
            No VTU transactions yet.
          </p>{:else}<div class="divide-y divide-border/60">
            {#each transactions.slice(0, 5) as transaction}<a
                href={`/extensions/vtu/transactions?reference=${encodeURIComponent(transaction.reference)}`}
                class="flex flex-wrap items-center gap-4 p-4 transition hover:bg-muted/30"
              >
                <span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  ><Activity class="h-4 w-4" /></span
                ><span class="min-w-0 flex-1"
                  ><span class="block text-sm font-semibold"
                    >{transaction.productType} · {transaction.network ??
                      "Provider"}</span
                  ><span class="block text-xs text-muted-foreground"
                    >{transaction.recipient} · {transaction.reference}</span
                  ></span
                ><span class="text-sm font-bold"
                  >₦{Number(transaction.amountCharged).toLocaleString()}</span
                ><span
                  class={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(transaction.status)}`}
                  >{transaction.status}</span
                >
              </a>{/each}
          </div>{/if}
      </section>
    </div>{/if}
</AppShell>
