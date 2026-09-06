<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="flex min-h-screen w-full bg-background text-foreground">
  <aside class="hidden min-h-screen w-64 shrink-0 border-r border-border/60 bg-card/40 p-5 lg:block">
      <div class="flex items-center gap-3">
        <Skeleton class="h-11 w-11 rounded-lg" />
        <div class="space-y-2"><Skeleton class="h-4 w-24" /><Skeleton class="h-2.5 w-32" /></div>
      </div>
      <div class="mt-10 space-y-3">
        {#each Array(8) as _, index}<Skeleton class={`h-10 rounded-lg ${index === 0 ? "bg-primary/15" : ""}`} />{/each}
      </div>
  </aside>
  <main class="min-h-screen min-w-0 flex-1 bg-background p-5 sm:p-8">
      <div class="flex items-center justify-between"><div class="space-y-3"><Skeleton class="h-3 w-20" /><Skeleton class="h-8 w-64" /></div><Skeleton class="h-10 w-28 rounded-lg" /></div>
      <div class="mt-10 grid gap-4 sm:grid-cols-3">{#each Array(3) as _}<Skeleton class="h-28 rounded-xl" />{/each}</div>
      <div class="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]"><Skeleton class="h-80 rounded-xl" /><Skeleton class="h-80 rounded-xl" /></div>
  </main>
</div>
