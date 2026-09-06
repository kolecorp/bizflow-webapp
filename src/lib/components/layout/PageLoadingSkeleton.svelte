<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";

  let { rows = 6 }: { rows?: number } = $props();
</script>

<div class="space-y-6" aria-busy="true" aria-label="Loading page">
  <div class="space-y-3"><Skeleton class="h-3 w-20" /><Skeleton class="h-8 w-56" /><Skeleton class="h-4 w-full max-w-lg" /></div>
  <div class="grid gap-4 sm:grid-cols-3">{#each Array(3) as _}<Skeleton class="h-24 rounded-xl" />{/each}</div>
  <div class="surface-panel space-y-3 p-5">{#each Array(rows) as _}<Skeleton class="h-12 w-full rounded-lg" />{/each}</div>
</div>
