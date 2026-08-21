import { M as clsx, N as escape_html, S as spread_props, d as attributes, f as bind_props, h as ensure_array_like, l as attr_class, m as element } from "./internal.js";
import { t as goto } from "./client.js";
import "./navigation.js";
import { r as derivedMode, t as Icon } from "./Icon.js";
import { t as cn } from "./utils2.js";
import { t as Button } from "./button.js";
import { n as Moon, t as Sun_medium } from "./sun-medium.js";
import { tv } from "tailwind-variants";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/arrow-right.svelte
function Arrow_right($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-right" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]] }
	]));
}
//#endregion
//#region src/lib/components/landing/LandingNav.svelte
function LandingNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { active = "" } = $$props;
		function handleGetStarted() {
			goto("/login");
		}
		const navLinks = [{
			label: "Features",
			path: "/features"
		}, {
			label: "Solutions",
			path: "/solutions"
		}];
		$$renderer.push(`<nav class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"><div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8"><button type="button" class="flex items-center gap-3 transition hover:opacity-80"><div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"><img src="/cafe-logo.png" alt="Bizflow logo" class="h-7 w-7 object-contain"/></div> <span class="font-heading text-xl font-black tracking-[-0.04em] text-foreground">Bizflow</span></button> <div class="hidden items-center gap-8 md:flex"><!--[-->`);
		const each_array = ensure_array_like(navLinks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let link = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`text-sm font-medium transition ${active === link.path ? "text-primary" : "text-muted-foreground hover:text-foreground"}`)}>${escape_html(link.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex items-center gap-3"><button type="button" aria-label="Toggle theme" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted">`);
		if (derivedMode.current === "dark") {
			$$renderer.push("<!--[0-->");
			Sun_medium($$renderer, { class: "h-4 w-4" });
		} else {
			$$renderer.push("<!--[-1-->");
			Moon($$renderer, { class: "h-4 w-4" });
		}
		$$renderer.push(`<!--]--></button> <button type="button" class="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block">Sign in</button> `);
		Button($$renderer, {
			onclick: handleGetStarted,
			size: "sm",
			class: "h-9 px-4",
			children: ($$renderer) => {
				$$renderer.push(`<!---->Get Started`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div></div></nav>`);
	});
}
//#endregion
//#region src/lib/components/landing/LandingFooter.svelte
function LandingFooter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const footerLinks = [
			{
				label: "Features",
				path: "/features"
			},
			{
				label: "Solutions",
				path: "/solutions"
			},
			{
				label: "Sign in",
				path: "/login"
			}
		];
		$$renderer.push(`<footer class="border-t border-border bg-card/50 py-12"><div class="mx-auto max-w-7xl px-6 sm:px-8"><div class="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div class="flex items-center gap-3"><div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"><img src="/cafe-logo.png" alt="Bizflow logo" class="h-6 w-6 object-contain"/></div> <div><p class="font-heading text-sm font-black tracking-[-0.04em] text-foreground">Bizflow</p> <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Business center management</p></div></div> <div class="flex flex-wrap gap-6"><!--[-->`);
		const each_array = ensure_array_like(footerLinks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let link = each_array[$$index];
			$$renderer.push(`<button type="button" class="text-sm text-muted-foreground transition hover:text-foreground">${escape_html(link.label)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center"><p class="text-xs text-muted-foreground">© 2026 Bizflow. Built for business centers across Africa.</p> <p class="text-xs text-muted-foreground">Printing · Typing · Graphics · Training</p></div></div></footer>`);
	});
}
//#endregion
//#region src/lib/components/landing/LandingLayout.svelte
function LandingLayout($$renderer, $$props) {
	let { active = "", children } = $$props;
	$$renderer.push(`<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">`);
	LandingNav($$renderer, { active });
	$$renderer.push(`<!----> <main>`);
	children?.($$renderer);
	$$renderer.push(`<!----></main> `);
	LandingFooter($$renderer, {});
	$$renderer.push(`<!----></div>`);
}
//#endregion
//#region src/lib/components/ui/badge/badge.svelte
var badgeVariants = tv({
	base: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, href, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		element($$renderer, href ? "a" : "span", () => {
			$$renderer.push(`${attributes({
				"data-slot": "badge",
				href,
				class: clsx(cn(badgeVariants({ variant }), className)),
				...restProps
			})}`);
		}, () => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-content.svelte
function Card_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-content",
			class: clsx(cn("px-(--card-spacing)", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-description.svelte
function Card_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<p${attributes({
			"data-slot": "card-description",
			class: clsx(cn("text-sm text-muted-foreground", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></p>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-header.svelte
function Card_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-header",
			class: clsx(cn("gap-1 rounded-t-xl px-(--card-spacing) [.border-b]:pb-(--card-spacing) group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card-title.svelte
function Card_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card-title",
			class: clsx(cn("text-base leading-snug font-medium group-data-[size=sm]/card:text-sm", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/card/card.svelte
function Card($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, size = "default", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "card",
			"data-size": size,
			class: clsx(cn("gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
export { Card_content as a, Arrow_right as c, Card_description as i, Card_title as n, Badge as o, Card_header as r, LandingLayout as s, Card as t };
