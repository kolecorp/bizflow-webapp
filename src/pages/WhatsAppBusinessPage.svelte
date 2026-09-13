<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { extensions, disconnectExtension } from "$lib/stores/extensions";
  import {
    Bell,
    CheckCircle2,
    Clock3,
    MessageCircle,
    Settings2,
    ShieldCheck,
    TrendingUp,
    Unplug,
    Users,
    WalletCards,
    ArrowUpRight,
  } from "@lucide/svelte";

  let businessExt = $derived(
    $extensions.find((extension) => extension.id === "whatsapp-business"),
  );
  let connected = $derived(businessExt?.connected ?? false);
  let notifications = $state({
    dailySummaries: true,
    largeTransactions: true,
    lowStock: false,
  });

  const approvals = [
    {
      title: "Refund request",
      detail: "Order #BF-1048 · ₦12,500",
      time: "8 min ago",
      tone: "amber",
    },
    {
      title: "Large transaction",
      detail: "Adebayo Stores · ₦86,000",
      time: "24 min ago",
      tone: "green",
    },
    {
      title: "New staff access",
      detail: "Tosin requested manager access",
      time: "1 hr ago",
      tone: "blue",
    },
  ];
</script>

<AppShell>
  <PageHeader
    eyebrow="WhatsApp · Business"
    title="Business control room"
    description="Run your Bizflow workspace from WhatsApp. Get alerts, approve requests, and keep your team moving without opening the dashboard."
  />

  {#if !connected}
    <div class="surface-panel flex flex-col items-center p-10 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600"
      >
        <MessageCircle class="h-8 w-8" />
      </div>
      <h2 class="mt-5 font-heading text-2xl font-bold text-foreground">
        Connect your business number
      </h2>
      <p class="mt-2 max-w-lg text-sm text-muted-foreground">
        Link the WhatsApp number you use for operations to receive sales
        summaries, low-stock alerts, and approval requests from Bizflow.
      </p>
      <a href="/extensions/whatsapp" class="btn-app-primary mt-6"
        >Start connection</a
      >
    </div>
  {:else}
    <div class="space-y-6">
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7"
      >
        <div
          class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-600"
            >
              <ShieldCheck class="h-6 w-6" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-heading text-2xl font-bold text-foreground">
                  Bizflow Operations
                </h2>
                <span
                  class="rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600"
                  >Online</span
                >
              </div>
              <p class="mt-2 text-sm text-muted-foreground">
                Your business line is ready to receive alerts and action
                requests.
              </p>
              <p
                class="mt-3 flex items-center gap-2 font-mono text-xs text-muted-foreground"
              >
                <MessageCircle class="h-3.5 w-3.5 text-green-500" /> +234 {String(
                  businessExt?.connectionData?.phone ?? "",
                )}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              class="rounded-xl border border-border/60 bg-background/70 px-4 py-3"
            >
              <p class="text-[11px] text-muted-foreground">Alerts today</p>
              <p class="mt-1 font-heading text-xl font-bold text-foreground">
                24
              </p>
            </div>
            <div
              class="rounded-xl border border-border/60 bg-background/70 px-4 py-3"
            >
              <p class="text-[11px] text-muted-foreground">Pending actions</p>
              <p class="mt-1 font-heading text-xl font-bold text-amber-600">
                3
              </p>
            </div>
            <div
              class="col-span-2 rounded-xl border border-border/60 bg-background/70 px-4 py-3 sm:col-span-1"
            >
              <p class="text-[11px] text-muted-foreground">Last summary</p>
              <p
                class="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"
              >
                <Clock3 class="h-3.5 w-3.5 text-primary" /> 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3
                class="flex items-center gap-2 text-lg font-bold text-foreground"
              >
                <Bell class="h-5 w-5 text-primary" /> Notification channels
              </h3>
              <p class="mt-1 text-sm text-muted-foreground">
                Choose what your operations team receives.
              </p>
            </div>
            <Settings2 class="h-5 w-5 text-muted-foreground" />
          </div>
          <div class="mt-5 space-y-3">
            <label
              class="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/20"
              ><span class="flex items-center gap-3"
                ><span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600"
                  ><Clock3 class="h-4 w-4" /></span
                ><span
                  ><span class="block text-sm font-medium text-foreground"
                    >Daily sales summary</span
                  ><span class="mt-0.5 block text-xs text-muted-foreground"
                    >Revenue, transactions, and top services at close</span
                  ></span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifications.dailySummaries}
                class="h-4 w-4 accent-primary"
              /></label
            >
            <label
              class="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/20"
              ><span class="flex items-center gap-3"
                ><span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600"
                  ><TrendingUp class="h-4 w-4" /></span
                ><span
                  ><span class="block text-sm font-medium text-foreground"
                    >Large transaction alerts</span
                  ><span class="mt-0.5 block text-xs text-muted-foreground"
                    >Get notified when a transaction exceeds ₦50,000</span
                  ></span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifications.largeTransactions}
                class="h-4 w-4 accent-primary"
              /></label
            >
            <label
              class="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-4 hover:bg-muted/20"
              ><span class="flex items-center gap-3"
                ><span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"
                  ><WalletCards class="h-4 w-4" /></span
                ><span
                  ><span class="block text-sm font-medium text-foreground"
                    >Low stock alerts</span
                  ><span class="mt-0.5 block text-xs text-muted-foreground"
                    >Know when a product needs restocking</span
                  ></span
                ></span
              ><input
                type="checkbox"
                bind:checked={notifications.lowStock}
                class="h-4 w-4 accent-primary"
              /></label
            >
          </div>
        </div>

        <div class="surface-panel p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3
                class="flex items-center gap-2 text-lg font-bold text-foreground"
              >
                <CheckCircle2 class="h-5 w-5 text-primary" /> Awaiting your action
              </h3>
              <p class="mt-1 text-sm text-muted-foreground">
                Requests you can approve from WhatsApp.
              </p>
            </div>
            <span
              class="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-600"
              >3 pending</span
            >
          </div>
          <div class="mt-5 space-y-2">
            {#each approvals as approval}<button
                type="button"
                class="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left transition hover:border-primary/40 hover:bg-muted/20"
                ><span
                  class={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${approval.tone === "amber" ? "bg-amber-500/10 text-amber-600" : approval.tone === "green" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}
                  ><CheckCircle2 class="h-4 w-4" /></span
                ><span class="min-w-0 flex-1"
                  ><span class="block text-sm font-medium text-foreground"
                    >{approval.title}</span
                  ><span
                    class="mt-0.5 block truncate text-xs text-muted-foreground"
                    >{approval.detail}</span
                  ></span
                ><span class="shrink-0 text-[11px] text-muted-foreground"
                  >{approval.time}</span
                ><ArrowUpRight
                  class="h-4 w-4 shrink-0 text-muted-foreground"
                /></button
              >{/each}
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="surface-panel p-6">
          <h3 class="flex items-center gap-2 text-lg font-bold text-foreground">
            <Users class="h-5 w-5 text-primary" /> Team numbers
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            People who receive business operations messages.
          </p>
          <div
            class="mt-5 flex items-center justify-between rounded-xl border border-border/60 p-3"
          >
            <div>
              <p class="text-sm font-medium text-foreground">Primary manager</p>
              <p class="mt-1 font-mono text-xs text-muted-foreground">
                +234 {String(businessExt?.connectionData?.phone ?? "")}
              </p>
            </div>
            <span class="text-xs font-semibold text-green-600">Verified</span>
          </div>
          <button type="button" class="btn-app-secondary mt-3 w-full text-sm"
            ><Users class="h-4 w-4" /> Add team number</button
          >
        </div>
        <div class="surface-panel p-6">
          <h3 class="flex items-center gap-2 text-lg font-bold text-foreground">
            <Settings2 class="h-5 w-5 text-primary" /> Business preferences
          </h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Control how Bizflow speaks to your team.
          </p>
          <div class="mt-5 space-y-3">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border border-border/60 p-3 text-left hover:bg-muted/20"
              ><span
                ><span class="block text-sm font-medium text-foreground"
                  >Alert language</span
                ><span class="block text-xs text-muted-foreground"
                  >English · Nigeria</span
                ></span
              ><ArrowUpRight class="h-4 w-4 text-muted-foreground" /></button
            ><button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border border-border/60 p-3 text-left hover:bg-muted/20"
              ><span
                ><span class="block text-sm font-medium text-foreground"
                  >Quiet hours</span
                ><span class="block text-xs text-muted-foreground"
                  >10:00 PM – 6:00 AM</span
                ></span
              ><ArrowUpRight class="h-4 w-4 text-muted-foreground" /></button
            >
          </div>
        </div>
      </div>
      <div class="flex justify-end border-t border-border/60 pt-2">
        <button
          type="button"
          onclick={() => disconnectExtension("whatsapp-business")}
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
          ><Unplug class="h-4 w-4" /> Disconnect business WhatsApp</button
        >
      </div>
    </div>
  {/if}
</AppShell>
