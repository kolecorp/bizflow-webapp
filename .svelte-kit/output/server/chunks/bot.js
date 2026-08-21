import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/bot.svelte
function Bot($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bot" },
		props,
		{ iconNode: [
			["path", { "d": "M12 8V4H8" }],
			["rect", {
				"width": "16",
				"height": "12",
				"x": "4",
				"y": "8",
				"rx": "2"
			}],
			["path", { "d": "M2 14h2" }],
			["path", { "d": "M20 14h2" }],
			["path", { "d": "M15 13v2" }],
			["path", { "d": "M9 13v2" }]
		] }
	]));
}
//#endregion
export { Bot as t };
