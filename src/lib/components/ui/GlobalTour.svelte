<script lang="ts">
  import { page } from "$app/state";
  import { HelpCircle } from "@lucide/svelte";
  import { startTour } from "$lib/config/tour";
  import { getTourForPath } from "$lib/config/tourConfig";

  let steps = $derived(getTourForPath(page.url.pathname));
  // Don't show the floating button on the builder page — it has its own menu
  let hasTour = $derived(
    steps !== null &&
    steps.length > 0 &&
    !page.url.pathname.startsWith("/extensions/marketing/builder")
  );

  function startCurrentTour() {
    if (steps) {
      startTour(steps);
    }
  }
</script>

{#if hasTour}
  <button
    class="fixed bottom-22.5 right-5 z-40 flex h-14 items-center gap-2 rounded-full border bg-background px-5 py-2 text-sm font-medium shadow-lg transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    onclick={startCurrentTour}
    title="Take a Tour"
  >
    <HelpCircle class="h-5 w-5" />
    <span class="hidden sm:inline">Take a Tour</span>
  </button>
{/if}
