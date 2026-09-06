<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { Send } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "telegram"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Messaging"
    title={extension?.name || "Telegram"}
    description="Keep your team and customer updates flowing in a lighter, instant messaging layer."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Telegram"}
    description="This channel is being built to support quick team alerts, automation triggers, and service updates in a messaging flow that complements your main business inbox."
    icon={Send}
    accentClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
    stats={[
      { label: "Alerts", value: "Ready" },
      { label: "Updates", value: "Queued" },
      { label: "Team", value: "Live" },
    ]}
  />
</AppShell>
