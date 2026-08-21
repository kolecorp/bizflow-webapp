import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/chart-column.svelte
function Chart_column($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "chart-column" },
		props,
		{ iconNode: [
			["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }],
			["path", { "d": "M18 17V9" }],
			["path", { "d": "M13 17V5" }],
			["path", { "d": "M8 17v-3" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/layout-grid.svelte
function Layout_grid($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "layout-grid" },
		props,
		{ iconNode: [
			["rect", {
				"width": "7",
				"height": "7",
				"x": "3",
				"y": "3",
				"rx": "1"
			}],
			["rect", {
				"width": "7",
				"height": "7",
				"x": "14",
				"y": "3",
				"rx": "1"
			}],
			["rect", {
				"width": "7",
				"height": "7",
				"x": "14",
				"y": "14",
				"rx": "1"
			}],
			["rect", {
				"width": "7",
				"height": "7",
				"x": "3",
				"y": "14",
				"rx": "1"
			}]
		] }
	]));
}
//#endregion
export { Chart_column as n, Layout_grid as t };
