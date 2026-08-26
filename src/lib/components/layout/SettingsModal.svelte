<script lang="ts">
  import { modals } from "$lib/stores/modals";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    Bell,
    Building2,
    LockKeyhole,
    Palette,
    UserRound,
    Check,
    Moon,
    SunMedium,
    Monitor,
  } from "@lucide/svelte";
  import { mode } from "mode-watcher";

  let open = $derived($modals.settings);
  let activeSection = $derived($modals.settingsSection);
  let density = $state("Comfortable");
  let businessName = $state("Cafe Bloom");
  function handleOpenChange(value: boolean) {
    if (!value) modals.closeSettings();
  }
</script>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Content class="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
    <Dialog.Header
      ><Dialog.Title>Workspace settings</Dialog.Title><Dialog.Description
        >Manage your business, account, alerts, and appearance.</Dialog.Description
      ></Dialog.Header
    >
    <div class="grid gap-7 md:grid-cols-[200px_minmax(0,1fr)]">
      <nav
        class="flex gap-1 overflow-x-auto md:flex-col"
        aria-label="Settings sections"
      >
        {#each [{ icon: Building2, title: "Profile", key: "profile" }, { icon: UserRound, title: "Team & roles", key: "team" }, { icon: Bell, title: "Notifications", key: "notifications" }, { icon: Palette, title: "Appearance", key: "appearance" }, { icon: LockKeyhole, title: "Security", key: "security" }] as setting}
          <button
            type="button"
            onclick={() => modals.openSettings(setting.key)}
            class={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${activeSection === setting.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            ><svelte:component
              this={setting.icon}
              class="h-4 w-4"
            />{setting.title}</button
          >
        {/each}
      </nav>
      <section
        class="min-h-72 min-w-0 rounded-xl border border-border/60 bg-muted/15 p-6"
      >
        {#if activeSection === "profile"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Business profile
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            The identity your team sees across Bizflow.
          </p>
          <label class="mt-5 block text-sm font-medium text-foreground"
            >Business name<input
              bind:value={businessName}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            /></label
          >
          <div
            class="mt-4 flex items-center justify-between rounded-lg border border-border/60 bg-background p-3"
          >
            <span
              ><span class="block text-sm font-medium text-foreground"
                >Business logo</span
              ><span class="block text-xs text-muted-foreground"
                >Cafe Bloom logo</span
              ></span
            ><button type="button" class="text-xs font-semibold text-primary"
              >Change</button
            >
          </div>
        {:else if activeSection === "appearance"}
          <h3 class="font-heading text-base font-bold text-foreground">
            Appearance
          </h3>
          <p class="mt-1 text-xs text-muted-foreground">
            Make the workspace comfortable for your team.
          </p>
          <div class="mt-5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onclick={() => mode.set("light")}
              class={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs ${mode.current === "light" ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"}`}
              ><SunMedium class="h-4 w-4" />Light</button
            ><button
              type="button"
              onclick={() => mode.set("dark")}
              class={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs ${mode.current === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground"}`}
              ><Moon class="h-4 w-4" />Dark</button
            ><button
              type="button"
              onclick={() => mode.set("system")}
              class="flex flex-col items-center gap-2 rounded-lg border border-border/60 p-3 text-xs text-muted-foreground"
              ><Monitor class="h-4 w-4" />System</button
            >
          </div>
          <label class="mt-5 block text-sm font-medium text-foreground"
            >Content density<select
              bind:value={density}
              class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              ><option>Comfortable</option><option>Compact</option></select
            ></label
          >
        {:else}
          <h3 class="font-heading text-base font-bold text-foreground">
            {activeSection === "team"
              ? "Team & roles"
              : activeSection === "notifications"
                ? "Notifications"
                : "Security"}
          </h3>
          <p class="mt-2 text-sm text-muted-foreground">
            This section is ready for configuration. Your current workspace
            settings remain active.
          </p>
          <div
            class="mt-5 flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground"
          >
            <Check class="h-4 w-4 text-primary" /> No changes are required here.
          </div>
        {/if}
      </section>
    </div>
  </Dialog.Content>
</Dialog.Root>
