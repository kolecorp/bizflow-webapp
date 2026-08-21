import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, l as attr_class } from "../../../../chunks/internal.js";
import "../../../../chunks/navigation.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { t as authStore } from "../../../../chunks/auth.js";
import "../../../../chunks/modals.js";
import { n as canAccess, o as Message_square, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Monitor } from "../../../../chunks/monitor.js";
import { n as Printer } from "../../../../chunks/shopping-bag.js";
import { t as Upload } from "../../../../chunks/upload.js";
import { t as User } from "../../../../chunks/user.js";
import { t as Wifi } from "../../../../chunks/wifi.js";
import { n as computers } from "../../../../chunks/businessData.js";
import { a as fileTransfers, n as canSendFileToComputer, u as workstationAgents } from "../../../../chunks/communications.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/shield-check.svelte
function Shield_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "shield-check" },
		props,
		{ iconNode: [["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }], ["path", { "d": "m9 12 2 2 4-4" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/shield-off.svelte
function Shield_off($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "shield-off" },
		props,
		{ iconNode: [
			["path", { "d": "m2 2 20 20" }],
			["path", { "d": "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71" }],
			["path", { "d": "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/wifi-off.svelte
function Wifi_off($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wifi-off" },
		props,
		{ iconNode: [
			["path", { "d": "M12 20h.01" }],
			["path", { "d": "M8.5 16.429a5 5 0 0 1 7 0" }],
			["path", { "d": "M5 12.859a10 10 0 0 1 5.17-2.69" }],
			["path", { "d": "M19 12.859a10 10 0 0 0-2.007-1.523" }],
			["path", { "d": "M2 8.82a15 15 0 0 1 4.177-2.643" }],
			["path", { "d": "M22 8.82a15 15 0 0 0-11.288-3.764" }],
			["path", { "d": "m2 2 20 20" }]
		] }
	]));
}
//#endregion
//#region src/pages/ComputersPage.svelte
function ComputersPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let userRole, canTransfer;
		function statusLabel(status) {
			switch (status) {
				case "in-use": return "In use";
				case "online": return "Available";
				default: return "Offline";
			}
		}
		function statusDot(status) {
			switch (status) {
				case "in-use": return "bg-blue-500";
				case "online": return "bg-green-500";
				default: return "bg-muted-foreground";
			}
		}
		function agentFor(computerId) {
			return store_get($$store_subs ??= {}, "$workstationAgents", workstationAgents).find((a) => a.computerId === computerId);
		}
		function formatSize(bytes) {
			if (bytes < 1024) return `${bytes} B`;
			if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
			return `${(bytes / 1048576).toFixed(1)} MB`;
		}
		$: userRole = store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "staff";
		$: canTransfer = canAccess(userRole, "computers.transfer");
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Operations",
					title: "Computer stations",
					description: "Track sessions, send files to customer PCs when their Workstation Agent allows it, and coordinate support.",
					$$slots: { actions: ($$renderer) => {
						$$renderer.push(`<button type="button" class="btn-app-secondary">`);
						Message_square($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> Staff chat &amp; tickets</button>`);
					} }
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-3"><div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total stations</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(store_get($$store_subs ??= {}, "$computers", computers).length)}</p></div> <div class="surface-stat border-blue-500/20 bg-blue-500/5 p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">In use now</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-blue-600">${escape_html(store_get($$store_subs ??= {}, "$computers", computers).filter((c) => c.status === "in-use").length)}</p></div> <div class="surface-stat p-5"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Accepting file transfers</p> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em]">${escape_html(store_get($$store_subs ??= {}, "$workstationAgents", workstationAgents).filter((a) => a.status === "online" && a.allowsFileTransfer).length)}</p></div></div> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$computers", computers));
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let pc = each_array[$$index];
					const agent = agentFor(pc.id);
					const transferAllowed = canSendFileToComputer(pc.id);
					$$renderer.push(`<div class="surface-stat flex flex-col p-5 transition hover:border-primary/20"><div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="rounded-xl bg-primary/10 p-2.5">`);
					Monitor($$renderer, { class: "h-5 w-5 text-primary" });
					$$renderer.push(`<!----></div> <div><p class="font-semibold text-foreground">${escape_html(pc.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(pc.label)}</p></div></div> <span class="flex items-center gap-1.5 text-xs font-medium text-foreground"><span${attr_class(`h-2 w-2 rounded-full ${statusDot(pc.status)}`)}></span> ${escape_html(statusLabel(pc.status))}</span></div> <div class="mt-4 space-y-2 text-sm">`);
					if (pc.currentUser) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="flex items-center gap-2 text-muted-foreground">`);
						User($$renderer, { class: "h-3.5 w-3.5" });
						$$renderer.push(`<!----> <span>${escape_html(pc.currentUser)}</span> `);
						if (pc.sessionStart) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<span class="text-xs">since ${escape_html(pc.sessionStart)}</span>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex items-center justify-between text-muted-foreground"><span class="flex items-center gap-2">`);
					Printer($$renderer, { class: "h-3.5 w-3.5" });
					$$renderer.push(`<!----> ${escape_html(pc.printsToday)} prints today</span> <span>₦${escape_html(pc.hourlyRate)}/hr</span></div> <div class="flex flex-wrap items-center gap-2 pt-1">`);
					if (agent?.status === "online") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">`);
						Wifi($$renderer, { class: "h-3 w-3" });
						$$renderer.push(`<!----> Agent online</span>`);
					} else if (agent) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">`);
						Wifi_off($$renderer, { class: "h-3 w-3" });
						$$renderer.push(`<!----> Agent offline</span>`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">No agent</span>`);
					}
					$$renderer.push(`<!--]--> `);
					if (agent?.allowsFileTransfer) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">`);
						Shield_check($$renderer, { class: "h-3 w-3" });
						$$renderer.push(`<!----> Files allowed</span>`);
					} else if (agent) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<span class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">`);
						Shield_off($$renderer, { class: "h-3 w-3" });
						$$renderer.push(`<!----> Files blocked</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div> <div class="mt-4 border-t border-border/60 pt-4">`);
					if (canTransfer && transferAllowed) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<button type="button" class="btn-app-primary w-full">`);
						Upload($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> Send file to PC</button>`);
					} else if (canTransfer && agent?.status === "online" && !agent.allowsFileTransfer) {
						$$renderer.push("<!--[1-->");
						$$renderer.push(`<p class="text-xs text-muted-foreground">Customer has not allowed incoming files on this workstation.</p>`);
					} else if (canTransfer && (!agent || agent.status !== "online")) {
						$$renderer.push("<!--[2-->");
						$$renderer.push(`<p class="text-xs text-muted-foreground">Workstation agent must be online to send files.</p>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div></div>`);
				}
				$$renderer.push(`<!--]--></div> `);
				if (store_get($$store_subs ??= {}, "$fileTransfers", fileTransfers).length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="surface-panel p-6"><h3 class="mb-4 text-lg font-semibold text-foreground">Recent file transfers</h3> <div class="space-y-3"><!--[-->`);
					const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$fileTransfers", fileTransfers).slice(0, 6));
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let job = each_array_1[$$index_1];
						$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-3"><div class="min-w-0"><p class="text-sm font-medium text-foreground truncate">${escape_html(job.fileName)}</p> <p class="text-xs text-muted-foreground">${escape_html(job.computerName)} · ${escape_html(job.sentBy)} · ${escape_html(formatSize(job.fileSize))}</p></div> <span${attr_class(`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${job.status === "delivered" ? "bg-green-500/10 text-green-600" : job.status === "uploading" ? "bg-primary/10 text-primary" : job.status === "failed" ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground"}`)}>${escape_html(job.status)}</span></div>`);
					}
					$$renderer.push(`<!--]--></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="surface-muted p-5 text-sm text-muted-foreground"><strong class="text-foreground">Workstation Agent</strong> — Customers opt in on their PC to
    allow staff file transfers and RPC chat. Staff can only push files when the agent is online and <code class="rounded bg-muted px-1 py-0.5 text-xs">allowsFileTransfer</code> is enabled on the
    customer side.</div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/computers/+page.svelte
function _page($$renderer) {
	ComputersPage($$renderer, {});
}
//#endregion
export { _page as default };
