<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    extensions,
    connectExtension,
    disconnectExtension,
  } from "$lib/stores/extensions";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import {
    Zap,
    Sparkles,
    CheckCircle2,
    PackageMinus,
    BarChart3,
    Receipt,
    UserPlus,
    ArrowRight,
    Power,
    Settings2,
    Play,
  } from "@lucide/svelte";

  let automationExt = $derived($extensions.find((e) => e.id === "automations"));
  let isConnected = $derived(automationExt?.connected ?? false);

  let templates = $state([
    {
      id: "low-stock",
      name: "Low Stock Alert",
      description:
        "Send a notification when an item's stock falls below a set threshold.",
      icon: PackageMinus,
      color: "amber",
      enabled: false,
    },
    {
      id: "daily-sales",
      name: "Daily Sales Summary",
      description:
        "Generate and send a summary of all sales at the end of the day.",
      icon: BarChart3,
      color: "blue",
      enabled: false,
    },
    {
      id: "large-tx",
      name: "Large Transaction Alert",
      description:
        "Trigger an alert when a transaction exceeds a specified amount.",
      icon: Zap,
      color: "emerald",
      enabled: false,
    },
    {
      id: "new-customer",
      name: "New Customer Welcome",
      description:
        "Send a welcome message to a customer after their first transaction.",
      icon: UserPlus,
      color: "violet",
      enabled: false,
    },
  ]);

  function getStarted() {
    connectExtension("automations", {
      connectedAt: new Date().toISOString(),
      activeAutomations: [],
    });
  }

  function toggleTemplate(index: number) {
    templates[index].enabled = !templates[index].enabled;
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title="Workflow Automations"
    description="Set up automated workflows triggered by transactions, stock levels, or schedules."
  />

  {#if !isConnected}
    <div class="space-y-6">
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 md:p-12 text-center"
      >
        <NoiseOverlay intensity="light" />
        <div class="relative z-10 max-w-2xl mx-auto space-y-6">
          <div
            class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mx-auto"
          >
            <Zap class="h-8 w-8" />
          </div>
          <h2
            class="font-heading text-3xl font-extrabold tracking-tight text-foreground"
          >
            Automate your business workflows
          </h2>
          <p class="text-muted-foreground text-lg">
            Save time and reduce manual work by setting up rules that trigger
            actions automatically. From low stock alerts to daily summaries, let
            Bizflow handle the routine tasks.
          </p>

          <div class="pt-6">
            <button
              type="button"
              onclick={getStarted}
              class="btn-app-primary text-lg px-8 py-3"
            >
              <Sparkles class="h-5 w-5" /> Get Started with Automations
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8"
      >
        <NoiseOverlay intensity="light" />
        <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-1 space-y-4">
            <div
              class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600"
            >
              <Zap class="h-6 w-6" />
            </div>
            <h2
              class="font-heading text-2xl font-extrabold tracking-tight text-foreground"
            >
              Automation Templates
            </h2>
            <p class="text-muted-foreground max-w-lg">
              Choose from our pre-built templates to quickly set up common
              workflows.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div
                class="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400"
              >
                <CheckCircle2 class="h-4 w-4" /> Ready to use
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        {#each templates as tpl, i}
          <div class="surface-panel p-6 flex flex-col">
            <div class="flex items-start justify-between mb-4">
              <div
                class={`rounded-xl p-3 bg-${tpl.color}-500/10 text-${tpl.color}-600 dark:text-${tpl.color}-400`}
              >
                <tpl.icon class="h-6 w-6" />
              </div>
              <button
                type="button"
                aria-label={`${tpl.enabled ? "Disable" : "Enable"} ${tpl.name}`}
                onclick={() => toggleTemplate(i)}
                class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tpl.enabled ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <span
                  class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tpl.enabled ? "translate-x-6" : "translate-x-1"}`}
                ></span>
              </button>
            </div>
            <h3 class="font-heading text-lg font-bold text-foreground">
              {tpl.name}
            </h3>
            <p class="mt-2 text-sm text-muted-foreground flex-1">
              {tpl.description}
            </p>

            <div
              class="mt-6 border-t border-border/60 pt-4 flex justify-between items-center"
            >
              <span
                class="text-xs font-medium text-muted-foreground flex items-center gap-1"
              >
                <Play class="h-3 w-3" /> Trigger based
              </span>
              {#if tpl.enabled}
                <button
                  type="button"
                  class="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  <Settings2 class="h-3 w-3" /> Configure
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="button"
          onclick={() => disconnectExtension("automations")}
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
        >
          <Power class="h-4 w-4" /> Disable Automations
        </button>
      </div>
    </div>
  {/if}
</AppShell>
