import { C as store_get, T as unsubscribe_stores } from "../../../chunks/internal.js";
import "../../../chunks/navigation.js";
import { t as authStore } from "../../../chunks/auth.js";
//#region src/routes/(app)/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children } = $$props;
		if (store_get($$store_subs ??= {}, "$authStore", authStore).isAuthenticated) {
			$$renderer.push("<!--[0-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _layout as default };
