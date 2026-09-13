<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { navigating } from "$app/state";

  import { ModeWatcher } from "mode-watcher";
  import { initializeAuth, authStore } from "$lib/stores/auth";
  import { syncExtensions } from "$lib/stores/extensions";
  import DailySalesModal from "$lib/components/modals/DailySalesModal.svelte";
  import NewTransactionModal from "$lib/components/modals/NewTransactionModal.svelte";
  import SendFileModal from "$lib/components/modals/SendFileModal.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import GlobalTour from "$lib/components/ui/GlobalTour.svelte";

  let { children } = $props();

  // Initialize immediately (synchronously on the client) so the initial state is hydrated
  // before the first render, preventing layout flashes.
  initializeAuth();

  $effect(() => {
    const user = $authStore.user;
    if ($authStore.isAuthenticated && $authStore.permissionsLoaded && user) {
      void syncExtensions(user);
    }
  });

  $effect(() => {
    const authenticated = $authStore.isAuthenticated;
    const pathname = page.url.pathname;

    if (authenticated && (pathname === "/login" || pathname === "/")) {
      goto("/dashboard");
    }
  });
</script>

<ModeWatcher />
<Toaster richColors closeButton position="top-right" />
<DailySalesModal />
<NewTransactionModal />
<SendFileModal />
<GlobalTour />
{#if navigating.to}
  <div
    class="fixed inset-x-0 top-0 z-100 h-0.5 overflow-hidden bg-primary/15"
    aria-hidden="true"
  >
    <div
      class="h-full w-1/3 animate-[loading-slide_1s_ease-in-out_infinite] bg-primary"
    ></div>
  </div>
{/if}
{@render children?.()}
