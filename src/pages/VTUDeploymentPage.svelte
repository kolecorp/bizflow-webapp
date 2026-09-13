<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    CheckCircle2,
    Code2,
    Globe2,
    MessageCircle,
    Send,
    Smartphone,
    ArrowRight,
  } from "@lucide/svelte";

  const connectors = [
    {
      name: "BizFlow web",
      detail:
        "Share a branded purchase link or embed the VTU experience in your storefront.",
      status: "Ready",
      icon: Globe2,
      tone: "text-emerald-600 bg-emerald-500/10",
      href: "/extensions/vtu/purchase",
      action: "Open purchase flow",
    },
    {
      name: "Telegram bot",
      detail:
        "Let customers buy airtime and data, check status, and receive updates in Telegram.",
      status: "Connect bot",
      icon: Send,
      tone: "text-sky-600 bg-sky-500/10",
      href: "/extensions/telegram",
      action: "Configure Telegram",
    },
    {
      name: "WhatsApp",
      detail:
        "Use WhatsApp as a conversational VTU channel for customer orders and notifications.",
      status: "Connector setup",
      icon: MessageCircle,
      tone: "text-green-600 bg-green-500/10",
      href: "/extensions/whatsapp",
      action: "Open WhatsApp",
    },
    {
      name: "REST API",
      detail:
        "Connect your own POS, mobile app, website, or automation to the normalized purchase contract.",
      status: "Ready for integration",
      icon: Code2,
      tone: "text-violet-600 bg-violet-500/10",
      href: "/extensions/vtu/provider",
      action: "View provider setup",
    },
  ];
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension · VTU"
    title="Customer deployment"
    description="Choose how customers will discover, purchase, and track VTU services. The same pricing, fulfillment, and status engine powers every connector."
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
      href="/extensions/vtu/deployment"
      class="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary"
      >Customer deployment</a
    >
    <a
      href="/extensions/vtu/provider"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Provider setup</a
    >
    <a
      href="/extensions/vtu/purchase"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >New purchase</a
    >
    <a
      href="/extensions/vtu/transactions"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Transactions</a
    >
    <a
      href="/extensions/vtu/pricing"
      class="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
      >Pricing</a
    >
  </nav>

  <div class="mt-6 space-y-6">
    <section class="surface-panel overflow-hidden">
      <div class="border-b border-border/70 bg-muted/15 p-6">
        <div class="flex items-start gap-4">
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            ><Smartphone class="h-6 w-6" /></span
          >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
            >
              Customer-facing channels
            </p>
            <h2 class="mt-1 font-heading text-xl font-bold">
              One VTU engine, every touchpoint
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Configure the channels your customers will use. Network detection,
              plan selection, pricing, bulk recipients, payment rules, and
              transaction status remain consistent wherever the purchase starts.
            </p>
          </div>
        </div>
      </div>
      <div class="grid gap-4 p-6 md:grid-cols-2">
        {#each connectors as connector}
          <article
            class="rounded-xl border border-border/70 bg-background p-5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-4">
              <span
                class={`flex size-10 items-center justify-center rounded-xl ${connector.tone}`}
                ><svelte:component
                  this={connector.icon}
                  class="h-5 w-5"
                /></span
              ><span
                class="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >{connector.status}</span
              >
            </div>
            <h3 class="mt-5 font-heading text-lg font-bold text-foreground">
              {connector.name}
            </h3>
            <p class="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              {connector.detail}
            </p>
            <a
              href={connector.href}
              class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >{connector.action}<ArrowRight class="h-4 w-4" /></a
            >
          </article>
        {/each}
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-3">
      <section class="surface-panel p-6 lg:col-span-2">
        <p
          class="text-[10px] font-bold uppercase tracking-[0.18em] text-primary"
        >
          Recommended rollout
        </p>
        <h2 class="mt-2 font-heading text-xl font-bold">
          Start simple, expand confidently
        </h2>
        <div class="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <span class="font-mono text-xs font-bold text-primary">01</span>
            <p class="mt-2 text-sm font-semibold">Web purchase</p>
            <p class="mt-1 text-xs leading-5 text-muted-foreground">
              Validate pricing, fulfillment, and customer status in the built-in
              flow.
            </p>
          </div>
          <div>
            <span class="font-mono text-xs font-bold text-primary">02</span>
            <p class="mt-2 text-sm font-semibold">Telegram and WhatsApp</p>
            <p class="mt-1 text-xs leading-5 text-muted-foreground">
              Meet customers in the channels they already use.
            </p>
          </div>
          <div>
            <span class="font-mono text-xs font-bold text-primary">03</span>
            <p class="mt-2 text-sm font-semibold">POS and API</p>
            <p class="mt-1 text-xs leading-5 text-muted-foreground">
              Connect staff tools, storefronts, and future Mini Apps.
            </p>
          </div>
        </div>
      </section>
      <aside class="surface-panel p-6">
        <CheckCircle2 class="h-5 w-5 text-emerald-600" />
        <h2 class="mt-3 font-heading text-lg font-bold">Shared controls</h2>
        <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>Provider catalog and pricing</li>
          <li>Business discounts and cashback</li>
          <li>Bulk recipient handling</li>
          <li>Live transaction status</li>
        </ul>
      </aside>
    </div>
  </div>
</AppShell>
