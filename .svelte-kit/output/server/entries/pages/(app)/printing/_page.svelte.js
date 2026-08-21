import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, l as attr_class } from "../../../../chunks/internal.js";
import "../../../../chunks/navigation.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import { a as Settings_2, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as File_text } from "../../../../chunks/file-text.js";
import { n as Printer } from "../../../../chunks/shopping-bag.js";
import { t as Users } from "../../../../chunks/users.js";
import { c as printJobs, l as printers, s as printAgents } from "../../../../chunks/businessData.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/chevron-right.svelte
function Chevron_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chevron-right" },
		props,
		{ iconNode: [["path", { "d": "m9 18 6-6-6-6" }]] }
	]));
}
//#endregion
//#region src/pages/PrintingPage.svelte
function PrintingPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let selectedPrinter;
		function statusDot(status) {
			switch (status) {
				case "online": return "bg-green-500";
				case "warning": return "bg-amber-500";
				case "error": return "bg-red-500";
				default: return "bg-muted-foreground";
			}
		}
		function jobStatusClass(status) {
			switch (status) {
				case "completed": return "bg-green-500/10 text-green-600 dark:text-green-400";
				case "failed": return "bg-red-500/10 text-red-600 dark:text-red-400";
				case "cancelled": return "bg-muted text-muted-foreground";
				case "printing": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
				default: return "bg-primary/10 text-primary";
			}
		}
		$: selectedPrinter = null;
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Printing",
					title: "Printers & print jobs",
					description: "Monitor printer health, queues, and every job routed through Bizflow Cloud → Print Agent → printer.",
					$$slots: { actions: ($$renderer) => {
						$$renderer.push(`<button type="button" class="btn-app-secondary">`);
						Settings_2($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> Print settings</button>`);
					} }
				});
				$$renderer.push(`<!----> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$printAgents", printAgents));
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let agent = each_array[$$index];
					$$renderer.push(`<div class="surface-stat p-5"><div class="flex items-center justify-between"><p class="text-sm font-semibold text-foreground">${escape_html(agent.name)}</p> <span${attr_class(`h-2 w-2 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-muted-foreground"}`)}></span></div> <p class="mt-1 text-xs text-muted-foreground">${escape_html(agent.machine)}</p> <p class="mt-3 text-xs text-muted-foreground">${escape_html(agent.printersConnected)} printers · v${escape_html(agent.version)} · ${escape_html(agent.lastSeen)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-6 py-4"><h3 class="text-lg font-semibold text-foreground">Printers</h3></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><th class="px-6 py-3 font-semibold">Printer</th><th class="px-4 py-3 font-semibold">Location</th><th class="px-4 py-3 font-semibold">Status</th><th class="px-4 py-3 font-semibold">Jobs today</th><th class="px-4 py-3 font-semibold">Pages today</th><th class="px-4 py-3 font-semibold"></th></tr></thead><tbody><!--[-->`);
				const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$printers", printers));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let printer = each_array_1[$$index_1];
					$$renderer.push(`<tr class="border-b border-border/40 hover:bg-muted/30 transition cursor-pointer"><td class="px-6 py-4"><div class="flex items-center gap-3">`);
					Printer($$renderer, { class: "h-4 w-4 text-primary shrink-0" });
					$$renderer.push(`<!----> <div><p class="font-medium text-foreground">${escape_html(printer.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(printer.model)}</p></div></div></td><td class="px-4 py-4 text-muted-foreground">${escape_html(printer.location)}</td><td class="px-4 py-4"><span class="flex items-center gap-2"><span${attr_class(`h-2 w-2 rounded-full ${statusDot(printer.status)}`)}></span> <span class="text-foreground">${escape_html(printer.statusDetail ?? printer.status)}</span></span></td><td class="px-4 py-4 text-foreground">${escape_html(printer.jobsToday)}</td><td class="px-4 py-4 text-foreground">${escape_html(printer.pagesToday)}</td><td class="px-4 py-4">`);
					Chevron_right($$renderer, { class: "h-4 w-4 text-muted-foreground" });
					$$renderer.push(`<!----></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></div> `);
				if (selectedPrinter) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="surface-panel border-primary/20 p-6"><div class="flex items-start justify-between gap-4"><div><h3 class="text-xl font-semibold text-foreground">${escape_html(selectedPrinter.name)}</h3> <p class="text-sm text-muted-foreground mt-1">${escape_html(selectedPrinter.ip)} · ${escape_html(selectedPrinter.protocol)} · ${escape_html(selectedPrinter.connectionType)}</p></div> <button type="button" class="text-xs text-muted-foreground hover:text-foreground">Close</button></div> <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="surface-muted p-4"><p class="text-[10px] uppercase tracking-wider text-muted-foreground">Pages today</p> <p class="mt-1 text-2xl font-bold text-foreground">${escape_html(selectedPrinter.pagesToday)}</p></div> <div class="surface-muted p-4"><p class="text-[10px] uppercase tracking-wider text-muted-foreground">This month</p> <p class="mt-1 text-2xl font-bold text-foreground">${escape_html(selectedPrinter.pagesMonth)}</p></div> <div class="surface-muted p-4"><p class="text-[10px] uppercase tracking-wider text-muted-foreground">B&amp;W / Colour</p> <p class="mt-1 text-2xl font-bold text-foreground">${escape_html(selectedPrinter.bwPages)} / ${escape_html(selectedPrinter.colorPages)}</p></div> <div class="surface-muted p-4"><p class="text-[10px] uppercase tracking-wider text-muted-foreground">Queue</p> <p class="mt-1 text-2xl font-bold text-foreground">${escape_html(selectedPrinter.queueCount)} jobs</p></div></div> <div class="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><span class="rounded-lg border border-border px-2 py-1">Colour: ${escape_html(selectedPrinter.supportsColor ? "Yes" : "No")}</span> <span class="rounded-lg border border-border px-2 py-1">Duplex: ${escape_html(selectedPrinter.supportsDuplex ? "Yes" : "No")}</span> <span class="rounded-lg border border-border px-2 py-1">Paper: ${escape_html(selectedPrinter.paperSizes.join(", "))}</span> `);
					if (selectedPrinter.tonerLevel !== void 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="rounded-lg border border-border px-2 py-1">Toner: ${escape_html(selectedPrinter.tonerLevel)}%</span>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <span class="rounded-lg border border-border px-2 py-1">Failed jobs: ${escape_html(selectedPrinter.failedJobs)}</span></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="surface-panel overflow-hidden"><div class="border-b border-border/60 px-6 py-4"><h3 class="flex items-center gap-2 text-lg font-semibold text-foreground">`);
				File_text($$renderer, { class: "h-5 w-5" });
				$$renderer.push(`<!----> Print jobs</h3></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><th class="px-6 py-3 font-semibold">Time</th><th class="px-4 py-3 font-semibold">User</th><th class="px-4 py-3 font-semibold">Document</th><th class="px-4 py-3 font-semibold">Printer</th><th class="px-4 py-3 font-semibold">Copies</th><th class="px-4 py-3 font-semibold">Pages</th><th class="px-4 py-3 font-semibold">Status</th></tr></thead><tbody><!--[-->`);
				const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$printJobs", printJobs));
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let job = each_array_2[$$index_2];
					$$renderer.push(`<tr class="border-b border-border/40 hover:bg-muted/30"><td class="px-6 py-4 text-muted-foreground">${escape_html(job.time)}</td><td class="px-4 py-4"><div class="flex items-center gap-2">`);
					Users($$renderer, { class: "h-3.5 w-3.5 text-muted-foreground" });
					$$renderer.push(`<!----> <span class="text-foreground">${escape_html(job.user)}</span></div></td><td class="px-4 py-4 text-foreground">${escape_html(job.document)}</td><td class="px-4 py-4 text-muted-foreground">${escape_html(job.printerName)}</td><td class="px-4 py-4 text-foreground">${escape_html(job.copies)}</td><td class="px-4 py-4 text-foreground">${escape_html(job.pages)}</td><td class="px-4 py-4"><span${attr_class(`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${jobStatusClass(job.status)}`)}>${escape_html(job.status)}</span></td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/printing/+page.svelte
function _page($$renderer) {
	PrintingPage($$renderer, {});
}
//#endregion
export { _page as default };
