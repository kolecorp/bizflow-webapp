import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/package.svelte
function Package($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "package" },
		props,
		{ iconNode: [
			["path", { "d": "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" }],
			["path", { "d": "M12 22V12" }],
			["polyline", { "points": "3.29 7 12 12 20.71 7" }],
			["path", { "d": "m7.5 4.27 9 5.15" }]
		] }
	]));
}
//#endregion
export { Package as t };
