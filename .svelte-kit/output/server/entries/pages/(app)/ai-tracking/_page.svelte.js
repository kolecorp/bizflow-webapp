import { N as escape_html, S as spread_props, h as ensure_array_like, l as attr_class } from "../../../../chunks/internal.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { i as Square_terminal, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Bot } from "../../../../chunks/bot.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/ellipsis.svelte
function Ellipsis($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "ellipsis" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "1"
			}],
			["circle", {
				"cx": "19",
				"cy": "12",
				"r": "1"
			}],
			["circle", {
				"cx": "5",
				"cy": "12",
				"r": "1"
			}]
		] }
	]));
}
//#endregion
//#region src/pages/AITrackingPage.svelte
function AITrackingPage($$renderer) {
	const aiTasks = [
		{
			id: "AI-101",
			title: "Rebuild dashboard for business centers",
			status: "Done",
			date: "Today",
			author: "Antigravity",
			tags: ["UI/UX", "Feature"]
		},
		{
			id: "AI-102",
			title: "Print Agent architecture & printing module",
			status: "In Progress",
			date: "Today",
			author: "Antigravity",
			tags: ["Printing", "Feature"]
		},
		{
			id: "AI-103",
			title: "Stock taking & inventory UI",
			status: "In Progress",
			date: "Today",
			author: "Antigravity",
			tags: ["Inventory"]
		},
		{
			id: "AI-104",
			title: "RBAC permission gates (placeholder)",
			status: "To Do",
			date: "Pending",
			author: "System",
			tags: ["Security"]
		}
	];
	function getStatusColor(status) {
		switch (status) {
			case "Done": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400";
			case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
			default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
		}
	}
	AppShell($$renderer, {
		children: ($$renderer) => {
			PageHeader($$renderer, {
				eyebrow: "System",
				title: "AI Tracking (.ai)",
				description: "Track features, modules, and changes made with AI assistance."
			});
			$$renderer.push(`<!----> <div class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-6 py-4 flex items-center gap-3">`);
			Square_terminal($$renderer, { class: "h-5 w-5 text-primary" });
			$$renderer.push(`<!----> <h3 class="text-lg font-semibold text-foreground">Development tasks</h3></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><th class="px-6 py-3 font-semibold">Key</th><th class="px-4 py-3 font-semibold">Summary</th><th class="px-4 py-3 font-semibold">Status</th><th class="px-4 py-3 font-semibold">Author</th><th class="px-4 py-3 font-semibold">Date</th><th class="px-4 py-3"></th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(aiTasks);
			for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
				let task = each_array[$$index_1];
				$$renderer.push(`<tr class="border-b border-border/40 hover:bg-muted/30 group"><td class="px-6 py-4 font-mono text-xs text-muted-foreground">${escape_html(task.id)}</td><td class="px-4 py-4"><div class="flex flex-wrap items-center gap-2"><span class="font-medium text-foreground">${escape_html(task.title)}</span> <!--[-->`);
				const each_array_1 = ensure_array_like(task.tags);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let tag = each_array_1[$$index];
					$$renderer.push(`<span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">${escape_html(tag)}</span>`);
				}
				$$renderer.push(`<!--]--></div></td><td class="px-4 py-4"><span${attr_class(`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`)}>${escape_html(task.status)}</span></td><td class="px-4 py-4 text-muted-foreground flex items-center gap-1.5">`);
				Bot($$renderer, { class: "h-3.5 w-3.5" });
				$$renderer.push(`<!----> ${escape_html(task.author)}</td><td class="px-4 py-4 text-muted-foreground">${escape_html(task.date)}</td><td class="px-4 py-4"><button type="button" class="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-muted transition">`);
				Ellipsis($$renderer, { class: "h-4 w-4 text-muted-foreground" });
				$$renderer.push(`<!----></button></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div></div>`);
		},
		$$slots: { default: true }
	});
}
//#endregion
//#region src/routes/(app)/ai-tracking/+page.svelte
function _page($$renderer) {
	AITrackingPage($$renderer, {});
}
//#endregion
export { _page as default };
