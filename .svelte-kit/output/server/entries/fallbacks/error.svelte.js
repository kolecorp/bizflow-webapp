import { N as escape_html } from "../../chunks/internal.js";
import { t as page } from "../../chunks/state.js";
//#region node_modules/.pnpm/@sveltejs+kit@2.70.2_@svelt_6f7611b7e49b04809256ea497ff57814/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}
//#endregion
export { Error as default };
