<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import {
    Settings,
    Building2,
    Users,
    Bell,
    ShieldCheck,
    Palette,
  } from "@lucide/svelte";
  import { modals } from "$lib/stores/modals";

  const sections = [
    {
      icon: Building2,
      title: "Business profile",
      detail: "Business name, logo, address, and operating hours",
    },
    {
      icon: Users,
      title: "Team & permissions",
      detail: "Invite staff and control workspace access",
    },
    {
      icon: Bell,
      title: "Notifications",
      detail: "Choose which alerts reach your team",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      detail: "Password, sessions, and authentication",
    },
    {
      icon: Palette,
      title: "Appearance",
      detail: "Theme, density, and display preferences",
    },
  ];
</script>

<AppShell>
  <PageHeader
    eyebrow="System"
    title="Settings"
    description="Shape how your Bizflow workspace works for your business and team."
  />
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    <section class="surface-panel p-6">
      <div class="flex items-center gap-3 border-b border-border/60 pb-5">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
          ><Settings class="h-5 w-5" /></span
        >
        <div>
          <h2 class="font-heading text-lg font-bold text-foreground">
            Workspace controls
          </h2>
          <p class="text-sm text-muted-foreground">
            Select a category to manage its preferences.
          </p>
        </div>
      </div>
      <div class="mt-5 grid gap-2 sm:grid-cols-2">
        {#each sections as section, index}
          <button
            type="button"
            onclick={() =>
              modals.openSettings(
                ["profile", "team", "notifications", "security", "appearance"][
                  index
                ],
              )}
            class="flex items-start gap-3 rounded-xl border border-border/60 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
            ><span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary"
              ><svelte:component this={section.icon} class="h-4 w-4" /></span
            ><span
              ><span class="block text-sm font-semibold text-foreground"
                >{section.title}</span
              ><span
                class="mt-1 block text-xs leading-relaxed text-muted-foreground"
                >{section.detail}</span
              ></span
            ></button
          >
        {/each}
      </div>
    </section>
    <aside class="surface-panel h-fit p-6">
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Workspace status
      </p>
      <p class="mt-3 font-heading text-2xl font-bold text-foreground">
        All systems ready
      </p>
      <div class="mt-5 space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Business account</span><span
            class="font-medium text-green-600">Active</span
          >
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Data sync</span><span
            class="font-medium text-green-600">Up to date</span
          >
        </div>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Last backup</span><span
            class="font-medium text-foreground">Today, 06:00</span
          >
        </div>
      </div>
      <button
        type="button"
        onclick={() => modals.openSettings()}
        class="btn-app-primary mt-6 w-full text-sm">Open settings panel</button
      >
    </aside>
  </div>
</AppShell>
