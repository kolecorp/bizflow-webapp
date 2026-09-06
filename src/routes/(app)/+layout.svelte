<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { authStore } from "$lib/stores/auth";
  import { hasPermission } from "$lib/stores/permissions";
  import { permissionForPath } from "$lib/config/navigation";
  import AppLoadingSkeleton from "$lib/components/layout/AppLoadingSkeleton.svelte";

  let { children } = $props();

  $effect(() => {
    if (!$authStore.authReady) return;

    if (!$authStore.isAuthenticated) {
      if ($authStore.sessionExpired) return;
      goto("/login");
      return;
    }

    if (!$authStore.permissionsLoaded) return;

    const required = permissionForPath(page.url.pathname);
    if (required && !hasPermission(required)) {
      goto("/dashboard");
    }
  });
</script>

{#if !$authStore.authReady}
  <AppLoadingSkeleton />
{:else if $authStore.sessionExpired}
  <!-- SessionExpiredModal is mounted by the root layout. -->
{:else if $authStore.isAuthenticated && $authStore.permissionsLoaded}
  {@render children?.()}
{:else if $authStore.isAuthenticated}
  <AppLoadingSkeleton />
{/if}
