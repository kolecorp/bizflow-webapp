<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import {
    Activity,
    CheckCircle2,
    CircleAlert,
    Clock3,
    LoaderCircle,
    RefreshCw,
    X,
  } from "@lucide/svelte";
  type Row = {
    reference: string;
    productType: string;
    network?: string;
    recipient: string;
    amountCharged: string | number;
    status: string;
    mode: string;
    createdAt: string;
    updatedAt?: string;
    providerReference?: string | null;
    message?: string | null;
    channel?: string | null;
  };
  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let rows = $state<Row[]>([]);
  let loading = $state(true);
  let error = $state("");
  let selected = $state<Row | null>(null);
  async function load() {
    loading = true;
    try {
      const response = await fetch(`${api}/vtu/transactions`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${$authStore.accessToken}` },
      });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;
      if (!response.ok)
        throw new Error(
          payload?.message ?? `Unable to load (${response.status})`,
        );
      rows = await refreshPendingRows(payload ?? []);
      const reference = new URLSearchParams(window.location.search).get(
        "reference",
      );
      selected = reference
        ? (rows.find((row) => row.reference === reference) ?? null)
        : null;
    } catch (cause) {
      error =
        cause instanceof Error ? cause.message : "Unable to load transactions";
    } finally {
      loading = false;
    }
  }
  async function refreshPendingRows(items: Row[]) {
    const pending = items.filter((row) => row.status === "PENDING");
    if (!pending.length) return items;
    const headers = { Authorization: `Bearer ${$authStore.accessToken}` };
    const refreshed = await Promise.all(
      pending.map(async (row) => {
        try {
          const response = await fetch(
            `${api}/vtu/transactions/${encodeURIComponent(row.reference)}/status`,
            { credentials: "include", headers },
          );
          return response.ok ? ((await response.json()) as Row) : row;
        } catch {
          return row;
        }
      }),
    );
    const byReference = new Map(refreshed.map((row) => [row.reference, row]));
    return items.map((row) => byReference.get(row.reference) ?? row);
  }
  function statusClass(status: string) {
    return status === "SUCCESS"
      ? "bg-emerald-500/10 text-emerald-700"
      : status === "FAILED"
        ? "bg-red-500/10 text-red-700"
        : "bg-amber-500/10 text-amber-700";
  }
  function formatDate(value?: string) {
    return value
      ? new Intl.DateTimeFormat("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "Not available";
  }
  function closeDetails() {
    selected = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("reference");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }
  onMount(() => {
    void load();
    const poll = window.setInterval(() => {
      if (rows.some((row) => row.status === "PENDING")) void load();
    }, 15000);
    return () => window.clearInterval(poll);
  });
</script>

<AppShell
  ><PageHeader
    eyebrow="VTU · Reporting"
    title="Transactions"
    description="Trace every request across hosted and bring-your-own provider modes."
  />
  <nav class="flex flex-wrap gap-2 border-b border-border/60 pb-4">
    <a
      href="/extensions/vtu"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Overview</a
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
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >Transactions</a
    ><a
      href="/extensions/vtu/pricing"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Pricing</a
    >
  </nav>
  {#if loading}<div
      class="surface-panel flex min-h-48 items-center justify-center text-sm text-muted-foreground"
    >
      <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />Loading requests
    </div>{:else if error}<div
      class="surface-panel flex items-center gap-3 p-6 text-sm text-destructive"
    >
      {error}<button
        type="button"
        class="ml-auto text-primary"
        onclick={() => void load()}><RefreshCw class="h-4 w-4" /></button
      >
    </div>{:else}<section class="surface-panel overflow-hidden">
      <div
        class="flex items-center justify-between border-b border-border/60 p-5"
      >
        <div>
          <h2 class="flex items-center gap-2 font-heading text-lg font-bold">
            <Activity class="h-5 w-5 text-primary" />Request history
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {rows.length} records
          </p>
        </div>
      </div>
      {#if rows.length === 0}<p class="p-8 text-sm text-muted-foreground">
          No VTU transactions yet.
        </p>{:else}<div class="divide-y divide-border/60">
          {#each rows as row}<button
              type="button"
              class="flex w-full flex-wrap items-center gap-4 p-4 text-left transition hover:bg-muted/30"
              onclick={() => (selected = row)}
            >
              <span
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                ><Activity class="h-4 w-4" /></span
              ><span class="min-w-0 flex-1"
                ><span class="block text-sm font-semibold"
                  >{row.productType} · {row.network ?? "Provider"}</span
                ><span class="block text-xs text-muted-foreground"
                  >{row.recipient} · {row.reference}</span
                ></span
              ><span class="text-sm font-bold"
                >₦{Number(row.amountCharged).toLocaleString()}</span
              ><span
                class={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(row.status)}`}
                >{row.status}</span
              >
            </button>{/each}
        </div>{/if}
    </section>{/if}</AppShell
>

{#if selected}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
    role="presentation"
    onclick={(event) => event.target === event.currentTarget && closeDetails()}
  >
    <section
      class="surface-panel w-full max-w-lg p-6 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vtu-transaction-title"
    >
      <div
        class="flex items-start justify-between gap-4 border-b border-border/60 pb-4"
      >
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
          >
            Transaction details
          </p>
          <h2
            id="vtu-transaction-title"
            class="mt-1 font-heading text-xl font-bold"
          >
            {selected.productType} purchase
          </h2>
        </div>
        <button
          type="button"
          aria-label="Close transaction details"
          class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          onclick={closeDetails}><X class="h-4 w-4" /></button
        >
      </div>
      <div
        class="mt-5 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-4"
      >
        {#if selected.status === "SUCCESS"}<CheckCircle2
            class="h-6 w-6 text-emerald-600"
          />{:else if selected.status === "FAILED"}<CircleAlert
            class="h-6 w-6 text-red-600"
          />{:else}<Clock3 class="h-6 w-6 text-amber-600" />{/if}
        <div>
          <p
            class={`text-sm font-bold ${statusClass(selected.status).split(" ").pop()}`}
          >
            {selected.status}
          </p>
          <p class="text-xs text-muted-foreground">
            {selected.message ?? "No provider message"}
          </p>
        </div>
      </div>
      <dl class="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-xs text-muted-foreground">Recipient</dt>
          <dd class="mt-1 font-medium">{selected.recipient}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted-foreground">Amount</dt>
          <dd class="mt-1 font-medium">
            ₦{Number(selected.amountCharged).toLocaleString()}
          </dd>
        </div>
        <div>
          <dt class="text-xs text-muted-foreground">Network</dt>
          <dd class="mt-1 font-medium">{selected.network ?? "Provider"}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted-foreground">Channel</dt>
          <dd class="mt-1 font-medium">
            {selected.channel ?? "Not specified"}
          </dd>
        </div>
        <div>
          <dt class="text-xs text-muted-foreground">Created</dt>
          <dd class="mt-1 font-medium">{formatDate(selected.createdAt)}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted-foreground">Last updated</dt>
          <dd class="mt-1 font-medium">{formatDate(selected.updatedAt)}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-xs text-muted-foreground">Reference</dt>
          <dd class="mt-1 break-all font-mono text-xs">{selected.reference}</dd>
        </div>
        {#if selected.providerReference}<div class="sm:col-span-2">
            <dt class="text-xs text-muted-foreground">Provider reference</dt>
            <dd class="mt-1 font-mono text-xs">{selected.providerReference}</dd>
          </div>{/if}
      </dl>
    </section>
  </div>
{/if}
