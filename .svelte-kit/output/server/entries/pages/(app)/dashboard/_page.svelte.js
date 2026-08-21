import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, l as attr_class, w as stringify } from "../../../../chunks/internal.js";
import "../../../../chunks/navigation.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/modals.js";
import { c as Bell, o as Message_square, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Circle_check } from "../../../../chunks/circle-check.js";
import { t as Monitor } from "../../../../chunks/monitor.js";
import { t as Package } from "../../../../chunks/package.js";
import { t as Plus } from "../../../../chunks/plus.js";
import { n as Printer, t as Shopping_bag } from "../../../../chunks/shopping-bag.js";
import { t as Ticket } from "../../../../chunks/ticket.js";
import { t as Trending_up } from "../../../../chunks/trending-up.js";
import { t as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { a as lowStockItems, c as printJobs, f as todayRevenue, l as printers, n as computers, p as todayTransactions } from "../../../../chunks/businessData.js";
import { n as notificationUnreadCount, t as notificationItems } from "../../../../chunks/notifications.js";
import { a as fileTransfers, o as openTickets, t as activeTransfers } from "../../../../chunks/communications.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
import { t as GlowStatCard } from "../../../../chunks/GlowStatCard.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/clock-3.svelte
function Clock_3($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "clock-3" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}], ["path", { "d": "M12 6v6h4" }]] }
	]));
}
//#endregion
//#region src/pages/DashboardPage.svelte
function DashboardPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		function printerStatusColor(status) {
			switch (status) {
				case "online": return "text-green-600 dark:text-green-400";
				case "warning": return "text-amber-600 dark:text-amber-400";
				case "error": return "text-red-600 dark:text-red-400";
				default: return "text-muted-foreground";
			}
		}
		function printerStatusDot(status) {
			switch (status) {
				case "online": return "bg-green-500";
				case "warning": return "bg-amber-500";
				case "error": return "bg-red-500";
				default: return "bg-muted-foreground";
			}
		}
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Overview",
					title: "Business center dashboard",
					description: "Today's revenue, printing health, stock alerts, and recent activity.",
					$$slots: { actions: ($$renderer) => {
						$$renderer.push(`<button type="button" class="btn-app-primary">`);
						Plus($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> New transaction</button> <button type="button" class="btn-app-secondary">Daily sales</button>`);
					} }
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-3"><button type="button" class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"><div class="rounded-xl bg-primary/10 p-2.5">`);
				Upload($$renderer, { class: "h-5 w-5 text-primary" });
				$$renderer.push(`<!----></div> <div><p class="font-semibold text-foreground">Send files to PCs</p> <p class="mt-1 text-xs text-muted-foreground">Push documents to customer workstations when their agent allows it.</p></div></button> <button type="button" class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"><div class="rounded-xl bg-blue-500/10 p-2.5">`);
				Message_square($$renderer, { class: "h-5 w-5 text-blue-600" });
				$$renderer.push(`<!----></div> <div><p class="font-semibold text-foreground">Staff chat</p> <p class="mt-1 text-xs text-muted-foreground">RPC-backed team messaging across front desk and operations.</p></div></button> <button type="button" class="surface-stat flex items-start gap-4 p-5 text-left transition hover:border-primary/30"><div class="rounded-xl bg-amber-500/10 p-2.5">`);
				Ticket($$renderer, { class: "h-5 w-5 text-amber-600" });
				$$renderer.push(`<!----></div> <div><p class="font-semibold text-foreground">Customer tickets</p> <p class="mt-1 text-xs text-muted-foreground">${escape_html(store_get($$store_subs ??= {}, "$openTickets", openTickets).length)} open · resolve workstation and service issues.</p></div></button></div> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">`);
				GlowStatCard($$renderer, {
					label: "Revenue today",
					value: `₦${stringify(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue).toLocaleString())}`,
					subtext: `${stringify(store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).length)} transactions`,
					icon: Trending_up,
					variant: "emerald"
				});
				$$renderer.push(`<!----> `);
				GlowStatCard($$renderer, {
					label: "Print jobs today",
					value: store_get($$store_subs ??= {}, "$printJobs", printJobs).length,
					subtext: "View printing queue",
					icon: Printer,
					variant: "blue"
				});
				$$renderer.push(`<!----> `);
				GlowStatCard($$renderer, {
					label: "Computers active",
					value: `${stringify(store_get($$store_subs ??= {}, "$computers", computers).filter((c) => c.status === "in-use").length)} / ${stringify(store_get($$store_subs ??= {}, "$computers", computers).length)}`,
					subtext: "Workstations in use",
					icon: Monitor,
					variant: "violet"
				});
				$$renderer.push(`<!----> `);
				GlowStatCard($$renderer, {
					label: "Low stock items",
					value: store_get($$store_subs ??= {}, "$lowStockItems", lowStockItems).length,
					subtext: "Needs restocking",
					icon: Package,
					variant: "amber"
				});
				$$renderer.push(`<!----></div> <div class="grid gap-6 lg:grid-cols-2"><div class="surface-panel p-6"><div class="flex items-center justify-between mb-5"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				Printer($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Printer health</h3> <button type="button" class="text-xs text-primary hover:underline">View all</button></div> <div class="space-y-3"><!--[-->`);
				const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$printers", printers));
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let printer = each_array[$$index];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div class="flex items-center gap-3 min-w-0"><span${attr_class(`h-2.5 w-2.5 shrink-0 rounded-full ${printerStatusDot(printer.status)}`)}></span> <div class="min-w-0"><p class="text-sm font-medium text-foreground truncate">${escape_html(printer.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(printer.location)}</p></div></div> <div class="text-right shrink-0"><p${attr_class(`text-xs font-medium ${printerStatusColor(printer.status)}`)}>${escape_html(printer.statusDetail ?? printer.status)}</p> <p class="text-xs text-muted-foreground">${escape_html(printer.jobsToday)} jobs today</p></div></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><div class="flex items-center justify-between mb-5"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				Shopping_bag($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Recent transactions</h3> <button type="button" class="text-xs text-primary hover:underline">View all</button></div> <div class="space-y-3"><!--[-->`);
				const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).slice(0, 5));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let tx = each_array_1[$$index_1];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div><p class="text-sm font-medium text-foreground">${escape_html(tx.service)}</p> <p class="text-xs text-muted-foreground">${escape_html(tx.customer)} · ${escape_html(tx.time)}</p></div> <p class="text-sm font-bold text-foreground">₦${escape_html(tx.amount.toLocaleString())}</p></div>`);
				}
				$$renderer.push(`<!--]--></div></div></div> <div class="grid gap-6 lg:grid-cols-3"><div class="surface-panel p-6"><div class="flex items-center justify-between mb-5"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				Bell($$renderer, { class: "h-5 w-5 text-primary" });
				$$renderer.push(`<!----> Notifications</h3> <span class="text-xs text-muted-foreground">${escape_html(store_get($$store_subs ??= {}, "$notificationUnreadCount", notificationUnreadCount))} unread</span></div> <div class="space-y-3"><!--[-->`);
				const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$notificationItems", notificationItems).slice(0, 4));
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let notif = each_array_2[$$index_2];
					$$renderer.push(`<button type="button"${attr_class(`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition hover:bg-muted/50 ${notif.read ? "border-border" : "border-primary/20 bg-primary/5"}`)}><div class="min-w-0 flex-1"><p class="text-sm font-medium text-foreground">${escape_html(notif.title)}</p> <p class="text-xs text-muted-foreground line-clamp-2">${escape_html(notif.message)}</p></div></button>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">`);
				Triangle_alert($$renderer, { class: "h-5 w-5 text-amber-500" });
				$$renderer.push(`<!----> Alerts</h3> <div class="space-y-3"><!--[-->`);
				const each_array_3 = ensure_array_like(store_get($$store_subs ??= {}, "$lowStockItems", lowStockItems));
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let item = each_array_3[$$index_3];
					$$renderer.push(`<div class="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">`);
					Package($$renderer, { class: "h-4 w-4 text-amber-600 shrink-0 mt-0.5" });
					$$renderer.push(`<!----> <div><p class="text-sm font-medium text-foreground">Low stock: ${escape_html(item.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(item.quantity)} ${escape_html(item.unit)} remaining (min ${escape_html(item.minQuantity)})</p></div></div>`);
				}
				$$renderer.push(`<!--]--> <!--[-->`);
				const each_array_4 = ensure_array_like(store_get($$store_subs ??= {}, "$printers", printers).filter((p) => p.status !== "online"));
				for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
					let printer = each_array_4[$$index_4];
					$$renderer.push(`<div class="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">`);
					Printer($$renderer, { class: "h-4 w-4 text-red-500 shrink-0 mt-0.5" });
					$$renderer.push(`<!----> <div><p class="text-sm font-medium text-foreground">${escape_html(printer.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(printer.statusDetail ?? printer.status)}</p></div></div>`);
				}
				$$renderer.push(`<!--]--> `);
				if (store_get($$store_subs ??= {}, "$lowStockItems", lowStockItems).length === 0 && store_get($$store_subs ??= {}, "$printers", printers).every((p) => p.status === "online")) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="flex items-center gap-2 text-sm text-muted-foreground">`);
					Circle_check($$renderer, { class: "h-4 w-4 text-green-500" });
					$$renderer.push(`<!----> All systems operating normally</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">`);
				Upload($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> File transfers</h3> <div class="space-y-3"><!--[-->`);
				const each_array_5 = ensure_array_like(store_get($$store_subs ??= {}, "$fileTransfers", fileTransfers).slice(0, 4));
				for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
					let job = each_array_5[$$index_5];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div class="min-w-0"><p class="text-sm font-medium text-foreground truncate">${escape_html(job.fileName)}</p> <p class="text-xs text-muted-foreground">${escape_html(job.computerName)} · ${escape_html(job.sentAt)}</p></div> <span${attr_class(`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${job.status === "delivered" ? "bg-green-500/10 text-green-600" : job.status === "uploading" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`)}>${escape_html(job.status)}</span></div>`);
				}
				$$renderer.push(`<!--]--> `);
				if (store_get($$store_subs ??= {}, "$activeTransfers", activeTransfers).length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-primary">${escape_html(store_get($$store_subs ??= {}, "$activeTransfers", activeTransfers).length)} transfer(s) in progress…</p>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <button type="button" class="text-xs text-primary hover:underline">Send file to a PC</button></div></div></div> <div class="grid gap-6 lg:grid-cols-2"><div class="surface-panel p-6"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground mb-5">`);
				Clock_3($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Print job activity</h3> <div class="space-y-3"><!--[-->`);
				const each_array_6 = ensure_array_like(store_get($$store_subs ??= {}, "$printJobs", printJobs).slice(0, 5));
				for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
					let job = each_array_6[$$index_6];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div class="min-w-0"><p class="text-sm font-medium text-foreground truncate">${escape_html(job.document)}</p> <p class="text-xs text-muted-foreground">${escape_html(job.user)} · ${escape_html(job.printerName)} · ${escape_html(job.time)}</p></div> <span${attr_class(`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${job.status === "completed" ? "bg-green-500/10 text-green-600" : job.status === "failed" ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary"}`)}>${escape_html(job.status)}</span></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><div class="flex items-center justify-between mb-5"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				Ticket($$renderer, { class: "h-5 w-5 text-amber-500" });
				$$renderer.push(`<!----> Open tickets</h3> <button type="button" class="text-xs text-primary hover:underline">Resolve tickets</button></div> <div class="space-y-3"><!--[-->`);
				const each_array_7 = ensure_array_like(store_get($$store_subs ??= {}, "$openTickets", openTickets).slice(0, 4));
				for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
					let ticket = each_array_7[$$index_7];
					$$renderer.push(`<button type="button" class="surface-row flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-muted/50"><div class="min-w-0"><p class="text-sm font-medium text-foreground">${escape_html(ticket.subject)}</p> <p class="text-xs text-muted-foreground">${escape_html(ticket.id)} · ${escape_html(ticket.customer)} `);
					if (ticket.computerName) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`· ${escape_html(ticket.computerName)}`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></p></div> <span class="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600">${escape_html(ticket.status.replace("_", " "))}</span></button>`);
				}
				$$renderer.push(`<!--]--></div></div></div> <div class="rounded-2xl border border-primary/20 bg-primary/5 p-6"><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">Print architecture</p> <p class="text-sm text-muted-foreground leading-relaxed">Bizflow Cloud → Print Agent → Local printers. Your browser never talks directly to
      printers on the LAN. Install the Bizflow Print Agent on a network computer and pair it
      in <button type="button" class="text-primary hover:underline">Print Settings</button>.</p></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/dashboard/+page.svelte
function _page($$renderer) {
	DashboardPage($$renderer, {});
}
//#endregion
export { _page as default };
