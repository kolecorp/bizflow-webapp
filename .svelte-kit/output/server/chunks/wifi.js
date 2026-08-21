import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/wifi.svelte
function Wifi($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "wifi" },
		props,
		{ iconNode: [
			["path", { "d": "M12 20h.01" }],
			["path", { "d": "M2 8.82a15 15 0 0 1 20 0" }],
			["path", { "d": "M5 12.859a10 10 0 0 1 14 0" }],
			["path", { "d": "M8.5 16.429a5 5 0 0 1 7 0" }]
		] }
	]));
}
//#endregion
export { Wifi as t };
