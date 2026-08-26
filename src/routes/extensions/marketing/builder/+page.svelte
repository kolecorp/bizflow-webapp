<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { authStore } from "$lib/stores/auth";
  import MarketingBuilderPage from "../../../../pages/MarketingBuilderPage.svelte";

  $effect(() => {
    if (!$authStore.isAuthenticated) goto(`/login?redirect=${encodeURIComponent(page.url.pathname)}`);
  });
</script>

{#if $authStore.isAuthenticated}
  <MarketingBuilderPage />
{/if}