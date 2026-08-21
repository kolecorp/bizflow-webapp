import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, j as attr, l as attr_class } from "../../../../chunks/internal.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as authStore } from "../../../../chunks/auth.js";
import "../../../../chunks/modals.js";
import { n as canAccess, r as resolveRoleKey, t as AppShell } from "../../../../chunks/AppShell.js";
import { n as Chart_column } from "../../../../chunks/layout-grid.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { t as Shopping_bag } from "../../../../chunks/shopping-bag.js";
import { t as Trending_up } from "../../../../chunks/trending-up.js";
import { t as User } from "../../../../chunks/user.js";
import { f as todayRevenue, m as transactions, u as services } from "../../../../chunks/businessData.js";
import "../../../../chunks/NoiseOverlay.js";
import "../../../../chunks/GlowStatCard.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/chevron-down.svelte
function Chevron_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevron-down" },
		props,
		{ iconNode: [["path", { "d": "m6 9 6 6 6-6" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/chevron-up.svelte
function Chevron_up($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevron-up" },
		props,
		{ iconNode: [["path", { "d": "m18 15-6-6-6 6" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/receipt.svelte
function Receipt($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "receipt" },
		props,
		{ iconNode: [
			["path", { "d": "M12 17V7" }],
			["path", { "d": "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" }],
			["path", { "d": "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/scale.svelte
function Scale($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "scale" },
		props,
		{ iconNode: [
			["path", { "d": "M12 3v18" }],
			["path", { "d": "m19 8 3 8a5 5 0 0 1-6 0zV7" }],
			["path", { "d": "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" }],
			["path", { "d": "m5 8 3 8a5 5 0 0 1-6 0zV7" }],
			["path", { "d": "M7 21h10" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/trash-2.svelte
function Trash_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "trash-2" },
		props,
		{ iconNode: [
			["path", { "d": "M10 11v6" }],
			["path", { "d": "M14 11v6" }],
			["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
			["path", { "d": "M3 6h18" }],
			["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
		] }
	]));
}
//#endregion
//#region src/pages/TransactionsPage.svelte
function TransactionsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let userRole, userId, userName, isManager, canCreate, canDelete, canViewAudit, todayTx, myTodayTx, myTodayTotal, staffBreakdown, filteredTransactions, serviceBreakdown, filteredRevenue, hourlyBuckets;
		const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		let formData = {
			service: "",
			customer: "",
			amount: "",
			description: "",
			date: today
		};
		let searchQuery = "";
		let filterService = "";
		let filterDateFrom = "";
		let filterDateTo = "";
		let showRegisterSummary = true;
		function formatDate(d) {
			return (/* @__PURE__ */ new Date(d + "T12:00:00")).toLocaleDateString("en-NG", {
				weekday: "short",
				month: "short",
				day: "numeric"
			});
		}
		$: userRole = store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "staff";
		$: userId = store_get($$store_subs ??= {}, "$authStore", authStore).user?.id ?? "";
		$: userName = store_get($$store_subs ??= {}, "$authStore", authStore).user?.name ?? "Staff";
		$: isManager = resolveRoleKey(userRole) === "manager";
		$: canCreate = canAccess(userRole, "transactions.create");
		$: canDelete = canAccess(userRole, "transactions.delete");
		$: canViewAudit = canAccess(userRole, "reports.view");
		$: todayTx = store_get($$store_subs ??= {}, "$transactions", transactions).filter((t) => t.date === today);
		$: myTodayTx = todayTx.filter((t) => t.recordedById === userId || t.recordedBy === userName);
		$: myTodayTotal = myTodayTx.reduce((s, t) => s + t.amount, 0);
		$: staffBreakdown = (() => {
			const map = /* @__PURE__ */ new Map();
			for (const tx of todayTx) {
				const key = tx.recordedBy;
				const cur = map.get(key) ?? {
					count: 0,
					total: 0
				};
				map.set(key, {
					count: cur.count + 1,
					total: cur.total + tx.amount
				});
			}
			return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
		})();
		$: filteredTransactions = (() => {
			let result = [...store_get($$store_subs ??= {}, "$transactions", transactions)];
			if (searchQuery.trim());
			result.sort((a, b) => {
				let cmp = 0;
				cmp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
				return -cmp;
			});
			return result;
		})();
		$: serviceBreakdown = (() => {
			const map = /* @__PURE__ */ new Map();
			for (const tx of filteredTransactions) {
				const cur = map.get(tx.service) ?? {
					count: 0,
					total: 0
				};
				map.set(tx.service, {
					count: cur.count + 1,
					total: cur.total + tx.amount
				});
			}
			return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
		})();
		$: filteredRevenue = filteredTransactions.reduce((s, t) => s + t.amount, 0);
		$: serviceBreakdown.length > 0 && serviceBreakdown[0][1].total;
		$: filteredTransactions.length > 0 && Math.round(filteredRevenue / filteredTransactions.length);
		$: [...new Set(store_get($$store_subs ??= {}, "$transactions", transactions).map((t) => t.service))].sort();
		$: [
			filterService,
			filterDateFrom,
			filterDateTo
		].filter(Boolean).length;
		$: hourlyBuckets = (() => {
			const buckets = new Array(12).fill(0);
			for (const tx of filteredTransactions.filter((t) => t.date === today)) {
				const hour = parseInt(tx.time.split(":")[0], 10);
				const isPM = tx.time.includes("PM");
				const h24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
				const idx = Math.min(11, Math.max(0, Math.floor((h24 - 8) / 1)));
				if (h24 >= 8 && h24 <= 19) buckets[idx] += tx.amount;
			}
			return buckets;
		})();
		$: Math.max(...hourlyBuckets, 1);
		AppShell($$renderer, {
			children: ($$renderer) => {
				$$renderer.push(`<div class="space-y-6"><div class="surface-panel sticky top-[50px] z-10 overflow-hidden"><button type="button" class="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-muted/20 sm:p-6"${attr("aria-expanded", showRegisterSummary)}><div class="flex min-w-0 items-center gap-4"><div class="shrink-0 rounded-xl border border-border/60 bg-muted/40 p-3">`);
				Scale($$renderer, { class: "h-6 w-6 text-primary" });
				$$renderer.push(`<!----></div> <div class="min-w-0"><p class="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Point of sale · Daily register</p> <h2 class="mt-1 font-heading text-lg font-black tracking-[-0.05em] text-foreground sm:text-xl">Balance account — ${escape_html(formatDate(today))}</h2> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> <div class="flex shrink-0 items-center gap-3">`);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				$$renderer.push("<!--[0-->");
				Chevron_up($$renderer, { class: "h-5 w-5 text-muted-foreground" });
				$$renderer.push(`<!--]--></div></button> `);
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="border-t border-border/50 px-5 pb-5 sm:px-6 sm:pb-6"><div class="grid gap-6 pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><p class="max-w-xl text-sm text-muted-foreground">Record sales here all day. Use the register total when closing the till.</p> <div class="grid shrink-0 gap-3 sm:grid-cols-2 sm:gap-4"><div class="rounded-xl border border-border/60 bg-muted/20 px-5 py-4"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Register total</p> <p class="mt-1 font-heading text-2xl font-black tracking-[-0.06em] text-emerald-600 dark:text-emerald-400 sm:text-3xl">₦${escape_html(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue).toLocaleString())}</p> <p class="mt-1 text-xs text-muted-foreground">${escape_html(todayTx.length)} transaction${escape_html(todayTx.length === 1 ? "" : "s")}</p></div> <div class="rounded-xl border border-border/60 bg-muted/20 px-5 py-4"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your shift</p> <p class="mt-1 text-2xl font-bold text-foreground">₦${escape_html(myTodayTotal.toLocaleString())}</p> <p class="mt-1 text-xs text-muted-foreground">${escape_html(myTodayTx.length)} recorded by ${escape_html(userName)}</p></div></div></div> `);
				if (isManager && staffBreakdown.length > 1) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="mt-5 flex flex-wrap gap-2 border-t border-border/50 pt-5"><!--[-->`);
					const each_array = ensure_array_like(staffBreakdown);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let [name, data] = each_array[$$index];
						$$renderer.push(`<span class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs">`);
						User($$renderer, { class: "h-3 w-3 text-muted-foreground" });
						$$renderer.push(`<!----> <span class="font-medium text-foreground">${escape_html(name)}</span> <span class="text-muted-foreground">· ${escape_html(data.count)} tx · ₦${escape_html(data.total.toLocaleString())}</span></span>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				$$renderer.push(`<!--]--></div> <div class="grid gap-6 lg:grid-cols-2 lg:items-start">`);
				if (canCreate) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="surface-panel p-5 sm:p-6"><h3 class="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">`);
					Plus($$renderer, { class: "h-5 w-5 text-primary" });
					$$renderer.push(`<!----> New sale</h3> <form class="space-y-4"><div class="space-y-2"><label for="pos-service" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service *</label> `);
					$$renderer.select({
						id: "pos-service",
						value: formData.service,
						class: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
					}, ($$renderer) => {
						$$renderer.option({ value: "" }, ($$renderer) => {
							$$renderer.push(`Select service`);
						});
						$$renderer.push(`<!--[-->`);
						const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$servicesStore", services).filter((s) => s.active));
						for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
							let s = each_array_1[$$index_1];
							$$renderer.option({ value: s.id }, ($$renderer) => {
								$$renderer.push(`${escape_html(s.name)} — ₦${escape_html(s.price)}/${escape_html(s.unit)}`);
							});
						}
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`</div> <div class="grid gap-4 sm:grid-cols-2"><div class="space-y-2"><label for="pos-customer" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer *</label> <input type="text" id="pos-customer" placeholder="Customer name"${attr("value", formData.customer)} class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"/></div> <div class="space-y-2"><label for="pos-amount" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (₦) *</label> <input type="number" id="pos-amount"${attr("value", formData.amount)} class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-semibold"/></div></div> <div class="space-y-2"><label for="pos-description" class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</label> <input type="text" id="pos-description"${attr("value", formData.description)} placeholder="Optional details" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"/></div> <button type="submit" class="btn-app-primary w-full py-3">`);
					Receipt($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Record sale</button> <p class="text-center text-xs text-muted-foreground">Logged as <span class="font-semibold text-foreground">${escape_html(userName)}</span></p></form></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div${attr_class(`surface-panel p-5 sm:p-6 ${canCreate ? "" : "lg:col-span-2"}`)}><div class="mb-5 flex items-center justify-between gap-3"><h3 class="flex items-center gap-2 text-base font-semibold text-foreground">`);
				Shopping_bag($$renderer, { class: "h-5 w-5 text-primary" });
				$$renderer.push(`<!----> Today's register</h3> <span class="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">₦${escape_html(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue).toLocaleString())}</span></div> `);
				if (todayTx.length === 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="rounded-xl border border-dashed border-border/40 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">No sales yet today. Record the first sale to start balancing.</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="max-h-[420px] space-y-2 overflow-y-auto"><!--[-->`);
					const each_array_2 = ensure_array_like(todayTx);
					for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
						let tx = each_array_2[$$index_2];
						$$renderer.push(`<div class="surface-row flex items-start justify-between gap-4 px-4 py-3"><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><p class="text-sm font-semibold text-foreground">${escape_html(tx.service)}</p> <span class="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">${escape_html(tx.time)}</span></div> <p class="mt-1 text-sm text-muted-foreground">${escape_html(tx.customer)}</p> `);
						if (tx.description) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="mt-1 text-xs text-muted-foreground">${escape_html(tx.description)}</p>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> <p class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">`);
						User($$renderer, { class: "h-3.5 w-3.5 shrink-0" });
						$$renderer.push(`<!----> ${escape_html(tx.recordedBy)}</p></div> <div class="flex shrink-0 items-center gap-2"><p class="text-base font-bold tabular-nums text-foreground">₦${escape_html(tx.amount.toLocaleString())}</p> `);
						if (canDelete) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<button type="button" class="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete transaction">`);
							Trash_2($$renderer, { class: "h-4 w-4" });
							$$renderer.push(`<!----></button>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="flex flex-wrap items-center justify-between gap-3"><p class="text-sm text-muted-foreground">End-of-day reconciliation</p> <div class="flex flex-wrap gap-2"><button type="button" class="btn-app-secondary">`);
				Trending_up($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----> Sales breakdown</button> `);
				if (canCreate) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button type="button" class="btn-app-secondary">`);
					Plus($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Quick add</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> `);
				if (canViewAudit) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="space-y-4 border-t border-border/50 pt-6"><button type="button" class="flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-left transition hover:bg-muted/40"><div class="flex items-center gap-2">`);
					Chart_column($$renderer, { class: "h-4 w-4 text-primary" });
					$$renderer.push(`<!----> <span class="text-sm font-semibold text-foreground">Sales analytics &amp; ledger</span> <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Manager</span></div> `);
					$$renderer.push("<!--[-1-->");
					Chevron_down($$renderer, { class: "h-4 w-4 text-muted-foreground" });
					$$renderer.push(`<!--]--></button> `);
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/transactions/+page.svelte
function _page($$renderer) {
	TransactionsPage($$renderer, {});
}
//#endregion
export { _page as default };
