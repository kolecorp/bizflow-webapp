<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { Sparkles } from "@lucide/svelte";
</script>

<AppShell>
  <PageHeader
    eyebrow="Extension"
    title="AI Studio"
    description="Turn repetitive operational work into guided, AI-assisted actions for your team."
  />

  <ExtensionBoilerplate
    title="AI Studio"
    description="This workspace is being prepared for AI-driven task triage, smart summaries, and suggested next steps across sales, operations, and support workflows."
    icon={Sparkles}
    accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
    stats={[
      { label: "Automation", value: "3 flows" },
      { label: "Tasks", value: "Queued" },
      { label: "Action", value: "Ready" },
    ]}
  />
</AppShell>
