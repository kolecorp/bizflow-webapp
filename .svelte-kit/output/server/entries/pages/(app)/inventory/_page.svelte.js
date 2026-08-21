import { C as store_get, M as clsx, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, j as attr, l as attr_class } from "../../../../chunks/internal.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as authStore } from "../../../../chunks/auth.js";
import { n as canAccess, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Package } from "../../../../chunks/package.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { a as lowStockItems, d as stockAdjustments, i as inventory } from "../../../../chunks/businessData.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/clipboard-list.svelte
function Clipboard_list($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "clipboard-list" },
		props,
		{ iconNode: [
			["rect", {
				"width": "8",
				"height": "4",
				"x": "8",
				"y": "2",
				"rx": "1",
				"ry": "1"
			}],
			["path", { "d": "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
			["path", { "d": "M12 11h4" }],
			["path", { "d": "M12 16h4" }],
			["path", { "d": "M8 11h.01" }],
			["path", { "d": "M8 16h.01" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/minus.svelte
function Minus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "minus" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }]] }
	]));
}
//#endregion
//#region src/pages/InventoryPage.svelte
function InventoryPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let userRole, canAdjust, selectedItem;
		let selectedItemId = "";
		let adjustType = "count";
		let adjustQty = "";
		let adjustReason = "";
		function isLowStock(item) {
			return item.quantity <= item.minQuantity;
		}
		$: userRole = store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "staff";
		$: canAdjust = canAccess(userRole, "inventory.adjust");
		$: selectedItem = store_get($$store_subs ??= {}, "$inventory", inventory).find((i) => i.id === selectedItemId);
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Inventory",
					title: "Stock taking",
					description: "Count stock, record adjustments, and monitor low-stock alerts for paper, ink, and supplies."
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-3"><div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total items</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(store_get($$store_subs ??= {}, "$inventory", inventory).length)}</p></div> <div class="surface-stat border-amber-500/30 bg-amber-500/5 p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Low stock alerts</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-amber-600">${escape_html(store_get($$store_subs ??= {}, "$lowStockItems", lowStockItems).length)}</p></div> <div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Adjustments today</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(store_get($$store_subs ??= {}, "$stockAdjustments", stockAdjustments).length)}</p></div></div> `);
				if (!canAdjust) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="surface-muted px-4 py-3 text-sm text-muted-foreground">Stock adjustments require inventory privileges. View-only access for your role.</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (canAdjust) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="surface-panel p-6"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">`);
					Clipboard_list($$renderer, { class: "h-5 w-5" });
					$$renderer.push(`<!----> Record stock adjustment</h3> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item</label> `);
					$$renderer.select({
						value: selectedItemId,
						class: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`Select item`);
						});
						$$renderer.push(`<!--[-->`);
						const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$inventory", inventory));
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let item = each_array[$$index];
							$$renderer.option({ value: item.id }, ($$renderer) => {
								$$renderer.push(`${escape_html(item.name)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`</div> <div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label> `);
					$$renderer.select({
						value: adjustType,
						class: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "count" }, ($$renderer) => {
							$$renderer.push(`Physical count`);
						});
						$$renderer.option({ value: "add" }, ($$renderer) => {
							$$renderer.push(`Add stock`);
						});
						$$renderer.option({ value: "remove" }, ($$renderer) => {
							$$renderer.push(`Remove stock`);
						});
					});
					$$renderer.push(`</div> <div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</label> <input type="number"${attr("value", adjustQty)} placeholder="0" class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"/></div> <div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason</label> <input type="text"${attr("value", adjustReason)} placeholder="e.g. Weekly count" class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"/></div></div> `);
					if (selectedItem) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="mt-3 text-sm text-muted-foreground">Current stock: <strong class="text-foreground">${escape_html(selectedItem.quantity)} ${escape_html(selectedItem.unit)}</strong> (min ${escape_html(selectedItem.minQuantity)})</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <button type="button" class="btn-app-primary mt-4">Save adjustment</button></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-6 py-4"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				Package($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Stock levels</h3></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><th class="px-6 py-3 font-semibold">Item</th><th class="px-4 py-3 font-semibold">Category</th><th class="px-4 py-3 font-semibold">SKU</th><th class="px-4 py-3 font-semibold">Quantity</th><th class="px-4 py-3 font-semibold">Min</th><th class="px-4 py-3 font-semibold">Location</th><th class="px-4 py-3 font-semibold">Last counted</th></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$inventory", inventory));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let item = each_array_1[$$index_1];
					$$renderer.push(`<tr class="border-b border-border/40 hover:bg-muted/30"><td class="px-6 py-4"><div class="flex items-center gap-2">`);
					if (isLowStock(item)) {
						$$renderer.push("<!--[0-->");
						Triangle_alert($$renderer, { class: "h-4 w-4 text-amber-500 shrink-0" });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <span class="font-medium text-foreground">${escape_html(item.name)}</span></div></td><td class="px-4 py-4 text-muted-foreground">${escape_html(item.category)}</td><td class="px-4 py-4 font-mono text-xs text-muted-foreground">${escape_html(item.sku)}</td><td class="px-4 py-4"><span${attr_class(clsx(isLowStock(item) ? "font-bold text-amber-600" : "text-foreground"))}>${escape_html(item.quantity)} ${escape_html(item.unit)}</span></td><td class="px-4 py-4 text-muted-foreground">${escape_html(item.minQuantity)}</td><td class="px-4 py-4 text-muted-foreground">${escape_html(item.location)}</td><td class="px-4 py-4 text-muted-foreground">${escape_html(item.lastCounted ?? "—")}</td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></div> <div class="surface-panel p-6"><h3 class="text-lg font-semibold text-foreground mb-4">Recent adjustments</h3> <div class="space-y-3"><!--[-->`);
				const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$stockAdjustments", stockAdjustments));
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let adj = each_array_2[$$index_2];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div class="flex items-center gap-3">`);
					if (adj.type === "add") {
						$$renderer.push("<!--[0-->");
						Plus($$renderer, { class: "h-4 w-4 text-green-600" });
					} else if (adj.type === "remove") {
						$$renderer.push("<!--[1-->");
						Minus($$renderer, { class: "h-4 w-4 text-red-500" });
					} else {
						$$renderer.push("<!--[-1-->");
						Clipboard_list($$renderer, { class: "h-4 w-4 text-primary" });
					}
					$$renderer.push(`<!--]--> <div><p class="text-sm font-medium text-foreground">${escape_html(adj.itemName)}</p> <p class="text-xs text-muted-foreground">${escape_html(adj.reason)} · ${escape_html(adj.by)}</p></div></div> <div class="text-right"><p class="text-sm font-semibold text-foreground">${escape_html(adj.type === "count" ? "Count:" : adj.type === "add" ? "+" : "−")}
              ${escape_html(adj.quantity)}</p> <p class="text-xs text-muted-foreground">${escape_html(adj.time)}</p></div></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/inventory/+page.svelte
function _page($$renderer) {
	InventoryPage($$renderer, {});
}
//#endregion
export { _page as default };
