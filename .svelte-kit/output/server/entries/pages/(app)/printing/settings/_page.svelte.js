import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, h as ensure_array_like, j as attr, l as attr_class } from "../../../../../chunks/internal.js";
import { t as Icon } from "../../../../../chunks/Icon.js";
import { t as AppShell } from "../../../../../chunks/AppShell.js";
import { t as Circle_check } from "../../../../../chunks/circle-check.js";
import { t as Loader_circle } from "../../../../../chunks/loader-circle.js";
import { t as Plus } from "../../../../../chunks/plus.js";
import { n as Printer } from "../../../../../chunks/shopping-bag.js";
import { t as Wifi } from "../../../../../chunks/wifi.js";
import { o as pairingCode, r as discoveredPrinters, s as printAgents, t as agentSearching } from "../../../../../chunks/businessData.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/download.svelte
function Download($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "download" },
		props,
		{ iconNode: [
			["path", { "d": "M12 15V3" }],
			["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
			["path", { "d": "m7 10 5 5 5-5" }]
		] }
	]));
}
//#endregion
//#region src/pages/PrintingSettingsPage.svelte
function PrintingSettingsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let codeEntered = "";
		AppShell($$renderer, {
			children: ($$renderer) => {
				PageHeader($$renderer, {
					eyebrow: "Settings",
					title: "Connect your printing system",
					description: "Install the Bizflow Print Agent on a computer on your local network. The agent discovers printers and maintains a secure outbound connection to Bizflow Cloud."
				});
				$$renderer.push(`<!----> <div class="surface-muted p-6 font-mono text-xs text-muted-foreground leading-relaxed"><pre class="whitespace-pre-wrap">
Browser → Bizflow Cloud → Print Agent → Local Printer

The agent uses outbound WebSocket/HTTPS — no port forwarding required.
IPP is the preferred protocol; Windows Spooler, CUPS, USB supported via agent.
    </pre></div> <div class="grid gap-6 lg:grid-cols-2"><div class="surface-panel p-6"><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Step 1</p> <h3 class="text-lg font-semibold text-foreground">Install Bizflow Print Agent</h3> <p class="mt-2 text-sm text-muted-foreground leading-relaxed">A small application that runs on a computer connected to your printers. It
        discovers devices on the local network and reports status to Bizflow Cloud.</p> <div class="mt-6 flex flex-wrap gap-3"><button type="button" class="btn-app-primary">`);
				Download($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----> Windows installer</button> <button type="button" class="btn-app-secondary">`);
				Download($$renderer, { class: "h-4 w-4" });
				$$renderer.push(`<!----> Linux package</button></div></div> <div class="surface-panel p-6"><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Step 2</p> <h3 class="text-lg font-semibold text-foreground">Connect agent to Bizflow</h3> <p class="mt-2 text-sm text-muted-foreground leading-relaxed">Generate a connection code in Bizflow and enter it in the Print Agent to pair
        securely with your business.</p> `);
				if (store_get($$store_subs ??= {}, "$pairingCode", pairingCode) && false);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="mt-4 space-y-3"><button type="button" class="btn-app-secondary w-full py-2.5">Generate connection code</button> <div class="flex gap-2"><input type="text" placeholder="Enter code from agent"${attr("value", codeEntered)} class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"/> <button type="button" class="btn-app-primary">Pair</button></div></div></div></div> <div class="surface-panel p-6"><h3 class="text-lg font-semibold text-foreground mb-4">Connected agents</h3> <div class="space-y-3"><!--[-->`);
				const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$printAgents", printAgents));
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let agent = each_array[$$index];
					$$renderer.push(`<div class="surface-row flex items-center justify-between px-4 py-4"><div class="flex items-center gap-3"><span${attr_class(`h-2.5 w-2.5 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-muted-foreground"}`)}></span> <div><p class="text-sm font-medium text-foreground">${escape_html(agent.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(agent.machine)} · ${escape_html(agent.printersConnected)} printers · ${escape_html(agent.lastSeen)}</p></div></div> <span class="text-xs font-medium text-green-600 dark:text-green-400">Connected</span></div>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="surface-panel p-6"><div class="flex items-center justify-between mb-4"><div><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-1">Step 3</p> <h3 class="text-lg font-semibold text-foreground">Discover &amp; connect printers</h3> <p class="text-sm text-muted-foreground mt-1">The agent searches your local network using IPP/DNS-SD discovery.</p></div> <button type="button"${attr("disabled", store_get($$store_subs ??= {}, "$agentSearching", agentSearching), true)} class="btn-app-primary disabled:opacity-60">`);
				if (store_get($$store_subs ??= {}, "$agentSearching", agentSearching)) {
					$$renderer.push("<!--[0-->");
					Loader_circle($$renderer, { class: "h-4 w-4 animate-spin" });
					$$renderer.push(`<!----> Searching...`);
				} else {
					$$renderer.push("<!--[-1-->");
					Wifi($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Search network`);
				}
				$$renderer.push(`<!--]--></button></div> `);
				if (store_get($$store_subs ??= {}, "$agentSearching", agentSearching)) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">`);
					Loader_circle($$renderer, { class: "h-6 w-6 animate-spin mx-auto text-primary" });
					$$renderer.push(`<!----> <p class="mt-3 text-sm text-muted-foreground">Searching for printers on local network...</p></div>`);
				} else if (store_get($$store_subs ??= {}, "$discoveredPrinters", discoveredPrinters).length === 0) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<div class="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">All discovered printers are connected. Run search again after adding new devices.</div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
					const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$discoveredPrinters", discoveredPrinters));
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let disc = each_array_1[$$index_1];
						$$renderer.push(`<div class="surface-muted p-5"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3">`);
						Printer($$renderer, { class: "h-5 w-5 text-primary shrink-0" });
						$$renderer.push(`<!----> <div><p class="text-sm font-semibold text-foreground">${escape_html(disc.name)}</p> <p class="text-xs text-muted-foreground">${escape_html(disc.ip)}</p> <p class="text-xs text-muted-foreground mt-1">${escape_html(disc.protocol)}</p></div></div></div> <div class="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground"><span class="rounded border border-border px-1.5 py-0.5">${escape_html(disc.supportsColor ? "Colour" : "B&W")}</span> <span class="rounded border border-border px-1.5 py-0.5">${escape_html(disc.supportsDuplex ? "Duplex" : "Simplex")}</span> <span class="rounded border border-border px-1.5 py-0.5">${escape_html(disc.paperSizes.join(", "))}</span></div> <button type="button" class="btn-app-primary w-full mt-4">`);
						Plus($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----> Connect</button></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-start gap-3">`);
				Circle_check($$renderer, { class: "h-5 w-5 text-green-600 shrink-0 mt-0.5" });
				$$renderer.push(`<!----> <div><p class="text-sm font-medium text-foreground">Secure multi-tenant architecture</p> <p class="mt-1 text-sm text-muted-foreground">Each agent belongs to one business. Printers are never exposed to the internet —
        the agent initiates an outbound encrypted connection. Tenant isolation is enforced
        at the API level (tenant_id, agent_id, device_id).</p></div></div>`);
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/printing/settings/+page.svelte
function _page($$renderer) {
	PrintingSettingsPage($$renderer, {});
}
//#endregion
export { _page as default };
