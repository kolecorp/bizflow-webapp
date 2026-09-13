<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import {
    CheckCircle2,
    Globe,
    PlugZap,
    RefreshCw,
    ShieldCheck,
    TicketPercent,
    Wifi,
  } from "@lucide/svelte";

  const api =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";
  let mode = $state<"BIZFLOW_HOSTED" | "BYO">("BIZFLOW_HOSTED");
  let providerKey = $state("custom_http");
  let authScheme = $state<"BEARER" | "API_KEY_HEADER" | "BASIC">("BEARER");
  let baseUrl = $state("");
  let token = $state("");
  let saving = $state(false);
  let testing = $state(false);
  let loading = $state(true);
  let configStatus = $state("Not configured");

  type EndpointConfig = {
    key: string;
    label: string;
    method: string;
    path: string;
    enabled: boolean;
    recipient: string;
    amount: string;
    network: string;
  };

  let endpoints = $state<EndpointConfig[]>([
    {
      key: "buyAirtime",
      label: "Airtime",
      method: "POST",
      path: "/api/topup/airtime",
      enabled: true,
      recipient: "recipient",
      amount: "amount",
      network: "network",
    },
    {
      key: "buyData",
      label: "Data bundle",
      method: "POST",
      path: "/api/topup/data",
      enabled: true,
      recipient: "recipient",
      amount: "amount",
      network: "network",
    },
    {
      key: "payBill",
      label: "Utility bills",
      method: "POST",
      path: "/api/topup/bills",
      enabled: true,
      recipient: "customerId",
      amount: "amount",
      network: "provider",
    },
    {
      key: "buyPin",
      label: "PIN sales",
      method: "POST",
      path: "/api/topup/pin",
      enabled: true,
      recipient: "productCode",
      amount: "amount",
      network: "productType",
    },
  ]);

  async function request(pathname: string, init: RequestInit = {}) {
    const response = await fetch(`${api}${pathname}`, {
      method: init.method ?? "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${$authStore.accessToken}`,
        ...(init.headers ?? {}),
      },
      ...init,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok)
      throw new Error(
        payload?.message ?? `Request failed (${response.status})`,
      );
    return payload;
  }
  async function loadConfiguration() {
    loading = true;
    try {
      const config = await request("/vtu/config");
      if (config?.mode === "BYO" || config?.mode === "BIZFLOW_HOSTED")
        mode = config.mode;
      configStatus = config?.status ?? "Not configured";
    } catch {
      configStatus = "Not configured";
    } finally {
      loading = false;
    }
  }
  async function saveMode() {
    saving = true;
    try {
      await request("/vtu/onboard", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      configStatus = mode === "BIZFLOW_HOSTED" ? "ACTIVE" : "PENDING_APPROVAL";
      toast.success("VTU setup path saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save setup path",
      );
    } finally {
      saving = false;
    }
  }
  async function saveProvider() {
    saving = true;
    try {
      const endpointMap: Record<string, unknown> = {};
      for (const endpoint of endpoints) {
        endpointMap[endpoint.key] = {
          method: endpoint.method,
          path: endpoint.path,
          requestTemplate: {
            recipient: endpoint.recipient,
            amount: endpoint.amount,
            network: endpoint.network,
          },
          responseMap: {
            statusPath: "status",
            successValue: "success",
            referencePath: "reference",
            messagePath: "message",
          },
        };
      }

      await request("/vtu/integrations", {
        method: "POST",
        body: JSON.stringify({
          providerKey,
          baseUrl,
          authScheme,
          credentials: { token },
          endpointMap,
        }),
      });
      mode = "BYO";
      configStatus = "ACTIVE";
      toast.success("Provider controller saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save provider",
      );
    } finally {
      saving = false;
    }
  }
  async function testConnection() {
    testing = true;
    try {
      const catalog = await request(
        `/vtu/integrations/test?providerKey=${encodeURIComponent(mode === "BIZFLOW_HOSTED" ? "vtu.ng" : providerKey)}`,
        { method: "POST" },
      );
      toast.success(
        `Provider connected · ${Array.isArray(catalog) ? catalog.length : 0} catalog items loaded`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Provider test failed",
      );
    } finally {
      testing = false;
    }
  }

  onMount(() => {
    void loadConfiguration();
  });
</script>

<AppShell>
  <PageHeader
    eyebrow="VTU · Provider setup"
    title="Provider control center"
    description="Connect one upstream provider and route every VTU product through a consistent contract."
  />
  <nav
    class="flex flex-wrap gap-2 border-b border-border/60 pb-4"
    aria-label="VTU workspace"
  >
    <a
      href="/extensions/vtu"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Overview</a
    ><a
      href="/extensions/vtu/provider"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
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
  <section
    class="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
  >
    <div class="border-b border-border/60 bg-muted/20 px-6 py-5">
      <div class="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div
            class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Provider workspace
          </div>
          <h2 class="mt-2 font-heading text-2xl font-bold">
            Connection & routes
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage the connection once, then map each product to its upstream
            route.
          </p>
        </div>
        <div
          class="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 class="h-4 w-4" />
          {loading ? "Loading configuration" : configStatus}
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-[280px_1fr]">
      <aside class="border-b border-border/60 p-5 lg:border-b-0 lg:border-r">
        <p
          class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
        >
          01 · Fulfillment
        </p>
        <div class="mt-4 space-y-2">
          <button
            type="button"
            onclick={() => (mode = "BIZFLOW_HOSTED")}
            class={`w-full rounded-xl border p-3 text-left transition ${mode === "BIZFLOW_HOSTED" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:bg-muted/30"}`}
          >
            <span
              class="flex items-center justify-between text-sm font-semibold"
              >BizFlow hosted <span class="h-2 w-2 rounded-full bg-emerald-500"
              ></span></span
            >
            <span class="mt-1 block text-xs leading-5 text-muted-foreground"
              >Managed adapter and float.</span
            >
          </button>
          <button
            type="button"
            onclick={() => (mode = "BYO")}
            class={`w-full rounded-xl border p-3 text-left transition ${mode === "BYO" ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:bg-muted/30"}`}
          >
            <span
              class="flex items-center justify-between text-sm font-semibold"
              >Bring your own <span class="h-2 w-2 rounded-full bg-primary"
              ></span></span
            >
            <span class="mt-1 block text-xs leading-5 text-muted-foreground"
              >Connect VTpass, MTN, Airtel, JED, or custom.</span
            >
          </button>
        </div>
        <button
          type="button"
          class="btn-app-primary mt-4 w-full"
          disabled={saving}
          onclick={() => void saveMode()}
        >
          {saving ? "Saving..." : "Save fulfillment mode"}
        </button>
        <div class="mt-5 border-t border-border/60 pt-5">
          <p
            class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Security
          </p>
          <p class="mt-2 flex gap-2 text-xs leading-5 text-muted-foreground">
            <ShieldCheck
              class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
            />Credentials are encrypted and never returned after saving.
          </p>
        </div>
      </aside>

      <div class="min-w-0 p-5 sm:p-6">
        {#if mode === "BIZFLOW_HOSTED"}
          <div class="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div class="flex items-start gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                ><Globe class="h-4 w-4" /></span
              >
              <div>
                <p class="text-sm font-semibold">VTU.ng hosted adapter</p>
                <p class="mt-1 text-xs leading-5 text-muted-foreground">
                  BizFlow routes airtime, data, electricity, cable TV, and ePIN
                  requests through the configured VTU.ng reseller account.
                  Credentials stay in the backend environment.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="btn-app-secondary mt-4"
              disabled={testing || loading}
              onclick={() => void testConnection()}
              ><RefreshCw
                class={`h-4 w-4 ${testing ? "animate-spin" : ""}`}
              />{testing ? "Testing..." : "Test VTU.ng connection"}</button
            >
          </div>
        {:else}
          <div class="grid gap-4 md:grid-cols-[1fr_180px]">
            <label class="block text-sm font-medium md:col-span-2"
              >Provider key<input
                bind:value={providerKey}
                placeholder="waec"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /><span
                class="mt-1 block text-[11px] font-normal text-muted-foreground"
                >Use a unique key such as <span class="font-mono">waec</span> or
                <span class="font-mono">mtn-direct</span>.</span
              ></label
            >
            <label class="block text-sm font-medium"
              >Base URL<input
                bind:value={baseUrl}
                placeholder="https://provider.example"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              /></label
            >
            <label class="block text-sm font-medium"
              >Auth scheme<select
                bind:value={authScheme}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5"
              >
                <option value="BEARER">BEARER</option><option
                  value="API_KEY_HEADER">API_KEY_HEADER</option
                ><option value="BASIC">BASIC</option>
              </select></label
            >
            <label class="block text-sm font-medium md:col-span-2"
              >Credential token<PasswordInput
                bind:value={token}
                placeholder="Provider token"
                class="mt-2"
              /></label
            >
          </div>

          <div
            class="mt-8 flex items-end justify-between gap-4 border-b border-border/60 pb-3"
          >
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                02 · Endpoint registry
              </p>
              <h3 class="mt-1 font-heading text-lg font-bold">
                Product routes
              </h3>
            </div>
            <span class="font-mono text-xs text-muted-foreground"
              >POST / normalized contract</span
            >
          </div>

          <div class="mt-4 divide-y divide-border/60">
            {#each endpoints as endpoint}
              <div class="py-5 first:pt-1 last:pb-1">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                      {#if endpoint.key === "buyAirtime"}<Wifi
                          class="h-4 w-4"
                        />{:else if endpoint.key === "buyData"}<Globe
                          class="h-4 w-4"
                        />{:else if endpoint.key === "buyPin"}<TicketPercent
                          class="h-4 w-4"
                        />{:else}<PlugZap class="h-4 w-4" />{/if}
                    </span>
                    <div>
                      <h4 class="text-sm font-semibold">{endpoint.label}</h4>
                      <p class="text-xs text-muted-foreground">
                        {endpoint.key === "buyPin"
                          ? "Voucher and examination PIN fulfillment"
                          : endpoint.key === "payBill"
                            ? "Electricity and cable bill payments"
                            : `Normalized ${endpoint.label.toLowerCase()} purchase route`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onclick={() => (endpoint.enabled = !endpoint.enabled)}
                    class={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${endpoint.enabled ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}
                    >{endpoint.enabled ? "Active" : "Disabled"}</button
                  >
                </div>
                <div class="mt-4 grid gap-3 md:grid-cols-[110px_1fr]">
                  <label class="block text-xs font-medium text-muted-foreground"
                    >Method<select
                      bind:value={endpoint.method}
                      class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                      ><option>POST</option><option>GET</option><option
                        >PUT</option
                      ></select
                    ></label
                  >
                  <label class="block text-xs font-medium text-muted-foreground"
                    >Route path<input
                      bind:value={endpoint.path}
                      class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm"
                    /></label
                  >
                </div>
                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  <label class="block text-xs font-medium text-muted-foreground"
                    >Recipient field<input
                      bind:value={endpoint.recipient}
                      class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                    /></label
                  >
                  <label class="block text-xs font-medium text-muted-foreground"
                    >Amount field<input
                      bind:value={endpoint.amount}
                      class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                    /></label
                  >
                  <label class="block text-xs font-medium text-muted-foreground"
                    >Network / provider<input
                      bind:value={endpoint.network}
                      class="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                    /></label
                  >
                </div>
              </div>
            {/each}
          </div>

          <div
            class="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/60 pt-5"
          >
            <span class="mr-auto text-xs text-muted-foreground"
              >Changes apply to new VTU requests after saving.</span
            >
            {#if mode === "BYO"}<button
                type="button"
                class="btn-app-primary"
                disabled={saving || !baseUrl || !token}
                onclick={() => void saveProvider()}
                ><PlugZap class="h-4 w-4" />{saving
                  ? "Saving..."
                  : "Save provider configuration"}</button
              >{/if}
          </div>
        {/if}
      </div>
    </div>
  </section>
</AppShell>
