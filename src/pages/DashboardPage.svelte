<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import GlowStatCard from "$lib/components/ui/GlowStatCard.svelte";
  import { Button } from "$lib/components/ui/button";
  import {
    todayRevenue,
    todayTransactions,
    lowStockItems,
  } from "$lib/stores/businessData";
  import { modals } from "$lib/stores/modals";
  import { authStore } from "$lib/stores/auth";
  import { initializeTeam, teamMembers } from "$lib/stores/team";
  import {
    notificationItems,
    notificationUnreadCount,
    markRead,
  } from "$lib/stores/notifications";
  import {
    Plus,
    ShoppingBag,
    TrendingUp,
    Package,
    AlertTriangle,
    Bell,
    Calendar,
    UsersRound,
  } from "@lucide/svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  let teamLoading = $state(true);

  let canManageTeam = $derived(
    $authStore.user?.role === "OWNER" || $authStore.user?.role === "ADMIN",
  );

  onMount(async () => {
    try {
      await initializeTeam($authStore.user);
    } finally {
      teamLoading = false;
    }
  });

</script>

<AppShell>
  <PageHeader
    eyebrow="Overview"
    title="Dashboard"
    description="A focused view of today’s revenue, activity, and priorities."
  >
    <svelte:fragment slot="actions">
      <Button type="button" onclick={() => modals.openNewTransaction()}>
        <Plus class="h-4 w-4" />
        New transaction
      </Button>
      <Button
        variant="outline"
        type="button"
        onclick={() => modals.openDailySales()}
      >
        Daily sales
      </Button>
    </svelte:fragment>
  </PageHeader>

  <div
    class="dashboard-signal surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex items-start gap-3">
      <div class="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
        <Calendar class="h-4 w-4" />
      </div>
      <div>
        <p class="text-sm font-semibold text-foreground">
          Today’s operating picture
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {$todayTransactions.length} transactions logged and ₦{$todayRevenue.toLocaleString()}
          recorded so far.
        </p>
      </div>
    </div>
    <div
      class="flex items-center gap-2 text-xs font-medium text-muted-foreground"
    >
      <span class="h-2 w-2 rounded-full bg-primary"></span>
      Workspace is up to date
    </div>
  </div>

  <!-- Core Stats — Generic for ALL businesses -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <GlowStatCard
      label="Revenue today"
      value="₦{$todayRevenue.toLocaleString()}"
      subtext="{$todayTransactions.length} transactions"
      icon={TrendingUp}
      variant="emerald"
    />

    <GlowStatCard
      label="Transactions"
      value={$todayTransactions.length}
      subtext="Logged today"
      icon={ShoppingBag}
      variant="blue"
    />

    <GlowStatCard
      label="Low stock alerts"
      value={$lowStockItems.length}
      subtext="Items need restocking"
      icon={Package}
      variant="amber"
    />

    <GlowStatCard
      label="Unread notifications"
      value={$notificationUnreadCount}
      subtext="Pending review"
      icon={Bell}
      variant="violet"
    />
  </div>

  {#if canManageTeam}
    <section
      class="surface-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <div class="rounded-lg bg-primary/10 p-2 text-primary">
          <UsersRound class="h-5 w-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">Team access</p>
          {#if teamLoading}
            <Skeleton class="mt-2 h-4 w-72" />
          {:else}
            <p class="mt-1 text-xs text-muted-foreground">
              {$teamMembers.length}
              {$teamMembers.length === 1 ? "person has" : "people have"} access to
              this workspace. Review roles, invite staff, or remove access.
            </p>
          {/if}
        </div>
      </div>
      <Button type="button" variant="outline" onclick={() => goto("/team")}>
        Manage team<UsersRound class="h-4 w-4" />
      </Button>
    </section>
  {/if}

  <!-- Two-column: Recent Transactions + Notifications -->
  <div
    class="dashboard-grid grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
  >
    <!-- Recent transactions -->
    <div class="surface-panel p-6 sm:p-7">
      <div class="mb-5 flex items-center justify-between">
        <h3
          class="flex items-center gap-2 text-lg font-semibold text-foreground"
        >
          <ShoppingBag class="h-5 w-5" />
          Recent transactions
        </h3>
        <button
          type="button"
          on:click={() => goto("/transactions")}
          class="rounded-md px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          View all
        </button>
      </div>
      <div class="space-y-3">
        {#each $todayTransactions.slice(0, 5) as tx}
          <div class="surface-row flex items-center justify-between px-4 py-3">
            <div>
              <p class="text-sm font-medium text-foreground">{tx.service}</p>
              <p class="text-xs text-muted-foreground">
                {tx.customer} · {tx.time}
              </p>
            </div>
            <p class="text-sm font-bold text-foreground">
              ₦{tx.amount.toLocaleString()}
            </p>
          </div>
        {/each}
        {#if $todayTransactions.length === 0}
          <div
            class="flex flex-col items-center justify-center py-10 text-center"
          >
            <div class="mb-4 rounded-full bg-primary/10 p-3 text-primary">
              <ShoppingBag class="h-6 w-6" />
            </div>
            <h4 class="text-sm font-semibold text-foreground">
              No transactions yet
            </h4>
            <p class="mt-1 max-w-50 text-xs text-muted-foreground">
              Record your first sale to start tracking daily revenue.
            </p>
            <button
              type="button"
              on:click={() => modals.openNewTransaction()}
              class="mt-4 rounded-md px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              + New transaction
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Notifications + Alerts combined -->
    <div class="space-y-6">
      <div class="surface-panel p-6 sm:p-7">
        <div class="mb-5 flex items-center justify-between">
          <h3
            class="flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <Bell class="h-5 w-5 text-primary" />
            Notifications
          </h3>
          <span class="text-xs text-muted-foreground">
            {$notificationUnreadCount} unread
          </span>
        </div>
        <div class="space-y-2">
          {#each $notificationItems.slice(0, 3) as notif}
            <button
              type="button"
              on:click={() => {
                markRead(notif.id);
                if (notif.href) goto(notif.href);
              }}
              class={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition hover:-translate-y-px hover:bg-muted/50 ${
                notif.read ? "border-border" : "border-primary/20 bg-primary/5"
              }`}
            >
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-foreground">{notif.title}</p>
                <p class="text-xs text-muted-foreground line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </button>
          {/each}
          {#if $notificationItems.length === 0}
            <div
              class="flex flex-col items-center justify-center py-6 text-center"
            >
              <Bell class="h-6 w-6 text-muted-foreground/30 mb-2" />
              <p class="text-xs text-muted-foreground">You're all caught up.</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Alerts -->
      {#if $lowStockItems.length > 0}
        <div class="surface-panel p-6 sm:p-7">
          <h3
            class="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
          >
            <AlertTriangle class="h-5 w-5 text-amber-500" />
            Alerts
          </h3>
          <div class="space-y-3">
            {#each $lowStockItems.slice(0, 3) as item}
              <div
                class="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3"
              >
                <Package class="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-foreground">
                    Low stock: {item.name}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {item.quantity}
                    {item.unit} remaining (min {item.minQuantity})
                  </p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</AppShell>
