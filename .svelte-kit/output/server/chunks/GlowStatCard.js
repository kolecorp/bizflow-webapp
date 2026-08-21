import { N as escape_html, l as attr_class, w as stringify } from "./internal.js";
import { t as NoiseOverlay } from "./NoiseOverlay.js";
//#region src/lib/components/ui/GlowStatCard.svelte
function GlowStatCard($$renderer, $$props) {
	let { label, value, subtext = "", icon: Icon, variant = "primary", class: className = "" } = $$props;
	const glowMap = {
		emerald: "glow-emerald",
		blue: "glow-blue",
		amber: "glow-amber",
		violet: "glow-violet",
		rose: "glow-rose",
		primary: "glow-primary"
	};
	const iconColorMap = {
		emerald: "text-emerald-500",
		blue: "text-blue-500",
		amber: "text-amber-500",
		violet: "text-violet-500",
		rose: "text-rose-500",
		primary: "text-primary"
	};
	$$renderer.push(`<div${attr_class(`glow-stat-card ${stringify(glowMap[variant])} ${stringify(className)}`)}><div class="glow-stat-card__inner relative overflow-hidden p-5">`);
	NoiseOverlay($$renderer, {
		intensity: "light",
		class: "rounded-[inherit]"
	});
	$$renderer.push(`<!----> <div class="relative z-10"><div class="flex items-start justify-between gap-3"><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">${escape_html(label)}</p> `);
	if (Icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="rounded-lg bg-background/60 p-2 ring-1 ring-border/40 backdrop-blur-sm">`);
		if (Icon) {
			$$renderer.push("<!--[-->");
			Icon($$renderer, { class: `h-4 w-4 ${stringify(iconColorMap[variant])}` });
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div> <p class="mt-2 font-heading text-3xl font-black tracking-[-0.06em] text-foreground">${escape_html(value)}</p> `);
	if (subtext) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="mt-1.5 text-xs text-muted-foreground">${escape_html(subtext)}</p>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div></div>`);
}
//#endregion
export { GlowStatCard as t };
