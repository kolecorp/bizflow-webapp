import { U as writable } from "./internal.js";
import "./exports.js";
//#region src/lib/stores/auth.ts
var AUTH_KEY = "cafe-management-auth";
var initialState = {
	isAuthenticated: false,
	user: null
};
var authStore = writable(initialState);
function persist(state) {
	if (typeof window === "undefined") return;
	if (!state.isAuthenticated) {
		window.localStorage.removeItem(AUTH_KEY);
		return;
	}
	window.localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}
function initializeAuth() {
	if (typeof window === "undefined") return;
	const saved = window.localStorage.getItem(AUTH_KEY);
	if (!saved) {
		authStore.set(initialState);
		return;
	}
	try {
		const parsed = JSON.parse(saved);
		if (parsed?.isAuthenticated && parsed.user) {
			authStore.set(parsed);
			return;
		}
	} catch {}
	authStore.set(initialState);
}
async function signOut() {
	authStore.set(initialState);
	persist(initialState);
}
//#endregion
export { initializeAuth as n, signOut as r, authStore as t };
