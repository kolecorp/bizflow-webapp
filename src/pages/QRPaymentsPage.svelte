<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { QrCode } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "qr-payments"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title={extension?.name || "QR Code Payments"}
    description="Accept instant payments with branded QR codes, POS-ready flows, and better reconciliation across every order."
  />

  <ExtensionBoilerplate
    title={extension?.name || "QR Code Payments"}
    description="This QR payments workspace is being prepared for secure payment links, receipt generation, and quick customer checkout journeys tied to your Bizflow transactions."
    icon={QrCode}
    accentClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
    stats={[
      { label: "Links", value: "Ready" },
      { label: "Receipts", value: "Live" },
      { label: "Sync", value: "Queued" },
    ]}
  />
</AppShell>
