
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/(app)/ai-tracking" | "/(app)/computers" | "/(app)/dashboard" | "/features" | "/(app)/inventory" | "/login" | "/(app)/overview" | "/(app)/printing" | "/(app)/printing/settings" | "/(app)/reports" | "/(app)/services" | "/solutions" | "/(app)/support" | "/(app)/transactions";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/(app)": Record<string, never>;
			"/": Record<string, never>;
			"/(app)/ai-tracking": Record<string, never>;
			"/(app)/computers": Record<string, never>;
			"/(app)/dashboard": Record<string, never>;
			"/features": Record<string, never>;
			"/(app)/inventory": Record<string, never>;
			"/login": Record<string, never>;
			"/(app)/overview": Record<string, never>;
			"/(app)/printing": Record<string, never>;
			"/(app)/printing/settings": Record<string, never>;
			"/(app)/reports": Record<string, never>;
			"/(app)/services": Record<string, never>;
			"/solutions": Record<string, never>;
			"/(app)/support": Record<string, never>;
			"/(app)/transactions": Record<string, never>
		};
		Pathname(): "/" | "/ai-tracking" | "/computers" | "/dashboard" | "/features" | "/inventory" | "/login" | "/overview" | "/printing" | "/printing/settings" | "/reports" | "/services" | "/solutions" | "/support" | "/transactions";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/cafe-logo.png" | "/favicon.svg" | "/icons.svg" | string & {};
	}
}