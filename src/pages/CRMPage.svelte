<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { UsersRound } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "crm"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Customer hub"
    title={extension?.name || "CRM"}
    description="Keep customer conversations, follow-ups, and sales history in one organized workspace."
  />

  <ExtensionBoilerplate
    title={extension?.name || "CRM"}
    description="This customer relationship center is being prepared to track leads, customer notes, follow-ups, and high-value service interactions without losing context."
    icon={UsersRound}
    accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    stats={[
      { label: "Leads", value: "Tracked" },
      { label: "Follow ups", value: "Queued" },
      { label: "Retention", value: "Visible" },
    ]}
  />
</AppShell>
