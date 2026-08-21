<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import GlowStatCard from "$lib/components/ui/GlowStatCard.svelte";
  import NoiseOverlay from "$lib/components/landing/NoiseOverlay.svelte";
  import { canAccess, resolveRoleKey } from "$lib/stores/permissions";
  import { authStore } from "$lib/stores/auth";
  import {
    transactions,
    todayRevenue,
    addTransaction,
    deleteTransaction,
    services as servicesStore,
  } from "$lib/stores/businessData";
  import { modals } from "$lib/stores/modals";
  import {
    Plus,
    Trash2,
    TrendingUp,
    ShoppingBag,
    Search,
    Filter,
    BarChart3,
    ArrowUpDown,
    Calendar,
    X,
    User,
    Scale,
    ChevronDown,
    ChevronUp,
    Receipt,
  } from "@lucide/svelte";

  const today = new Date().toISOString().split("T")[0];

  let formData = {
    service: "",
    customer: "",
    amount: "",
    description: "",
    date: today,
  };

  let searchQuery = "";
  let filterService = "";
  let filterDateFrom = "";
  let filterDateTo = "";
  let sortField: "date" | "amount" | "customer" | "service" = "date";
  let sortDir: "asc" | "desc" = "desc";
  let showFilters = false;
  let showAnalytics = false;
  let showRegisterSummary = true;

  $: userRole = $authStore.user?.role ?? "staff";
  $: userId = $authStore.user?.id ?? "";
  $: userName = $authStore.user?.name ?? "Staff";
  $: isManager = resolveRoleKey(userRole) === "manager";
  $: canCreate = canAccess(userRole, "transactions.create");
  $: canDelete = canAccess(userRole, "transactions.delete");
  $: canViewAudit = canAccess(userRole, "reports.view");
  $: todayTx = $transactions.filter((t) => t.date === today);
  $: myTodayTx = todayTx.filter(
    (t) => t.recordedById === userId || t.recordedBy === userName,
  );
  $: myTodayTotal = myTodayTx.reduce((s, t) => s + t.amount, 0);

  $: staffBreakdown = (() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const tx of todayTx) {
      const key = tx.recordedBy;
      const cur = map.get(key) ?? { count: 0, total: 0 };
      map.set(key, { count: cur.count + 1, total: cur.total + tx.amount });
    }
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  })();

  $: filteredTransactions = (() => {
    let result = [...$transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.customer.toLowerCase().includes(q) ||
          t.service.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.recordedBy.toLowerCase().includes(q) ||
          t.amount.toString().includes(q),
      );
    }

    if (filterService) result = result.filter((t) => t.service === filterService);
    if (filterDateFrom) result = result.filter((t) => t.date >= filterDateFrom);
    if (filterDateTo) result = result.filter((t) => t.date <= filterDateTo);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "customer") cmp = a.customer.localeCompare(b.customer);
      else if (sortField === "service") cmp = a.service.localeCompare(b.service);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  })();

  $: serviceBreakdown = (() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const tx of filteredTransactions) {
      const cur = map.get(tx.service) ?? { count: 0, total: 0 };
      map.set(tx.service, { count: cur.count + 1, total: cur.total + tx.amount });
    }
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  })();

  $: filteredRevenue = filteredTransactions.reduce((s, t) => s + t.amount, 0);
  $: maxBreakdown = serviceBreakdown.length > 0 ? serviceBreakdown[0][1].total : 1;
  $: avgTransaction =
    filteredTransactions.length > 0
      ? Math.round(filteredRevenue / filteredTransactions.length)
      : 0;

  $: uniqueServices = [...new Set($transactions.map((t) => t.service))].sort();
  $: activeFilterCount = [filterService, filterDateFrom, filterDateTo].filter(Boolean).length;

  $: hourlyBuckets = (() => {
    const buckets = new Array(12).fill(0);
    for (const tx of filteredTransactions.filter((t) => t.date === today)) {
      const hour = parseInt(tx.time.split(":")[0], 10);
      const isPM = tx.time.includes("PM");
      const h24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
      const idx = Math.min(11, Math.max(0, Math.floor((h24 - 8) / 1)));
      if (h24 >= 8 && h24 <= 19) buckets[idx] += tx.amount;
    }
    return buckets;
  })();

  $: maxHourly = Math.max(...hourlyBuckets, 1);

  function handleSubmit() {
    if (!canCreate) return;
    if (!formData.service || !formData.customer || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const svc = $servicesStore.find((s) => s.id === formData.service);
    addTransaction({
      service: svc?.name ?? formData.service,
      customer: formData.customer,
      amount: parseInt(formData.amount, 10),
      date: formData.date,
      description: formData.description,
      recordedBy: userName,
      recordedById: userId,
    });

    formData = {
      service: "",
      customer: "",
      amount: "",
      description: "",
      date: today,
    };
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) sortDir = sortDir === "asc" ? "desc" : "asc";
    else {
      sortField = field;
      sortDir = "desc";
    }
  }

  function clearFilters() {
    filterService = "";
    filterDateFrom = "";
    filterDateTo = "";
    searchQuery = "";
  }

  function formatDate(d: string) {
    return new Date(d + "T12:00:00").toLocaleDateString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
</script>

<AppShell>
  <div class="space-y-6">
    <!-- Register summary — sticky, foldable -->
    <div class="surface-panel sticky top-[50px] z-10 overflow-hidden">
      <button
        type="button"
        on:click={() => (showRegisterSummary = !showRegisterSummary)}
        class="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/20 sm:p-6"
        aria-expanded={showRegisterSummary}
      >
        <div class="flex min-w-0 items-center gap-4">
          <div class="shrink-0 rounded-xl border border-border/60 bg-muted/40 p-3">
            <Scale class="h-6 w-6 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              Point of sale · Daily register
            </p>
            <h2 class="mt-1 font-heading text-lg font-black tracking-[-0.05em] text-foreground sm:text-xl">
              Balance account — {formatDate(today)}
            </h2>
            {#if !showRegisterSummary}
              <p class="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ₦{$todayRevenue.toLocaleString()}
                <span class="font-normal text-muted-foreground">· {todayTx.length} tx · your shift ₦{myTodayTotal.toLocaleString()}</span>
              </p>
            {/if}
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-3">
          {#if !showRegisterSummary}
            <span class="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:inline">
              ₦{$todayRevenue.toLocaleString()}
            </span>
          {/if}
          {#if showRegisterSummary}
            <ChevronUp class="h-5 w-5 text-muted-foreground" />
          {:else}
            <ChevronDown class="h-5 w-5 text-muted-foreground" />
          {/if}
        </div>
      </button>

      {#if showRegisterSummary}
        <div class="border-t border-border/50 px-5 pb-5 sm:px-6 sm:pb-6">
          <div class="grid gap-6 pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <p class="max-w-xl text-sm text-muted-foreground">
              Record sales here all day. Use the register total when closing the till.
            </p>

            <div class="grid shrink-0 gap-3 sm:grid-cols-2 sm:gap-4">
              <div class="rounded-xl border border-border/60 bg-muted/20 px-5 py-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Register total
                </p>
                <p class="mt-1 font-heading text-2xl font-black tracking-[-0.06em] text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                  ₦{$todayRevenue.toLocaleString()}
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {todayTx.length} transaction{todayTx.length === 1 ? "" : "s"}
                </p>
              </div>
              <div class="rounded-xl border border-border/60 bg-muted/20 px-5 py-4">
                <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Your shift
                </p>
                <p class="mt-1 text-2xl font-bold text-foreground">₦{myTodayTotal.toLocaleString()}</p>
                <p class="mt-1 text-xs text-muted-foreground">{myTodayTx.length} recorded by {userName}</p>
              </div>
            </div>
          </div>

          {#if isManager && staffBreakdown.length > 1}
            <div class="mt-5 flex flex-wrap gap-2 border-t border-border/50 pt-5">
              {#each staffBreakdown as [name, data]}
                <span class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs">
                  <User class="h-3 w-3 text-muted-foreground" />
                  <span class="font-medium text-foreground">{name}</span>
                  <span class="text-muted-foreground">· {data.count} tx · ₦{data.total.toLocaleString()}</span>
                </span>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- POS workspace -->
    <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
      {#if canCreate}
        <div class="surface-panel p-5 sm:p-6">
          <h3 class="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
            <Plus class="h-5 w-5 text-primary" />
            New sale
          </h3>
          <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div class="space-y-2">
              <label for="pos-service" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Service *
              </label>
              <select
                id="pos-service"
                bind:value={formData.service}
                class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              >
                <option value="">Select service</option>
                {#each $servicesStore.filter((s) => s.active) as s}
                  <option value={s.id}>{s.name} — ₦{s.price}/{s.unit}</option>
                {/each}
              </select>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="pos-customer" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer *
                </label>
                <input
                  type="text"
                  id="pos-customer"
                  placeholder="Customer name"
                  bind:value={formData.customer}
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                />
              </div>
              <div class="space-y-2">
                <label for="pos-amount" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  id="pos-amount"
                  bind:value={formData.amount}
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-semibold"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label for="pos-description" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Note
              </label>
              <input
                type="text"
                id="pos-description"
                bind:value={formData.description}
                placeholder="Optional details"
                class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" class="btn-app-primary w-full py-3">
              <Receipt class="h-4 w-4" />
              Record sale
            </button>
            <p class="text-center text-xs text-muted-foreground">
              Logged as <span class="font-semibold text-foreground">{userName}</span>
            </p>
          </form>
        </div>
      {/if}

      <div class="surface-panel p-5 sm:p-6 {canCreate ? '' : 'lg:col-span-2'}">
        <div class="mb-5 flex items-center justify-between gap-3">
          <h3 class="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShoppingBag class="h-5 w-5 text-primary" />
            Today's register
          </h3>
          <span class="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ₦{$todayRevenue.toLocaleString()}
          </span>
        </div>

        {#if todayTx.length === 0}
          <div class="rounded-xl border border-dashed border-border/40 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
            No sales yet today. Record the first sale to start balancing.
          </div>
        {:else}
          <div class="max-h-[420px] space-y-2 overflow-y-auto">
            {#each todayTx as tx (tx.id)}
              <div class="surface-row flex items-start justify-between gap-4 px-4 py-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-semibold text-foreground">{tx.service}</p>
                    <span class="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{tx.time}</span>
                  </div>
                  <p class="mt-1 text-sm text-muted-foreground">{tx.customer}</p>
                  {#if tx.description}
                    <p class="mt-1 text-xs text-muted-foreground">{tx.description}</p>
                  {/if}
                  <p class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User class="h-3.5 w-3.5 shrink-0" />
                    {tx.recordedBy}
                  </p>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <p class="text-base font-bold tabular-nums text-foreground">₦{tx.amount.toLocaleString()}</p>
                  {#if canDelete}
                    <button
                      type="button"
                      on:click={() => deleteTransaction(tx.id)}
                      class="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete transaction"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Quick actions -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">End-of-day reconciliation</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" on:click={() => modals.openDailySales()} class="btn-app-secondary">
          <TrendingUp class="h-4 w-4" />
          Sales breakdown
        </button>
        {#if canCreate}
          <button type="button" on:click={() => modals.openNewTransaction()} class="btn-app-secondary">
            <Plus class="h-4 w-4" />
            Quick add
          </button>
        {/if}
      </div>
    </div>

    <!-- Manager analytics -->
    {#if canViewAudit}
      <div class="space-y-4 border-t border-border/50 pt-6">
        <button
          type="button"
          on:click={() => (showAnalytics = !showAnalytics)}
          class="flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-left transition hover:bg-muted/40"
        >
          <div class="flex items-center gap-2">
            <BarChart3 class="h-4 w-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Sales analytics &amp; ledger</span>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Manager</span>
          </div>
          {#if showAnalytics}
            <ChevronUp class="h-4 w-4 text-muted-foreground" />
          {:else}
            <ChevronDown class="h-4 w-4 text-muted-foreground" />
          {/if}
        </button>

        {#if showAnalytics}
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GlowStatCard
              label="Revenue today"
              value="₦{$todayRevenue.toLocaleString()}"
              subtext="{todayTx.length} transactions logged"
              icon={TrendingUp}
              variant="emerald"
            />
            <GlowStatCard
              label="Filtered revenue"
              value="₦{filteredRevenue.toLocaleString()}"
              subtext="{filteredTransactions.length} matching records"
              icon={BarChart3}
              variant="blue"
            />
            <GlowStatCard
              label="Avg transaction"
              value="₦{avgTransaction.toLocaleString()}"
              subtext="Across filtered set"
              icon={ShoppingBag}
              variant="violet"
            />
            <GlowStatCard
              label="Top service"
              value={serviceBreakdown[0]?.[0] ?? "—"}
              subtext={serviceBreakdown[0]
                ? `₦${serviceBreakdown[0][1].total.toLocaleString()} · ${serviceBreakdown[0][1].count} tx`
                : "No data"}
              icon={Filter}
              variant="amber"
            />
          </div>

          <div class="glow-panel relative">
            <NoiseOverlay intensity="light" />
            <div class="relative z-10 p-6">
              <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <BarChart3 class="h-5 w-5 text-primary" />
                    Sales analytics
                  </h3>
                  <p class="mt-1 text-xs text-muted-foreground">
                    Full ledger with staff attribution — manager view only
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    on:click={() => (showFilters = !showFilters)}
                    class="btn-app-secondary text-xs"
                  >
                    <Filter class="h-3.5 w-3.5" />
                    Filters
                    {#if activeFilterCount > 0}
                      <span class="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    {/if}
                  </button>
                  {#if activeFilterCount > 0 || searchQuery}
                    <button type="button" on:click={clearFilters} class="btn-app-secondary text-xs">
                      <X class="h-3.5 w-3.5" />
                      Clear
                    </button>
                  {/if}
                </div>
              </div>

              <div class="relative mb-4">
                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search customer, service, staff, or amount…"
                  bind:value={searchQuery}
                  class="w-full rounded-xl border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {#if showFilters}
                <div class="mb-6 grid gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 sm:grid-cols-3">
                  <div class="space-y-1.5">
                    <label for="filter-service" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</label>
                    <select id="filter-service" bind:value={filterService} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                      <option value="">All services</option>
                      {#each uniqueServices as svc}<option value={svc}>{svc}</option>{/each}
                    </select>
                  </div>
                  <div class="space-y-1.5">
                    <label for="filter-from" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From date</label>
                    <input type="date" id="filter-from" bind:value={filterDateFrom} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                  <div class="space-y-1.5">
                    <label for="filter-to" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">To date</label>
                    <input type="date" id="filter-to" bind:value={filterDateTo} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
              {/if}

              <div class="grid gap-6 lg:grid-cols-5">
                <div class="space-y-4 lg:col-span-2">
                  <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Revenue by service</p>
                  <div class="space-y-3">
                    {#each serviceBreakdown as [service, data]}
                      <div>
                        <div class="mb-1 flex items-center justify-between text-sm">
                          <span class="font-medium text-foreground">{service}</span>
                          <span class="text-xs text-muted-foreground">₦{data.total.toLocaleString()} · {data.count} tx</span>
                        </div>
                        <div class="h-2 overflow-hidden rounded-full bg-muted/60">
                          <div class="h-full rounded-full bg-primary transition-all duration-500" style="width: {(data.total / maxBreakdown) * 100}%"></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                  <div class="mt-6 pb-6">
                    <p class="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Today's hourly revenue</p>
                    <div class="flex h-20 items-end gap-1">
                      {#each hourlyBuckets as amount, i}
                        <div class="relative flex-1">
                          <div class="w-full rounded-t bg-primary/70 transition-all" style="height: {Math.max(4, (amount / maxHourly) * 100)}%"></div>
                          <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground">{8 + i}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>

                <div class="lg:col-span-3">
                  <div class="mb-3 flex items-center justify-between">
                    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Transaction ledger</p>
                    <span class="text-xs text-muted-foreground">{filteredTransactions.length} records</span>
                  </div>
                  <div class="overflow-x-auto rounded-xl border border-border/50">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-border/50 bg-muted/30 text-left">
                          <th class="px-3 py-2.5">
                            <button type="button" on:click={() => toggleSort("date")} class="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                              Date <ArrowUpDown class="h-3 w-3" />
                            </button>
                          </th>
                          <th class="px-3 py-2.5">
                            <button type="button" on:click={() => toggleSort("service")} class="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                              Service <ArrowUpDown class="h-3 w-3" />
                            </button>
                          </th>
                          <th class="px-3 py-2.5">
                            <button type="button" on:click={() => toggleSort("customer")} class="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                              Customer <ArrowUpDown class="h-3 w-3" />
                            </button>
                          </th>
                          <th class="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recorded by</th>
                          <th class="px-3 py-2.5 text-right">
                            <button type="button" on:click={() => toggleSort("amount")} class="ml-auto flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                              Amount <ArrowUpDown class="h-3 w-3" />
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each filteredTransactions as tx (tx.id)}
                          <tr class="border-b border-border/30 transition hover:bg-muted/20">
                            <td class="whitespace-nowrap px-3 py-2.5">
                              <div class="flex items-center gap-1.5">
                                <Calendar class="h-3 w-3 text-muted-foreground" />
                                <span class="text-xs">{tx.date}</span>
                                <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tx.time}</span>
                              </div>
                            </td>
                            <td class="px-3 py-2.5 font-medium text-foreground">{tx.service}</td>
                            <td class="px-3 py-2.5 text-muted-foreground">{tx.customer}</td>
                            <td class="px-3 py-2.5">
                              <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <User class="h-3 w-3" />
                                {tx.recordedBy}
                              </span>
                            </td>
                            <td class="px-3 py-2.5 text-right font-semibold text-foreground">₦{tx.amount.toLocaleString()}</td>
                          </tr>
                        {:else}
                          <tr>
                            <td colspan="5" class="px-3 py-8 text-center text-sm text-muted-foreground">No transactions match your search or filters.</td>
                          </tr>
                        {/each}
                      </tbody>
                      {#if filteredTransactions.length > 0}
                        <tfoot>
                          <tr class="border-t border-border/50 bg-muted/20 font-semibold">
                            <td class="px-3 py-2.5" colspan="4">Total</td>
                            <td class="px-3 py-2.5 text-right text-foreground">₦{filteredRevenue.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      {/if}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</AppShell>
