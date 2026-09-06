<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import AppHeader from "./AppHeader.svelte";
  import AppSidebar from "./AppSidebar.svelte";
  import { authStore } from "$lib/stores/auth";
  import { signOut } from "$lib/stores/auth";
  import { sidebar } from "$lib/stores/sidebar";
  import AIAssistantShell from "./AIAssistantShell.svelte";
  import SettingsModal from "./SettingsModal.svelte";

  let { children } = $props();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/inventory": "Inventory",
    "/services": "Services",
    "/team": "Team",
    "/reports": "Reports",
    "/settings": "Settings",
    "/support": "Support",
    "/overview": "Overview",
    "/printing": "Printing",
    "/ai-tracking": "AI Tracking",
    "/computers": "Computers",
    "/extensions": "Extensions",
    "/extensions/analytics": "Analytics",
    "/extensions/fraud-shield": "Fraud Shield",
    "/extensions/inventory": "Inventory Pro",
    "/extensions/inventory-sync": "Inventory Sync",
    "/extensions/ai-studio": "AI Studio",
    "/extensions/crm": "CRM",
    "/extensions/insights": "Insights",
    "/extensions/sms": "SMS Notifications",
    "/extensions/sms/templates": "SMS Templates",
    "/extensions/ussd": "USSD Access",
    "/extensions/storefront": "Storefront",
    "/extensions/vtu": "VTU Platform",
    "/extensions/wallet": "Wallet & Payments",
    "/extensions/qr-payments": "QR Payments",
    "/extensions/marketing": "Marketing Studio",
    "/extensions/automations": "Automations",
    "/extensions/reports": "Scheduled Reports",
    "/extensions/whatsapp/business": "WhatsApp Business",
    "/extensions/whatsapp/customers": "WhatsApp Customers",
    "/extensions/telegram": "Telegram",
  };

  const pageTitle = $derived.by(() => {
    const pathname = page.url.pathname;
    // Match by exact path or first segment
    if (pageTitles[pathname]) return pageTitles[pathname];
    const segment = "/" + pathname.split("/").filter(Boolean)[0];
    return pageTitles[segment] ?? "Bizflow";
  });

  async function handleSignOut() {
    await signOut();
    goto("/login");
  }
</script>

<svelte:head>
  <title>{pageTitle} — Bizflow</title>
</svelte:head>

<div
  class:sidebar-open={$sidebar}
  class:sidebar-closed={!$sidebar}
  class="app-layout min-h-screen bg-background text-foreground"
>
  <div class="app-sidebar-container" inert={!$sidebar}>
    <AppSidebar activePath={page.url.pathname} />
  </div>
  <button
    type="button"
    class="app-sidebar-backdrop"
    aria-label="Close sidebar"
    aria-hidden={!$sidebar}
    tabindex={$sidebar ? 0 : -1}
    onclick={() => sidebar.close()}
  ></button>
  <div class="app-main min-w-0 min-h-screen">
    <AppHeader
      title={$authStore.user?.name ?? "Manager"}
      subtitle={$authStore.user?.role ?? "Operations"}
      onLogout={handleSignOut}
      onToggleSidebar={() => sidebar.toggle()}
      sidebarOpen={$sidebar}
    />
    <main
      class="app-shell min-h-[calc(100vh-50px)] bg-background text-foreground"
    >
      <div
        class:dashboard-content--sidebar-closed={!$sidebar}
        class="dashboard-content mx-auto w-full max-w-400 space-y-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8"
      >
        {@render children?.()}
      </div>
    </main>
    <AIAssistantShell />
    <SettingsModal />
  </div>
</div>
