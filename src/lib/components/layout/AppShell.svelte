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

  async function handleSignOut() {
    await signOut();
    goto("/login");
  }
</script>

{#if $sidebar}
  <div class="app-layout min-h-screen bg-background text-foreground">
    <AppSidebar activePath={page.url.pathname} />
    <div class="app-main min-w-0">
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
          class="dashboard-content dashboard-content--sidebar-open mx-auto w-full max-w-400 space-y-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8"
        >
          {@render children?.()}
        </div>
      </main>
      <AIAssistantShell />
      <SettingsModal />
    </div>
  </div>
{:else}
  <div class="app-main min-h-screen bg-background text-foreground">
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
      <AIAssistantShell />
      <SettingsModal />
      <div
        class="dashboard-content dashboard-content--sidebar-closed mx-auto w-full min-w-0 space-y-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8"
      >
        {@render children?.()}
      </div>
    </main>
  </div>
{/if}
