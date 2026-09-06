<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import AddUSSDMenuModal from "$lib/components/modals/AddUSSDMenuModal.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { authStore } from "$lib/stores/auth";
  import { toast } from "svelte-sonner";
  import {
    Hash,
    Terminal,
    Plus,
    ListTree,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Settings2,
    Users,
    BarChart3,
  } from "@lucide/svelte";

  let { initialTab = "overview" } = $props();

  let connected = $state(false);
  let isConnecting = $state(false);
  let shortCode = $state("");
  let apiKey = $state("");
  let provider = $state("Africa's Talking");
  let activeTab = $state<"overview" | "menus" | "settings">(
    initialTab as "overview" | "menus" | "settings",
  );

  let menuModalOpen = $state(false);

  const providers = ["Africa's Talking", "Infobip", "Termii"];
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

  const recentSessions = [
    {
      phone: "0803•••218",
      session: "Balance Check → ₦14,500",
      duration: "45s",
      time: "5 min ago",
      result: "Success",
    },
    {
      phone: "0706•••441",
      session: "Airtime Purchase → ₦500 to 0812•••",
      duration: "1m 12s",
      time: "22 min ago",
      result: "Success",
    },
    {
      phone: "0901•••773",
      session: "Transaction History → Last 5 txns",
      duration: "30s",
      time: "1 hr ago",
      result: "Success",
    },
    {
      phone: "0814•••112",
      session: "Balance Check",
      duration: "8s",
      time: "2 hrs ago",
      result: "Timeout",
    },
  ];

  let menuItems = $state([
    {
      code: "1",
      label: "Check Balance",
      subItems: ["1. Business Wallet", "2. Customer Wallets"],
    },
    {
      code: "2",
      label: "Buy Airtime / Data",
      subItems: ["1. MTN", "2. Airtel", "3. Glo", "4. 9mobile"],
    },
    {
      code: "3",
      label: "Transaction History",
      subItems: ["Last 5 transactions"],
    },
    {
      code: "4",
      label: "Staff Actions",
      subItems: ["1. Log Sale", "2. Check Inventory"],
    },
  ]);

  const stats = [
    { label: "Sessions Today", value: "31" },
    { label: "Successful", value: "28" },
    { label: "Timeout / Failed", value: "3" },
    { label: "Avg Duration", value: "48s" },
  ];

  async function connect() {
    isConnecting = true;
    try {
      const response = await fetch(`${API_BASE_URL}/ussd/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ provider, shortCode, apiKey }),
      });
      if (!response.ok) throw new Error("USSD provider connection failed.");
      connected = true;
    } catch (error) {
      toast.error("Unable to connect USSD provider", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      isConnecting = false;
    }
  }

  async function saveChanges() {
    try {
      const response = await fetch(`${API_BASE_URL}/ussd/config`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ provider, shortCode }),
      });
      if (!response.ok) throw new Error("USSD configuration was not saved.");
      toast.success("USSD settings saved");
    } catch (error) {
      toast.error("Unable to save USSD settings", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  async function createMenu(code: string, label: string, subItems: string[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/ussd/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${$authStore.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ code, label, subItems }),
      });
      if (!response.ok) throw new Error("USSD menu was not saved.");
      menuItems = [...menuItems, { code, label, subItems }];
      menuModalOpen = false;
    } catch (error) {
      toast.error("Unable to create menu", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · USSD"
    title="USSD Access"
    description="Let staff and customers check balances, buy airtime, and perform transactions via USSD on any phone — no internet needed."
  />

  {#if !connected}
    <!-- Setup state -->
    <div class="surface-panel overflow-hidden">
      <div class="p-8 sm:p-10">
        <div class="mx-auto max-w-lg text-center">
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Hash class="h-8 w-8 text-primary" />
          </div>
          <h2 class="font-heading text-2xl font-extrabold text-foreground">
            Connect your USSD provider
          </h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Link a USSD short code to Bizflow. Your customers and staff can
            access core features without needing a smartphone or internet.
          </p>
        </div>

        <div class="mx-auto mt-8 max-w-md space-y-4">
          <label class="block text-sm font-medium text-foreground">
            Provider
            <select
              bind:value={provider}
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            >
              {#each providers as p}<option value={p}>{p}</option>{/each}
            </select>
          </label>

          <label class="block text-sm font-medium text-foreground">
            Short Code
            <input
              type="text"
              bind:value={shortCode}
              placeholder="e.g. *384*001#"
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>

          <label class="block text-sm font-medium text-foreground">
            API Key
            <PasswordInput
              bind:value={apiKey}
              placeholder="Paste your {provider} API key"
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>

          <button
            type="button"
            onclick={connect}
            disabled={isConnecting || !apiKey || !shortCode}
            class="btn-app-primary w-full mt-2"
          >
            {isConnecting ? "Connecting…" : "Connect & Activate"}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Connected dashboard -->
    <div class="grid gap-4 sm:grid-cols-4">
      {#each stats as stat}
        <div class="surface-stat p-5">
          <p
            class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {stat.label}
          </p>
          <p
            class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground"
          >
            {stat.value}
          </p>
        </div>
      {/each}
    </div>

    <!-- Short code badge -->
    <div class="surface-panel p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-lg bg-primary/10 p-2.5 text-primary">
          <Terminal class="h-5 w-5" />
        </div>
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Active Short Code
          </p>
          <p class="font-mono text-lg font-extrabold text-foreground">
            {shortCode || "*384*001#"}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-2 w-2 rounded-full bg-green-500"></div>
        <span class="text-xs font-semibold text-green-600 dark:text-green-400"
          >Live via {provider}</span
        >
      </div>
    </div>

    <!-- Tab nav -->
    <div
      class="flex items-center gap-1 rounded-xl border border-border/60 bg-card p-1 w-fit"
    >
      {#each ["overview", "menus", "settings"] as const as tab}
        <button
          type="button"
          onclick={() => (activeTab = tab)}
          class="rounded-lg px-4 py-2 text-sm font-semibold capitalize transition {activeTab ===
          tab
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'}"
        >
          {tab}
        </button>
      {/each}
    </div>

    {#if activeTab === "overview"}
      <!-- Recent sessions -->
      <div class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 px-6 py-5"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <BarChart3 class="h-4 w-4" />
            </div>
            <div>
              <h3 class="font-heading text-lg font-semibold text-foreground">
                Recent USSD Sessions
              </h3>
              <p class="text-xs text-muted-foreground mt-0.5">
                Live activity from your short code
              </p>
            </div>
          </div>
        </div>
        <div class="divide-y divide-border/40">
          {#each recentSessions as session}
            <div
              class="flex items-start justify-between px-6 py-4 hover:bg-muted/20 transition"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div
                  class="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground"
                >
                  {session.phone.slice(0, 2)}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-foreground">
                    {session.phone}
                  </p>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {session.session}
                  </p>
                </div>
              </div>
              <div class="ml-4 shrink-0 text-right">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold {session.result ===
                  'Success'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-amber-500/10 text-amber-600'}"
                >
                  {#if session.result === "Success"}<CheckCircle2
                      class="h-3 w-3"
                    />{:else}<AlertCircle class="h-3 w-3" />{/if}
                  {session.result}
                </span>
                <p class="text-[10px] text-muted-foreground mt-1">
                  {session.duration} · {session.time}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeTab === "menus"}
      <!-- Menu tree -->
      <div class="surface-panel overflow-hidden">
        <div
          class="flex items-center justify-between border-b border-border/60 px-6 py-5"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-primary/10 p-2 text-primary">
              <ListTree class="h-4 w-4" />
            </div>
            <h3 class="font-heading text-lg font-semibold text-foreground">
              USSD Menu Tree
            </h3>
          </div>
          <button
            type="button"
            onclick={() => (menuModalOpen = true)}
            class="btn-app-primary text-xs"
            ><Plus class="h-3.5 w-3.5" /> Add menu item</button
          >
        </div>
        <div class="divide-y divide-border/40">
          {#each menuItems as item}
            <div class="px-6 py-4 hover:bg-muted/20 transition group">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span
                    class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary"
                    >{item.code}</span
                  >
                  <p class="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>
                <button
                  type="button"
                  class="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition flex items-center gap-1"
                >
                  Edit <ChevronRight class="h-3 w-3" />
                </button>
              </div>
              <div class="mt-2 ml-10 space-y-1">
                {#each item.subItems as sub}
                  <p class="text-xs text-muted-foreground font-mono">{sub}</p>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Settings -->
      <div class="surface-panel p-6 sm:p-8 space-y-6">
        <div
          class="flex items-center justify-between pb-4 border-b border-border/60"
        >
          <div>
            <h3 class="font-heading text-lg font-semibold text-foreground">
              Provider: {provider}
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">
              Short Code: {shortCode || "*384*001#"}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-green-500"></div>
            <span
              class="text-xs font-semibold text-green-600 dark:text-green-400"
              >Connected</span
            >
          </div>
        </div>
        <div class="space-y-4 max-w-md">
          <label class="block text-sm font-medium">
            Short Code
            <input
              type="text"
              bind:value={shortCode}
              placeholder="*384*001#"
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>
          <label class="block text-sm font-medium">
            API Key
            <PasswordInput
              value="••••••••••••••••"
              readonly
              class="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-mono"
            />
          </label>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            onclick={saveChanges}
            class="btn-app-primary text-sm">Save Changes</button
          >
          <button
            type="button"
            onclick={() => (connected = false)}
            class="btn-app-secondary text-sm">Disconnect</button
          >
        </div>
      </div>
    {/if}
  {/if}

  <AddUSSDMenuModal
    open={menuModalOpen}
    onOpenChange={(open) => (menuModalOpen = open)}
    onConfirm={createMenu}
  />
</AppShell>
