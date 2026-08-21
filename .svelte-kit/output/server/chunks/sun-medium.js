import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/moon.svelte
function Moon($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "moon" },
		props,
		{ iconNode: [["path", { "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/sun-medium.svelte
function Sun_medium($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "sun-medium" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "4"
			}],
			["path", { "d": "M12 3v1" }],
			["path", { "d": "M12 20v1" }],
			["path", { "d": "M3 12h1" }],
			["path", { "d": "M20 12h1" }],
			["path", { "d": "m18.364 5.636-.707.707" }],
			["path", { "d": "m6.343 17.657-.707.707" }],
			["path", { "d": "m5.636 5.636.707.707" }],
			["path", { "d": "m17.657 17.657.707.707" }]
		] }
	]));
}
//#endregion
export { Moon as n, Sun_medium as t };
