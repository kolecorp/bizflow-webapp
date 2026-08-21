import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/graduation-cap.svelte
function Graduation_cap($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "graduation-cap" },
		props,
		{ iconNode: [
			["path", { "d": "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" }],
			["path", { "d": "M22 10v6" }],
			["path", { "d": "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }]
		] }
	]));
}
//#endregion
export { Graduation_cap as t };
