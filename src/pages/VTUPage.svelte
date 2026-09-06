<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import {
    Activity,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    CreditCard,
    Lightbulb,
    PlugZap,
    ShieldCheck,
    SmartphoneNfc,
    Unplug,
    Zap,
  } from "@lucide/svelte";

  let connected = $state(false);
  let provider = $state("VTPass");
  let environment = $state("Sandbox");
  let isTesting = $state(false);
  let apiUrl = $state("");
  let apiKey = $state("");
  let secret = $state("");

  const services = [
    { name: "Airtime", detail: "All networks", icon: SmartphoneNfc },
    { name: "Data", detail: "Bundles & plans", icon: Zap },
    { name: "Electricity", detail: "Bills & meters", icon: Lightbulb },
    { name: "Cable TV", detail: "DStv, GOtv & StarTimes", icon: CreditCard },
    { name: "Education pins", detail: "WAEC, JAMB & more", icon: ShieldCheck },
    {
      name: "Custom services",
      detail: "Provider dependent",
      icon: CircleDollarSign,
    },
  ];

  const transactions = [
    ["MTN Airtime", "0803•••218", "₦1,000", "Successful"],
    ["DSTV Compact", "0806•••901", "₦9,000", "Successful"],
    ["Airtel Data 2GB", "0814•••442", "₦750", "Failed"],
  ];

  function testConnection() {
    isTesting = true;
    setTimeout(() => {
      isTesting = false;
      connected = true;
    }, 900);
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · VTU"
    title="VTU platform"
    description="Sell airtime, data, bills and digital services through Bizflow, WhatsApp and your campaign pages."
  />

  {#if !connected}
    <div
      class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
    >
      <section class="surface-panel overflow-hidden p-0">
        <div class="border-b border-border/60 bg-muted/20 px-7 py-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
              >
                Provider setup
              </p>
              <h2 class="mt-2 font-heading text-2xl font-bold text-foreground">
                Connect a VTU provider
              </h2>
              <p class="mt-2 max-w-lg text-sm text-muted-foreground">
                Your provider supplies the services and float. Bizflow handles
                pricing, orders, wallets and customer delivery.
              </p>
            </div>
            <div
              class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex"
            >
              <PlugZap class="h-5 w-5" />
            </div>
          </div>
        </div>
        <div class="p-7">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-medium text-foreground"
              >Provider<select
                bind:value={provider}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                ><option>VTPass</option><option>Reloadly</option><option
                  >Baxi</option
                ><option>Custom Provider</option></select
              ></label
            >
            <label class="text-sm font-medium text-foreground"
              >Environment<select
                bind:value={environment}
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                ><option>Sandbox</option><option>Production</option></select
              ></label
            >
            {#if provider === "Custom Provider"}<label
                class="text-sm font-medium text-foreground sm:col-span-2"
                >API URL<input
                  bind:value={apiUrl}
                  placeholder="https://api.provider.com/v1"
                  class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
                /></label
              >{/if}
            <label class="text-sm font-medium text-foreground"
              >API key<PasswordInput
                bind:value={apiKey}
                placeholder="Enter API key"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
              /></label
            >
            <label class="text-sm font-medium text-foreground"
              >Secret / API token<PasswordInput
                bind:value={secret}
                placeholder="Enter secret token"
                class="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
              /></label
            >
          </div>
          <div
            class="mt-6 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Start in Sandbox while you test. Your credentials are encrypted
              and never shown after saving.
            </p>
            <button
              type="button"
              onclick={testConnection}
              disabled={isTesting}
              class="btn-app-primary shrink-0 disabled:opacity-60"
              ><PlugZap class="h-4 w-4" />{isTesting
                ? "Testing connection..."
                : "Test connection"}</button
            >
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="surface-panel p-6">
          <div class="flex items-center justify-between">
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Provider coverage
              </p>
              <h3 class="mt-2 font-heading text-xl font-bold text-foreground">
                Everything your customers need
              </h3>
            </div>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <Zap class="h-5 w-5" />
            </div>
          </div>
          <div class="mt-5 space-y-2">
            {#each services as service}<div
                class="flex items-center gap-3 rounded-xl border border-border/60 p-3"
              >
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/70 text-primary"
                  ><svelte:component
                    this={service.icon}
                    class="h-4 w-4"
                  /></span
                ><span class="flex-1"
                  ><span class="block text-sm font-medium text-foreground"
                    >{service.name}</span
                  ><span class="block text-xs text-muted-foreground"
                    >{service.detail}</span
                  ></span
                ><Check class="h-4 w-4 text-green-500" />
              </div>{/each}
          </div>
        </div>
        <div class="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p
            class="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <ShieldCheck class="h-4 w-4 text-primary" /> Built for reliable fulfilment
          </p>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
            One connection powers your store, customer wallets, WhatsApp bot and
            marketing campaigns. You can change providers later.
          </p>
        </div>
      </aside>
    </div>
  {:else}
    <div class="space-y-6">
      <div
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-5"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600"
            ><CheckCircle2 class="h-5 w-5" /></span
          >
          <div>
            <p class="font-semibold text-foreground">{provider} is connected</p>
            <p class="text-xs text-muted-foreground">
              {environment} environment · Services synced just now
            </p>
          </div>
        </div>
        <button
          type="button"
          class="btn-app-secondary text-sm"
          onclick={() => (connected = false)}
          ><PlugZap class="h-4 w-4" /> Change provider</button
        >
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Transactions this month</p>
          <p class="mt-2 font-heading text-2xl font-bold text-foreground">
            1,284
          </p>
          <p class="mt-1 text-xs text-green-600">+12.8% vs last month</p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Success rate</p>
          <p class="mt-2 font-heading text-2xl font-bold text-foreground">
            96.7%
          </p>
          <p class="mt-1 text-xs text-muted-foreground">1,242 successful</p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Revenue / profit</p>
          <p class="mt-2 font-heading text-2xl font-bold text-foreground">
            ₦38,460
          </p>
          <p class="mt-1 text-xs text-green-600">₦12,840 profit</p>
        </div>
        <div class="surface-panel p-5">
          <p class="text-xs text-muted-foreground">Customer wallets</p>
          <p class="mt-2 font-heading text-2xl font-bold text-foreground">
            ₦84,200
          </p>
          <p class="mt-1 text-xs text-primary">126 active wallets</p>
        </div>
      </div>
      <div class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Catalog
              </p>
              <h2
                class="mt-2 flex items-center gap-2 text-lg font-bold text-foreground"
              >
                <Zap class="h-5 w-5 text-primary" /> Available services
              </h2>
            </div>
            <a
              href="/extensions/vtu/pricing"
              class="text-xs font-semibold text-primary">Manage pricing</a
            >
          </div>
          <div class="mt-5 grid grid-cols-2 gap-2">
            {#each services as service}<div
                class="rounded-xl border border-border/60 p-3"
              >
                <p class="text-sm font-medium text-foreground">
                  {service.name}
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {service.detail}
                </p>
              </div>{/each}
          </div>
          <a
            href="/extensions/vtu/pricing"
            class="mt-5 flex items-center justify-between rounded-xl bg-primary/5 p-3 text-sm font-medium text-primary"
            >Configure rules & pricing <ChevronRight class="h-4 w-4" /></a
          >
        </section>
        <section class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              >
                Activity
              </p>
              <h2
                class="mt-2 flex items-center gap-2 text-lg font-bold text-foreground"
              >
                <Activity class="h-5 w-5 text-primary" /> Recent transactions
              </h2>
            </div>
            <button
              type="button"
              class="text-xs font-semibold text-primary"
              onclick={() => (window.location.href = "/transactions")}
              >View all</button
            >
          </div>
          <div class="mt-5 overflow-x-auto">
            <table class="w-full min-w-[520px] text-left text-sm">
              <thead class="text-xs text-muted-foreground"
                ><tr
                  ><th class="pb-3 font-medium">Service</th><th
                    class="pb-3 font-medium">Customer</th
                  ><th class="pb-3 font-medium">Amount</th><th
                    class="pb-3 font-medium">Status</th
                  ></tr
                ></thead
              ><tbody
                >{#each transactions as transaction}<tr
                    class="border-t border-border/60"
                    ><td class="py-3 text-foreground">{transaction[0]}</td><td
                      class="py-3 font-mono text-xs text-muted-foreground"
                      >{transaction[1]}</td
                    ><td class="py-3 text-foreground">{transaction[2]}</td><td
                      class={`py-3 text-xs font-semibold ${transaction[3] === "Successful" ? "text-green-600" : "text-red-500"}`}
                      >{transaction[3]}</td
                    ></tr
                  >{/each}</tbody
              >
            </table>
          </div>
        </section>
      </div>
      <div class="flex justify-end border-t border-border/60 pt-2">
        <button
          type="button"
          onclick={() => (connected = false)}
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
          ><Unplug class="h-4 w-4" /> Disconnect provider</button
        >
      </div>
    </div>
  {/if}
</AppShell>
