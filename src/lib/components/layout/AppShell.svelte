<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import AppHeader from "./AppHeader.svelte";
	import AppSidebar from "./AppSidebar.svelte";
	import { authStore } from "$lib/stores/auth";
	import { signOut } from "$lib/stores/auth";
	import { sidebar } from "$lib/stores/sidebar";

	let { children } = $props();

	async function handleSignOut() {
		await signOut();
		goto("/login");
	}
</script>

<AppHeader
	title={$authStore.user?.name ?? "Manager"}
	subtitle={$authStore.user?.role ?? "Operations"}
	onLogout={handleSignOut}
	onToggleSidebar={() => sidebar.toggle()}
	sidebarOpen={$sidebar}
/>

<div class="min-h-screen bg-background text-foreground">
	<div class="w-full px-4 pb-10 pt-6 sm:px-6 lg:px-8">
		{#if $sidebar}
			<div class="mx-auto grid w-full max-w-[1500px] gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
				<AppSidebar activePath={page.url.pathname} />
				<div class="min-w-0 space-y-6">
					{@render children?.()}
				</div>
			</div>
		{:else}
			<div class="mx-auto w-[70%] min-w-0 space-y-6">
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>
