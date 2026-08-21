import { U as writable } from "./internal.js";
import "./exports.js";
//#region src/lib/stores/modals.ts
function createModalStore() {
	const { subscribe, set, update } = writable({
		dailySales: false,
		newTransaction: false,
		sendFile: false,
		sendFileTarget: null
	});
	return {
		subscribe,
		openDailySales: () => update((state) => ({
			...state,
			dailySales: true,
			newTransaction: false
		})),
		closeDailySales: () => update((state) => ({
			...state,
			dailySales: false
		})),
		openNewTransaction: () => update((state) => ({
			...state,
			newTransaction: true,
			dailySales: false
		})),
		closeNewTransaction: () => update((state) => ({
			...state,
			newTransaction: false
		})),
		openSendFile: (target) => update((state) => ({
			...state,
			sendFile: true,
			sendFileTarget: target
		})),
		closeSendFile: () => update((state) => ({
			...state,
			sendFile: false,
			sendFileTarget: null
		})),
		closeAll: () => set({
			dailySales: false,
			newTransaction: false,
			sendFile: false,
			sendFileTarget: null
		})
	};
}
var modals = createModalStore();
//#endregion
export { modals as t };
