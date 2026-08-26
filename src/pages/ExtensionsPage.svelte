<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { extensions, toggleExtension, type Extension } from "$lib/stores/extensions";
  import { Puzzle } from "@lucide/svelte";

  let channelExtensions = $derived($extensions.filter(e => e.category === "channels"));
  let operationExtensions = $derived($extensions.filter(e => e.category === "operations"));
  let automationExtensions = $derived($extensions.filter(e => e.category === "automation"));

  function statusBadge(status: Extension["status"]) {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "coming-soon":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
  }

  function statusLabel(status: Extension["status"]) {
    switch (status) {
      case "active": return "Active";
      case "inactive": return "Inactive";
      case "coming-soon": return "Coming Soon";
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Marketplace"
    title="Extensions"
    description="Activate modules and features to expand your business center's capabilities."
  />

  <div class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
    <NoiseOverlay intensity="light" />
    <div class="relative z-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Puzzle class="h-6 w-6 text-primary" />
            Modules
          </h2>
          <p class="mt-1 text-sm text-muted-foreground max-w-2xl">
            Activate the modules your business needs. Extension pages are loaded from the server once enabled.
            Each extension adds its own navigation entry and configuration panel.
          </p>
        </div>
      </div>

      <!-- Channels -->
      <div class="mb-8">
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Channels
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each channelExtensions as ext}
            <div class="rounded-2xl border border-border/60 bg-background p-5 transition hover:border-primary/20 hover:shadow-sm">
              <div class="flex items-start justify-between mb-3">
                <div class="rounded-xl bg-primary/10 p-2.5">
                  <ext.icon class="h-5 w-5 text-primary" />
                </div>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {statusBadge(ext.status)}">
                  {statusLabel(ext.status)}
                </span>
              </div>
              <h4 class="font-heading text-base font-bold text-foreground mb-1">{ext.name}</h4>
              <p class="text-xs text-muted-foreground leading-relaxed mb-4">{ext.description}</p>
              {#if ext.status !== "coming-soon"}
                <button
                  type="button"
                  on:click={() => toggleExtension(ext.id)}
                  class="text-xs font-semibold {ext.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-primary hover:text-primary/80'} transition"
                >
                  {ext.status === "active" ? "Deactivate" : "Activate"}
                </button>
              {:else}
                <span class="text-xs text-muted-foreground italic">Available soon</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Operations -->
      <div class="mb-8">
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Operations
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each operationExtensions as ext}
            <div class="rounded-2xl border border-border/60 bg-background p-5 transition hover:border-primary/20 hover:shadow-sm">
              <div class="flex items-start justify-between mb-3">
                <div class="rounded-xl bg-blue-500/10 p-2.5">
                  <ext.icon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {statusBadge(ext.status)}">
                  {statusLabel(ext.status)}
                </span>
              </div>
              <h4 class="font-heading text-base font-bold text-foreground mb-1">{ext.name}</h4>
              <p class="text-xs text-muted-foreground leading-relaxed mb-4">{ext.description}</p>
              {#if ext.status !== "coming-soon"}
                <button
                  type="button"
                  on:click={() => toggleExtension(ext.id)}
                  class="text-xs font-semibold {ext.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-primary hover:text-primary/80'} transition"
                >
                  {ext.status === "active" ? "Deactivate" : "Activate"}
                </button>
              {:else}
                <span class="text-xs text-muted-foreground italic">Available soon</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Automation -->
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Automation
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each automationExtensions as ext}
            <div class="rounded-2xl border border-border/60 bg-background p-5 transition hover:border-primary/20 hover:shadow-sm">
              <div class="flex items-start justify-between mb-3">
                <div class="rounded-xl bg-amber-500/10 p-2.5">
                  <ext.icon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {statusBadge(ext.status)}">
                  {statusLabel(ext.status)}
                </span>
              </div>
              <h4 class="font-heading text-base font-bold text-foreground mb-1">{ext.name}</h4>
              <p class="text-xs text-muted-foreground leading-relaxed mb-4">{ext.description}</p>
              {#if ext.status !== "coming-soon"}
                <button
                  type="button"
                  on:click={() => toggleExtension(ext.id)}
                  class="text-xs font-semibold {ext.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-primary hover:text-primary/80'} transition"
                >
                  {ext.status === "active" ? "Deactivate" : "Activate"}
                </button>
              {:else}
                <span class="text-xs text-muted-foreground italic">Available soon</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</AppShell>
