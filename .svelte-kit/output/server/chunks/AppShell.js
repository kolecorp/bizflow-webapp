import { C as store_get, N as escape_html, S as spread_props, T as unsubscribe_stores, U as writable, X as fallback, f as bind_props, h as ensure_array_like, j as attr, l as attr_class, p as derived } from "./internal.js";
import "./exports.js";
import { t as goto } from "./client.js";
import "./navigation.js";
import { t as page } from "./state.js";
import { r as derivedMode, t as Icon } from "./Icon.js";
import { r as signOut, t as authStore } from "./auth.js";
import { n as Chart_column, t as Layout_grid } from "./layout-grid.js";
import { t as Monitor } from "./monitor.js";
import { n as Moon, t as Sun_medium } from "./sun-medium.js";
import { t as Package } from "./package.js";
import { n as Printer, t as Shopping_bag } from "./shopping-bag.js";
import { n as notificationUnreadCount } from "./notifications.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/bell.svelte
function Bell($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bell" },
		props,
		{ iconNode: [["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }], ["path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/briefcase-business.svelte
function Briefcase_business($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "briefcase-business" },
		props,
		{ iconNode: [
			["path", { "d": "M12 12h.01" }],
			["path", { "d": "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" }],
			["path", { "d": "M22 13a18.15 18.15 0 0 1-20 0" }],
			["rect", {
				"width": "20",
				"height": "14",
				"x": "2",
				"y": "6",
				"rx": "2"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/lock.svelte
function Lock($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "lock" },
		props,
		{ iconNode: [["rect", {
			"width": "18",
			"height": "11",
			"x": "3",
			"y": "11",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/log-out.svelte
function Log_out($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "log-out" },
		props,
		{ iconNode: [
			["path", { "d": "m16 17 5-5-5-5" }],
			["path", { "d": "M21 12H9" }],
			["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/message-square.svelte
function Message_square($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "message-square" },
		props,
		{ iconNode: [["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/panel-left-close.svelte
function Panel_left_close($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "panel-left-close" },
		props,
		{ iconNode: [
			["rect", {
				"width": "18",
				"height": "18",
				"x": "3",
				"y": "3",
				"rx": "2"
			}],
			["path", { "d": "M9 3v18" }],
			["path", { "d": "m16 15-3-3 3-3" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/panel-left.svelte
function Panel_left($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "panel-left" },
		props,
		{ iconNode: [["rect", {
			"width": "18",
			"height": "18",
			"x": "3",
			"y": "3",
			"rx": "2"
		}], ["path", { "d": "M9 3v18" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/settings-2.svelte
function Settings_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "settings-2" },
		props,
		{ iconNode: [
			["path", { "d": "M14 17H5" }],
			["path", { "d": "M19 7h-9" }],
			["circle", {
				"cx": "17",
				"cy": "17",
				"r": "3"
			}],
			["circle", {
				"cx": "7",
				"cy": "7",
				"r": "3"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/square-terminal.svelte
function Square_terminal($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "square-terminal" },
		props,
		{ iconNode: [
			["path", { "d": "m7 11 2-2-2-2" }],
			["path", { "d": "M11 13h4" }],
			["rect", {
				"width": "18",
				"height": "18",
				"x": "3",
				"y": "3",
				"rx": "2",
				"ry": "2"
			}]
		] }
	]));
}
//#endregion
//#region src/lib/components/layout/NotificationBell.svelte
function NotificationBell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		$$renderer.push(`<div class="relative"><button type="button" aria-label="Notifications" class="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted">`);
		Bell($$renderer, { class: "h-4 w-4" });
		$$renderer.push(`<!----> `);
		if (store_get($$store_subs ??= {}, "$notificationUnreadCount", notificationUnreadCount) > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">${escape_html(store_get($$store_subs ??= {}, "$notificationUnreadCount", notificationUnreadCount) > 9 ? "9+" : store_get($$store_subs ??= {}, "$notificationUnreadCount", notificationUnreadCount))}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/layout/AppHeader.svelte
function AppHeader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let title = fallback($$props["title"], "Admin");
		let subtitle = fallback($$props["subtitle"], "Operations Studio");
		let onLogout = fallback($$props["onLogout"], void 0);
		let onToggleSidebar = fallback($$props["onToggleSidebar"], void 0);
		let sidebarOpen = fallback($$props["sidebarOpen"], true);
		const isDarkMode = () => derivedMode.current === "dark";
		$$renderer.push(`<header class="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl"><div class="mx-auto flex min-h-[50px] w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8"><div class="flex min-w-0 items-center gap-3">`);
		if (onToggleSidebar) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button"${attr("aria-label", sidebarOpen ? "Hide sidebar" : "Show sidebar")} class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted">`);
			if (sidebarOpen) {
				$$renderer.push("<!--[0-->");
				Panel_left_close($$renderer, { class: "h-4 w-4" });
			} else {
				$$renderer.push("<!--[-1-->");
				Panel_left($$renderer, { class: "h-4 w-4" });
			}
			$$renderer.push(`<!--]--></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm"><img src="/cafe-logo.png" alt="Bizflow logo" class="h-7 w-7 object-contain"/></div> <div class="min-w-0 leading-none"><p class="truncate text-base font-semibold tracking-[-0.04em] text-foreground">${escape_html(title)}</p> <p class="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">${escape_html(subtitle)}</p></div></div> <div class="flex items-center gap-2 sm:gap-3">`);
		NotificationBell($$renderer, {});
		$$renderer.push(`<!----> <button type="button" aria-label="Toggle theme" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-muted">`);
		if (isDarkMode()) {
			$$renderer.push("<!--[0-->");
			Sun_medium($$renderer, { class: "h-4 w-4" });
		} else {
			$$renderer.push("<!--[-1-->");
			Moon($$renderer, { class: "h-4 w-4" });
		}
		$$renderer.push(`<!--]--></button> `);
		if (onLogout) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button type="button" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">`);
			Log_out($$renderer, { class: "h-3.5 w-3.5" });
			$$renderer.push(`<!----> Sign out</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></header>`);
		bind_props($$props, {
			title,
			subtitle,
			onLogout,
			onToggleSidebar,
			sidebarOpen
		});
	});
}
//#endregion
//#region src/lib/stores/permissions.ts
var ROLE_PERMISSIONS = {
	manager: ["*"],
	staff: [
		"dashboard.view",
		"transactions.view",
		"transactions.create",
		"printing.view",
		"inventory.view",
		"inventory.adjust",
		"computers.view",
		"computers.transfer",
		"services.view",
		"support.view"
	],
	receptionist: [
		"dashboard.view",
		"transactions.view",
		"transactions.create",
		"printing.view",
		"computers.view",
		"computers.transfer",
		"services.view",
		"support.view"
	]
};
function resolveRoleKey(roleLabel) {
	const lower = roleLabel.toLowerCase();
	if (lower.includes("manager") || lower.includes("admin")) return "manager";
	if (lower.includes("reception")) return "receptionist";
	return "staff";
}
function canAccess(roleLabel, permission) {
	const permissions = ROLE_PERMISSIONS[resolveRoleKey(roleLabel)];
	if (permissions[0] === "*") return true;
	return permissions.includes(permission);
}
//#endregion
//#region src/lib/config/navigation.ts
var appNavItems = [
	{
		label: "Overview",
		path: "/dashboard",
		icon: Layout_grid,
		permission: "dashboard.view",
		section: "Workspace"
	},
	{
		label: "Transactions",
		path: "/transactions",
		icon: Shopping_bag,
		permission: "transactions.view",
		section: "Workspace"
	},
	{
		label: "Printing",
		path: "/printing",
		icon: Printer,
		permission: "printing.view",
		section: "Operations"
	},
	{
		label: "Print Settings",
		path: "/printing/settings",
		icon: Settings_2,
		permission: "printing.settings",
		section: "Operations"
	},
	{
		label: "Stock Taking",
		path: "/inventory",
		icon: Package,
		permission: "inventory.view",
		section: "Operations"
	},
	{
		label: "Computers",
		path: "/computers",
		icon: Monitor,
		permission: "computers.view",
		section: "Operations"
	},
	{
		label: "Support & Chat",
		path: "/support",
		icon: Message_square,
		permission: "support.view",
		section: "Operations"
	},
	{
		label: "Services",
		path: "/services",
		icon: Briefcase_business,
		permission: "services.view",
		section: "Operations"
	},
	{
		label: "Daily Sales",
		path: "/reports",
		icon: Chart_column,
		permission: "reports.view",
		section: "Reports"
	},
	{
		label: "AI Tracking",
		path: "/ai-tracking",
		icon: Square_terminal,
		permission: "ai-tracking.view",
		badge: "Dev",
		section: "System"
	}
];
function isNavActive(path, currentPath) {
	if (path === "/dashboard") return currentPath === "/dashboard" || currentPath === "/overview";
	if (path === "/printing") return currentPath === "/printing";
	return currentPath === path || currentPath.startsWith(path + "/");
}
//#endregion
//#region src/lib/components/layout/AppSidebar.svelte
function AppSidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { activePath = "" } = $$props;
		let userRole = derived(() => store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "staff");
		let sections = derived(() => {
			const map = /* @__PURE__ */ new Map();
			for (const item of appNavItems) {
				const section = item.section ?? "General";
				if (!map.has(section)) map.set(section, []);
				map.get(section).push(item);
			}
			return map;
		});
		$$renderer.push(`<aside class="surface-panel p-5"><div class="flex items-center gap-3.5 border-b border-border/60 pb-5"><div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"><img src="/cafe-logo.png" alt="Bizflow logo" class="h-8 w-8 object-contain"/></div> <div><p class="font-heading text-xl font-black tracking-[-0.06em] text-foreground">Bizflow</p> <p class="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Business center</p></div></div> <div class="mt-5 space-y-5"><!--[-->`);
		const each_array = ensure_array_like([...sections().entries()]);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let [section, items] = each_array[$$index_1];
			$$renderer.push(`<div><div class="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">${escape_html(section)}</div> <div class="space-y-1"><!--[-->`);
			const each_array_1 = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let item = each_array_1[$$index];
				const allowed = canAccess(userRole(), item.permission);
				$$renderer.push(`<button type="button"${attr("disabled", !allowed, true)}${attr_class(`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition ${isNavActive(item.path, activePath) ? "bg-foreground text-background" : allowed ? "text-muted-foreground hover:bg-muted hover:text-foreground" : "text-muted-foreground/50 cursor-not-allowed"}`)}><span class="flex items-center gap-3 min-w-0">`);
				if (!allowed) {
					$$renderer.push("<!--[0-->");
					Lock($$renderer, { class: "h-4 w-4 shrink-0" });
				} else {
					$$renderer.push("<!--[-1-->");
					if (item.icon) {
						$$renderer.push("<!--[-->");
						item.icon($$renderer, { class: "h-4 w-4 shrink-0" });
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				$$renderer.push(`<!--]--> <span class="truncate">${escape_html(item.label)}</span></span> `);
				if (item.badge && allowed) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">${escape_html(item.badge)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div></aside>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/stores/sidebar.ts
var STORAGE_KEY = "bizflow-sidebar-open";
function readInitial() {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(STORAGE_KEY) !== "false";
}
function createSidebarStore() {
	const { subscribe, set, update } = writable(readInitial());
	subscribe((open) => {
		if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, String(open));
	});
	return {
		subscribe,
		open: () => set(true),
		close: () => set(false),
		toggle: () => update((v) => !v)
	};
}
var sidebar = createSidebarStore();
//#endregion
//#region src/lib/components/layout/AppShell.svelte
function AppShell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children } = $$props;
		async function handleSignOut() {
			await signOut();
			goto("/login");
		}
		AppHeader($$renderer, {
			title: store_get($$store_subs ??= {}, "$authStore", authStore).user?.name ?? "Manager",
			subtitle: store_get($$store_subs ??= {}, "$authStore", authStore).user?.role ?? "Operations",
			onLogout: handleSignOut,
			onToggleSidebar: () => sidebar.toggle(),
			sidebarOpen: store_get($$store_subs ??= {}, "$sidebar", sidebar)
		});
		$$renderer.push(`<!----> <div class="w-full px-4 pb-10 pt-6 sm:px-6 lg:px-8">`);
		if (store_get($$store_subs ??= {}, "$sidebar", sidebar)) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="mx-auto grid w-full max-w-[1500px] gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">`);
			AppSidebar($$renderer, { activePath: page.url.pathname });
			$$renderer.push(`<!----> <div class="min-w-0 space-y-6">`);
			children?.($$renderer);
			$$renderer.push(`<!----></div></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="mx-auto w-[70%] min-w-0 space-y-6">`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { Settings_2 as a, Bell as c, Square_terminal as i, canAccess as n, Message_square as o, resolveRoleKey as r, Briefcase_business as s, AppShell as t };
