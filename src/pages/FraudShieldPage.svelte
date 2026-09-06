<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { ShieldCheck } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "FRAUD_SHIELD"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title={extension?.name || "Fraud Shield"}
    description="Monitor suspicious activity, identify risky patterns, and alert your team before losses grow."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Fraud Shield"}
    description="This fraud monitoring workspace is being prepared for anomaly detection, risk scoring, and activity alerts across transactions and wallet movements."
    icon={ShieldCheck}
    accentClass="bg-rose-500/10 text-rose-600 dark:text-rose-400"
    stats={[
      { label: "Alerts", value: "Queued" },
      { label: "Watchlist", value: "Live" },
      { label: "Risk", value: "Monitored" },
    ]}
  />
</AppShell>
