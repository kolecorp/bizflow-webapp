<script lang="ts">
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/stores/auth";
	import { canAccess } from "$lib/stores/permissions";
	import { appNavItems, isNavActive } from "$lib/config/navigation";
	import { Lock } from "@lucide/svelte";

	let { activePath = "" }: { activePath?: string } = $props();

	let userRole = $derived($authStore.user?.role ?? "staff");

	let sections = $derived.by(() => {
		const map = new Map<string, typeof appNavItems>();
		for (const item of appNavItems) {
			const section = item.section ?? "General";
			if (!map.has(section)) map.set(section, []);
			map.get(section)!.push(item);
		}
		return map;
	});

	function navigate(path: string) {
		goto(path);
	}
</script>

<aside class="surface-panel p-5">
	<div class="flex items-center gap-3.5 border-b border-border/60 pb-5">
		<div
			class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
		>
			<img src="/cafe-logo.png" alt="Bizflow logo" class="h-8 w-8 object-contain" />
		</div>
		<div>
			<p class="font-heading text-xl font-black tracking-[-0.06em] text-foreground">
				Bizflow
			</p>
			<p class="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
				Business center
			</p>
		</div>
	</div>

	<div class="mt-5 space-y-5">
		{#each [...sections.entries()] as [section, items]}
			<div>
				<div
					class="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
				>
					{section}
				</div>
				<div class="space-y-1">
					{#each items as item}
						{@const allowed = canAccess(userRole, item.permission)}
						<button
							type="button"
							disabled={!allowed}
							onclick={() => allowed && navigate(item.path)}
							class={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition ${
								isNavActive(item.path, activePath)
									? "bg-foreground text-background"
									: allowed
										? "text-muted-foreground hover:bg-muted hover:text-foreground"
										: "text-muted-foreground/50 cursor-not-allowed"
							}`}
						>
							<span class="flex items-center gap-3 min-w-0">
								{#if !allowed}
									<Lock class="h-4 w-4 shrink-0" />
								{:else}
									<item.icon class="h-4 w-4 shrink-0" />
								{/if}
								<span class="truncate">{item.label}</span>
							</span>
							{#if item.badge && allowed}
								<span
									class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary"
								>
									{item.badge}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</aside>
