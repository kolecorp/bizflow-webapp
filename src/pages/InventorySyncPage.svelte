<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { PackageCheck } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "INVENTORY_PRO"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Inventory"
    title={extension?.name || "Inventory Sync"}
    description="Keep stock, pricing, and warehouse movements aligned across your business tools."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Inventory Sync"}
    description="This sync layer will connect Bizflow inventory to live stock updates, supplier activity, and item movement tracking so your warehouse stays current."
    icon={PackageCheck}
    accentClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    stats={[
      { label: "Levels", value: "Synced" },
      { label: "Alerts", value: "Live" },
      { label: "Stock", value: "Ready" },
    ]}
  />
</AppShell>
