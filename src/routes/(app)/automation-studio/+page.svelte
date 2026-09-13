<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import AutomationStudioPage from "../../../pages/AutomationStudioPage.svelte";

  $effect(() => {
    if (!$authStore.isAuthenticated) {
      goto(`/login?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}`);
    }
  });
</script>

<svelte:head>
  <title>Automation Studio | BizFlow</title>
</svelte:head>

{#if $authStore.isAuthenticated}
  <AutomationStudioPage />
{/if}
