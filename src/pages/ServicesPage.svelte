<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import PageHeader from "$lib/components/layout/PageHeader.svelte";
  import { services } from "$lib/stores/businessData";
  import { BriefcaseBusiness, CheckCircle2, XCircle } from "@lucide/svelte";

  $: categories = [...new Set($services.map((s) => s.category))];
</script>

<AppShell>
  <PageHeader
    eyebrow="Catalog"
    title="Services & pricing"
    description="Manage the services your business center offers — printing rates, typing, graphics, training, and computer sessions."
  />

  <div class="grid gap-4 sm:grid-cols-3">
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Active services
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">
        {$services.filter((s) => s.active).length}
      </p>
    </div>
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Categories
      </p>
      <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">{categories.length}</p>
    </div>
    <div class="surface-stat p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Linked to transactions
      </p>
      <p class="mt-2 text-sm text-muted-foreground mt-3">
        Select services when recording transactions on the Transactions page.
      </p>
    </div>
  </div>

  {#each categories as category}
    <div class="surface-panel overflow-hidden">
      <div class="border-b border-border/60 px-6 py-4 flex items-center gap-2">
        <BriefcaseBusiness class="h-5 w-5 text-primary" />
        <h3 class="text-lg font-semibold text-foreground">{category}</h3>
      </div>
      <div class="divide-y divide-border/40">
        {#each $services.filter((s) => s.category === category) as svc}
          <div class="flex items-center justify-between px-6 py-4 hover:bg-muted/20">
            <div>
              <div class="flex items-center gap-2">
                <p class="font-medium text-foreground">{svc.name}</p>
                {#if svc.active}
                  <CheckCircle2 class="h-3.5 w-3.5 text-green-500" />
                {:else}
                  <XCircle class="h-3.5 w-3.5 text-muted-foreground" />
                {/if}
              </div>
              {#if svc.description}
                <p class="text-xs text-muted-foreground mt-1">{svc.description}</p>
              {/if}
            </div>
            <div class="text-right shrink-0">
              <p class="text-lg font-bold text-foreground">₦{svc.price.toLocaleString()}</p>
              <p class="text-xs text-muted-foreground">{svc.unit}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</AppShell>
