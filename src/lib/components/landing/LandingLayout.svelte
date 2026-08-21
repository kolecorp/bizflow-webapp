<script lang="ts">
  import LandingNav from "./LandingNav.svelte";
  import LandingFooter from "./LandingFooter.svelte";

  let {
    active = "",
    children,
  }: {
    active?: string;
    children?: import("svelte").Snippet;
  } = $props();
</script>

<div
  class="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground"
>
  <LandingNav {active} />
  <main>
    {@render children?.()}
  </main>
  <LandingFooter />
</div>
