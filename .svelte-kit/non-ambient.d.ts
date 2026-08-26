
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
		RouteId(): "/(app)" | "/" | "/(app)/ai-tracking" | "/(app)/computers" | "/(app)/dashboard" | "/extensions" | "/(app)/extensions" | "/(app)/extensions/automations" | "/extensions/marketing" | "/(app)/extensions/marketing" | "/extensions/marketing/builder" | "/(app)/extensions/marketing/builder" | "/(app)/extensions/marketing/forms" | "/(app)/extensions/vtu" | "/(app)/extensions/vtu/pricing" | "/(app)/extensions/wallet" | "/(app)/extensions/whatsapp" | "/(app)/extensions/whatsapp/business" | "/(app)/extensions/whatsapp/customers" | "/features" | "/(app)/inventory" | "/invite" | "/invite/[id]" | "/login" | "/onboarding" | "/(app)/overview" | "/(app)/printing" | "/(app)/printing/settings" | "/register" | "/(app)/reports" | "/(app)/services" | "/(app)/settings" | "/solutions" | "/(app)/support" | "/(app)/team" | "/(app)/team/[id]" | "/(app)/transactions";
		RouteParams(): {
			"/invite/[id]": { id: string };
			"/(app)/team/[id]": { id: string }
		};
		LayoutParams(): {
			"/(app)": { id?: string | undefined };
			"/": { id?: string | undefined };
			"/(app)/ai-tracking": Record<string, never>;
			"/(app)/computers": Record<string, never>;
			"/(app)/dashboard": Record<string, never>;
			"/extensions": Record<string, never>;
			"/(app)/extensions": Record<string, never>;
			"/(app)/extensions/automations": Record<string, never>;
			"/extensions/marketing": Record<string, never>;
			"/(app)/extensions/marketing": Record<string, never>;
			"/extensions/marketing/builder": Record<string, never>;
			"/(app)/extensions/marketing/builder": Record<string, never>;
			"/(app)/extensions/marketing/forms": Record<string, never>;
			"/(app)/extensions/vtu": Record<string, never>;
			"/(app)/extensions/vtu/pricing": Record<string, never>;
			"/(app)/extensions/wallet": Record<string, never>;
			"/(app)/extensions/whatsapp": Record<string, never>;
			"/(app)/extensions/whatsapp/business": Record<string, never>;
			"/(app)/extensions/whatsapp/customers": Record<string, never>;
			"/features": Record<string, never>;
			"/(app)/inventory": Record<string, never>;
			"/invite": { id?: string | undefined };
			"/invite/[id]": { id: string };
			"/login": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/(app)/overview": Record<string, never>;
			"/(app)/printing": Record<string, never>;
			"/(app)/printing/settings": Record<string, never>;
			"/register": Record<string, never>;
			"/(app)/reports": Record<string, never>;
			"/(app)/services": Record<string, never>;
			"/(app)/settings": Record<string, never>;
			"/solutions": Record<string, never>;
			"/(app)/support": Record<string, never>;
			"/(app)/team": { id?: string | undefined };
			"/(app)/team/[id]": { id: string };
			"/(app)/transactions": Record<string, never>
		};
		Pathname(): "/" | "/ai-tracking" | "/computers" | "/dashboard" | "/extensions" | "/extensions/automations" | "/extensions/marketing" | "/extensions/marketing/builder" | "/extensions/marketing/forms" | "/extensions/vtu" | "/extensions/vtu/pricing" | "/extensions/wallet" | "/extensions/whatsapp" | "/extensions/whatsapp/business" | "/extensions/whatsapp/customers" | "/features" | "/inventory" | `/invite/${string}` & {} | "/login" | "/onboarding" | "/overview" | "/printing" | "/printing/settings" | "/register" | "/reports" | "/services" | "/settings" | "/solutions" | "/support" | "/team" | `/team/${string}` & {} | "/transactions";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/bizflow-ai.png" | "/bizflow-mascot.png" | "/business-icon.png" | "/cafe-logo.png" | "/favicon.svg" | "/icons.svg" | "/login-bizzy.png" | "/onboarding-bizzy.png" | "/register-bizzy.png" | string & {};
	}
}