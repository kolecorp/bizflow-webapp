<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { TrendingUp } from "@lucide/svelte";
</script>

<AppShell>
  <PageHeader
    eyebrow="Insights"
    title="Customer Insights"
    description="Understand what is happening across your operations and customer journeys at a glance."
  />

  <ExtensionBoilerplate
    title="Customer Insights"
    description="This insight layer is being designed to reveal shopping patterns, service performance, conversion opportunities, and operational bottlenecks without burying the signal in raw data."
    icon={TrendingUp}
    accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
    stats={[
      { label: "Signals", value: "Live" },
      { label: "Patterns", value: "Tracked" },
      { label: "Focus", value: "Actionable" },
    ]}
  />
</AppShell>
