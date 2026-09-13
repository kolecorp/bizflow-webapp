<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  // The old standalone studio route now redirects to the new generic Automation Studio
  onMount(() => {
    const params = new URLSearchParams(page.url.searchParams);
    params.set("extension", "telegram");
    goto(`/automation-studio?${params.toString()}`, { replaceState: true });
  });
</script>

<svelte:head>
  <title>Redirecting… | BizFlow</title>
</svelte:head>

<div
  style="display:flex;height:100vh;align-items:center;justify-content:center;color:var(--muted-foreground);font-family:var(--sans)"
>
  Redirecting to Automation Studio…
</div>
