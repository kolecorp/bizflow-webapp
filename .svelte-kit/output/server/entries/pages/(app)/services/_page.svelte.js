import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like } from "../../../../chunks/internal.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { s as Briefcase_business, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { u as services } from "../../../../chunks/businessData.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/circle-x.svelte
function Circle_x($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle-x" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "m15 9-6 6" }],
			["path", { "d": "m9 9 6 6" }]
		] }
	]));
}
//#endregion
//#region src/pages/ServicesPage.svelte
function ServicesPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let categories;
		$: categories = [...new Set(store_get($$store_subs ??= {}, "$services", services).map((s) => s.category))];
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Catalog",
					title: "Services & pricing",
					description: "Manage the services your business center offers — printing rates, typing, graphics, training, and computer sessions."
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-3"><div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Active services</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(store_get($$store_subs ??= {}, "$services", services).filter((s) => s.active).length)}</p></div> <div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Categories</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(categories.length)}</p></div> <div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Linked to transactions</p> <p class="mt-2 text-sm text-muted-foreground mt-3">Select services when recording transactions on the Transactions page.</p></div></div> <!--[-->`);
				const each_array = ensure_array_like(categories);
				for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
					let category = each_array[$$index_1];
					$$renderer.push(`<div class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-6 py-4 flex items-center gap-2">`);
					Briefcase_business($$renderer, { class: "h-5 w-5 text-primary" });
					$$renderer.push(`<!----> <h3 class="text-lg font-semibold text-foreground">${escape_html(category)}</h3></div> <div class="divide-y divide-border/40"><!--[-->`);
					const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$services", services).filter((s) => s.category === category));
					for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
						let svc = each_array_1[$$index];
						$$renderer.push(`<div class="flex items-center justify-between px-6 py-4 hover:bg-muted/20"><div><div class="flex items-center gap-2"><p class="font-medium text-foreground">${escape_html(svc.name)}</p> `);
						if (svc.active) {
							$$renderer.push("<!--[0-->");
							Circle_check($$renderer, { class: "h-3.5 w-3.5 text-green-500" });
						} else {
							$$renderer.push("<!--[-1-->");
							Circle_x($$renderer, { class: "h-3.5 w-3.5 text-muted-foreground" });
						}
						$$renderer.push(`<!--]--></div> `);
						if (svc.description) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="text-xs text-muted-foreground mt-1">${escape_html(svc.description)}</p>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div> <div class="text-right shrink-0"><p class="text-lg font-bold text-foreground">₦${escape_html(svc.price.toLocaleString())}</p> <p class="text-xs text-muted-foreground">${escape_html(svc.unit)}</p></div></div>`);
					}
					$$renderer.push(`<!--]--></div></div>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/services/+page.svelte
function _page($$renderer) {
	ServicesPage($$renderer, {});
}
//#endregion
export { _page as default };
