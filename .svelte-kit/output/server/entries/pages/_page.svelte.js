import { N as escape_html, h as ensure_array_like, l as attr_class, w as stringify } from "../../chunks/internal.js";
import { t as goto } from "../../chunks/client.js";
import "../../chunks/navigation.js";
import { t as Button } from "../../chunks/button.js";
import { c as Arrow_right, i as Card_description, n as Card_title, o as Badge, r as Card_header, s as LandingLayout, t as Card } from "../../chunks/card.js";
import { t as Bot } from "../../chunks/bot.js";
import { n as Chart_column, t as Layout_grid } from "../../chunks/layout-grid.js";
import { t as Circle_check } from "../../chunks/circle-check.js";
import { t as Graduation_cap } from "../../chunks/graduation-cap.js";
import { t as Monitor } from "../../chunks/monitor.js";
import { n as Printer, t as Shopping_bag } from "../../chunks/shopping-bag.js";
import { t as Sparkles } from "../../chunks/sparkles.js";
import { t as Trending_up } from "../../chunks/trending-up.js";
import { t as Users } from "../../chunks/users.js";
import { t as NoiseOverlay } from "../../chunks/NoiseOverlay.js";
//#region src/pages/LandingPage.svelte
function LandingPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function handleGetStarted() {
			goto("/login");
		}
		const stats = [
			{
				value: "5+",
				label: "Service types tracked"
			},
			{
				value: "₦",
				label: "Naira-native pricing"
			},
			{
				value: "Real-time",
				label: "Daily sales totals"
			},
			{
				value: "1-click",
				label: "Transaction logging"
			}
		];
		const featureHighlights = [
			{
				icon: Shopping_bag,
				title: "Transaction Logging",
				description: "Record printing, typing, graphics, and training services in seconds with customer details and amounts.",
				color: "text-primary bg-primary/10"
			},
			{
				icon: Chart_column,
				title: "Sales Dashboard",
				description: "See today's revenue, active services, and business health from a single control panel.",
				color: "text-green-600 dark:text-green-400 bg-green-500/10"
			},
			{
				icon: Bot,
				title: "AI Task Tracking",
				description: "Monitor features and improvements built with AI — transparent development progress for your team.",
				color: "text-blue-600 dark:text-blue-400 bg-blue-500/10"
			}
		];
		const solutions = [
			{
				icon: Printer,
				title: "Printing Shops",
				description: "Track every print job, photocopy, and binding service with customer names and amounts."
			},
			{
				icon: Monitor,
				title: "Cyber Cafés",
				description: "Manage computer rentals, internet sessions, and bundled service packages effortlessly."
			},
			{
				icon: Graduation_cap,
				title: "Training Centers",
				description: "Log course enrollments, session fees, and student payments in one organized system."
			}
		];
		const steps = [
			{
				step: "01",
				title: "Sign in",
				description: "Use your manager credentials to access your dashboard."
			},
			{
				step: "02",
				title: "Log services",
				description: "Record each transaction — printing, typing, design, or training."
			},
			{
				step: "03",
				title: "Track growth",
				description: "Watch daily totals climb and spot trends in your revenue."
			}
		];
		LandingLayout($$renderer, {
			children: ($$renderer) => {
				$$renderer.push(`<section class="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">`);
				NoiseOverlay($$renderer, { intensity: "medium" });
				$$renderer.push(`<!----> <div class="absolute -top-32 left-1/2 -z-10 h-[36rem] w-[72rem] -translate-x-1/2 opacity-25 dark:opacity-15"><div class="absolute inset-0 rounded-[100%] bg-gradient-to-br from-primary via-blue-400 to-cyan-300 blur-3xl dark:from-primary dark:via-blue-800 dark:to-blue-900"></div></div> <div class="absolute right-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div> <div class="absolute bottom-0 left-1/4 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"></div> <div class="relative z-10 mx-auto max-w-7xl px-6 sm:px-8"><div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"><div>`);
				Badge($$renderer, {
					variant: "outline",
					class: "mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary",
					children: ($$renderer) => {
						Sparkles($$renderer, { class: "h-3.5 w-3.5" });
						$$renderer.push(`<!----> Built for African business centers`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <h1 class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">Run your business center <span class="text-primary">like a pro</span></h1> <p class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">Bizflow helps printing shops, cyber cafés, and training centers
            track every service, every customer, and every naira — all from one
            sleek dashboard.</p> <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">`);
				Button($$renderer, {
					onclick: handleGetStarted,
					size: "lg",
					class: "h-12 px-8 text-sm font-semibold",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Start for free `);
						Arrow_right($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "outline",
					size: "lg",
					class: "h-12 px-8 text-sm font-semibold",
					onclick: () => goto("/features"),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Explore features`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2"><!--[-->`);
				const each_array = ensure_array_like([
					"Printing",
					"Typing",
					"Graphics",
					"Training"
				]);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let tag = each_array[$$index];
					$$renderer.push(`<span class="flex items-center gap-1.5 text-sm text-muted-foreground">`);
					Circle_check($$renderer, { class: "h-4 w-4 text-primary" });
					$$renderer.push(`<!----> ${escape_html(tag)}</span>`);
				}
				$$renderer.push(`<!--]--></div></div> <div class="relative"><div class="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_rgba(0,82,204,0.12)]">`);
				NoiseOverlay($$renderer, {
					intensity: "light",
					class: "rounded-2xl"
				});
				$$renderer.push(`<!----> <div class="relative z-10 p-5 sm:p-6"><div class="mb-4 flex items-center justify-between"><div><p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Today's overview</p> <p class="font-heading text-2xl font-black tracking-[-0.04em] text-foreground">₦13,700</p></div> `);
				Badge($$renderer, {
					class: "bg-green-500/10 text-green-600 dark:text-green-400",
					children: ($$renderer) => {
						Trending_up($$renderer, { class: "h-3 w-3" });
						$$renderer.push(`<!----> +18%`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div> <div class="grid grid-cols-3 gap-3 mb-5"><!--[-->`);
				const each_array_1 = ensure_array_like([
					{
						label: "Transactions",
						value: "12",
						icon: Shopping_bag
					},
					{
						label: "Services",
						value: "5",
						icon: Layout_grid
					},
					{
						label: "Customers",
						value: "8",
						icon: Users
					}
				]);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let stat = each_array_1[$$index_1];
					$$renderer.push(`<div class="rounded-xl border border-border/60 bg-background/80 p-3">`);
					stat.icon($$renderer, { class: "h-4 w-4 text-primary mb-1.5" });
					$$renderer.push(`<!----> <p class="font-heading text-lg font-black tracking-[-0.04em]">${escape_html(stat.value)}</p> <p class="text-[10px] text-muted-foreground">${escape_html(stat.label)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="space-y-2"><p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Recent transactions</p> <!--[-->`);
				const each_array_2 = ensure_array_like([{
					service: "Printing",
					customer: "Adebayo T.",
					amount: "₦5,500"
				}, {
					service: "Typing",
					customer: "Grace C.",
					amount: "₦8,200"
				}]);
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let tx = each_array_2[$$index_2];
					$$renderer.push(`<div class="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2.5"><div><p class="text-sm font-medium text-foreground">${escape_html(tx.service)}</p> <p class="text-xs text-muted-foreground">${escape_html(tx.customer)}</p></div> <p class="text-sm font-semibold text-foreground">${escape_html(tx.amount)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div></div></div> <div class="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card px-4 py-3 shadow-lg"><div class="flex items-center gap-2"><div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> <p class="text-xs font-medium text-foreground">Live tracking active</p></div></div></div></div></div></section> <section class="border-y border-border/50 bg-card/50 py-10"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="grid grid-cols-2 gap-6 sm:grid-cols-4"><!--[-->`);
				const each_array_3 = ensure_array_like(stats);
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let stat = each_array_3[$$index_3];
					$$renderer.push(`<div class="text-center sm:text-left"><p class="font-heading text-2xl font-black tracking-[-0.04em] text-primary">${escape_html(stat.value)}</p> <p class="mt-1 text-sm text-muted-foreground">${escape_html(stat.label)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="py-24"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="mx-auto max-w-2xl text-center mb-14"><p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Core features</p> <h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">Everything your center needs</h2> <p class="mt-4 text-lg text-muted-foreground">Stop juggling notebooks and spreadsheets. Bizflow keeps your operations
          organized and your revenue visible.</p></div> <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
				const each_array_4 = ensure_array_like(featureHighlights);
				for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
					let feature = each_array_4[$$index_4];
					Card($$renderer, {
						class: "border-border/60 bg-card transition hover:shadow-md hover:border-primary/20",
						children: ($$renderer) => {
							Card_header($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div${attr_class(`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${stringify(feature.color)}`)}>`);
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
						},
						$$slots: { default: true }
					});
				}
				$$renderer.push(`<!--]--></div> <div class="mt-10 text-center">`);
				Button($$renderer, {
					variant: "outline",
					onclick: () => goto("/features"),
					class: "gap-2",
					children: ($$renderer) => {
						$$renderer.push(`<!---->View all features `);
						Arrow_right($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div></section> <section class="relative overflow-hidden border-t border-border/50 bg-muted/30 py-24">`);
				NoiseOverlay($$renderer, { intensity: "light" });
				$$renderer.push(`<!----> <div class="relative z-10 mx-auto max-w-7xl px-6 sm:px-8"><div class="mx-auto max-w-2xl text-center mb-14"><p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Solutions</p> <h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">Built for your type of business</h2> <p class="mt-4 text-lg text-muted-foreground">Whether you run a print shop or a full business center, Bizflow adapts
          to how you work.</p></div> <div class="grid gap-6 sm:grid-cols-3"><!--[-->`);
				const each_array_5 = ensure_array_like(solutions);
				for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
					let solution = each_array_5[$$index_5];
					$$renderer.push(`<div class="group rounded-2xl border border-border/60 bg-card p-8 transition hover:border-primary/30 hover:shadow-lg"><div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">`);
					solution.icon($$renderer, { class: "h-6 w-6" });
					$$renderer.push(`<!----></div> <h3 class="font-heading text-xl font-bold tracking-[-0.03em] text-foreground">${escape_html(solution.title)}</h3> <p class="mt-3 text-sm leading-relaxed text-muted-foreground">${escape_html(solution.description)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div> <div class="mt-10 text-center">`);
				Button($$renderer, {
					variant: "outline",
					onclick: () => goto("/solutions"),
					class: "gap-2",
					children: ($$renderer) => {
						$$renderer.push(`<!---->See all solutions `);
						Arrow_right($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div></section> <section class="py-24"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="mx-auto max-w-2xl text-center mb-14"><p class="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">How it works</p> <h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">Up and running in minutes</h2></div> <div class="grid gap-8 sm:grid-cols-3"><!--[-->`);
				const each_array_6 = ensure_array_like(steps);
				for (let i = 0, $$length = each_array_6.length; i < $$length; i++) {
					let item = each_array_6[i];
					$$renderer.push(`<div class="relative">`);
					if (i < steps.length - 1) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="absolute top-8 left-full hidden h-px w-full -translate-x-1/2 bg-border sm:block"></div>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="text-center sm:text-left"><p class="font-heading text-4xl font-black tracking-[-0.06em] text-primary/30">${escape_html(item.step)}</p> <h3 class="mt-2 font-heading text-xl font-bold tracking-[-0.03em] text-foreground">${escape_html(item.title)}</h3> <p class="mt-2 text-sm leading-relaxed text-muted-foreground">${escape_html(item.description)}</p></div></div>`);
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="relative overflow-hidden border-t border-border/50 py-24">`);
				NoiseOverlay($$renderer, { intensity: "medium" });
				$$renderer.push(`<!----> <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-cyan-400/5"></div> <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8"><h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">Ready to modernize your business center?</h2> <p class="mt-4 text-lg text-muted-foreground">Join business centers already using Bizflow to track services, grow
        revenue, and run operations with clarity.</p> <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">`);
				Button($$renderer, {
					onclick: handleGetStarted,
					size: "lg",
					class: "h-12 px-8 text-sm font-semibold",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Get started free `);
						Arrow_right($$renderer, { class: "h-4 w-4" });
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Button($$renderer, {
					variant: "outline",
					size: "lg",
					class: "h-12 px-8 text-sm font-semibold",
					onclick: () => goto("/solutions"),
					children: ($$renderer) => {
						$$renderer.push(`<!---->Find your solution`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----></div></div></section>`);
			},
			$$slots: { default: true }
		});
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer) {
	LandingPage($$renderer, {});
}
//#endregion
export { _page as default };
