import { $ as run, B as derived$1, U as writable, p as derived } from "./internal.js";
import "./exports.js";
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/internal/helpers.js
function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}
var isBrowser = typeof document !== "undefined";
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/toast-state.svelte.js
var toastsCounter = 0;
var ToastState = class {
	toasts = [];
	heights = [];
	#findToastIdx = (id) => {
		const idx = this.toasts.findIndex((toast) => toast.id === id);
		if (idx === -1) return null;
		return idx;
	};
	addToast = (data) => {
		if (!isBrowser) return;
		this.toasts.unshift(data);
	};
	updateToast = ({ id, data, type, message }) => {
		const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
		const toastToUpdate = this.toasts[toastIdx];
		this.toasts[toastIdx] = {
			...toastToUpdate,
			...data,
			id,
			title: message,
			type,
			updated: true
		};
	};
	create = (data) => {
		const { message, ...rest } = data;
		const id = typeof data?.id === "number" || data.id && data.id?.length > 0 ? data.id : toastsCounter++;
		const dismissible = data.dismissible !== void 0 ? data.dismissible : data.dismissable !== void 0 ? data.dismissable : true;
		const type = data.type === void 0 ? "default" : data.type;
		run(() => {
			if (this.toasts.find((toast) => toast.id === id)) this.updateToast({
				id,
				data,
				type,
				message,
				dismissible
			});
			else this.addToast({
				...rest,
				id,
				title: message,
				dismissible,
				type
			});
		});
		return id;
	};
	dismiss = (id) => {
		run(() => {
			if (id === void 0) {
				this.toasts = this.toasts.map((toast) => ({
					...toast,
					dismiss: true
				}));
				return;
			}
			const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
			if (this.toasts[toastIdx]) this.toasts[toastIdx] = {
				...this.toasts[toastIdx],
				dismiss: true
			};
		});
		return id;
	};
	remove = (id) => {
		if (id === void 0) {
			this.toasts = [];
			return;
		}
		const toastIdx = this.#findToastIdx(id);
		if (toastIdx === null) return;
		this.toasts.splice(toastIdx, 1);
		return id;
	};
	message = (message, data) => {
		return this.create({
			...data,
			type: "default",
			message
		});
	};
	error = (message, data) => {
		return this.create({
			...data,
			type: "error",
			message
		});
	};
	success = (message, data) => {
		return this.create({
			...data,
			type: "success",
			message
		});
	};
	info = (message, data) => {
		return this.create({
			...data,
			type: "info",
			message
		});
	};
	warning = (message, data) => {
		return this.create({
			...data,
			type: "warning",
			message
		});
	};
	loading = (message, data) => {
		return this.create({
			...data,
			type: "loading",
			message
		});
	};
	promise = (promise, data) => {
		if (!data) return;
		let id = void 0;
		if (data.loading !== void 0) id = this.create({
			...data,
			promise,
			type: "loading",
			message: typeof data.loading === "string" ? data.loading : data.loading()
		});
		const p = promise instanceof Promise ? promise : promise();
		let shouldDismiss = id !== void 0;
		p.then((response) => {
			if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
				shouldDismiss = false;
				const message = constructPromiseErrorMessage(response);
				this.create({
					id,
					type: "error",
					message
				});
			} else if (data.success !== void 0) {
				shouldDismiss = false;
				const message = typeof data.success === "function" ? data.success(response) : data.success;
				this.create({
					id,
					type: "success",
					message
				});
			}
		}).catch((error) => {
			if (data.error !== void 0) {
				shouldDismiss = false;
				const message = typeof data.error === "function" ? data.error(error) : data.error;
				this.create({
					id,
					type: "error",
					message
				});
			}
		}).finally(() => {
			if (shouldDismiss) {
				this.dismiss(id);
				id = void 0;
			}
			data.finally?.();
		});
		return id;
	};
	custom = (component, data) => {
		const id = data?.id || toastsCounter++;
		this.create({
			component,
			id,
			...data
		});
		return id;
	};
	removeHeight = (id) => {
		this.heights = this.heights.filter((height) => height.toastId !== id);
	};
	setHeight = (data) => {
		const toastIdx = this.#findToastIdx(data.toastId);
		if (toastIdx === null) {
			this.heights.push(data);
			return;
		}
		this.heights[toastIdx] = data;
	};
	reset = () => {
		this.toasts = [];
		this.heights = [];
	};
};
function constructPromiseErrorMessage(response) {
	if (response && typeof response === "object" && "status" in response) return `HTTP error! Status: ${response.status}`;
	return `Error! ${response}`;
}
var toastState = new ToastState();
function toastFunction(message, data) {
	return toastState.create({
		message,
		...data
	});
}
var SonnerState = class {
	/**
	* A derived state of the toasts that are not dismissed.
	*/
	#activeToasts = derived(() => toastState.toasts.filter((toast) => !toast.dismiss));
	get toasts() {
		return this.#activeToasts();
	}
};
var toast = Object.assign(toastFunction, {
	success: toastState.success,
	info: toastState.info,
	warning: toastState.warning,
	error: toastState.error,
	custom: toastState.custom,
	message: toastState.message,
	promise: toastState.promise,
	dismiss: toastState.dismiss,
	loading: toastState.loading,
	getActiveToasts: () => {
		return toastState.toasts.filter((toast) => !toast.dismiss);
	}
});
//#endregion
//#region src/lib/stores/notifications.ts
var nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
var seedNotifications = [
	{
		id: "notif-1",
		title: "File transfer ready",
		message: "PC-03 (Training Room) accepted incoming files from staff.",
		kind: "success",
		category: "file_transfer",
		read: false,
		createdAt: nowIso(),
		href: "/computers"
	},
	{
		id: "notif-2",
		title: "New support ticket",
		message: "TKT-1042 — Customer cannot open saved document on PC-01.",
		kind: "warning",
		category: "ticket",
		read: false,
		createdAt: nowIso(),
		href: "/support"
	},
	{
		id: "notif-3",
		title: "Staff message",
		message: "Grace: Please check toner on Canon before the training session.",
		kind: "info",
		category: "chat",
		read: true,
		createdAt: nowIso(),
		href: "/support"
	}
];
function createNotificationStore() {
	const items = writable(seedNotifications);
	const unreadCount = derived$1(items, ($items) => $items.filter((n) => !n.read).length);
	function push(input) {
		const notification = {
			id: `notif-${Date.now()}`,
			title: input.title,
			message: input.message,
			kind: input.kind ?? "info",
			category: input.category ?? "system",
			read: false,
			createdAt: nowIso(),
			href: input.href
		};
		items.update((list) => [notification, ...list]);
		if (input.toast !== false) (notification.kind === "success" ? toast.success : notification.kind === "error" ? toast.error : notification.kind === "warning" ? toast.warning : toast.info)(notification.title, { description: notification.message });
		return notification;
	}
	function markRead(id) {
		items.update((list) => list.map((n) => n.id === id ? {
			...n,
			read: true
		} : n));
	}
	function markAllRead() {
		items.update((list) => list.map((n) => ({
			...n,
			read: true
		})));
	}
	function remove(id) {
		items.update((list) => list.filter((n) => n.id !== id));
	}
	return {
		items,
		unreadCount,
		push,
		markRead,
		markAllRead,
		remove
	};
}
var _notifications = createNotificationStore();
var notifications = _notifications;
var notificationItems = _notifications.items;
var notificationUnreadCount = _notifications.unreadCount;
var { push: pushNotification, markRead, markAllRead, remove } = _notifications;
//#endregion
export { toastState as a, SonnerState as i, notificationUnreadCount as n, cn as o, notifications as r, notificationItems as t };
