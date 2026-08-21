import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/clock.svelte
function Clock($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "clock" },
		props,
		{ iconNode: [["circle", {
			"cx": "12",
			"cy": "12",
			"r": "10"
		}], ["path", { "d": "M12 6v6l4 2" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/wallet.svelte
function Wallet($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wallet" },
		props,
		{ iconNode: [["path", { "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }], ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]] }
	]));
}
//#endregion
export { Clock as n, Wallet as t };
