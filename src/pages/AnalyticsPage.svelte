<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { BarChart3 } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "analytics"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Analytics"
    title={extension?.name || "Sales Analytics"}
    description="Track performance, cash flow, and service trends across the business in one place."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Sales Analytics"}
    description="This analytics workspace is being built to surface customer behavior, revenue trends, and daily operational health with clear visual summaries for your team."
    icon={BarChart3}
    accentClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
    stats={[
      { label: "Revenue", value: "Live" },
      { label: "Forecast", value: "Next 30d" },
      { label: "Segments", value: "Ready" },
    ]}
  />
</AppShell>
