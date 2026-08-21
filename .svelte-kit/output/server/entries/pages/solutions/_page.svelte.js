import { M as clsx, N as escape_html, S as spread_props, h as ensure_array_like, l as attr_class, w as stringify } from "../../../chunks/internal.js";
import { t as goto } from "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Button } from "../../../chunks/button.js";
import { a as Card_content, c as Arrow_right, o as Badge, s as LandingLayout, t as Card } from "../../../chunks/card.js";
import { t as Circle_check } from "../../../chunks/circle-check.js";
import { n as Clock, t as Wallet } from "../../../chunks/wallet.js";
import { t as File_text } from "../../../chunks/file-text.js";
import { t as Graduation_cap } from "../../../chunks/graduation-cap.js";
import { t as Monitor } from "../../../chunks/monitor.js";
import { n as Printer, t as Shopping_bag } from "../../../chunks/shopping-bag.js";
import { t as Sparkles } from "../../../chunks/sparkles.js";
import { t as Trending_up } from "../../../chunks/trending-up.js";
import { t as Users } from "../../../chunks/users.js";
import { t as NoiseOverlay } from "../../../chunks/NoiseOverlay.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/building-2.svelte
function Building_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "building-2" },
		props,
		{ iconNode: [
			["path", { "d": "M10 12h4" }],
			["path", { "d": "M10 8h4" }],
			["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
			["path", { "d": "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" }],
			["path", { "d": "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }]
		] }
	]));
}
//#endregion
//#region src/pages/SolutionsPage.svelte
function SolutionsPage($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function handleGetStarted() {
			goto("/login");
		}
		const solutions = [
			{
				icon: Printer,
				title: "Printing & Photocopy Shops",
				tagline: "Never lose track of a print job again",
				description: "Dedicated printing shops handle dozens of jobs daily — color prints, black & white copies, laminations, and bindings. Bizflow lets you log each job with the customer name, page count, and amount in Naira.",
				features: [
					"Log print jobs by type and quantity",
					"Track daily printing revenue",
					"Customer name on every record",
					"See today's total at a glance"
				],
				stats: {
					label: "Avg. jobs per day",
					value: "40+"
				},
				color: "from-blue-500/10 to-primary/10",
				iconColor: "text-primary bg-primary/10"
			},
			{
				icon: Monitor,
				title: "Cyber Cafés & Business Centers",
				tagline: "One system for every service you offer",
				description: "Business centers combine printing, computer rentals, internet access, typing, and graphics into one operation. Bizflow supports all service types in a single transaction log, so nothing falls through the cracks.",
				features: [
					"5 service categories built-in",
					"Computer session tracking",
					"Multi-service daily totals",
					"Sidebar navigation for all modules"
				],
				stats: {
					label: "Service types",
					value: "5+"
				},
				color: "from-cyan-500/10 to-blue-500/10",
				iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
			},
			{
				icon: Graduation_cap,
				title: "Training & Education Centers",
				tagline: "Manage enrollments and session fees",
				description: "Training centers need to track course enrollments, session payments, and student records alongside their other services. Bizflow's flexible service logging handles training fees just like any other transaction.",
				features: [
					"Log training session payments",
					"Track student customers",
					"Combine with other services",
					"Monthly revenue summaries"
				],
				stats: {
					label: "Students tracked",
					value: "100+"
				},
				color: "from-purple-500/10 to-pink-500/10",
				iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10"
			},
			{
				icon: Sparkles,
				title: "Graphics & Design Studios",
				tagline: "Track creative work and client payments",
				description: "Graphics designers handle logos, banners, flyers, and custom artwork with varying prices. Log each project with the client name, description, and agreed amount — keeping your creative business financially organized.",
				features: [
					"Project-based transaction logging",
					"Client name and description fields",
					"Flexible pricing per project",
					"Portfolio of completed work via records"
				],
				stats: {
					label: "Projects per month",
					value: "25+"
				},
				color: "from-pink-500/10 to-orange-500/10",
				iconColor: "text-pink-600 dark:text-pink-400 bg-pink-500/10"
			},
			{
				icon: Building_2,
				title: "Multi-Service Hubs",
				tagline: "Scale across locations and teams",
				description: "Growing business centers with multiple staff members need a shared system everyone can use. Bizflow's manager authentication and consistent interface make it easy for any team member to log transactions.",
				features: [
					"Manager-level access control",
					"Consistent UI across modules",
					"Shared transaction history",
					"Activity stream for team visibility"
				],
				stats: {
					label: "Team members",
					value: "3–10"
				},
				color: "from-green-500/10 to-teal-500/10",
				iconColor: "text-green-600 dark:text-green-400 bg-green-500/10"
			},
			{
				icon: Users,
				title: "Freelance & Solo Operators",
				tagline: "Professional tools without the overhead",
				description: "Running a one-person business center? Bizflow gives you the same professional transaction tracking and revenue visibility as larger operations — without complexity or high costs.",
				features: [
					"Free to start",
					"No setup required",
					"Demo credentials available",
					"Works on any device"
				],
				stats: {
					label: "Setup time",
					value: "< 5 min"
				},
				color: "from-amber-500/10 to-yellow-500/10",
				iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
			}
		];
		const painPoints = [
			{
				problem: "Lost revenue from unlogged services",
				solution: "Every transaction logged with amount, customer, and service type",
				icon: Wallet
			},
			{
				problem: "No visibility into daily performance",
				solution: "Live dashboard with today's total and transaction count",
				icon: Trending_up
			},
			{
				problem: "Paper notebooks get lost or damaged",
				solution: "Digital records that persist and are always accessible",
				icon: File_text
			},
			{
				problem: "Can't remember repeat customers",
				solution: "Customer names stored on every transaction for easy lookup",
				icon: Users
			}
		];
		LandingLayout($$renderer, {
			active: "/solutions",
			children: ($$renderer) => {
				$$renderer.push(`<section class="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">`);
				NoiseOverlay($$renderer, { intensity: "medium" });
				$$renderer.push(`<!----> <div class="absolute -top-24 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 opacity-20 dark:opacity-10"><div class="absolute inset-0 rounded-[100%] bg-gradient-to-br from-primary via-purple-400 to-pink-300 blur-3xl dark:from-primary dark:via-purple-800 dark:to-pink-900"></div></div> <div class="relative z-10 mx-auto max-w-7xl px-6 text-center sm:px-8">`);
				Badge($$renderer, {
					variant: "outline",
					class: "mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary",
					children: ($$renderer) => {
						Sparkles($$renderer, { class: "h-3.5 w-3.5" });
						$$renderer.push(`<!----> Industry solutions`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> <h1 class="font-heading text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">The right fit for <span class="text-primary">your business</span></h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">Bizflow isn't generic software — it's built specifically for the service
        businesses that power communities across Africa.</p></div></section> <section class="border-y border-border/50 bg-card/50 py-16"><div class="mx-auto max-w-7xl px-6 sm:px-8"><p class="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-8">Common challenges we solve</p> <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
				const each_array = ensure_array_like(painPoints);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let item = each_array[$$index];
					$$renderer.push(`<div class="rounded-xl border border-border/60 bg-background p-5">`);
					item.icon($$renderer, { class: "h-5 w-5 text-primary mb-3" });
					$$renderer.push(`<!----> <p class="text-sm font-medium text-foreground mb-2">${escape_html(item.problem)}</p> <p class="text-xs leading-relaxed text-muted-foreground flex items-start gap-1.5">`);
					Circle_check($$renderer, { class: "h-3.5 w-3.5 shrink-0 text-green-500 mt-0.5" });
					$$renderer.push(`<!----> ${escape_html(item.solution)}</p></div>`);
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="py-24"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="space-y-8"><!--[-->`);
				const each_array_1 = ensure_array_like(solutions);
				for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
					let solution = each_array_1[i];
					$$renderer.push(`<div${attr_class(`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${stringify(solution.color)}`)}>`);
					NoiseOverlay($$renderer, {
						intensity: "light",
						class: "rounded-2xl"
					});
					$$renderer.push(`<!----> <div class="relative z-10 grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-10"><div${attr_class(clsx(i % 2 === 1 ? "lg:order-2" : ""))}><div${attr_class(`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stringify(solution.iconColor)}`)}>`);
					solution.icon($$renderer, { class: "h-6 w-6" });
					$$renderer.push(`<!----></div> <h2 class="font-heading text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">${escape_html(solution.title)}</h2> <p class="mt-1 text-sm font-medium text-primary">${escape_html(solution.tagline)}</p> <p class="mt-4 text-sm leading-relaxed text-muted-foreground">${escape_html(solution.description)}</p> <ul class="mt-6 space-y-2.5"><!--[-->`);
					const each_array_2 = ensure_array_like(solution.features);
					for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
						let feature = each_array_2[$$index_1];
						$$renderer.push(`<li class="flex items-center gap-2 text-sm text-foreground">`);
						Circle_check($$renderer, { class: "h-4 w-4 shrink-0 text-primary" });
						$$renderer.push(`<!----> ${escape_html(feature)}</li>`);
					}
					$$renderer.push(`<!--]--></ul></div> <div${attr_class(clsx(i % 2 === 1 ? "lg:order-1" : ""))}>`);
					Card($$renderer, {
						class: "border-border/60 bg-card/80 backdrop-blur-sm",
						children: ($$renderer) => {
							Card_content($$renderer, {
								class: "p-6",
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex items-center justify-between mb-6"><div><p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Key metric</p> <p class="font-heading text-3xl font-black tracking-[-0.04em] text-primary">${escape_html(solution.stats.value)}</p></div> `);
									Badge($$renderer, {
										variant: "outline",
										class: "text-xs",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(solution.stats.label)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----></div> <div class="space-y-3"><p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Sample transactions</p> <!--[-->`);
									const each_array_3 = ensure_array_like([{
										service: "Service",
										customer: "Customer",
										amount: "₦4,500"
									}, {
										service: "Service",
										customer: "Customer",
										amount: "₦2,800"
									}]);
									for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
										let tx = each_array_3[$$index_2];
										$$renderer.push(`<div class="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 px-3 py-2.5"><div class="flex items-center gap-2">`);
										Shopping_bag($$renderer, { class: "h-4 w-4 text-primary" });
										$$renderer.push(`<!----> <div><p class="text-sm font-medium">${escape_html(tx.service)}</p> <p class="text-xs text-muted-foreground">${escape_html(tx.customer)}</p></div></div> <p class="text-sm font-semibold">${escape_html(tx.amount)}</p></div>`);
									}
									$$renderer.push(`<!--]--></div> <div class="mt-4 flex items-center gap-2 text-xs text-muted-foreground">`);
									Clock($$renderer, { class: "h-3.5 w-3.5" });
									$$renderer.push(`<!----> Updated in real-time</div>`);
								},
								$$slots: { default: true }
							});
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></div></div>`);
				}
				$$renderer.push(`<!--]--></div></div></section> <section class="relative overflow-hidden border-t border-border/50 py-20">`);
				NoiseOverlay($$renderer, { intensity: "medium" });
				$$renderer.push(`<!----> <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-purple-400/5"></div> <div class="relative z-10 mx-auto max-w-3xl px-6 text-center sm:px-8"><h2 class="font-heading text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">Find your perfect setup</h2> <p class="mt-4 text-lg text-muted-foreground">No matter your business type, Bizflow adapts to how you work. Start free
        and see the difference in your first day.</p> <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">`);
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
					onclick: () => goto("/features"),
					children: ($$renderer) => {
						$$renderer.push(`<!---->View all features`);
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
//#region src/routes/solutions/+page.svelte
function _page($$renderer) {
	SolutionsPage($$renderer, {});
}
//#endregion
export { _page as default };
