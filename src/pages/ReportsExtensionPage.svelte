<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { CalendarClock } from "@lucide/svelte";

  let extension = $derived(
    $extensions.find((e) => e.id === "scheduled-reports"),
  );
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title={extension?.name || "Scheduled Reports"}
    description="Send recurring sales, stock, and activity reports to the right people without manual export work."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Scheduled Reports"}
    description="This reporting workspace is being prepared for recurring summaries, custom report windows, and automatic delivery to email or WhatsApp channels."
    icon={CalendarClock}
    accentClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    stats={[
      { label: "Delivery", value: "Queued" },
      { label: "Reports", value: "4" },
      { label: "Sync", value: "Live" },
    ]}
  />
</AppShell>
