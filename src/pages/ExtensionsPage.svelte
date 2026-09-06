<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import {
    extensions,
    toggleExtension,
    subscribeExtension,
    getDaysRemaining,
    type Extension,
  } from "$lib/stores/extensions";
  import {
    Puzzle,
    Search,
    Clock,
    CheckCircle2,
    AlertTriangle,
  } from "@lucide/svelte";
  import ExtensionPaymentSheet from "$lib/components/modals/ExtensionPaymentSheet.svelte";
  import { toast } from "svelte-sonner";

  let paymentModalOpen = $state(false);
  let selectedExtension = $state<Extension | null>(null);
  let searchQuery = $state("");
  let activeTab = $state<"browse" | "installed">("browse");

  async function handleExtensionClick(ext: Extension) {
    if (ext.status === "active") {
      try {
        await toggleExtension(ext.id);
      } catch (error) {
        toast.error("Extension update failed", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    } else if (ext.subscribed) {
      try {
        await toggleExtension(ext.id);
      } catch (error) {
        toast.error("Extension update failed", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    } else {
      selectedExtension = ext;
      paymentModalOpen = true;
    }
  }

  async function handlePaymentConfirm() {
    try {
      if (selectedExtension) {
        await subscribeExtension(selectedExtension.id);
      }
      paymentModalOpen = false;
    } catch (error) {
      toast.error("Extension subscription failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  // Search filter
  let filteredExtensions = $derived(
    $extensions.filter((e) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }),
  );

  // Browse tab: grouped by category
  let channelExtensions = $derived(
    filteredExtensions.filter((e) => e.category === "channels"),
  );
  let operationExtensions = $derived(
    filteredExtensions.filter((e) => e.category === "operations"),
  );
  let automationExtensions = $derived(
    filteredExtensions.filter((e) => e.category === "automation"),
  );
  let analyticsExtensions = $derived(
    filteredExtensions.filter((e) => e.category === "analytics"),
  );

  // Installed tab: subscribed or active
  let installedExtensions = $derived(
    filteredExtensions.filter((e) => e.subscribed || e.status === "active"),
  );

  let totalInstalled = $derived(
    $extensions.filter((e) => e.subscribed || e.status === "active").length,
  );

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
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "coming-soon":
        return "Coming Soon";
    }
  }

  function categoryColor(category: Extension["category"]) {
    switch (category) {
      case "channels":
        return "bg-primary/10 text-primary";
      case "operations":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "automation":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "analytics":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
    }
  }
</script>

<AppShell>
  <PageHeader
    eyebrow="Marketplace"
    title="Extensions"
    description="Activate modules and features to expand your business center's capabilities."
  />

  <!-- Search + Tabs -->
  <div
    class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
  >
    <div
      class="flex items-center gap-1 rounded-xl border border-border/60 bg-card p-1"
    >
      <button
        type="button"
        onclick={() => (activeTab = "browse")}
        class="rounded-lg px-4 py-2 text-sm font-semibold transition {activeTab ===
        'browse'
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        Browse All
      </button>
      <button
        type="button"
        onclick={() => (activeTab = "installed")}
        class="rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2 {activeTab ===
        'installed'
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        Installed
        {#if totalInstalled > 0}
          <span
            class="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] font-bold {activeTab ===
            'installed'
              ? 'text-primary-foreground'
              : 'text-foreground bg-muted'}">{totalInstalled}</span
          >
        {/if}
      </button>
    </div>

    <div class="relative w-full sm:w-72">
      <Search
        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        placeholder="Search extensions..."
        bind:value={searchQuery}
        class="w-full rounded-xl border border-border/60 bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  </div>

  {#if activeTab === "browse"}
    <!-- Browse View -->
    <div
      class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm"
    >
      <NoiseOverlay intensity="light" />
      <div class="relative z-10 space-y-10">
        {#snippet categorySection(title: string, items: Extension[])}
          {#if items.length > 0}
            <div>
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4"
              >
                {title}
              </p>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {#each items as ext}
                  <div
                    class="group rounded-2xl border border-border/60 bg-background p-5 transition hover:border-primary/20 hover:shadow-sm"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div
                        class="rounded-xl p-2.5 {categoryColor(ext.category)}"
                      >
                        <ext.icon class="h-5 w-5" />
                      </div>
                      <div class="flex flex-col items-end gap-1.5">
                        <span
                          class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {statusBadge(
                            ext.status,
                          )}"
                        >
                          {statusLabel(ext.status)}
                        </span>
                        {#if ext.subscribed && ext.status !== "active"}
                          <span
                            class="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase text-primary"
                          >
                            Owned
                          </span>
                        {/if}
                      </div>
                    </div>
                    <div class="flex items-center justify-between mb-1 gap-2">
                      <h4
                        class="font-heading text-base font-bold text-foreground"
                      >
                        {ext.name}
                      </h4>
                      {#if ext.price}
                        <span
                          class="shrink-0 text-xs font-bold {ext.price ===
                          'Free'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-primary'}">{ext.price}</span
                        >
                      {/if}
                    </div>
                    <p
                      class="text-xs text-muted-foreground leading-relaxed mb-4"
                    >
                      {ext.description}
                    </p>
                    {#if ext.status !== "coming-soon"}
                      <button
                        type="button"
                        onclick={() => handleExtensionClick(ext)}
                        class="text-xs font-semibold {ext.status === 'active'
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-primary hover:text-primary/80'} transition"
                      >
                        {ext.status === "active"
                          ? "Deactivate"
                          : ext.subscribed
                            ? "Activate"
                            : "Subscribe & Activate"}
                      </button>
                    {:else}
                      <span class="text-xs text-muted-foreground italic"
                        >Available soon</span
                      >
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/snippet}

        {@render categorySection("Channels", channelExtensions)}
        {@render categorySection("Operations", operationExtensions)}
        {@render categorySection("Automation", automationExtensions)}
        {@render categorySection("Analytics", analyticsExtensions)}

        {#if filteredExtensions.length === 0}
          <div class="text-center py-16">
            <Puzzle class="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p class="text-sm font-medium text-muted-foreground">
              No extensions match "{searchQuery}"
            </p>
            <p class="text-xs text-muted-foreground/60 mt-1">
              Try a different search term
            </p>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- Installed View -->
    {#if installedExtensions.length === 0}
      <div
        class="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-sm"
      >
        <NoiseOverlay intensity="light" />
        <div class="relative z-10 text-center py-16">
          <Puzzle class="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p class="text-sm font-medium text-muted-foreground">
            {searchQuery
              ? `No installed extensions match "${searchQuery}"`
              : "You haven't installed any extensions yet"}
          </p>
          <p class="text-xs text-muted-foreground/60 mt-1">
            Browse the marketplace to get started
          </p>
          <button
            type="button"
            onclick={() => {
              activeTab = "browse";
              searchQuery = "";
            }}
            class="mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition"
          >
            Browse Extensions →
          </button>
        </div>
      </div>
    {:else}
      <div class="space-y-3">
        {#each installedExtensions as ext}
          {@const daysLeft = getDaysRemaining(ext.expiresAt)}
          <div
            class="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 sm:p-6 transition hover:border-primary/10 hover:shadow-sm"
          >
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Icon + Info -->
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="rounded-xl p-3 shrink-0 {categoryColor(ext.category)}"
                >
                  <ext.icon class="h-6 w-6" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4
                      class="font-heading text-base font-bold text-foreground"
                    >
                      {ext.name}
                    </h4>
                    <span
                      class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {statusBadge(
                        ext.status,
                      )}"
                    >
                      {statusLabel(ext.status)}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5 truncate">
                    {ext.description}
                  </p>
                </div>
              </div>

              <!-- Subscription info + Actions -->
              <div class="flex items-center gap-4 sm:gap-6 shrink-0">
                <!-- Expiry / Plan info -->
                <div class="text-right">
                  {#if ext.price === "Free"}
                    <div
                      class="flex items-center gap-1.5 text-green-600 dark:text-green-400"
                    >
                      <CheckCircle2 class="h-3.5 w-3.5" />
                      <span class="text-xs font-semibold">Free forever</span>
                    </div>
                  {:else if daysLeft !== null}
                    <div
                      class="flex items-center gap-1.5 {daysLeft <= 7
                        ? 'text-red-500'
                        : daysLeft <= 14
                          ? 'text-amber-500'
                          : 'text-muted-foreground'}"
                    >
                      {#if daysLeft <= 7}
                        <AlertTriangle class="h-3.5 w-3.5" />
                      {:else}
                        <Clock class="h-3.5 w-3.5" />
                      {/if}
                      <span class="text-xs font-semibold">
                        {daysLeft === 0
                          ? "Expired"
                          : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                      </span>
                    </div>
                    <p class="text-[10px] text-muted-foreground mt-0.5">
                      {ext.price}
                    </p>
                  {:else}
                    <p class="text-xs font-semibold text-muted-foreground">
                      {ext.price}
                    </p>
                  {/if}
                </div>

                <!-- Toggle button -->
                <button
                  type="button"
                  onclick={() => handleExtensionClick(ext)}
                  class="rounded-xl border px-4 py-2 text-xs font-semibold transition {ext.status ===
                  'active'
                    ? 'border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10'
                    : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'}"
                >
                  {ext.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</AppShell>

<ExtensionPaymentSheet
  open={paymentModalOpen}
  extension={selectedExtension}
  onOpenChange={(isOpen) => (paymentModalOpen = isOpen)}
  onConfirm={handlePaymentConfirm}
/>
