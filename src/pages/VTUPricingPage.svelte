<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Pencil, RefreshCw, Save, X } from "@lucide/svelte";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";

  type CatalogItem = {
    id: string;
    providerKey: string;
    productType: string;
    network?: string | null;
    planCode?: string | null;
    providerLabel: string;
    label: string;
    providerCost: string;
    bizflowPrice?: string | null;
    sellingPrice: string;
    businessDiscountType?: "FIXED" | "PERCENTAGE";
    businessDiscountValue?: string;
    cashbackType?: "FIXED" | "PERCENTAGE";
    cashbackValue?: string;
    businessPrice?: string;
    bizflowGain?: string;
  };

  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  });

  function formatMoney(value: number | string | null | undefined) {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? currency.format(amount) : "—";
  }

  let catalog = $state<CatalogItem[]>([]);
  let selected = $state<CatalogItem | null>(null);
  let search = $state("");
  let product = $state("ALL");
  let network = $state("ALL");
  let planCode = $state("ALL");
  let loading = $state(true);
  let syncing = $state(false);
  let saving = $state(false);
  let name = $state("");
  let price = $state("");
  let discountType = $state<"FIXED" | "PERCENTAGE">("PERCENTAGE");
  let discountValue = $state("0");
  let cashbackType = $state<"FIXED" | "PERCENTAGE">("PERCENTAGE");
  let cashbackValue = $state("0");

  async function request(path: string, init: RequestInit = {}) {
    const response = await fetch(`${api}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init.headers ?? {}),
      },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(
        payload?.message ?? `Request failed (${response.status})`,
      );
    return payload;
  }

  async function syncCatalog() {
    loading = true;
    syncing = true;
    try {
      const items = await request("/vtu/catalog/sync?providerKey=vtu.ng", {
        method: "POST",
      });
      catalog = Array.isArray(items) ? items : [];
      toast.success(`${catalog.length} provider offers synchronized`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to synchronize provider catalog",
      );
    } finally {
      loading = false;
      syncing = false;
    }
  }

  function selectItem(item: CatalogItem) {
    selected = item;
    name = item.label;
    price = item.sellingPrice;
    discountType = item.businessDiscountType ?? "PERCENTAGE";
    discountValue = item.businessDiscountValue ?? "0";
    cashbackType = item.cashbackType ?? "PERCENTAGE";
    cashbackValue = item.cashbackValue ?? "0";
  }

  function closeEditor() {
    selected = null;
  }

  async function saveItem() {
    if (!selected) return;
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast.error("Enter a valid selling price.");
      return;
    }
    saving = true;
    try {
      const updated = await request(`/vtu/catalog/${selected.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim() || null,
          price: String(parsedPrice),
          businessDiscountType: discountType,
          businessDiscountValue: discountValue,
          cashbackType,
          cashbackValue,
        }),
      });
      catalog = catalog.map((item) =>
        item.id === updated.id ? updated : item,
      );
      selectItem(updated);
      toast.success("Pricing offer saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save pricing offer",
      );
    } finally {
      saving = false;
    }
  }

  const networks = $derived(
    Array.from(
      new Set(catalog.map((item) => item.network).filter(Boolean)),
    ).sort(),
  );
  const dataNetworks = $derived(
    Array.from(
      new Set(
        catalog
          .filter((item) => item.productType === "DATA")
          .map((item) => item.network)
          .filter(Boolean),
      ),
    ).sort(),
  );
  const dataPlans = $derived(
    Array.from(
      new Map(
        catalog
          .filter(
            (item) =>
              item.productType === "DATA" &&
              (network === "ALL" || item.network === network) &&
              item.planCode,
          )
          .map((item) => [item.planCode, item]),
      ).values(),
    ).sort((left, right) => left.label.localeCompare(right.label)),
  );
  const filtered = $derived(
    catalog.filter((item) => {
      const query = search.trim().toLowerCase();
      return (
        (product === "ALL" || item.productType === product) &&
        (network === "ALL" || item.network === network) &&
        (product !== "DATA" ||
          planCode === "ALL" ||
          item.planCode === planCode) &&
        (!query ||
          `${item.label} ${item.providerLabel} ${item.planCode} ${item.network}`
            .toLowerCase()
            .includes(query))
      );
    }),
  );
  const configured = $derived(
    catalog.filter((item) => item.bizflowPrice).length,
  );
  const spread = $derived(
    catalog.reduce(
      (sum, item) =>
        sum + Number(item.sellingPrice) - Number(item.providerCost),
      0,
    ),
  );

  onMount(() => void syncCatalog());
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · VTU"
    title="Pricing"
    description="Review live provider costs and set the BizFlow price, business discount, and end-user cashback for each offer."
  />

  <nav
    class="mt-6 flex flex-wrap gap-2 border-b border-border/60 pb-4"
    aria-label="VTU workspace"
  >
    <a
      href="/extensions/vtu"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >Overview</a
    >
    <a
      href="/extensions/vtu/provider"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >Provider setup</a
    >
    <a
      href="/extensions/vtu/purchase"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >New purchase</a
    >
    <a
      href="/extensions/vtu/pricing"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >Pricing</a
    >
    <a
      href="/extensions/vtu/transactions"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >Transactions</a
    >
  </nav>

  <div class="mt-6 space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="surface-panel p-5">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Live offers
        </p>
        <p class="mt-3 font-heading text-3xl font-black text-foreground">
          {catalog.length}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          Available provider records
        </p>
      </div>
      <div class="surface-panel p-5">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Configured
        </p>
        <p class="mt-3 font-heading text-3xl font-black text-foreground">
          {configured}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          BizFlow price overrides
        </p>
      </div>
      <div class="surface-panel p-5">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Gross spread
        </p>
        <p class="mt-3 font-heading text-3xl font-black text-emerald-600">
          {formatMoney(spread)}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          Before discounts and cashback
        </p>
      </div>
      <div class="surface-panel p-5">
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Provider
        </p>
        <p class="mt-3 font-heading text-2xl font-black text-foreground">
          VTU.ng
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          Auto-syncs on page entry
        </p>
      </div>
    </div>

    <section class="surface-panel overflow-hidden">
      <div
        class="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-muted/20 px-5 py-4"
      >
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
          >
            Pricing board
          </p>
          <h2 class="mt-1 font-heading text-xl font-bold text-foreground">
            Provider offers
          </h2>
        </div>
        <button
          type="button"
          class="btn-app-secondary inline-flex items-center gap-2"
          disabled={syncing}
          onclick={() => void syncCatalog()}
        >
          <RefreshCw class={syncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          {syncing ? "Syncing" : "Sync provider"}
        </button>
      </div>

      <div
        class="grid gap-3 border-b border-border/70 p-5 md:grid-cols-[minmax(0,1fr)_170px_170px]"
      >
        <input
          bind:value={search}
          placeholder="Search by name, network, or plan"
          class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <label class="space-y-1.5 text-xs font-semibold text-muted-foreground">
          <span class="block uppercase tracking-[0.14em]">Product</span>
          <select
            bind:value={product}
            onchange={() => {
              network = "ALL";
              planCode = "ALL";
            }}
            class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All products</option>
            <option value="DATA">Data</option>
            <option value="CABLE_TV">Cable TV</option>
            <option value="AIRTIME">Airtime</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="EXAM_PIN">Exam PIN</option>
          </select>
        </label>
        <label class="space-y-1.5 text-xs font-semibold text-muted-foreground">
          <span class="block uppercase tracking-[0.14em]">Network</span>
          <select
            bind:value={network}
            onchange={() => (planCode = "ALL")}
            class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All networks</option>
            {#each product === "DATA" ? dataNetworks : networks as item}
              <option value={item}>{item}</option>
            {/each}
          </select>
        </label>
        {#if product === "DATA"}
          <label
            class="space-y-1.5 text-xs font-semibold text-muted-foreground md:col-span-2 xl:col-span-1"
          >
            <span class="block uppercase tracking-[0.14em]"
              >Plan / variation</span
            >
            <select
              bind:value={planCode}
              class="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All plans and variations</option>
              {#each dataPlans as plan}
                <option value={plan.planCode ?? ""}>
                  {plan.label}{plan.planCode ? ` · ${plan.planCode}` : ""}
                </option>
              {/each}
            </select>
          </label>
        {/if}
      </div>

      {#if loading}
        <div
          class="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <RefreshCw class="h-4 w-4 animate-spin" />
          Loading provider offers
        </div>
      {:else if filtered.length === 0}
        <div class="p-10 text-center text-sm text-muted-foreground">
          No offers match the current filters.
        </div>
      {:else}
        <div class="max-h-[68vh] overflow-auto">
          <table class="w-full min-w-215 text-left text-sm">
            <thead
              class="sticky top-0 z-10 bg-muted/80 text-xs uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              <tr>
                <th class="px-4 py-3 font-semibold">Offer</th>
                <th class="px-4 py-3 font-semibold">Code</th>
                <th class="px-4 py-3 font-semibold">Provider cost</th>
                <th class="px-4 py-3 font-semibold">BizFlow price</th>
                <th class="px-4 py-3 font-semibold">Business price</th>
                <th class="px-4 py-3 font-semibold">Gain</th>
                <th class="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each filtered as item (item.id)}
                <tr
                  class={`${selected?.id === item.id ? "bg-primary/5" : "hover:bg-muted/20"} border-t border-border/70`}
                >
                  <td class="px-4 py-3 align-top">
                    <p class="font-semibold text-foreground">{item.label}</p>
                    <p class="mt-1 text-xs text-muted-foreground">
                      {item.productType} · {item.network ?? "General"}
                    </p>
                  </td>
                  <td
                    class="px-4 py-3 align-top font-mono text-xs text-muted-foreground"
                    >{item.planCode ?? "—"}</td
                  >
                  <td class="px-4 py-3 align-top font-medium text-foreground"
                    >{formatMoney(item.providerCost)}</td
                  >
                  <td class="px-4 py-3 align-top font-semibold text-primary"
                    >{formatMoney(item.sellingPrice)}</td
                  >
                  <td class="px-4 py-3 align-top text-foreground"
                    >{formatMoney(item.businessPrice ?? item.sellingPrice)}</td
                  >
                  <td class="px-4 py-3 align-top font-semibold text-emerald-600"
                    >{formatMoney(
                      item.bizflowGain ??
                        Number(item.sellingPrice) - Number(item.providerCost),
                    )}</td
                  >
                  <td class="px-4 py-3 text-right align-top">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                      onclick={() => selectItem(item)}
                    >
                      <Pencil class="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>

    {#if selected}
      <section class="surface-panel overflow-hidden">
        <div
          class="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 px-5 py-4"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
            >
              Selected offer
            </p>
            <h2 class="mt-1 font-heading text-xl font-bold text-foreground">
              Edit pricing
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Provider cost stays locked to the upstream catalog. BizFlow
              controls the published offer.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close editor"
            class="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            onclick={closeEditor}
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-medium text-foreground">
              BizFlow display name
              <input
                bind:value={name}
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </label>
            <label class="text-sm font-medium text-foreground">
              BizFlow selling price
              <input
                bind:value={price}
                type="number"
                min="0"
                step="0.01"
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </label>
            <label class="text-sm font-medium text-foreground">
              Business discount type
              <select
                bind:value={discountType}
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed amount</option>
              </select>
            </label>
            <label class="text-sm font-medium text-foreground">
              Business discount value
              <input
                bind:value={discountValue}
                type="number"
                min="0"
                step="0.01"
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </label>
            <label class="text-sm font-medium text-foreground">
              End-user cashback type
              <select
                bind:value={cashbackType}
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed amount</option>
              </select>
            </label>
            <label class="text-sm font-medium text-foreground">
              End-user cashback value
              <input
                bind:value={cashbackValue}
                type="number"
                min="0"
                step="0.01"
                class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
              />
            </label>
          </div>

          <aside class="rounded-2xl border border-border bg-muted/25 p-4">
            <p
              class="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              Snapshot
            </p>
            <dl class="mt-4 space-y-3 text-sm">
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">Provider</dt>
                <dd class="font-medium text-foreground">
                  {selected.providerLabel}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">Provider cost</dt>
                <dd class="font-medium text-foreground">
                  {formatMoney(selected.providerCost)}
                </dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">BizFlow sell</dt>
                <dd class="font-medium text-primary">{formatMoney(price)}</dd>
              </div>
              <div class="flex items-center justify-between gap-3">
                <dt class="text-muted-foreground">Potential gain</dt>
                <dd class="font-medium text-emerald-600">
                  {formatMoney(
                    Math.max(0, Number(price) - Number(selected.providerCost)),
                  )}
                </dd>
              </div>
            </dl>

            <div class="mt-5 flex gap-2">
              <button
                type="button"
                class="btn-app-secondary flex-1"
                onclick={closeEditor}>Cancel</button
              >
              <button
                type="button"
                class="btn-app-primary flex-1"
                disabled={saving}
                onclick={() => void saveItem()}
              >
                {saving ? "Saving..." : "Save offer"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    {/if}
  </div>
</AppShell>
