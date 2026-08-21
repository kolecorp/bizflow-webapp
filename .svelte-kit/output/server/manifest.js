export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["cafe-logo.png","favicon.svg","icons.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CzFnqSjX.js",app:"_app/immutable/entry/app.DpQ6Q2nx.js",imports:["_app/immutable/entry/start.CzFnqSjX.js","_app/immutable/chunks/DeI9gAd2.js","_app/immutable/chunks/Cd6jACye.js","_app/immutable/chunks/CEoa-xHZ.js","_app/immutable/chunks/Dt-HX3Vu.js","_app/immutable/entry/app.DpQ6Q2nx.js","_app/immutable/chunks/Cd6jACye.js","_app/immutable/chunks/CEoa-xHZ.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/ai-tracking","/computers","/dashboard","/features","/inventory","/login","/overview","/printing","/printing/settings","/reports","/services","/solutions","/support","/transactions"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
