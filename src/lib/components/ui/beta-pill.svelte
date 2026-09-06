<script lang="ts">
  import { cn } from "$lib/utils.js";

  let { class: className = "" }: { class?: string } = $props();
</script>

<span
  class={cn(
    "inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm shadow-primary/5",
    className,
  )}
>
  <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
  Beta
</span>
