import { C as store_get, M as clsx, N as escape_html, S as spread_props, T as unsubscribe_stores, d as attributes, f as bind_props, h as ensure_array_like, j as attr, l as attr_class } from "../../../../chunks/internal.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/label.js";
import { t as authStore } from "../../../../chunks/auth.js";
import { t as cn } from "../../../../chunks/utils2.js";
import { n as canAccess, o as Message_square, t as AppShell } from "../../../../chunks/AppShell.js";
import { t as Ticket } from "../../../../chunks/ticket.js";
import "../../../../chunks/businessData.js";
import { c as supportTickets, i as chatMessages, l as ticketComments, r as chatChannels, s as sendChatMessage } from "../../../../chunks/communications.js";
import { t as PageHeader } from "../../../../chunks/PageHeader.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/send.svelte
function Send($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "send" },
		props,
		{ iconNode: [["path", { "d": "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }], ["path", { "d": "m21.854 2.147-10.94 10.939" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/textarea/textarea.svelte
function Textarea($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, class: className, "data-slot": dataSlot = "textarea", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<textarea${attributes({
			"data-slot": dataSlot,
			class: clsx(cn("rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)),
			...restProps
		})}>`);
		const $$body = escape_html(value);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea>`);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/pages/SupportPage.svelte
function SupportPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let userRole, channelMessages, selectedTicket;
		let selectedChannelId = "ch-team";
		let chatDraft = "";
		let selectedTicketId = "TKT-1042";
		function sendMessage() {
			if (!chatDraft.trim()) return;
			sendChatMessage(selectedChannelId, chatDraft);
			chatDraft = "";
		}
		function handleChatKeydown(event) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				sendMessage();
			}
		}
		$: userRole = store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "staff";
		$: canAccess(userRole, "support.manage");
		$: channelMessages = store_get($$store_subs ??= {}, "$chatMessages", chatMessages).filter((m) => m.channelId === selectedChannelId);
		$: selectedTicket = store_get($$store_subs ??= {}, "$supportTickets", supportTickets).find((t) => t.id === selectedTicketId) ?? null;
		$: selectedTicket && store_get($$store_subs ??= {}, "$ticketComments", ticketComments).filter((c) => c.ticketId === selectedTicket.id);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			AppShell($$renderer, {
				children: ($$renderer) => {
					PageHeader($$renderer, {
						eyebrow: "Collaboration",
						title: "Support & staff chat",
						description: "RPC-backed staff messaging, customer ticket resolution, and coordination across workstations."
					});
					$$renderer.push(`<!----> <div class="flex flex-wrap gap-2"><button type="button"${attr_class(`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition bg-foreground text-background`)}>`);
					Message_square($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Staff chat</button> <button type="button"${attr_class(`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition border border-border bg-background text-muted-foreground hover:text-foreground`)}>`);
					Ticket($$renderer, { class: "h-4 w-4" });
					$$renderer.push(`<!----> Customer tickets <span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">${escape_html(store_get($$store_subs ??= {}, "$supportTickets", supportTickets).filter((t) => t.status !== "resolved" && t.status !== "closed").length)}</span></button></div> `);
					{
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]"><div class="surface-panel p-4 space-y-2"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Channels</p> <!--[-->`);
						const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$chatChannels", chatChannels));
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let channel = each_array[$$index];
							$$renderer.push(`<button type="button"${attr_class(`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${selectedChannelId === channel.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`)}>`);
							Message_square($$renderer, { class: "h-4 w-4 shrink-0" });
							$$renderer.push(`<!----> <span class="truncate">${escape_html(channel.name)}</span></button>`);
						}
						$$renderer.push(`<!--]--></div> <div class="surface-panel flex min-h-[420px] flex-col"><div class="border-b border-border px-4 py-3"><p class="font-semibold text-foreground">${escape_html(store_get($$store_subs ??= {}, "$chatChannels", chatChannels).find((c) => c.id === selectedChannelId)?.name ?? "Chat")}</p> <p class="text-xs text-muted-foreground">Messages route through Bizflow RPC when workstation agents are online.</p></div> <div class="flex-1 space-y-3 overflow-y-auto p-4"><!--[-->`);
						const each_array_1 = ensure_array_like(channelMessages);
						for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
							let message = each_array_1[$$index_1];
							$$renderer.push(`<div class="flex gap-3"><div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">${escape_html(message.senderName.charAt(0))}</div> <div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><span class="text-sm font-medium text-foreground">${escape_html(message.senderName)}</span> <span class="text-xs text-muted-foreground">${escape_html(message.sentAt)}</span> `);
							if (message.rpcId) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">${escape_html(message.rpcId)}</span>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <p class="mt-1 text-sm text-foreground">${escape_html(message.body)}</p></div></div>`);
						}
						$$renderer.push(`<!--]--></div> <div class="border-t border-border p-4"><div class="flex gap-2">`);
						Textarea($$renderer, {
							onkeydown: handleChatKeydown,
							placeholder: "Message the team…",
							rows: 2,
							class: "min-h-[60px] resize-none",
							get value() {
								return chatDraft;
							},
							set value($$value) {
								chatDraft = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> <button type="button"${attr("disabled", !chatDraft.trim(), true)} class="btn-app-primary self-end">`);
						Send($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!----></button></div></div></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/(app)/support/+page.svelte
function _page($$renderer) {
	SupportPage($$renderer, {});
}
//#endregion
export { _page as default };
