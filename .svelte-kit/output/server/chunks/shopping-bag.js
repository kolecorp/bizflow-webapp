import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/printer.svelte
function Printer($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "printer" },
		props,
		{ iconNode: [
			["path", { "d": "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }],
			["path", { "d": "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }],
			["rect", {
				"x": "6",
				"y": "14",
				"width": "12",
				"height": "8",
				"rx": "1"
			}]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/shopping-bag.svelte
function Shopping_bag($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "shopping-bag" },
		props,
		{ iconNode: [
			["path", { "d": "M16 10a4 4 0 0 1-8 0" }],
			["path", { "d": "M3.103 6.034h17.794" }],
			["path", { "d": "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" }]
		] }
	]));
}
//#endregion
export { Printer as n, Shopping_bag as t };
