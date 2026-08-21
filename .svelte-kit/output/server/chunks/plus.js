import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/plus.svelte
function Plus($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "plus" },
		props,
		{ iconNode: [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]] }
	]));
}
//#endregion
export { Plus as t };
