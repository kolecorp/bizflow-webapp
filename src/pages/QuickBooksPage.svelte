<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { WalletCards } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "quickbooks"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Accounting"
    title={extension?.name || "QuickBooks"}
    description="Bring bookkeeping, invoices, and cash movement into a clearer financial view."
  />

  <ExtensionBoilerplate
    title={extension?.name || "QuickBooks"}
    description="This accounting bridge is being shaped to keep your records aligned with Bizflow transactions, payments, and daily reporting without manual reconciliation work."
    icon={WalletCards}
    accentClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
    stats={[
      { label: "Entries", value: "Synced" },
      { label: "Reconciles", value: "Weekly" },
      { label: "Books", value: "Ready" },
    ]}
  />
</AppShell>
