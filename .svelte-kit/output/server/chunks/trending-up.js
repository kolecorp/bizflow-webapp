import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/trending-up.svelte
function Trending_up($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "trending-up" },
		props,
		{ iconNode: [["path", { "d": "M16 7h6v6" }], ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]] }
	]));
}
//#endregion
export { Trending_up as t };
