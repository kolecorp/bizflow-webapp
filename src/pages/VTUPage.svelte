<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { authStore } from "$lib/stores/auth";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import {
    Activity,
    ArrowRight,
    Bot,
    CheckCircle2,
    CircleAlert,
    Code2,
    CreditCard,
    LoaderCircle,
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
  type VtuTransaction = {
    reference: string;
    productType: string;
    network?: string;
    recipient: string;
    amountCharged: string | number;
    status: string;
    mode: string;
    createdAt: string;
    message?: string;
  };
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let config = $state<Config>(null);
  let transactions = $state<VtuTransaction[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let error = $state("");
  let activePanel = $state<"overview" | "integration" | "purchase">("overview");
  let setupMode = $state<"BIZFLOW_HOSTED" | "BYO">("BIZFLOW_HOSTED");
  let integration = $state({
    baseUrl: "",
    authScheme: "BEARER",
    token: "",
    airtimePath: "/api/topup/airtime",
    dataPath: "/api/topup/data",
    billsPath: "/api/topup/bills",
    pinPath: "/api/topup/pin",
    recipientField: "recipient",
    amountField: "amount",
    networkField: "network",
  });
  let purchase = $state({
    productType: "AIRTIME",
    network: "MTN",
    recipient: "",
    amount: "",
    reference: "",
  });

  const services = [
    { label: "Airtime", detail: "All major networks", icon: Smartphone },
    { label: "Data", detail: "Bundles and plans", icon: Zap },
    { label: "Electricity", detail: "Meters and bills", icon: PlugZap },
    { label: "Cable TV", detail: "DStv, GOtv and more", icon: CreditCard },
  ];
  const money = (value: string | number) =>
    `₦${Number(value).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
  const request = async <T,>(path: string, init?: RequestInit) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init?.headers ?? {}),
      },
    });
    const rawBody = await response.text();
    let payload: T | { message?: string } | null = null;
    if (rawBody.trim()) {
      try {
        payload = JSON.parse(rawBody) as T | { message?: string };
      } catch {
        payload = null;
      }
    }
    if (!response.ok) {
      throw new Error(
        (payload as { message?: string } | null)?.message ??
          `VTU request failed (${response.status} ${response.statusText}).`,
      );
    }
    return rawBody.trim() ? (payload as T) : null;
  };

  async function load() {
    loading = true;
    error = "";
    try {
      const nextConfig = await request<Config>("/vtu/config");
      const nextTransactions =
        await request<VtuTransaction[]>("/vtu/transactions");
      config = nextConfig ?? null;
      transactions = nextTransactions ?? [];
      setupMode = config?.mode ?? "BIZFLOW_HOSTED";
    } catch (cause) {
      error =
        cause instanceof Error
          ? cause.message
          : "Unable to load VTU workspace.";
    } finally {
      loading = false;
    }
  }
  async function onboard() {
    saving = true;
    try {
      config = await request<Config>("/vtu/onboard", {
        method: "POST",
        body: JSON.stringify({ mode: setupMode }),
      });
      toast.success(
        setupMode === "BYO"
          ? "Bring-your-own provider mode enabled"
          : "VTU float wallet provisioned",
      );
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Unable to start VTU setup.",
      );
    } finally {
      saving = false;
    }
  }
  async function saveIntegration() {
    saving = true;
    try {
      await request("/vtu/integrations", {
        method: "POST",
        body: JSON.stringify({
          baseUrl: integration.baseUrl,
          authScheme: integration.authScheme,
          credentials: { token: integration.token },
          endpointMap: {
            buyAirtime: {
              method: "POST",
              path:
                integration.airtimePath ||
                integration.dataPath ||
                "/api/topup/airtime",
              requestTemplate: {
                recipient: integration.recipientField,
                amount: integration.amountField,
                network: integration.networkField,
              },
              responseMap: {
                statusPath: "status",
                successValue: "success",
                referencePath: "reference",
                messagePath: "message",
              },
            },
            buyData: {
              method: "POST",
              path:
                integration.dataPath ||
                integration.airtimePath ||
                "/api/topup/data",
              requestTemplate: {
                recipient: integration.recipientField,
                amount: integration.amountField,
                network: integration.networkField,
              },
              responseMap: {
                statusPath: "status",
                successValue: "success",
                referencePath: "reference",
                messagePath: "message",
              },
            },
            buyBills: {
              method: "POST",
              path:
                integration.billsPath ||
                integration.airtimePath ||
                "/api/topup/bills",
              requestTemplate: {
                recipient: integration.recipientField,
                amount: integration.amountField,
                network: integration.networkField,
              },
              responseMap: {
                statusPath: "status",
                successValue: "success",
                referencePath: "reference",
                messagePath: "message",
              },
            },
            sellPin: {
              method: "POST",
              path:
                integration.pinPath ||
                integration.airtimePath ||
                "/api/topup/pin",
              requestTemplate: {
                recipient: integration.recipientField,
                amount: integration.amountField,
                network: integration.networkField,
              },
              responseMap: {
                statusPath: "status",
                successValue: "success",
                referencePath: "reference",
                messagePath: "message",
              },
            },
          },
        }),
      });
      config = await request<Config>("/vtu/config");
      toast.success("Provider configuration saved");
      activePanel = "overview";
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Unable to save provider.",
      );
    } finally {
      saving = false;
    }
  }
  async function buy() {
    saving = true;
    try {
      const reference = purchase.reference || `vtu-${Date.now()}`;
      await request("/vtu/purchase", {
        method: "POST",
        body: JSON.stringify({ ...purchase, reference }),
      });
      toast.success("VTU request submitted");
      purchase = { ...purchase, recipient: "", amount: "", reference: "" };
      transactions =
        (await request<VtuTransaction[]>("/vtu/transactions")) ?? [];
      activePanel = "overview";
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Unable to submit VTU purchase.",
      );
    } finally {
      saving = false;
    }
  }
  onMount(() => {
    void load();
  });
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · VTU"
    title="VTU platform"
    description="A provider-agnostic control room for airtime, data, bills, pricing, and fulfillment."
  />
  <nav
    class="flex flex-wrap gap-2 border-b border-border/60 pb-4"
    aria-label="VTU workspace"
  >
    <a
      href="/extensions/vtu"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >Overview</a
    >
    <a
      href="/extensions/vtu/provider"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
      >Provider setup</a
    >
    <a
      href="/extensions/vtu/purchase"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
      >New purchase</a
    >
    <a
      href="/extensions/vtu/transactions"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
      >Transactions</a
    >
    <a
      href="/extensions/vtu/pricing"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
      >Pricing</a
    >
  </nav>
  {#if loading}<div
      class="surface-panel flex min-h-64 items-center justify-center text-sm text-muted-foreground"
    >
      <LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Loading VTU workspace
    </div>
  {:else if error}<div
      class="surface-panel flex items-center gap-3 p-6 text-sm text-destructive"
    >
      <CircleAlert class="h-5 w-5" />{error}<button
        type="button"
        class="ml-auto text-primary"
        onclick={() => void load()}><RefreshCw class="h-4 w-4" /></button
      >
    </div>
  {:else}
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-foreground">VTU workspace</p>
          <p class="mt-1 text-sm text-muted-foreground">
            Your channels stay the same while the provider can change
            underneath.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="btn-app-secondary text-xs"
            onclick={() => void load()}
            ><RefreshCw class="h-4 w-4" /> Refresh</button
          ><button
            type="button"
            class="btn-app-primary text-xs"
            onclick={() => (activePanel = "purchase")}
            ><Zap class="h-4 w-4" /> New purchase</button
          >
        </div>
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
          <p class="text-xs text-muted-foreground">Fulfillment layer</p>
          <p class="mt-2 font-heading text-xl font-bold">
            {config?.mode === "BYO" ? "Your API" : "Provider seam"}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            Normalized into one purchase flow
          </p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Recent requests</p>
          <p class="mt-2 font-heading text-xl font-bold">
            {transactions.length}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            Last 100 workspace requests
          </p>
        </div>
      </div>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
              >
                Setup path
              </p>
              <h2 class="mt-2 font-heading text-xl font-bold">
                Choose your provider model
              </h2>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                You can connect a VTpass-style aggregator later, or route
                fulfillment to your own API without changing the customer
                experience.
              </p>
            </div>
            <ShieldCheck class="h-5 w-5 text-primary" />
          </div>
          <div class="mt-5 space-y-3">
            <button
              type="button"
              class={`w-full rounded-xl border p-4 text-left ${setupMode === "BIZFLOW_HOSTED" ? "border-primary bg-primary/5" : "border-border/60"}`}
              onclick={() => (setupMode = "BIZFLOW_HOSTED")}
              ><span class="flex items-center gap-3"
                ><span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  ><Bot class="h-4 w-4" /></span
                ><span
                  ><span class="block text-sm font-semibold"
                    >BizFlow hosted</span
                  ><span class="block text-xs text-muted-foreground"
                    >Use BizFlow's future upstream adapter and VTU float wallet.</span
                  ></span
                ></span
              ></button
            ><button
              type="button"
              class={`w-full rounded-xl border p-4 text-left ${setupMode === "BYO" ? "border-primary bg-primary/5" : "border-border/60"}`}
              onclick={() => (setupMode = "BYO")}
              ><span class="flex items-center gap-3"
                ><span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600"
                  ><Code2 class="h-4 w-4" /></span
                ><span
                  ><span class="block text-sm font-semibold"
                    >Bring your own provider</span
                  ><span class="block text-xs text-muted-foreground"
                    >Map your API once. BizFlow handles orchestration and
                    reporting.</span
                  ></span
                ></span
              ></button
            >
          </div>
          {#if config?.mode !== setupMode || !config}<button
              type="button"
              class="btn-app-primary mt-5 w-full"
              disabled={saving}
              onclick={() => void onboard()}
              >{saving ? "Saving..." : "Use this setup path"}<ArrowRight
                class="h-4 w-4"
              /></button
            >{:else}<div
              class="mt-5 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 class="h-4 w-4" /> Setup path active
            </div>{/if}<button
            type="button"
            class="mt-3 w-full text-xs font-semibold text-primary"
            onclick={() => (activePanel = "integration")}
            >Configure provider mapping</button
          >
        </section>
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Product coverage
              </p>
              <h2 class="mt-2 font-heading text-xl font-bold">
                One front door, many providers
              </h2>
            </div>
            <Activity class="h-5 w-5 text-primary" />
          </div>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
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
          <div
            class="mt-5 rounded-xl bg-muted/40 p-4 text-xs leading-6 text-muted-foreground"
          >
            The API boundary is intentionally abstract: a future VTpass, MTN,
            Airtel, JED, or custom adapter can plug into the same registry and
            normalized result contract.
          </div>
        </section>
      </div>
      {#if activePanel === "integration"}<section class="surface-panel p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                Provider integration
              </p>
              <h2 class="mt-2 font-heading text-xl font-bold">
                Provider contract
              </h2>
              <p class="mt-1 text-sm text-muted-foreground">
                Configure your upstream VTU provider once and keep airtime,
                data, utilities, and PIN operations behind a single normalized
                API.
              </p>
            </div>
            <button
              type="button"
              class="text-sm text-muted-foreground"
              onclick={() => (activePanel = "overview")}>Close</button
            >
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-4">
            <div class="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p
                class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Mode
              </p>
              <p class="mt-3 text-lg font-bold text-foreground">
                {setupMode === "BYO" ? "BYO" : "Hosted"}
              </p>
            </div>
            <div class="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p
                class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Products
              </p>
              <p class="mt-3 text-lg font-bold text-foreground">4 mapped</p>
            </div>
            <div class="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p
                class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Contract
              </p>
              <p class="mt-3 text-lg font-bold text-foreground">Live</p>
            </div>
            <div class="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p
                class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Status
              </p>
              <p class="mt-3 text-lg font-bold text-emerald-600">Ready</p>
            </div>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium"
              >Base URL<input
                required
                bind:value={integration.baseUrl}
                placeholder="https://provider.example"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            ><label class="text-sm font-medium"
              >Auth scheme<select
                bind:value={integration.authScheme}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                ><option>BEARER</option><option>API_KEY_HEADER</option><option
                  >BASIC</option
                ></select
              ></label
            ><label class="text-sm font-medium md:col-span-2"
              >Credential token<input
                required
                type="password"
                bind:value={integration.token}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            >
          </div>

          <div class="mt-8">
            <div class="mb-3 flex items-center justify-between">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                Endpoint matrix
              </p>
              <span
                class="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary"
                >4 product routes</span
              >
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="text-sm font-medium"
                >Airtime endpoint<input
                  bind:value={integration.airtimePath}
                  placeholder="/api/topup/airtime"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              ><label class="text-sm font-medium"
                >Data endpoint<input
                  bind:value={integration.dataPath}
                  placeholder="/api/topup/data"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              ><label class="text-sm font-medium"
                >Bills endpoint<input
                  bind:value={integration.billsPath}
                  placeholder="/api/topup/bills"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              ><label class="text-sm font-medium"
                >PIN endpoint<input
                  bind:value={integration.pinPath}
                  placeholder="/api/topup/pin"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              >
            </div>
          </div>

          <div class="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
            >
              Field mapping
            </p>
            <div class="mt-4 grid gap-4 md:grid-cols-3">
              <label class="text-sm font-medium"
                >Recipient field<input
                  bind:value={integration.recipientField}
                  placeholder="recipient"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              ><label class="text-sm font-medium"
                >Amount field<input
                  bind:value={integration.amountField}
                  placeholder="amount"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              ><label class="text-sm font-medium"
                >Network field<input
                  bind:value={integration.networkField}
                  placeholder="network"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                /></label
              >
            </div>
          </div>

          <button
            type="button"
            class="btn-app-primary mt-6"
            disabled={saving}
            onclick={() => void saveIntegration()}
            ><PlugZap class="h-4 w-4" />{saving
              ? "Saving..."
              : "Save provider contract"}</button
          >
        </section>{/if}
      {#if activePanel === "purchase"}<section class="surface-panel p-6">
          <div>
            <h2 class="font-heading text-xl font-bold">New VTU purchase</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              The same purchase shape can be called by REST, WhatsApp, Telegram,
              or future channels.
            </p>
          </div>
          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium"
              >Product<select
                bind:value={purchase.productType}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
                ><option>AIRTIME</option><option>DATA</option><option
                  >ELECTRICITY</option
                ><option>CABLE_TV</option><option>EXAM_PIN</option></select
              ></label
            ><label class="text-sm font-medium"
              >Network<input
                bind:value={purchase.network}
                placeholder="MTN"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            ><label class="text-sm font-medium"
              >Recipient<input
                required
                bind:value={purchase.recipient}
                placeholder="08012345678"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            ><label class="text-sm font-medium"
              >Amount<input
                required
                bind:value={purchase.amount}
                placeholder="1000.00"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            >
          </div>
          <div class="mt-5 flex gap-2">
            <button
              type="button"
              class="btn-app-primary"
              disabled={saving}
              onclick={() => void buy()}
              >{saving ? "Submitting..." : "Submit purchase"}</button
            ><button
              type="button"
              class="btn-app-secondary"
              onclick={() => (activePanel = "overview")}>Cancel</button
            >
          </div>
        </section>{/if}
      <section class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 p-5"
        >
          <div>
            <h2 class="font-heading text-lg font-bold">Recent VTU requests</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Every request is idempotent and traceable by reference.
            </p>
          </div>
          <span class="text-xs text-muted-foreground"
            >{transactions.length} records</span
          >
        </div>
        {#if transactions.length === 0}<p
            class="p-8 text-sm text-muted-foreground"
          >
            No VTU requests yet.
          </p>{:else}<div class="divide-y divide-border/60">
            {#each transactions.slice(0, 8) as transaction}<div
                class="flex flex-wrap items-center gap-4 p-4"
              >
                <span
                  class={`flex h-9 w-9 items-center justify-center rounded-lg ${transaction.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-600" : transaction.status === "FAILED" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}
                  ><Activity class="h-4 w-4" /></span
                ><span class="min-w-0 flex-1"
                  ><span class="block text-sm font-semibold"
                    >{transaction.productType} · {transaction.network ??
                      "Provider"}</span
                  ><span class="block text-xs text-muted-foreground"
                    >{transaction.recipient} · {transaction.reference}</span
                  ></span
                ><span class="text-sm font-bold"
                  >{money(transaction.amountCharged)}</span
                ><span
                  class="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >{transaction.status}</span
                >
              </div>{/each}
          </div>{/if}
      </section>
    </div>
  {/if}
</AppShell>
