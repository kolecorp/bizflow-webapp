import { N as escape_html, S as spread_props, h as ensure_array_like, l as attr_class, w as stringify } from "../../../chunks/internal.js";
import { t as goto } from "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Button } from "../../../chunks/button.js";
import { a as Card_content, c as Arrow_right, i as Card_description, n as Card_title, o as Badge, r as Card_header, s as LandingLayout, t as Card } from "../../../chunks/card.js";
import { t as Bot } from "../../../chunks/bot.js";
import { n as Chart_column, t as Layout_grid } from "../../../chunks/layout-grid.js";
import { t as Circle_check } from "../../../chunks/circle-check.js";
import { n as Clock, t as Wallet } from "../../../chunks/wallet.js";
import { t as File_text } from "../../../chunks/file-text.js";
import { t as Monitor } from "../../../chunks/monitor.js";
import { t as Package } from "../../../chunks/package.js";
import { n as Printer, t as Shopping_bag } from "../../../chunks/shopping-bag.js";
import { t as Sparkles } from "../../../chunks/sparkles.js";
import { t as Trending_up } from "../../../chunks/trending-up.js";
import { t as Users } from "../../../chunks/users.js";
import { t as NoiseOverlay } from "../../../chunks/NoiseOverlay.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/shield.svelte
function Shield($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "shield" },
		props,
		{ iconNode: [["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/zap.svelte
function Zap($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "zap" },
		props,
		{ iconNode: [["path", { "d": "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" }]] }
	]));
}
//#endregion
//#region src/pages/FeaturesPage.svelte
function FeaturesPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function handleGetStarted() {
			goto("/login");
		}
		const features = [
			{
				icon: Shopping_bag,
				title: "Transaction Logging",
				description: "Record every service sale in seconds. Select the service type, enter the customer name, amount in Naira, and optional notes.",
				benefits: [
					"5 service categories",
					"Instant daily totals",
					"Delete & edit records"
				],
				color: "text-primary bg-primary/10",
				featured: true
			},
			{
				icon: Chart_column,
				title: "Sales Dashboard",
				description: "A real-time overview of your business health. See resolved issues, active automations, and system status at a glance.",
				benefits: [
					"Live stats cards",
					"Activity stream",
					"Task tracking"
				],
				color: "text-green-600 dark:text-green-400 bg-green-500/10",
				featured: false
			},
			{
				icon: Layout_grid,
				title: "Unified Control Panel",
				description: "Navigate between dashboard, transactions, computers, services, and AI tracking from a consistent sidebar layout.",
				benefits: [
					"Sidebar navigation",
					"Sticky headers",
					"Dark mode support"
				],
				color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
				featured: false
			},
			{
				icon: Monitor,
				title: "Computer Management",
				description: "Track which computers are in use, session durations, and rental fees for your cyber café or business center.",
				benefits: [
					"Session tracking",
					"Status overview",
					"Revenue per machine"
				],
				color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
				featured: false
			},
			{
				icon: Package,
				title: "Inventory Tracking",
				description: "Monitor paper stock, ink levels, and consumables. Get alerts before you run out during a busy day.",
				benefits: [
					"Stock levels",
					"Low-stock alerts",
					"Usage history"
				],
				color: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
				featured: false
			},
			{
				icon: Users,
				title: "Customer Records",
				description: "Keep a history of every customer interaction. Know who ordered what, how often they visit, and their total spend.",
				benefits: [
					"Customer history",
					"Repeat visitor tracking",
					"Contact notes"
				],
				color: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
				featured: false
			},
			{
				icon: Wallet,
				title: "Expense Management",
				description: "Log business expenses alongside revenue. Track ink purchases, paper stock, maintenance, and utility costs.",
				benefits: [
					"Expense categories",
					"Monthly summaries",
					"Profit calculation"
				],
				color: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
				featured: false
			},
			{
				icon: File_text,
				title: "Reports & Analytics",
				description: "Generate sales reports, inventory summaries, and period comparisons to understand what's driving your revenue.",
				benefits: [
					"Sales reports",
					"Inventory reports",
					"Export ready"
				],
				color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
				featured: false
			},
			{
				icon: Bot,
				title: "AI Task Tracking",
				description: "A dedicated tracker for features and improvements built with AI assistance. Transparent development progress for your team.",
				benefits: [
					"Task board",
					"AI-authored tags",
					"Progress timeline"
				],
				color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
				featured: true
			},
			{
				icon: Zap,
				title: "Workflow Automations",
				description: "Set up automated workflows to reduce manual work. Trigger actions when transactions are logged or thresholds are hit.",
				benefits: [
					"Rule builder",
					"Auto-notifications",
					"Time savings"
				],
				color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
				featured: false
			},
			{
				icon: Shield,
				title: "Secure Access",
				description: "Manager-level authentication keeps your business data private. Sign in with credentials and sign out when done.",
				benefits: [
					"Session persistence",
					"Route protection",
					"Sign-out control"
				],
				color: "text-red-600 dark:text-red-400 bg-red-500/10",
				featured: false
			},
			{
				icon: Clock,
				title: "Real-time Updates",
				description: "Transactions appear instantly in your list and daily total updates the moment you save. No refresh needed.",
				benefits: [
					"Instant feedback",
					"Live totals",
					"Time stamps"
				],
				color: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
				featured: false
			}
		];
		const serviceTypes = [
			{
				icon: Printer,
				label: "Printing & Photocopy"
			},
			{
				icon: File_text,
				label: "Typing & Data Entry"
			},
			{
				icon: Sparkles,
				label: "Graphics Design"
			},
			{
				icon: Trending_up,
				label: "Training Sessions"
			},
			{
				icon: Shopping_bag,
				label: "Other Services"
			}
		];
		LandingLayout($$renderer, {
			active: "/features",
			children: ($$renderer) => {
				$$renderer.push(`<section class="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">`);
				NoiseOverlay($$renderer, { intensity: "medium" });
				$$renderer.push(`<!----> <div class="absolute -top-24 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 opacity-20 dark:opacity-10"><div class="absolute inset-0 rounded-[100%] bg-gradient-to-r from-primary to-blue-300 blur-3xl dark:to-blue-900"></div></div> <div class="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">`);
				Badge($$renderer, {
					variant: "outline",
					class: "mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary",
					children: ($$renderer) => {
						Sparkles($$renderer, { class: "h-3.5 w-3.5" });
						$$renderer.push(`<!----> Full feature set`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <h1 class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">Powerful tools for <span class="text-primary">every operation</span></h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">From logging a ₦500 print job to generating monthly revenue reports — Bizflow
        covers every part of running a modern business center.</p></div></section> <section class="border-y border-border/50 bg-card/50 py-8"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8"><!--[-->`);
				const each_array = ensure_array_like(serviceTypes);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let service = each_array[$$index];
					$$renderer.push(`<div class="flex items-center gap-2 text-sm text-muted-foreground">`);
					service.icon($$renderer, { class: "h-4 w-4 text-primary" });
					$$renderer.push(`<!----> ${escape_html(service.label)}</div>`);
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="py-24"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array_1 = ensure_array_like(features);
				for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
					let feature = each_array_1[$$index_2];
					Card($$renderer, {
						class: `border-border/60 bg-card transition hover:shadow-md hover:border-primary/20 ${feature.featured ? "ring-1 ring-primary/20" : ""}`,
						children: ($$renderer) => {
							Card_header($$renderer, {
								children: ($$renderer) => {
									if (feature.featured) {
										$$renderer.push("<!--[0-->");
										Badge($$renderer, {
											class: "mb-3 bg-primary/10 text-primary text-[10px]",
											children: ($$renderer) => {
												$$renderer.push(`<!---->Popular`);
											},
											$$slots: { default: true }
										});
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]--> <div${attr_class(`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${stringify(feature.color)}`)}>`);
									feature.icon($$renderer, { class: "h-5 w-5" });
									$$renderer.push(`<!----></div> `);
									Card_title($$renderer, {
										class: "font-heading text-lg font-bold tracking-[-0.03em]",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(feature.title)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Card_description($$renderer, {
										class: "text-sm leading-relaxed",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(feature.description)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Card_content($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<ul class="space-y-2"><!--[-->`);
									const each_array_2 = ensure_array_like(feature.benefits);
									for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
										let benefit = each_array_2[$$index_1];
										$$renderer.push(`<li class="flex items-center gap-2 text-sm text-muted-foreground">`);
										Circle_check($$renderer, { class: "h-3.5 w-3.5 shrink-0 text-primary" });
										$$renderer.push(`<!----> ${escape_html(benefit)}</li>`);
									}
									$$renderer.push(`<!--]--></ul>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="relative overflow-hidden border-t border-border/50 py-20">`);
				NoiseOverlay($$renderer, { intensity: "light" });
				$$renderer.push(`<!----> <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8"><h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">See it in action</h2> <p class="mt-4 text-lg text-muted-foreground">Sign in with demo credentials and explore the full dashboard, transaction
        logging, and AI tracking — no setup required.</p> `);
				Button($$renderer, {
					onclick: handleGetStarted,
					size: "lg",
					class: "mt-8 h-12 px-8 text-sm font-semibold",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Try Bizflow free `);
						Arrow_right($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></section>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/routes/features/+page.svelte
function _page($$renderer) {
	FeaturesPage($$renderer, {});
}
//#endregion
export { _page as default };
