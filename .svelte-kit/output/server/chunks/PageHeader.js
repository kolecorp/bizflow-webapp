import { N as escape_html, X as fallback, b as sanitize_slots, f as bind_props, x as slot } from "./internal.js";
//#region src/lib/components/layout/PageHeader.svelte
function PageHeader($$renderer, $$props) {
	const $$slots = sanitize_slots($$props);
	let eyebrow = fallback($$props["eyebrow"], "");
	let title = fallback($$props["title"], "");
	let description = fallback($$props["description"], "");
	$$renderer.push(`<div class="surface-panel p-6">`);
	if (eyebrow) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">${escape_html(eyebrow)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (title) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">${escape_html(title)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if (description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="mt-2 text-sm text-muted-foreground">${escape_html(description)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> `);
	if ($$slots.actions) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="mt-4 flex flex-wrap gap-2"><!--[-->`);
		slot($$renderer, $$props, "actions", {}, null);
		$$renderer.push(`<!--]--></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
	bind_props($$props, {
		eyebrow,
		title,
		description
	});
}
//#endregion
export { PageHeader as t };
