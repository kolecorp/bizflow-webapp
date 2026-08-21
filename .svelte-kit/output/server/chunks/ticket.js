import { S as spread_props } from "./internal.js";
import { t as Icon } from "./Icon.js";
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/ticket.svelte
function Ticket($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "ticket" },
		props,
		{ iconNode: [
			["path", { "d": "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" }],
			["path", { "d": "M13 5v2" }],
			["path", { "d": "M13 17v2" }],
			["path", { "d": "M13 11v2" }]
		] }
	]));
}
//#endregion
export { Ticket as t };
