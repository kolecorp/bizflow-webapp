import { C as store_get, N as escape_html, T as unsubscribe_stores, h as ensure_array_like, u as attr_style, w as stringify } from "../../../../chunks/internal.js";
import "../../../../chunks/modals.js";
import { t as AppShell } from "../../../../chunks/AppShell.js";
import { n as Chart_column } from "../../../../chunks/layout-grid.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { f as todayRevenue, p as todayTransactions } from "../../../../chunks/businessData.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region src/pages/ReportsPage.svelte
function ReportsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let serviceBreakdown, maxAmount;
		$: serviceBreakdown = (() => {
			const map = /* @__PURE__ */ new Map();
			for (const tx of store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions)) map.set(tx.service, (map.get(tx.service) ?? 0) + tx.amount);
			return [...map.entries()].sort((a, b) => b[1] - a[1]);
		})();
		$: maxAmount = serviceBreakdown.length > 0 ? serviceBreakdown[0][1] : 1;
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Reports",
					title: "Daily sales",
					description: "Today's revenue breakdown by service type.",
					$$slots: { actions: ($$renderer) => {
						$$renderer.push(`<button type="button" class="btn-app-primary">`);
						Plus($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> Add transaction</button>`);
					} }
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-2"><div class="surface-stat p-6"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total revenue today</p> <p class="mt-2 font-heading text-4xl font-black tracking-[-0.06em] text-foreground">₦${escape_html(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue).toLocaleString())}</p></div> <div class="surface-stat p-6"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Transactions</p> <p class="mt-2 font-heading text-4xl font-black tracking-[-0.06em] text-foreground">${escape_html(store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).length)}</p></div></div> <div class="surface-panel p-6"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">`);
				Chart_column($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Revenue by service</h3> <div class="space-y-4"><!--[-->`);
				const each_array = ensure_array_like(serviceBreakdown);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let [service, amount] = each_array[$$index];
					$$renderer.push(`<div><div class="flex items-center justify-between text-sm mb-1.5"><span class="font-medium text-foreground">${escape_html(service)}</span> <span class="text-muted-foreground">₦${escape_html(amount.toLocaleString())}</span></div> <div class="h-2 rounded-full bg-muted overflow-hidden"><div class="h-full rounded-full bg-primary transition-all"${attr_style(`width: ${stringify(amount / maxAmount * 100)}%`)}></div></div></div>`);
				}
				$$renderer.push(`<!--]--> `);
				if (serviceBreakdown.length === 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-sm text-muted-foreground">No transactions recorded today.</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><h3 class="text-lg font-semibold text-foreground mb-4">Transaction log</h3> <div class="space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let tx = each_array_1[$$index_1];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div><p class="text-sm font-medium text-foreground">${escape_html(tx.service)}</p> <p class="text-xs text-muted-foreground">${escape_html(tx.customer)} · ${escape_html(tx.time)}</p></div> <p class="font-bold text-foreground">₦${escape_html(tx.amount.toLocaleString())}</p></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/reports/+page.svelte
function _page($$renderer) {
	ReportsPage($$renderer, {});
}
//#endregion
export { _page as default };
