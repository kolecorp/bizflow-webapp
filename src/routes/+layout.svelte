<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { ModeWatcher } from "mode-watcher";
  import { initializeAuth, authStore } from "$lib/stores/auth";
  import DailySalesModal from "$lib/components/modals/DailySalesModal.svelte";
  import NewTransactionModal from "$lib/components/modals/NewTransactionModal.svelte";
  import SendFileModal from "$lib/components/modals/SendFileModal.svelte";
  import { Toaster } from "$lib/components/ui/sonner";

  let { children } = $props();

  initializeAuth();

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
{@render children?.()}
