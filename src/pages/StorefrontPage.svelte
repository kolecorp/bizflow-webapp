<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { Globe } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "web-storefront"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title={extension?.name || "Web Storefront"}
    description="Sell products online with a storefront that stays connected to inventory, pricing, and fulfilment in Bizflow."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Web Storefront"}
    description="This storefront workspace is being prepared for product catalog publishing, checkout flows, and real-time inventory sync for online sales."
    icon={Globe}
    stats={[
      { label: "Catalog", value: "Live" },
      { label: "Orders", value: "Queued" },
      { label: "Sync", value: "Ready" },
    ]}
  />
</AppShell>
