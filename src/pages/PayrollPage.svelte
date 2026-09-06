<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import ExtensionBoilerplate from "$lib/components/layout/ExtensionBoilerplate.svelte";
  import { extensions } from "$lib/stores/extensions";
  import { Wallet } from "@lucide/svelte";

  let extension = $derived($extensions.find((e) => e.id === "payroll"));
</script>

<AppShell>
  <PageHeader
    eyebrow="Payroll"
    title={extension?.name || "Payroll"}
    description="Simplify pay cycles, staff records, and financial planning in one streamlined flow."
  />

  <ExtensionBoilerplate
    title={extension?.name || "Payroll"}
    description="This payroll module is being designed to help you track staff payments, hours, and monthly summaries while keeping sensitive financial details organized and auditable."
    icon={Wallet}
    accentClass="bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400"
    stats={[
      { label: "Staff", value: "Ready" },
      { label: "Payouts", value: "Planned" },
      { label: "Summary", value: "Live" },
    ]}
  />
</AppShell>
