import { l as attr_class, w as stringify } from "./internal.js";
//#region src/lib/components/landing/NoiseOverlay.svelte
function NoiseOverlay($$renderer, $$props) {
	let { intensity = "medium", class: className = "" } = $$props;
	$$renderer.push(`<div${attr_class(`pointer-events-none absolute inset-0 bg-noise ${stringify({
		light: "opacity-[0.35] dark:opacity-[0.25]",
		medium: "opacity-[0.55] dark:opacity-[0.4]",
		strong: "opacity-[0.75] dark:opacity-[0.55]"
	}[intensity])} ${stringify(className)}`)} aria-hidden="true"></div>`);
}
//#endregion
export { NoiseOverlay as t };
