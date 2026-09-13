<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    BarChart3,
    ChevronRight,
    Copy,
    Eye,
    Megaphone,
    MousePointerClick,
    Plus,
    Users,
  } from "@lucide/svelte";
  const campaigns = [
    {
      name: "MTN Data Promo",
      page: "Data Promo",
      status: "Running",
      visitors: "2,450",
      leads: "382",
      conversion: "15.5%",
      revenue: "₦126,000",
    },
    {
      name: "Back to School",
      page: "School Essentials",
      status: "Draft",
      visitors: "—",
      leads: "—",
      conversion: "—",
      revenue: "—",
    },
    {
      name: "Cafe Bloom Launch",
      page: "New menu",
      status: "Ended",
      visitors: "1,820",
      leads: "214",
      conversion: "11.8%",
      revenue: "₦84,500",
    },
  ];
</script>

<AppShell
  ><PageHeader
    eyebrow="Extension · Marketing"
    title="Marketing studio"
    description="Turn ads into leads, conversations, and sales with connected campaigns for your business."
    infographic="/marketing_infographics.png"
    infographicAlt="Marketing Studio campaign and conversion overview"
    ><svelte:fragment slot="actions"
      ><div class="flex flex-wrap items-center gap-2">
        <a href="/extensions/marketing/builder" class="btn-app-secondary"
          ><MousePointerClick class="h-4 w-4" /> Open builder</a
        ><a href="/extensions/marketing/builder" class="btn-app-primary"
          ><Plus class="h-4 w-4" /> Create campaign</a
        >
      </div></svelte:fragment
    ></PageHeader
  >
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div class="surface-panel p-5">
      <p class="text-xs text-muted-foreground">Active campaigns</p>
      <p class="mt-2 font-heading text-2xl font-bold">1</p>
      <p class="mt-1 text-xs text-green-600">+1 this month</p>
    </div>
    <div class="surface-panel p-5">
      <p class="text-xs text-muted-foreground">Visitors</p>
      <p class="mt-2 font-heading text-2xl font-bold">4,270</p>
      <p class="mt-1 text-xs text-muted-foreground">Across all pages</p>
    </div>
    <div class="surface-panel p-5">
      <p class="text-xs text-muted-foreground">Leads</p>
      <p class="mt-2 font-heading text-2xl font-bold">596</p>
      <p class="mt-1 text-xs text-primary">14% conversion</p>
    </div>
    <div class="surface-panel p-5">
      <p class="text-xs text-muted-foreground">Campaign revenue</p>
      <p class="mt-2 font-heading text-2xl font-bold">₦210,500</p>
      <p class="mt-1 text-xs text-green-600">+22% this month</p>
    </div>
  </div>
  <div class="surface-panel overflow-hidden p-0">
    <div
      class="flex items-center justify-between border-b border-border/60 p-6"
    >
      <div>
        <h2 class="flex items-center gap-2 text-lg font-bold">
          <Megaphone class="h-5 w-5 text-primary" /> Campaigns
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Landing pages, forms, and WhatsApp journeys in one view.
        </p>
      </div>
      <a
        href="/extensions/marketing/forms"
        class="text-sm font-medium text-primary">Manage forms</a
      >
    </div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-200 text-left text-sm">
        <thead class="bg-muted/30 text-xs text-muted-foreground"
          ><tr
            ><th class="p-4 font-medium">Campaign</th><th
              class="p-4 font-medium">Status</th
            ><th class="p-4 font-medium">Visitors</th><th
              class="p-4 font-medium">Leads</th
            ><th class="p-4 font-medium">Conversion</th><th
              class="p-4 font-medium">Revenue</th
            ><th class="p-4 font-medium">Actions</th></tr
          ></thead
        ><tbody
          >{#each campaigns as campaign}<tr class="border-t border-border/60"
              ><td class="p-4"
                ><p class="font-semibold text-foreground">{campaign.name}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  Landing page → {campaign.page}
                </p></td
              ><td class="p-4"
                ><span
                  class={`rounded-full px-2 py-1 text-[11px] font-semibold ${campaign.status === "Running" ? "bg-green-500/10 text-green-600" : campaign.status === "Draft" ? "bg-muted text-muted-foreground" : "bg-amber-500/10 text-amber-600"}`}
                  >{campaign.status}</span
                ></td
              ><td class="p-4 text-foreground">{campaign.visitors}</td><td
                class="p-4 text-foreground">{campaign.leads}</td
              ><td class="p-4 text-foreground">{campaign.conversion}</td><td
                class="p-4 font-semibold text-foreground">{campaign.revenue}</td
              ><td class="p-4"
                ><div class="flex gap-1">
                  <button
                    type="button"
                    aria-label="View campaign"
                    class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    ><Eye class="h-4 w-4" /></button
                  ><button
                    type="button"
                    aria-label="Duplicate campaign"
                    class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    ><Copy class="h-4 w-4" /></button
                  ><button
                    type="button"
                    aria-label="Campaign analytics"
                    class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    ><BarChart3 class="h-4 w-4" /></button
                  >
                </div></td
              ></tr
            >{/each}</tbody
        >
      </table>
    </div>
  </div>
  <div class="mt-6 grid gap-4 md:grid-cols-3">
    <a
      href="/extensions/marketing/builder"
      class="surface-panel p-5 hover:border-primary/40"
      ><MousePointerClick class="h-5 w-5 text-primary" />
      <p class="mt-3 font-semibold">Landing pages</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Build and publish conversion-focused pages.
      </p>
      <ChevronRight class="mt-4 h-4 w-4 text-primary" /></a
    ><a
      href="/extensions/marketing/forms"
      class="surface-panel p-5 hover:border-primary/40"
      ><Users class="h-5 w-5 text-primary" />
      <p class="mt-3 font-semibold">Forms & lead actions</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Decide what happens after every submission.
      </p>
      <ChevronRight class="mt-4 h-4 w-4 text-primary" /></a
    >
    <div class="surface-panel p-5">
      <BarChart3 class="h-5 w-5 text-primary" />
      <p class="mt-3 font-semibold">Connected journey</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Ad → page → lead → WhatsApp → payment → order.
      </p>
    </div>
  </div></AppShell
>
