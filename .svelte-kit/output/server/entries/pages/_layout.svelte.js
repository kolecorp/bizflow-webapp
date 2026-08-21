import { $ as run, A as setContext, C as store_get, D as getAllContexts, I as on, M as clsx, N as escape_html, O as getContext, S as spread_props, T as unsubscribe_stores, _ as props_id, c as unmount, d as attributes, f as bind_props, h as ensure_array_like, i as mount, j as attr, k as hasContext, l as attr_class, p as derived, s as tick, u as attr_style, w as stringify } from "../../chunks/internal.js";
import "../../chunks/exports.js";
import "../../chunks/navigation.js";
import "../../chunks/state.js";
import { a as createSubscriber, i as SvelteMap, n as Mode_watcher, r as derivedMode, t as Icon } from "../../chunks/Icon.js";
import { a as createBitsAttrs, c as attachRef, d as composeHandlers, f as boxWith, i as boolToEmptyStrOrUndef, l as mergeProps, m as isObject, n as Input, o as getDataOpenClosed, p as simpleBox, r as createId, s as getDataTransitionAttrs, t as Label, u as executeCallbacks } from "../../chunks/label.js";
import { n as initializeAuth } from "../../chunks/auth.js";
import { t as modals } from "../../chunks/modals.js";
import { t as cn } from "../../chunks/utils2.js";
import { n as buttonVariants, t as Button } from "../../chunks/button.js";
import { t as Circle_check } from "../../chunks/circle-check.js";
import { t as Loader_circle } from "../../chunks/loader-circle.js";
import { t as Monitor } from "../../chunks/monitor.js";
import { t as Plus } from "../../chunks/plus.js";
import { t as Trending_up } from "../../chunks/trending-up.js";
import { t as Triangle_alert } from "../../chunks/triangle-alert.js";
import { t as Upload } from "../../chunks/upload.js";
import { f as todayRevenue, p as todayTransactions, u as services } from "../../chunks/businessData.js";
import { a as toastState, i as SonnerState, o as cn$1 } from "../../chunks/notifications.js";
import "../../chunks/communications.js";
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow$1 = void 0;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement$2(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement$1 = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow$1, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber((update) => {
			const cleanupFocusIn = on(window, "focusin", update);
			const cleanupFocusOut = on(window, "focusout", update);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement$2(this.#document);
	}
};
new ActiveElement$1();
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/utilities/context/context.js
var Context$1 = class {
	#name;
	#key;
	/**
	* @param name The name of the context.
	* This is used for generating the context key and error messages.
	*/
	constructor(name) {
		this.#name = name;
		this.#key = Symbol(name);
	}
	/**
	* The key used to get and set the context.
	*
	* It is not recommended to use this value directly.
	* Instead, use the methods provided by this class.
	*/
	get key() {
		return this.#key;
	}
	/**
	* Checks whether this has been set in the context of a parent component.
	*
	* Must be called during component initialisation.
	*/
	exists() {
		return hasContext(this.#key);
	}
	/**
	* Retrieves the context that belongs to the closest parent component.
	*
	* Must be called during component initialisation.
	*
	* @throws An error if the context does not exist.
	*/
	get() {
		const context = getContext(this.#key);
		if (context === void 0) throw new Error(`Context "${this.#name}" not found`);
		return context;
	}
	/**
	* Retrieves the context that belongs to the closest parent component,
	* or the given fallback value if the context does not exist.
	*
	* Must be called during component initialisation.
	*/
	getOr(fallback) {
		const context = getContext(this.#key);
		if (context === void 0) return fallback;
		return context;
	}
	/**
	* Associates the given value with the current component and returns it.
	*
	* Must be called during component initialisation.
	*/
	set(context) {
		return setContext(this.#key, context);
	}
};
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher$1(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch$1(sources, effect, options) {
	runWatcher$1(sources, "post", effect, options);
}
function watchPre$1(sources, effect, options) {
	runWatcher$1(sources, "pre", effect, options);
}
watch$1.pre = watchPre$1;
function watchOnce$1(source, effect) {}
function watchOncePre$1(source, effect) {}
watchOnce$1.pre = watchOncePre$1;
//#endregion
//#region node_modules/.pnpm/runed@0.35.1_@sveltejs+kit@_12fb6753ee4132f3dec3e75f1a8c0f80/node_modules/runed/dist/utilities/resource/resource.svelte.js
function debounce$2(fn, delay) {
	let timeoutId;
	let lastResolve = null;
	return (...args) => {
		return new Promise((resolve) => {
			if (lastResolve) lastResolve(void 0);
			lastResolve = resolve;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				const result = await fn(...args);
				if (lastResolve) {
					lastResolve(result);
					lastResolve = null;
				}
			}, delay);
		});
	};
}
function throttle$1(fn, delay) {
	let lastRun = 0;
	let lastPromise = null;
	return (...args) => {
		const now = Date.now();
		if (lastRun && now - lastRun < delay) return lastPromise ?? Promise.resolve(void 0);
		lastRun = now;
		lastPromise = fn(...args);
		return lastPromise;
	};
}
function runResource$1(source, fetcher, options = {}, effectFn) {
	const { lazy = false, once = false, initialValue, debounce: debounceTime, throttle: throttleTime } = options;
	let current = initialValue;
	let loading = false;
	let error = void 0;
	let cleanupFns = [];
	const runCleanup = () => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	};
	const onCleanup = (fn) => {
		cleanupFns = [...cleanupFns, fn];
	};
	const baseFetcher = async (value, previousValue, refetching = false) => {
		try {
			loading = true;
			error = void 0;
			runCleanup();
			const controller = new AbortController();
			onCleanup(() => controller.abort());
			const result = await fetcher(value, previousValue, {
				data: current,
				refetching,
				onCleanup,
				signal: controller.signal
			});
			current = result;
			return result;
		} catch (e) {
			if (!(e instanceof DOMException && e.name === "AbortError")) error = e;
			return;
		} finally {
			loading = false;
		}
	};
	const runFetcher = debounceTime ? debounce$2(baseFetcher, debounceTime) : throttleTime ? throttle$1(baseFetcher, throttleTime) : baseFetcher;
	const sources = Array.isArray(source) ? source : [source];
	let prevValues;
	effectFn((values, previousValues) => {
		if (once && prevValues) return;
		prevValues = values;
		runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? previousValues : previousValues?.[0]);
	}, { lazy });
	return {
		get current() {
			return current;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		mutate: (value) => {
			current = value;
		},
		refetch: (info) => {
			const values = sources.map((s) => s());
			return runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? values : values[0], info ?? true);
		}
	};
}
function resource$1(source, fetcher, options) {
	return runResource$1(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getters = () => sources.map((s) => s());
		watch$1(getters, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
function resourcePre$1(source, fetcher, options) {
	return runResource$1(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getter = () => sources.map((s) => s());
		watch$1.pre(getter, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
resource$1.pre = resourcePre$1;
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sve_ce2a027af00e034c67401bc45bb30715/node_modules/svelte-toolbelt/dist/utils/after-sleep.js
/**
* A utility function that executes a callback after a specified number of milliseconds.
*/
function afterSleep(ms, cb) {
	return setTimeout(cb, ms);
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sve_ce2a027af00e034c67401bc45bb30715/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function afterTick(fn) {
	(/* @__PURE__ */ tick()).then(fn);
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sve_ce2a027af00e034c67401bc45bb30715/node_modules/svelte-toolbelt/dist/utils/dom.js
var ELEMENT_NODE = 1;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;
function isHTMLElement$1(node) {
	return isObject(node) && node.nodeType === ELEMENT_NODE && typeof node.nodeName === "string";
}
function isDocument(node) {
	return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
	return isObject(node) && node.constructor?.name === "VisualViewport";
}
function isNode(node) {
	return isObject(node) && node.nodeType !== void 0;
}
function isShadowRoot(node) {
	return isNode(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in node;
}
function contains(parent, child) {
	if (!parent || !child) return false;
	if (!isHTMLElement$1(parent) || !isHTMLElement$1(child)) return false;
	const rootNode = child.getRootNode?.();
	if (parent === child) return true;
	if (parent.contains(child)) return true;
	if (rootNode && isShadowRoot(rootNode)) {
		let next = child;
		while (next) {
			if (parent === next) return true;
			next = next.parentNode || next.host;
		}
	}
	return false;
}
function getDocument(node) {
	if (isDocument(node)) return node;
	if (isWindow(node)) return node.document;
	return node?.ownerDocument ?? document;
}
function getActiveElement$1(rootNode) {
	let activeElement = rootNode.activeElement;
	while (activeElement?.shadowRoot) {
		const el = activeElement.shadowRoot.activeElement;
		if (el === activeElement) break;
		else activeElement = el;
	}
	return activeElement;
}
//#endregion
//#region node_modules/.pnpm/svelte-toolbelt@0.10.6_@sve_ce2a027af00e034c67401bc45bb30715/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var DOMContext = class {
	element;
	#root = derived(() => {
		if (!this.element.current) return document;
		return this.element.current.getRootNode() ?? document;
	});
	get root() {
		return this.#root();
	}
	set root($$value) {
		return this.#root($$value);
	}
	constructor(element) {
		if (typeof element === "function") this.element = boxWith(element);
		else this.element = element;
	}
	getDocument = () => {
		return getDocument(this.root);
	};
	getWindow = () => {
		return this.getDocument().defaultView ?? window;
	};
	getActiveElement = () => {
		return getActiveElement$1(this.root);
	};
	isActiveElement = (node) => {
		return node === this.getActiveElement();
	};
	getElementById(id) {
		return this.root.getElementById(id);
	}
	querySelector = (selector) => {
		if (!this.root) return null;
		return this.root.querySelector(selector);
	};
	querySelectorAll = (selector) => {
		if (!this.root) return [];
		return this.root.querySelectorAll(selector);
	};
	setTimeout = (callback, delay) => {
		return this.getWindow().setTimeout(callback, delay);
	};
	clearTimeout = (timeoutId) => {
		return this.getWindow().clearTimeout(timeoutId);
	};
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/is.js
var isBrowser = typeof document !== "undefined";
var isIOS = getIsIOS();
function getIsIOS() {
	return isBrowser && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function isHTMLElement(element) {
	return element instanceof HTMLElement;
}
function isElementOrSVGElement(element) {
	return element instanceof Element || element instanceof SVGElement;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/animations-complete.js
var AnimationsComplete = class {
	#opts;
	#currentFrame = null;
	#observer = null;
	#runId = 0;
	constructor(opts) {
		this.#opts = opts;
	}
	#cleanup() {
		if (this.#currentFrame !== null) {
			window.cancelAnimationFrame(this.#currentFrame);
			this.#currentFrame = null;
		}
		this.#observer?.disconnect();
		this.#observer = null;
		this.#runId++;
	}
	run(fn) {
		this.#cleanup();
		const node = this.#opts.ref.current;
		if (!node) return;
		if (typeof node.getAnimations !== "function") {
			this.#executeCallback(fn);
			return;
		}
		const runId = this.#runId;
		const executeIfCurrent = () => {
			if (runId !== this.#runId) return;
			this.#executeCallback(fn);
		};
		const waitForAnimations = () => {
			if (runId !== this.#runId) return;
			const animations = node.getAnimations();
			if (animations.length === 0) {
				executeIfCurrent();
				return;
			}
			Promise.all(animations.map((animation) => animation.finished)).then(() => {
				executeIfCurrent();
			}).catch(() => {
				if (runId !== this.#runId) return;
				if (node.getAnimations().some((animation) => animation.pending || animation.playState !== "finished")) {
					waitForAnimations();
					return;
				}
				executeIfCurrent();
			});
		};
		const requestWaitForAnimations = () => {
			this.#currentFrame = window.requestAnimationFrame(() => {
				this.#currentFrame = null;
				waitForAnimations();
			});
		};
		if (!this.#opts.afterTick.current) {
			requestWaitForAnimations();
			return;
		}
		this.#currentFrame = window.requestAnimationFrame(() => {
			this.#currentFrame = null;
			const startingStyleAttr = "data-starting-style";
			if (!node.hasAttribute(startingStyleAttr)) {
				requestWaitForAnimations();
				return;
			}
			this.#observer = new MutationObserver(() => {
				if (runId !== this.#runId) return;
				if (node.hasAttribute(startingStyleAttr)) return;
				this.#observer?.disconnect();
				this.#observer = null;
				requestWaitForAnimations();
			});
			this.#observer.observe(node, {
				attributes: true,
				attributeFilter: [startingStyleAttr]
			});
		});
	}
	#executeCallback(fn) {
		const execute = () => {
			fn();
		};
		if (this.#opts.afterTick) afterTick(execute);
		else execute();
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/presence-manager.svelte.js
var PresenceManager = class {
	#opts;
	#enabled;
	#afterAnimations;
	#shouldRender = false;
	#transitionStatus = void 0;
	#hasMounted = false;
	#transitionFrame = null;
	constructor(opts) {
		this.#opts = opts;
		this.#shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			afterTick: this.#opts.open
		});
		watch$1(() => this.#opts.open.current, (isOpen) => {
			if (!this.#hasMounted) {
				this.#hasMounted = true;
				return;
			}
			this.#clearTransitionFrame();
			if (!isOpen && this.#opts.shouldSkipExitAnimation?.()) {
				this.#shouldRender = false;
				this.#transitionStatus = void 0;
				this.#opts.onComplete?.();
				return;
			}
			if (isOpen) this.#shouldRender = true;
			this.#transitionStatus = isOpen ? "starting" : "ending";
			if (isOpen) this.#transitionFrame = window.requestAnimationFrame(() => {
				this.#transitionFrame = null;
				if (this.#opts.open.current) this.#transitionStatus = void 0;
			});
			if (!this.#enabled) {
				if (!isOpen) this.#shouldRender = false;
				this.#transitionStatus = void 0;
				this.#opts.onComplete?.();
				return;
			}
			this.#afterAnimations.run(() => {
				if (isOpen === this.#opts.open.current) {
					if (!this.#opts.open.current) this.#shouldRender = false;
					this.#transitionStatus = void 0;
					this.#opts.onComplete?.();
				}
			});
		});
	}
	get shouldRender() {
		return this.#shouldRender;
	}
	get transitionStatus() {
		return this.#transitionStatus;
	}
	#clearTransitionFrame() {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/noop.js
/**
* A no operation function (does nothing)
*/
function noop() {}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var dialogAttrs = createBitsAttrs({
	component: "dialog",
	parts: [
		"content",
		"trigger",
		"overlay",
		"title",
		"description",
		"close",
		"cancel",
		"action"
	]
});
var DialogRootContext = new Context$1("Dialog.Root | AlertDialog.Root");
var DialogRootState = class DialogRootState {
	static create(opts) {
		const parent = DialogRootContext.getOr(null);
		return DialogRootContext.set(new DialogRootState(opts, parent));
	}
	opts;
	triggerNode = null;
	contentNode = null;
	overlayNode = null;
	descriptionNode = null;
	contentId = void 0;
	titleId = void 0;
	triggerId = void 0;
	descriptionId = void 0;
	cancelNode = null;
	nestedOpenCount = 0;
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(opts, parent) {
		this.opts = opts;
		this.parent = parent;
		this.depth = parent ? parent.depth + 1 : 0;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			enabled: true,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open,
			enabled: true
		});
		watch$1(() => this.opts.open.current, (isOpen) => {
			if (!this.parent) return;
			if (isOpen) this.parent.incrementNested();
			else this.parent.decrementNested();
		}, { lazy: true });
	}
	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}
	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	getBitsAttr = (part) => {
		return dialogAttrs.getAttr(part, this.opts.variant.current);
	};
	incrementNested() {
		this.nestedOpenCount++;
		this.parent?.incrementNested();
	}
	decrementNested() {
		if (this.nestedOpenCount === 0) return;
		this.nestedOpenCount--;
		this.parent?.decrementNested();
	}
	#sharedProps = derived(() => ({ "data-state": getDataOpenClosed(this.opts.open.current) }));
	get sharedProps() {
		return this.#sharedProps();
	}
	set sharedProps($$value) {
		return this.#sharedProps($$value);
	}
};
var DialogCloseState = class DialogCloseState {
	static create(opts) {
		return new DialogCloseState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.root.handleClose();
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr(this.opts.variant.current)]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		disabled: this.opts.disabled.current ? true : void 0,
		tabindex: 0,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogActionState = class DialogActionState {
	static create(opts) {
		return new DialogActionState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("action")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogTitleState = class DialogTitleState {
	static create(opts) {
		return new DialogTitleState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.root.titleId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref);
		watch$1.pre(() => this.opts.id.current, (id) => {
			this.root.titleId = id;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogDescriptionState = class DialogDescriptionState {
	static create(opts) {
		return new DialogDescriptionState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.root.descriptionId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.descriptionNode = v;
		});
		watch$1.pre(() => this.opts.id.current, (id) => {
			this.root.descriptionId = id;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogContentState = class DialogContentState {
	static create(opts) {
		return new DialogContentState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.contentNode = v;
			this.root.contentId = v?.id;
		});
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.getBitsAttr("content")]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount,
			contain: "layout style"
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		"data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
		"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
};
var DialogOverlayState = class DialogOverlayState {
	static create(opts) {
		return new DialogOverlayState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.overlayNode = v);
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
		"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
		...getDataTransitionAttrs(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
};
var AlertDialogCancelState = class AlertDialogCancelState {
	static create(opts) {
		return new AlertDialogCancelState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.cancelNode = v);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.root.handleClose();
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("cancel")]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		tabindex: 0,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/alert-dialog/components/alert-dialog.svelte
function Alert_dialog$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop, onOpenChangeComplete = noop, children } = $$props;
		DialogRootState.create({
			variant: boxWith(() => "alert-dialog"),
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog-title.svelte
function Dialog_title$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, level = 2, $$slots, $$events, ...restProps } = $$props;
		const titleState = DialogTitleState.create({
			id: boxWith(() => id),
			level: boxWith(() => level),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, titleState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/alert-dialog/components/alert-dialog-action.svelte
function Alert_dialog_action$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const actionState = DialogActionState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, actionState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/alert-dialog/components/alert-dialog-cancel.svelte
function Alert_dialog_cancel$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, disabled = false, $$slots, $$events, ...restProps } = $$props;
		const cancelState = AlertDialogCancelState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, cancelState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/portal/portal-consumer.svelte
function Portal_consumer($$renderer, $$props) {
	const { children } = $$props;
	$$renderer.push(`<!---->`);
	children?.($$renderer);
	$$renderer.push(`<!---->`);
	$$renderer.push(`<!---->`);
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var BitsConfigContext = new Context$1("BitsConfig");
/**
* Gets the current Bits UI configuration state from the context.
*
* Returns a default configuration (where all values are `undefined`) if no configuration is found.
*/
function getBitsConfig() {
	const fallback = new BitsConfigState(null, {});
	return BitsConfigContext.getOr(fallback).opts;
}
/**
* Configuration state that inherits from parent configurations.
*
* @example
* Config resolution:
* ```
* Level 1: { defaultPortalTo: "#some-element", theme: "dark" }
* Level 2: { spacing: "large" } // inherits defaultPortalTo="#some-element", theme="dark"
* Level 3: { theme: "light" }   // inherits defaultPortalTo="#some-element", spacing="large", overrides theme="light"
* ```
*/
var BitsConfigState = class {
	opts;
	constructor(parent, opts) {
		const resolveConfigOption = createConfigResolver(parent, opts);
		this.opts = {
			defaultPortalTo: resolveConfigOption((config) => config.defaultPortalTo),
			defaultLocale: resolveConfigOption((config) => config.defaultLocale)
		};
	}
};
/**
* Returns a config resolver that resolves a given config option's value.
*
* The resolver creates reactive boxes that resolve config option values using this priority:
* 1. Current level's value (if defined)
* 2. Parent level's value (if defined and current is undefined)
* 3. `undefined` (if no value is found in either parent or child)
*
* @param parent - Parent configuration state (null if this is root level)
* @param currentOpts - Current level's configuration options
*
* @example
* ```typescript
* // Given this hierarchy:
* // Root: { defaultPortalTo: "#some-element" }
* // Child: { someOtherProp: "value" } // no defaultPortalTo specified
*
* const resolveConfigOption = createConfigResolver(parent, opts);
* const portalTo = resolveConfigOption(config => config.defaultPortalTo);
*
* // portalTo.current === "#some-element" (inherited from parent)
* // even when child didn't specify `defaultPortalTo`
* ```
*/
function createConfigResolver(parent, currentOpts) {
	return (getter) => {
		return boxWith(() => {
			const value = getter(currentOpts)?.current;
			if (value !== void 0) return value;
			if (parent === null) return void 0;
			return getter(parent.opts)?.current;
		});
	};
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
/**
* Creates a generic prop resolver that follows a standard priority chain:
* 1. The getter's prop value (if defined)
* 2. The config default value (if no getter prop value is defined)
* 3. The fallback value (if no config value found)
*/
function createPropResolver(configOption, fallback) {
	return (getProp) => {
		const config = getBitsConfig();
		return boxWith(() => {
			const propValue = getProp();
			if (propValue !== void 0) return propValue;
			const option = configOption(config).current;
			if (option !== void 0) return option;
			return fallback;
		});
	};
}
/**
* Resolves a portal's `to` value using the prop, the config default, or a fallback.
*
* Default value: `"body"`
*/
var resolvePortalToProp = createPropResolver((config) => config.defaultPortalTo, "body");
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { to: toProp, children, disabled } = $$props;
		const to = resolvePortalToProp(() => toProp);
		const context = getAllContexts();
		let target = derived(getTarget);
		function getTarget() {
			if (!isBrowser || disabled) return null;
			let localTarget = null;
			if (typeof to.current === "string") localTarget = document.querySelector(to.current);
			else localTarget = to.current;
			return localTarget;
		}
		let instance;
		function unmountInstance() {
			if (instance) {
				unmount(instance);
				instance = null;
			}
		}
		watch$1([() => target(), () => disabled], ([target, disabled]) => {
			if (!target || disabled) {
				unmountInstance();
				return;
			}
			instance = mount(Portal_consumer, {
				target,
				props: { children },
				context
			});
			return () => {
				unmountInstance();
			};
		});
		if (disabled) {
			$$renderer.push("<!--[0-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/events.js
/**
* Creates a typed event dispatcher and listener pair for custom events
* @template T - The type of data that will be passed in the event detail
* @param eventName - The name of the custom event
* @param options - CustomEvent options (bubbles, cancelable, etc.)
*/
var CustomEventDispatcher = class {
	eventName;
	options;
	constructor(eventName, options = {
		bubbles: true,
		cancelable: true
	}) {
		this.eventName = eventName;
		this.options = options;
	}
	createEvent(detail) {
		return new CustomEvent(this.eventName, {
			...this.options,
			detail
		});
	}
	dispatch(element, detail) {
		const event = this.createEvent(detail);
		element.dispatchEvent(event);
		return event;
	}
	listen(element, callback, options) {
		const handler = (event) => {
			callback(event);
		};
		return on(element, this.eventName, handler, options);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/debounce.js
function debounce$1(fn, wait = 500) {
	let timeout = null;
	const debounced = (...args) => {
		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, wait);
	};
	debounced.destroy = () => {
		if (timeout !== null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};
	return debounced;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/elements.js
function isOrContainsTarget(node, target) {
	return node === target || node.contains(target);
}
function getOwnerDocument(el) {
	return el?.ownerDocument ?? document;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/dom.js
/**
* Determines if the click event truly occurred outside the content node.
* This was added to handle password managers and other elements that may be injected
* into the DOM but visually appear inside the content.
*/
function isClickTrulyOutside(event, contentNode) {
	const { clientX, clientY } = event;
	const rect = contentNode.getBoundingClientRect();
	return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
//#endregion
//#region node_modules/.pnpm/tabbable@6.5.0/node_modules/tabbable/dist/index.esm.js
/*!
* tabbable 6.5.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
];
var candidateSelector = /* #__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
	var _element$getRootNode;
	return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
	return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
/**
* Determines if a node is inert or in an inert ancestor.
* @param {Node} [node]
* @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
*  see if any of them are inert. If false, only `node` itself is considered.
* @returns {boolean} True if inert itself or by way of being in an inert ancestor.
*  False if `node` is falsy.
*/
var _isInert = function isInert(node, lookUp) {
	var _node$getAttribute;
	if (lookUp === void 0) lookUp = true;
	var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
	return inertAtt === "" || inertAtt === "true" || lookUp && node && (typeof node.closest === "function" ? node.closest("[inert]") : _isInert(node.parentNode));
};
/**
* Determines if a node's content is editable.
* @param {Element} [node]
* @returns True if it's content-editable; false if it's not or `node` is falsy.
*/
var isContentEditable = function isContentEditable(node) {
	var _node$getAttribute2;
	var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
	return attValue === "" || attValue === "true";
};
/**
* @param {Element} el container to check in
* @param {boolean} includeContainer add container to check
* @param {(node: Element) => boolean} filter filter candidates
* @returns {Element[]}
*/
var getCandidates = function getCandidates(el, includeContainer, filter) {
	if (_isInert(el)) return [];
	var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
	if (includeContainer && matches.call(el, candidateSelector)) candidates.unshift(el);
	candidates = candidates.filter(filter);
	return candidates;
};
/**
* @callback GetShadowRoot
* @param {Element} element to check for shadow root
* @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
*/
/**
* @callback ShadowRootFilter
* @param {Element} shadowHostNode the element which contains shadow content
* @returns {boolean} true if a shadow root could potentially contain valid candidates.
*/
/**
* @typedef {Object} CandidateScope
* @property {Element} scopeParent contains inner candidates
* @property {Element[]} candidates list of candidates found in the scope parent
*/
/**
* @typedef {Object} IterativeOptions
* @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
*  if a function, implies shadow support is enabled and either returns the shadow root of an element
*  or a boolean stating if it has an undisclosed shadow root
* @property {(node: Element) => boolean} filter filter candidates
* @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
* @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
*/
/**
* @param {Element[]} elements list of element containers to match candidates from
* @param {boolean} includeContainer add container list to check
* @param {IterativeOptions} options
* @returns {Array.<Element|CandidateScope>}
*/
var _getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
	var candidates = [];
	var elementsToCheck = Array.from(elements);
	while (elementsToCheck.length) {
		var element = elementsToCheck.shift();
		if (_isInert(element, false)) continue;
		if (element.tagName === "SLOT") {
			var assigned = element.assignedElements();
			var nestedCandidates = _getCandidatesIteratively(assigned.length ? assigned : element.children, true, options);
			if (options.flatten) candidates.push.apply(candidates, nestedCandidates);
			else candidates.push({
				scopeParent: element,
				candidates: nestedCandidates
			});
		} else {
			if (matches.call(element, candidateSelector) && options.filter(element) && (includeContainer || !elements.includes(element))) candidates.push(element);
			var shadowRoot = element.shadowRoot || typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
			var validShadowRoot = !_isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
			if (shadowRoot && validShadowRoot) {
				var _nestedCandidates = _getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
				if (options.flatten) candidates.push.apply(candidates, _nestedCandidates);
				else candidates.push({
					scopeParent: element,
					candidates: _nestedCandidates
				});
			} else elementsToCheck.unshift.apply(elementsToCheck, element.children);
		}
	}
	return candidates;
};
/**
* @private
* Determines if the node has an explicitly specified `tabindex` attribute.
* @param {HTMLElement} node
* @returns {boolean} True if so; false if not.
*/
var hasTabIndex = function hasTabIndex(node) {
	return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
/**
* Determine the tab index of a given node.
* @param {HTMLElement} node
* @returns {number} Tab order (negative, 0, or positive number).
* @throws {Error} If `node` is falsy.
*/
var getTabIndex = function getTabIndex(node) {
	if (!node) throw new Error("No node provided");
	if (node.tabIndex < 0) {
		if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) return 0;
	}
	return node.tabIndex;
};
/**
* Determine the tab index of a given node __for sort order purposes__.
* @param {HTMLElement} node
* @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
*  has tabIndex -1, but needs to be sorted by document order in order for its content to be
*  inserted into the correct sort position.
* @returns {number} Tab order (negative, 0, or positive number).
*/
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
	var tabIndex = getTabIndex(node);
	if (tabIndex < 0 && isScope && !hasTabIndex(node)) return 0;
	return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
	return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
	return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput(node) {
	return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
	return node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
		return child.tagName === "SUMMARY";
	});
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
	for (var i = 0; i < nodes.length; i++) if (nodes[i].checked && nodes[i].form === form) return nodes[i];
};
var isTabbableRadio = function isTabbableRadio(node) {
	if (!node.name) return true;
	var radioScope = node.form || getRootNode(node);
	var queryRadios = function queryRadios(name) {
		return radioScope.querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]");
	};
	var radioSet;
	if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") radioSet = queryRadios(window.CSS.escape(node.name));
	else try {
		radioSet = queryRadios(node.name);
	} catch (err) {
		console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
		return false;
	}
	var checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
};
var isRadio = function isRadio(node) {
	return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
	return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached(node) {
	var _nodeRoot;
	var nodeRoot = node && getRootNode(node);
	var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
	var attached = false;
	if (nodeRoot && nodeRoot !== node) {
		var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
		attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
		while (!attached && nodeRootHost) {
			var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
			nodeRoot = getRootNode(nodeRootHost);
			nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
			attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
		}
	}
	return attached;
};
var isZeroArea = function isZeroArea(node) {
	var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
	return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
	var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
	if (displayCheck === "full-native") {
		if ("checkVisibility" in node) return !node.checkVisibility({
			checkOpacity: false,
			opacityProperty: false,
			contentVisibilityAuto: true,
			visibilityProperty: true,
			checkVisibilityCSS: true
		});
	}
	var visibility = getComputedStyle(node).visibility;
	if (visibility === "hidden" || visibility === "collapse") return true;
	var nodeUnderDetails = matches.call(node, "details>summary:first-of-type") ? node.parentElement : node;
	if (matches.call(nodeUnderDetails, "details:not([open]) *")) return true;
	if (!displayCheck || displayCheck === "full" || displayCheck === "full-native" || displayCheck === "legacy-full") {
		if (typeof getShadowRoot === "function") {
			var originalNode = node;
			while (node) {
				var parentElement = node.parentElement;
				var rootNode = getRootNode(node);
				if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) return isZeroArea(node);
				else if (node.assignedSlot) node = node.assignedSlot;
				else if (!parentElement && rootNode !== node.ownerDocument) node = rootNode.host;
				else node = parentElement;
			}
			node = originalNode;
		}
		if (isNodeAttached(node)) return !node.getClientRects().length;
		if (displayCheck !== "legacy-full") return true;
	} else if (displayCheck === "non-zero-area") return isZeroArea(node);
	return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
		var parentNode = node.parentElement;
		while (parentNode) {
			if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
				for (var i = 0; i < parentNode.children.length; i++) {
					var child = parentNode.children.item(i);
					if (child.tagName === "LEGEND") return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
				}
				return true;
			}
			parentNode = parentNode.parentElement;
		}
	}
	return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
	if (node.disabled || isHiddenInput(node) || isHidden(node, options) || isDetailsWithSummary(node) || isDisabledFromFieldset(node)) return false;
	return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
	if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) return false;
	return true;
};
var isShadowRootTabbable = function isShadowRootTabbable(shadowHostNode) {
	var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
	if (isNaN(tabIndex) || tabIndex >= 0) return true;
	return false;
};
/**
* @param {Array.<Element|CandidateScope>} candidates
* @returns Element[]
*/
var _sortByOrder = function sortByOrder(candidates) {
	var regularTabbables = [];
	var orderedTabbables = [];
	candidates.forEach(function(item, i) {
		var isScope = !!item.scopeParent;
		var element = isScope ? item.scopeParent : item;
		var candidateTabindex = getSortOrderTabIndex(element, isScope);
		var elements = isScope ? _sortByOrder(item.candidates) : element;
		if (candidateTabindex === 0) isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
		else orderedTabbables.push({
			documentOrder: i,
			tabIndex: candidateTabindex,
			item,
			isScope,
			content: elements
		});
	});
	return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
		sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
		return acc;
	}, []).concat(regularTabbables);
};
var tabbable = function tabbable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorTabbable.bind(null, options),
		flatten: false,
		getShadowRoot: options.getShadowRoot,
		shadowRootFilter: isShadowRootTabbable
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
	return _sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorFocusable.bind(null, options),
		flatten: true,
		getShadowRoot: options.getShadowRoot
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
	return candidates;
};
var focusableCandidateSelector = /* #__PURE__ */ candidateSelectors.concat("iframe:not([inert]):not([inert] *)").join(",");
var isFocusable = function isFocusable(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, focusableCandidateSelector) === false) return false;
	return isNodeMatchingSelectorFocusable(options, node);
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";
var CONTEXT_MENU_CONTENT_ATTR = "data-context-menu-content";
new Context$1("Menu.Root");
new Context$1("Menu.Root | Menu.Sub");
new Context$1("Menu.Content");
new Context$1("Menu.Group | Menu.RadioGroup");
new Context$1("Menu.RadioGroup");
new Context$1("Menu.CheckboxGroup");
new CustomEventDispatcher("bitsmenuopen", {
	bubbles: false,
	cancelable: true
});
createBitsAttrs({
	component: "menu",
	parts: [
		"trigger",
		"content",
		"sub-trigger",
		"item",
		"group",
		"group-heading",
		"checkbox-group",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"separator",
		"sub-content",
		"arrow"
	]
});
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var DismissibleLayerState = class DismissibleLayerState {
	static create(opts) {
		return new DismissibleLayerState(opts);
	}
	opts;
	#interactOutsideProp;
	#behaviorType;
	#interceptedEvents = { pointerdown: false };
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	#documentObj = void 0;
	#onFocusOutside;
	#unsubClickListener = noop;
	constructor(opts) {
		this.opts = opts;
		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;
		let unsubEvents = noop;
		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};
		watch$1([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
			if (!this.opts.enabled.current || !this.opts.ref.current) return;
			afterSleep(1, () => {
				if (!this.opts.ref.current) return;
				globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			});
			return cleanup;
		});
	}
	#handleFocus = (event) => {
		if (event.defaultPrevented) return;
		if (!this.opts.ref.current) return;
		afterTick(() => {
			if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target)) return;
			if (event.target && !this.#isFocusInsideDOMTree) this.#onFocusOutside.current?.(event);
		});
	};
	#addEventListeners() {
		return executeCallbacks(
			/**
			* CAPTURE INTERACTION START
			* mark interaction-start event as intercepted.
			* mark responsible layer during interaction start
			* to avoid checking if is responsible layer during interaction end
			* when a new floating element may have been opened.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
			/**
			* BUBBLE INTERACTION START
			* Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			* to avoid prematurely checking if other events were intercepted.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
			/**
			* HANDLE FOCUS OUTSIDE
			*/
			on(this.#documentObj, "focusin", this.#handleFocus)
		);
	}
	#handleDismiss = (e) => {
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(e);
		this.#interactOutsideProp.current(e);
	};
	#handleInteractOutside = debounce$1((e) => {
		if (!this.opts.ref.current) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid = this.opts.isValidEvent.current(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);
		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(event);
		if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
			this.#unsubClickListener();
			return;
		}
		if (e.pointerType === "touch") {
			this.#unsubClickListener();
			this.#unsubClickListener = on(this.#documentObj, "click", this.#handleDismiss, { once: true });
		} else this.#interactOutsideProp.current(event);
	}, 10);
	#markInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = true;
	};
	#markNonInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = false;
	};
	#markResponsibleLayer = () => {
		if (!this.opts.ref.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
	};
	#isTargetWithinLayer = (target) => {
		if (!this.opts.ref.current) return false;
		return isOrContainsTarget(this.opts.ref.current, target);
	};
	#resetState = debounce$1(() => {
		for (const eventType in this.#interceptedEvents) this.#interceptedEvents[eventType] = false;
		this.#isResponsibleLayer = false;
	}, 20);
	#isAnyEventIntercepted() {
		return Object.values(this.#interceptedEvents).some(Boolean);
	}
	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};
	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};
	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture
	};
};
function getTopMostDismissableLayer(layersArr = [...globalThis.bitsDismissableLayers]) {
	return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the outside interaction. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = getTopMostDismissableLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode.opts.ref.current === node;
}
function isValidEvent(e, node) {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;
	const targetIsContextMenuTrigger = Boolean(target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`));
	const nodeIsContextMenu = Boolean(node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`));
	if ("button" in e && e.button > 0 && !targetIsContextMenuTrigger) return false;
	if ("button" in e && e.button === 0 && targetIsContextMenuTrigger && nodeIsContextMenu) return true;
	if (targetIsContextMenuTrigger && nodeIsContextMenu) return false;
	return getOwnerDocument(target).documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
}
function createWrappedEvent(e) {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;
	let newEvent;
	if (e instanceof PointerEvent) newEvent = new PointerEvent(e.type, e);
	else newEvent = new PointerEvent("pointerdown", e);
	let isPrevented = false;
	return new Proxy(newEvent, { get: (target, prop) => {
		if (prop === "currentTarget") return capturedCurrentTarget;
		if (prop === "target") return capturedTarget;
		if (prop === "preventDefault") return () => {
			isPrevented = true;
			if (typeof target.preventDefault === "function") target.preventDefault();
		};
		if (prop === "defaultPrevented") return isPrevented;
		if (prop in target) return target[prop];
		return e[prop];
	} });
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function Dismissible_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { interactOutsideBehavior = "close", onInteractOutside = noop, onFocusOutside = noop, id, children, enabled, isValidEvent = () => false, ref } = $$props;
		const dismissibleLayerState = DismissibleLayerState.create({
			id: boxWith(() => id),
			interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
			onInteractOutside: boxWith(() => onInteractOutside),
			enabled: boxWith(() => enabled),
			onFocusOutside: boxWith(() => onFocusOutside),
			isValidEvent: boxWith(() => isValidEvent),
			ref
		});
		children?.($$renderer, { props: dismissibleLayerState.props });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var EscapeLayerState = class EscapeLayerState {
	static create(opts) {
		return new EscapeLayerState(opts);
	}
	opts;
	domContext;
	constructor(opts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);
		let unsubEvents = noop;
		watch$1(() => opts.enabled.current, (enabled) => {
			if (enabled) {
				globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
				unsubEvents = this.#addEventListener();
			}
			return () => {
				unsubEvents();
				globalThis.bitsEscapeLayers.delete(this);
			};
		});
	}
	#addEventListener = () => {
		return on(this.domContext.getDocument(), "keydown", this.#onkeydown, { passive: false });
	};
	#onkeydown = (e) => {
		if (e.key !== "Escape" || !isResponsibleEscapeLayer(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior.current;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		this.opts.onEscapeKeydown.current(clonedEvent);
	};
};
function isResponsibleEscapeLayer(instance) {
	const layersArr = [...globalThis.bitsEscapeLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the escape. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode === instance;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function Escape_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { escapeKeydownBehavior = "close", onEscapeKeydown = noop, children, enabled, ref } = $$props;
		EscapeLayerState.create({
			escapeKeydownBehavior: boxWith(() => escapeKeydownBehavior),
			onEscapeKeydown: boxWith(() => onEscapeKeydown),
			enabled: boxWith(() => enabled),
			ref
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var FocusScopeManager = class FocusScopeManager {
	static instance;
	#scopeStack = simpleBox([]);
	#focusHistory = /* @__PURE__ */ new WeakMap();
	#preFocusHistory = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		if (!this.instance) this.instance = new FocusScopeManager();
		return this.instance;
	}
	register(scope) {
		const current = this.getActive();
		if (current && current !== scope) current.pause();
		const activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) this.#preFocusHistory.set(scope, activeElement);
		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		this.#scopeStack.current.unshift(scope);
	}
	unregister(scope) {
		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		const next = this.getActive();
		if (next) next.resume();
	}
	getActive() {
		return this.#scopeStack.current[0];
	}
	setFocusMemory(scope, element) {
		this.#focusHistory.set(scope, element);
	}
	getFocusMemory(scope) {
		return this.#focusHistory.get(scope);
	}
	isActiveScope(scope) {
		return this.getActive() === scope;
	}
	setPreFocusMemory(scope, element) {
		this.#preFocusHistory.set(scope, element);
	}
	getPreFocusMemory(scope) {
		return this.#preFocusHistory.get(scope);
	}
	clearPreFocusMemory(scope) {
		this.#preFocusHistory.delete(scope);
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte.js
var FocusScope = class FocusScope {
	#paused = false;
	#container = null;
	#manager = FocusScopeManager.getInstance();
	#cleanupFns = [];
	#opts;
	constructor(opts) {
		this.#opts = opts;
	}
	get paused() {
		return this.#paused;
	}
	pause() {
		this.#paused = true;
	}
	resume() {
		this.#paused = false;
	}
	#cleanup() {
		for (const fn of this.#cleanupFns) fn();
		this.#cleanupFns = [];
	}
	mount(container) {
		if (this.#container) this.unmount();
		this.#container = container;
		this.#manager.register(this);
		this.#setupEventListeners();
		this.#handleOpenAutoFocus();
	}
	unmount() {
		if (!this.#container) return;
		this.#cleanup();
		this.#handleCloseAutoFocus();
		this.#manager.unregister(this);
		this.#manager.clearPreFocusMemory(this);
		this.#container = null;
	}
	#handleOpenAutoFocus() {
		if (!this.#container) return;
		const event = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: false,
			cancelable: true
		});
		this.#opts.onOpenAutoFocus.current(event);
		if (!event.defaultPrevented) requestAnimationFrame(() => {
			if (!this.#container) return;
			const firstTabbable = this.#getFirstTabbable();
			if (firstTabbable) {
				firstTabbable.focus();
				this.#manager.setFocusMemory(this, firstTabbable);
			} else this.#container.focus();
		});
	}
	#handleCloseAutoFocus() {
		const event = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: false,
			cancelable: true
		});
		this.#opts.onCloseAutoFocus.current?.(event);
		if (!event.defaultPrevented) {
			const preFocusedElement = this.#manager.getPreFocusMemory(this);
			if (preFocusedElement && document.contains(preFocusedElement)) try {
				preFocusedElement.focus();
			} catch {
				document.body.focus();
			}
		}
	}
	#setupEventListeners() {
		if (!this.#container || !this.#opts.trap.current) return;
		const container = this.#container;
		const doc = container.ownerDocument;
		const handleFocus = (e) => {
			if (this.#paused || !this.#manager.isActiveScope(this)) return;
			const target = e.target;
			if (!target) return;
			if (container.contains(target)) this.#manager.setFocusMemory(this, target);
			else {
				const lastFocused = this.#manager.getFocusMemory(this);
				if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
					e.preventDefault();
					lastFocused.focus();
				} else {
					const firstTabbable = this.#getFirstTabbable();
					const firstFocusable = this.#getAllFocusables()[0];
					(firstTabbable || firstFocusable || container).focus();
				}
			}
		};
		const handleKeydown = (e) => {
			if (!this.#opts.loop || this.#paused || e.key !== "Tab") return;
			if (!this.#manager.isActiveScope(this)) return;
			const tabbables = this.#getTabbables();
			if (tabbables.length === 0) return;
			const first = tabbables[0];
			const last = tabbables[tabbables.length - 1];
			if (!e.shiftKey && doc.activeElement === last) {
				e.preventDefault();
				first.focus();
			} else if (e.shiftKey && doc.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		};
		this.#cleanupFns.push(on(doc, "focusin", handleFocus, { capture: true }), on(container, "keydown", handleKeydown));
		const observer = new MutationObserver(() => {
			const lastFocused = this.#manager.getFocusMemory(this);
			if (lastFocused && !container.contains(lastFocused)) {
				const firstTabbable = this.#getFirstTabbable();
				const firstFocusable = this.#getAllFocusables()[0];
				const elementToFocus = firstTabbable || firstFocusable;
				if (elementToFocus) {
					elementToFocus.focus();
					this.#manager.setFocusMemory(this, elementToFocus);
				} else container.focus();
			}
		});
		observer.observe(container, {
			childList: true,
			subtree: true
		});
		this.#cleanupFns.push(() => observer.disconnect());
	}
	#getTabbables() {
		if (!this.#container) return [];
		return tabbable(this.#container, {
			includeContainer: false,
			getShadowRoot: true
		});
	}
	#getFirstTabbable() {
		return this.#getTabbables()[0] || null;
	}
	#getAllFocusables() {
		if (!this.#container) return [];
		return focusable(this.#container, {
			includeContainer: false,
			getShadowRoot: true
		});
	}
	static use(opts) {
		let scope = null;
		watch$1([() => opts.ref.current, () => opts.enabled.current], ([ref, enabled]) => {
			if (ref && enabled) {
				if (!scope) scope = new FocusScope(opts);
				scope.mount(ref);
			} else if (scope) {
				scope.unmount();
				scope = null;
			}
		});
		return { get props() {
			return { tabindex: -1 };
		} };
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function Focus_scope($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { enabled = false, trapFocus = false, loop = false, onCloseAutoFocus = noop, onOpenAutoFocus = noop, focusScope, ref } = $$props;
		const focusScopeState = FocusScope.use({
			enabled: boxWith(() => enabled),
			trap: boxWith(() => trapFocus),
			loop,
			onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
			onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
			ref
		});
		focusScope?.($$renderer, { props: focusScopeState.props });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var noopPointer = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var TextSelectionLayerState = class TextSelectionLayerState {
	static create(opts) {
		return new TextSelectionLayerState(opts);
	}
	opts;
	domContext;
	#unsubSelectionLock = noop;
	#enabledSnapshot = false;
	#onPointerDownSnapshot = noopPointer;
	#onPointerUpSnapshot = noopPointer;
	constructor(opts) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		let unsubEvents = noop;
		watch$1(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([enabled, onPointerDown, onPointerUp]) => {
			this.#enabledSnapshot = enabled;
			this.#onPointerDownSnapshot = onPointerDown;
			this.#onPointerUpSnapshot = onPointerUp;
			if (enabled) {
				globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			}
			return () => {
				this.#enabledSnapshot = false;
				unsubEvents();
				this.#resetSelectionLock();
				globalThis.bitsTextSelectionLayers.delete(this);
			};
		});
	}
	#addEventListeners() {
		return executeCallbacks(on(this.domContext.getDocument(), "pointerdown", this.#pointerdown), on(this.domContext.getDocument(), "pointerup", composeHandlers(this.#resetSelectionLock, this.#pointerupUserHandler)));
	}
	#pointerupUserHandler = (e) => {
		this.#onPointerUpSnapshot(e);
	};
	#pointerdown = (e) => {
		const node = this.opts.ref.current;
		const target = e.target;
		if (!isHTMLElement(node) || !isHTMLElement(target) || !this.#enabledSnapshot) return;
		/**
		* We only lock user-selection overflow if layer is the top most layer and
		* pointerdown occurred inside the node. You are still allowed to select text
		* outside the node provided pointerdown occurs outside the node.
		*/
		if (!isHighestLayer(this) || !contains(node, target)) return;
		this.#onPointerDownSnapshot(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node, this.domContext.getDocument().body);
	};
	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = noop;
	};
};
var getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node, body) {
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, "none");
	setUserSelect(node, "text");
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}
function setUserSelect(node, value) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
	const layersArr = [...globalThis.bitsTextSelectionLayers];
	if (!layersArr.length) return false;
	const highestLayer = layersArr.at(-1);
	if (!highestLayer) return false;
	return highestLayer[0] === instance;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function Text_selection_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventOverflowTextSelection = true, onPointerDown = noop, onPointerUp = noop, id, children, enabled, ref } = $$props;
		TextSelectionLayerState.create({
			id: boxWith(() => id),
			onPointerDown: boxWith(() => onPointerDown),
			onPointerUp: boxWith(() => onPointerUp),
			enabled: boxWith(() => enabled && preventOverflowTextSelection),
			ref
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
/**
* Generates a unique ID based on a global counter.
*/
function useId(prefix = "bits") {
	globalThis.bitsIdCounter.current++;
	return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var SharedState = class {
	#factory;
	#subscribers = 0;
	#state;
	#scope;
	constructor(factory) {
		this.#factory = factory;
	}
	#dispose() {
		this.#subscribers -= 1;
		if (this.#scope && this.#subscribers <= 0) {
			this.#scope();
			this.#state = void 0;
			this.#scope = void 0;
		}
	}
	get(...args) {
		this.#subscribers += 1;
		if (this.#state === void 0) this.#scope = () => {};
		return this.#state;
	}
};
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/internal/body-scroll-lock.svelte.js
var lockMap = new SvelteMap();
var initialBodyStyle = null;
var cleanupTimeoutId = null;
var isInCleanupTransition = false;
var anyLocked = boxWith(() => {
	for (const value of lockMap.values()) if (value) return true;
	return false;
});
/**
* We track the time we scheduled the cleanup to prevent race conditions
* when multiple locks are created/destroyed in the same tick, ensuring
* only the last one to schedule the cleanup will run.
*
* reference: https://github.com/huntabyte/bits-ui/issues/1639
*/
var cleanupScheduledAt = null;
var bodyLockStackCount = new SharedState(() => {
	function resetBodyStyle() {}
	function cancelPendingCleanup() {
		if (cleanupTimeoutId === null) return;
		window.clearTimeout(cleanupTimeoutId);
		cleanupTimeoutId = null;
	}
	function scheduleCleanupIfNoNewLocks(delay, callback) {
		cancelPendingCleanup();
		isInCleanupTransition = true;
		cleanupScheduledAt = Date.now();
		const currentCleanupId = cleanupScheduledAt;
		/**
		* We schedule the cleanup to run after a delay to allow new locks to register
		* that might have been added in the same tick as the current cleanup.
		*
		* If a new lock is added in the same tick, the cleanup will be cancelled and
		* a new cleanup will be scheduled.
		*
		* This is to prevent the cleanup from running too early and resetting the body
		* style before the new lock has had a chance to apply its styles.
		*/
		const cleanupFn = () => {
			cleanupTimeoutId = null;
			if (cleanupScheduledAt !== currentCleanupId) return;
			if (!isAnyLocked(lockMap)) {
				isInCleanupTransition = false;
				callback();
			} else isInCleanupTransition = false;
		};
		const actualDelay = delay === null ? 24 : delay;
		cleanupTimeoutId = window.setTimeout(cleanupFn, actualDelay);
	}
	function ensureInitialStyleCaptured() {
		if (initialBodyStyle === null && lockMap.size === 0 && !isInCleanupTransition) initialBodyStyle = document.body.getAttribute("style");
	}
	watch$1(() => anyLocked.current, () => {
		if (!anyLocked.current) return;
		ensureInitialStyleCaptured();
		isInCleanupTransition = false;
		const htmlStyle = getComputedStyle(document.documentElement);
		const bodyStyle = getComputedStyle(document.body);
		const hasStableGutter = htmlStyle.scrollbarGutter?.includes("stable") || bodyStyle.scrollbarGutter?.includes("stable");
		const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const config = {
			padding: Number.parseInt(bodyStyle.paddingRight ?? "0", 10) + verticalScrollbarWidth,
			margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10)
		};
		if (verticalScrollbarWidth > 0 && !hasStableGutter) {
			document.body.style.paddingRight = `${config.padding}px`;
			document.body.style.marginRight = `${config.margin}px`;
			document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
		}
		document.body.style.overflow = "hidden";
		if (isIOS) on(document, "touchmove", (e) => {
			if (e.target !== document.documentElement) return;
			if (e.touches.length > 1) return;
			e.preventDefault();
		}, { passive: false });
		/**
		* We ensure pointer-events: none is applied _after_ DOM updates, so that any focus/
		* interaction changes from opening overlays/menus complete _before_ we block pointer
		* events.
		*
		* this avoids race conditions where pointer-events could be set too early and break
		* focus/interaction.
		*/
		afterTick(() => {
			document.body.style.pointerEvents = "none";
			document.body.style.overflow = "hidden";
		});
	});
	return {
		get lockMap() {
			return lockMap;
		},
		resetBodyStyle,
		scheduleCleanupIfNoNewLocks,
		cancelPendingCleanup,
		ensureInitialStyleCaptured
	};
});
var BodyScrollLock = class {
	#id = useId();
	#initialState;
	#restoreScrollDelay = () => null;
	#countState;
	locked;
	constructor(initialState, restoreScrollDelay = () => null) {
		this.#initialState = initialState;
		this.#restoreScrollDelay = restoreScrollDelay;
		this.#countState = bodyLockStackCount.get();
		if (!this.#countState) return;
		/**
		* Since a new lock is being created, we cancel any pending cleanup to
		* prevent the cleanup from running too early and resetting the body style
		* before the new lock has had a chance to apply its styles.
		*
		* reference: https://github.com/huntabyte/bits-ui/issues/1639
		*/
		this.#countState.cancelPendingCleanup();
		this.#countState.ensureInitialStyleCaptured();
		this.#countState.lockMap.set(this.#id, this.#initialState ?? false);
		this.locked = boxWith(() => this.#countState.lockMap.get(this.#id) ?? false, (v) => this.#countState.lockMap.set(this.#id, v));
	}
};
function isAnyLocked(map) {
	for (const [_, value] of map) if (value) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function Scroll_lock($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventScroll = true, restoreScrollDelay = null } = $$props;
		if (preventScroll) new BodyScrollLock(preventScroll, () => restoreScrollDelay);
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/alert-dialog/components/alert-dialog-content.svelte
function Alert_dialog_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, ref = null, forceMount = false, interactOutsideBehavior = "ignore", onCloseAutoFocus = noop, onEscapeKeydown = noop, onOpenAutoFocus = noop, onInteractOutside = noop, preventScroll = true, trapFocus = true, restoreScrollDelay = null, $$slots, $$events, ...restProps } = $$props;
		const contentState = DialogContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (contentState.shouldRender || forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function focusScope($$renderer, { props: focusScopeProps }) {
					Escape_layer($$renderer, spread_props([mergedProps(), {
						enabled: contentState.root.opts.open.current,
						ref: contentState.opts.ref,
						onEscapeKeydown: (e) => {
							onEscapeKeydown(e);
							if (e.defaultPrevented) return;
							contentState.root.handleClose();
						},
						children: ($$renderer) => {
							Dismissible_layer($$renderer, spread_props([mergedProps(), {
								ref: contentState.opts.ref,
								enabled: contentState.root.opts.open.current,
								interactOutsideBehavior,
								onInteractOutside: (e) => {
									onInteractOutside(e);
									if (e.defaultPrevented) return;
									contentState.root.handleClose();
								},
								children: ($$renderer) => {
									Text_selection_layer($$renderer, spread_props([mergedProps(), {
										ref: contentState.opts.ref,
										enabled: contentState.root.opts.open.current,
										children: ($$renderer) => {
											if (child) {
												$$renderer.push("<!--[0-->");
												if (contentState.root.opts.open.current) {
													$$renderer.push("<!--[0-->");
													Scroll_lock($$renderer, {
														preventScroll,
														restoreScrollDelay
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												child($$renderer, {
													props: mergeProps(mergedProps(), focusScopeProps),
													...contentState.snippetProps
												});
												$$renderer.push(`<!---->`);
											} else {
												$$renderer.push("<!--[-1-->");
												Scroll_lock($$renderer, { preventScroll });
												$$renderer.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
												children?.($$renderer);
												$$renderer.push(`<!----></div>`);
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									}]));
								},
								$$slots: { default: true }
							}]));
						},
						$$slots: { default: true }
					}]));
				}
				Focus_scope($$renderer, {
					ref: contentState.opts.ref,
					loop: true,
					trapFocus,
					enabled: contentState.root.opts.open.current,
					onCloseAutoFocus,
					onOpenAutoFocus: (e) => {
						onOpenAutoFocus(e);
						if (e.defaultPrevented) return;
						e.preventDefault();
						afterSleep(0, () => contentState.opts.ref.current?.focus());
					},
					focusScope,
					$$slots: { focusScope: true }
				});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
function Dialog_overlay$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), forceMount = false, child, children, ref = null, $$slots, $$events, ...restProps } = $$props;
		const overlayState = DialogOverlayState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, overlayState.props));
		if (overlayState.shouldRender || forceMount) {
			$$renderer.push("<!--[0-->");
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, {
					props: mergeProps(mergedProps()),
					...overlayState.snippetProps
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergeProps(mergedProps()) })}>`);
				children?.($$renderer, overlayState.snippetProps);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
function Dialog_description$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, ref = null, $$slots, $$events, ...restProps } = $$props;
		const descriptionState = DialogDescriptionState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, descriptionState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function Dialog$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop, onOpenChangeComplete = noop, children } = $$props;
		DialogRootState.create({
			variant: boxWith(() => "dialog"),
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog-close.svelte
function Dialog_close($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, disabled = false, $$slots, $$events, ...restProps } = $$props;
		const closeState = DialogCloseState.create({
			variant: boxWith(() => "close"),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, closeState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/bits-ui@2.18.1_@internation_782ae3ce00c5c3f59cccdbbed52ee160/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
function Dialog_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, ref = null, forceMount = false, onCloseAutoFocus = noop, onOpenAutoFocus = noop, onEscapeKeydown = noop, onInteractOutside = noop, trapFocus = true, preventScroll = true, restoreScrollDelay = null, $$slots, $$events, ...restProps } = $$props;
		const contentState = DialogContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (contentState.shouldRender || forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function focusScope($$renderer, { props: focusScopeProps }) {
					Escape_layer($$renderer, spread_props([mergedProps(), {
						enabled: contentState.root.opts.open.current,
						ref: contentState.opts.ref,
						onEscapeKeydown: (e) => {
							onEscapeKeydown(e);
							if (e.defaultPrevented) return;
							contentState.root.handleClose();
						},
						children: ($$renderer) => {
							Dismissible_layer($$renderer, spread_props([mergedProps(), {
								ref: contentState.opts.ref,
								enabled: contentState.root.opts.open.current,
								onInteractOutside: (e) => {
									onInteractOutside(e);
									if (e.defaultPrevented) return;
									contentState.root.handleClose();
								},
								children: ($$renderer) => {
									Text_selection_layer($$renderer, spread_props([mergedProps(), {
										ref: contentState.opts.ref,
										enabled: contentState.root.opts.open.current,
										children: ($$renderer) => {
											if (child) {
												$$renderer.push("<!--[0-->");
												if (contentState.root.opts.open.current) {
													$$renderer.push("<!--[0-->");
													Scroll_lock($$renderer, {
														preventScroll,
														restoreScrollDelay
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												child($$renderer, {
													props: mergeProps(mergedProps(), focusScopeProps),
													...contentState.snippetProps
												});
												$$renderer.push(`<!---->`);
											} else {
												$$renderer.push("<!--[-1-->");
												Scroll_lock($$renderer, { preventScroll });
												$$renderer.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
												children?.($$renderer);
												$$renderer.push(`<!----></div>`);
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									}]));
								},
								$$slots: { default: true }
							}]));
						},
						$$slots: { default: true }
					}]));
				}
				Focus_scope($$renderer, {
					ref: contentState.opts.ref,
					loop: true,
					trapFocus,
					enabled: contentState.root.opts.open.current,
					onOpenAutoFocus,
					onCloseAutoFocus,
					focusScope,
					$$slots: { focusScope: true }
				});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/x.svelte
function X($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "x" },
		props,
		{ iconNode: [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]] }
	]));
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-portal.svelte
function Dialog_portal($$renderer, $$props) {
	let { $$slots, $$events, ...restProps } = $$props;
	if (Portal) {
		$$renderer.push("<!--[-->");
		Portal($$renderer, spread_props([restProps]));
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-content.svelte
function Dialog_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, portalProps, children, showCloseButton = true, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Dialog_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					if (Dialog_overlay) {
						$$renderer.push("<!--[-->");
						Dialog_overlay($$renderer, {});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Dialog_content$1) {
						$$renderer.push("<!--[-->");
						Dialog_content$1($$renderer, spread_props([
							{
								"data-slot": "dialog-content",
								class: cn("grid max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none", className)
							},
							restProps,
							{
								get ref() {
									return ref;
								},
								set ref($$value) {
									ref = $$value;
									$$settled = false;
								},
								children: ($$renderer) => {
									children?.($$renderer);
									$$renderer.push(`<!----> `);
									if (showCloseButton) {
										$$renderer.push("<!--[0-->");
										{
											function child($$renderer, { props }) {
												Button($$renderer, spread_props([
													{
														variant: "ghost",
														class: "absolute top-2 right-2",
														size: "icon-sm"
													},
													props,
													{
														children: ($$renderer) => {
															X($$renderer, {});
															$$renderer.push(`<!----> <span class="sr-only">Close</span>`);
														},
														$$slots: { default: true }
													}
												]));
											}
											if (Dialog_close) {
												$$renderer.push("<!--[-->");
												Dialog_close($$renderer, {
													"data-slot": "dialog-close",
													child,
													$$slots: { child: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										}
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							}
						]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-description.svelte
function Dialog_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_description$1) {
				$$renderer.push("<!--[-->");
				Dialog_description$1($$renderer, spread_props([
					{
						"data-slot": "dialog-description",
						class: cn("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-footer.svelte
function Dialog_footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, showCloseButton = false, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "dialog-footer",
			class: clsx(cn("-mx-4 -mb-4 rounded-b-xl border-t bg-muted/50 p-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		if (showCloseButton) {
			$$renderer.push("<!--[0-->");
			{
				function child($$renderer, { props }) {
					Button($$renderer, spread_props([
						{ variant: "outline" },
						props,
						{
							children: ($$renderer) => {
								$$renderer.push(`<!---->Close`);
							},
							$$slots: { default: true }
						}
					]));
				}
				if (Dialog_close) {
					$$renderer.push("<!--[-->");
					Dialog_close($$renderer, {
						child,
						$$slots: { child: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-header.svelte
function Dialog_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "dialog-header",
			class: clsx(cn("gap-2 flex flex-col", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-overlay.svelte
function Dialog_overlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_overlay$1) {
				$$renderer.push("<!--[-->");
				Dialog_overlay$1($$renderer, spread_props([
					{
						"data-slot": "dialog-overlay",
						class: cn("bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog-title.svelte
function Dialog_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_title$1) {
				$$renderer.push("<!--[-->");
				Dialog_title$1($$renderer, spread_props([
					{
						"data-slot": "dialog-title",
						class: cn("text-base leading-none font-medium", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/dialog/dialog.svelte
function Dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog$1) {
				$$renderer.push("<!--[-->");
				Dialog$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					}
				}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/info.svelte
function Info($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "info" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "M12 16v-4" }],
			["path", { "d": "M12 8h.01" }]
		] }
	]));
}
//#endregion
//#region node_modules/.pnpm/@lucide+svelte@1.31.0_svelte@5.56.8/node_modules/@lucide/svelte/dist/icons/octagon-x.svelte
function Octagon_x($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "octagon-x" },
		props,
		{ iconNode: [
			["path", { "d": "m15 9-6 6" }],
			["path", { "d": "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" }],
			["path", { "d": "m9 9 6 6" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/modals/DailySalesModal.svelte
function DailySalesModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let open, breakdown, maxAmount, avgTx;
		function handleOpenChange(isOpen) {
			if (!isOpen) modals.closeDailySales();
		}
		$: open = store_get($$store_subs ??= {}, "$modals", modals).dailySales;
		$: breakdown = (() => {
			const map = /* @__PURE__ */ new Map();
			for (const tx of store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions)) map.set(tx.service, (map.get(tx.service) ?? 0) + tx.amount);
			return [...map.entries()].sort((a, b) => b[1] - a[1]);
		})();
		$: maxAmount = breakdown.length > 0 ? breakdown[0][1] : 1;
		$: avgTx = store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).length > 0 ? Math.round(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue) / store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).length) : 0;
		Dialog($$renderer, {
			open,
			onOpenChange: handleOpenChange,
			children: ($$renderer) => {
				Dialog_content($$renderer, {
					class: "sm:max-w-lg",
					children: ($$renderer) => {
						Dialog_header($$renderer, {
							children: ($$renderer) => {
								Dialog_title($$renderer, {
									class: "flex items-center gap-2",
									children: ($$renderer) => {
										Trending_up($$renderer, { class: "h-5 w-5 text-emerald-500" });
										$$renderer.push(`<!----> Today's sales`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								Dialog_description($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<!---->Daily sales overview and breakdown`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <div class="space-y-6"><div class="grid grid-cols-2 gap-4"><div class="glow-stat-card glow-emerald"><div class="glow-stat-card__inner p-4"><p class="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Total sales</p> <p class="mt-2 text-2xl font-bold tracking-[-0.05em] text-foreground">₦${escape_html(store_get($$store_subs ??= {}, "$todayRevenue", todayRevenue).toLocaleString())}</p></div></div> <div class="glow-stat-card glow-blue"><div class="glow-stat-card__inner p-4"><p class="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Transactions</p> <p class="mt-2 text-2xl font-bold tracking-[-0.05em] text-foreground">${escape_html(store_get($$store_subs ??= {}, "$todayTransactions", todayTransactions).length)}</p> <p class="mt-1 text-xs text-muted-foreground">Avg: ₦${escape_html(avgTx.toLocaleString())}</p></div></div></div> <div class="glow-panel p-4"><p class="mb-4 text-sm font-semibold text-foreground">Sales by service</p> <div class="space-y-3"><!--[-->`);
						const each_array = ensure_array_like(breakdown);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let [service, amount] = each_array[$$index];
							$$renderer.push(`<div><div class="mb-1 flex items-center justify-between"><span class="text-sm text-foreground">${escape_html(service)}</span> <span class="text-xs font-semibold text-foreground">₦${escape_html(amount.toLocaleString())}</span></div> <div class="h-2 w-full rounded-full bg-muted"><div class="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-500"${attr_style(`width: ${stringify(amount / maxAmount * 100)}%`)}></div></div></div>`);
						}
						$$renderer.push(`<!--]--> `);
						if (breakdown.length === 0) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="text-sm text-muted-foreground">No sales recorded today.</p>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div></div></div> `);
						Dialog_footer($$renderer, {
							class: "border-t-0 bg-transparent p-0 pt-2",
							children: ($$renderer) => {
								Button($$renderer, {
									variant: "outline",
									onclick: () => modals.closeDailySales(),
									children: ($$renderer) => {
										$$renderer.push(`<!---->Close`);
									},
									$$slots: { default: true }
								});
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
			},
			$$slots: { default: true }
		});
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/lib/components/modals/NewTransactionModal.svelte
function NewTransactionModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let open;
		let formData = {
			service: "",
			customer: "",
			amount: "",
			description: ""
		};
		function handleOpenChange(isOpen) {
			if (!isOpen) {
				modals.closeNewTransaction();
				formData = {
					service: "",
					customer: "",
					amount: "",
					description: ""
				};
			}
		}
		$: open = store_get($$store_subs ??= {}, "$modals", modals).newTransaction;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Dialog($$renderer, {
				open,
				onOpenChange: handleOpenChange,
				children: ($$renderer) => {
					Dialog_content($$renderer, {
						class: "sm:max-w-md",
						children: ($$renderer) => {
							Dialog_header($$renderer, {
								children: ($$renderer) => {
									Dialog_title($$renderer, {
										class: "flex items-center gap-2",
										children: ($$renderer) => {
											Plus($$renderer, { class: "h-5 w-5 text-primary" });
											$$renderer.push(`<!----> New transaction`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Dialog_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Record a new service transaction`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <form class="space-y-4"><div class="space-y-2">`);
							Label($$renderer, {
								for: "modal-service",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Service`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							$$renderer.select({
								id: "modal-service",
								value: formData.service,
								class: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
							}, ($$renderer) => {
								$$renderer.option({ value: "" }, ($$renderer) => {
									$$renderer.push(`Select a service`);
								});
								$$renderer.push(`<!--[-->`);
								const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$services", services).filter((s) => s.active));
								for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
									let s = each_array[$$index];
									$$renderer.option({ value: s.id }, ($$renderer) => {
										$$renderer.push(`${escape_html(s.name)}`);
									});
								}
								$$renderer.push(`<!--]-->`);
							});
							$$renderer.push(`</div> <div class="space-y-2">`);
							Label($$renderer, {
								for: "modal-customer",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Customer name`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								id: "modal-customer",
								placeholder: "Customer name",
								get value() {
									return formData.customer;
								},
								set value($$value) {
									formData.customer = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> <div class="space-y-2">`);
							Label($$renderer, {
								for: "modal-amount",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Amount (₦)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Input($$renderer, {
								id: "modal-amount",
								type: "number",
								placeholder: "0",
								get value() {
									return formData.amount;
								},
								set value($$value) {
									formData.amount = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----></div> <div class="space-y-2">`);
							Label($$renderer, {
								for: "modal-description",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Description (optional)`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <textarea id="modal-description" class="h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">`);
							const $$body = escape_html(formData.description);
							if ($$body) $$renderer.push(`${$$body}`);
							$$renderer.push(`</textarea></div> `);
							Dialog_footer($$renderer, {
								class: "border-t-0 bg-transparent p-0 pt-2",
								children: ($$renderer) => {
									Button($$renderer, {
										type: "button",
										variant: "outline",
										onclick: () => modals.closeNewTransaction(),
										children: ($$renderer) => {
											$$renderer.push(`<!---->Cancel`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Button($$renderer, {
										type: "submit",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Create`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/Loader.svelte
var bars = Array(12).fill(0);
function Loader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		"use strict";
		let { visible, class: className } = $$props;
		$$renderer.push(`<div${attr_class(clsx(["sonner-loading-wrapper", className].filter(Boolean).join(" ")))}${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`);
		const each_array = ensure_array_like(bars);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			each_array[i];
			$$renderer.push(`<div class="sonner-loading-bar"></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow = void 0;
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber((update) => {
			const cleanupFocusIn = on(window, "focusin", update);
			const cleanupFocusOut = on(window, "focusout", update);
			return () => {
				cleanupFocusIn();
				cleanupFocusOut();
			};
		});
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement(this.#document);
	}
};
new ActiveElement();
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/utilities/context/context.js
var Context = class {
	#name;
	#key;
	/**
	* @param name The name of the context.
	* This is used for generating the context key and error messages.
	*/
	constructor(name) {
		this.#name = name;
		this.#key = Symbol(name);
	}
	/**
	* The key used to get and set the context.
	*
	* It is not recommended to use this value directly.
	* Instead, use the methods provided by this class.
	*/
	get key() {
		return this.#key;
	}
	/**
	* Checks whether this has been set in the context of a parent component.
	*
	* Must be called during component initialisation.
	*/
	exists() {
		return hasContext(this.#key);
	}
	/**
	* Retrieves the context that belongs to the closest parent component.
	*
	* Must be called during component initialisation.
	*
	* @throws An error if the context does not exist.
	*/
	get() {
		const context = getContext(this.#key);
		if (context === void 0) throw new Error(`Context "${this.#name}" not found`);
		return context;
	}
	/**
	* Retrieves the context that belongs to the closest parent component,
	* or the given fallback value if the context does not exist.
	*
	* Must be called during component initialisation.
	*/
	getOr(fallback) {
		const context = getContext(this.#key);
		if (context === void 0) return fallback;
		return context;
	}
	/**
	* Associates the given value with the current component and returns it.
	*
	* Must be called during component initialisation.
	*/
	set(context) {
		return setContext(this.#key, context);
	}
};
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch(sources, effect, options) {
	runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
	runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
function watchOnce(source, effect) {}
function watchOncePre(source, effect) {}
watchOnce.pre = watchOncePre;
//#endregion
//#region node_modules/.pnpm/runed@0.28.0_svelte@5.56.8/node_modules/runed/dist/utilities/resource/resource.svelte.js
function debounce(fn, delay) {
	let timeoutId;
	let lastResolve = null;
	return (...args) => {
		return new Promise((resolve) => {
			if (lastResolve) lastResolve(void 0);
			lastResolve = resolve;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async () => {
				const result = await fn(...args);
				if (lastResolve) {
					lastResolve(result);
					lastResolve = null;
				}
			}, delay);
		});
	};
}
function throttle(fn, delay) {
	let lastRun = 0;
	let lastPromise = null;
	return (...args) => {
		const now = Date.now();
		if (lastRun && now - lastRun < delay) return lastPromise ?? Promise.resolve(void 0);
		lastRun = now;
		lastPromise = fn(...args);
		return lastPromise;
	};
}
function runResource(source, fetcher, options = {}, effectFn) {
	const { lazy = false, once = false, initialValue, debounce: debounceTime, throttle: throttleTime } = options;
	let current = initialValue;
	let loading = false;
	let error = void 0;
	let cleanupFns = [];
	const runCleanup = () => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	};
	const onCleanup = (fn) => {
		cleanupFns = [...cleanupFns, fn];
	};
	const baseFetcher = async (value, previousValue, refetching = false) => {
		try {
			loading = true;
			error = void 0;
			runCleanup();
			const controller = new AbortController();
			onCleanup(() => controller.abort());
			const result = await fetcher(value, previousValue, {
				data: current,
				refetching,
				onCleanup,
				signal: controller.signal
			});
			current = result;
			return result;
		} catch (e) {
			if (!(e instanceof DOMException && e.name === "AbortError")) error = e;
			return;
		} finally {
			loading = false;
		}
	};
	const runFetcher = debounceTime ? debounce(baseFetcher, debounceTime) : throttleTime ? throttle(baseFetcher, throttleTime) : baseFetcher;
	const sources = Array.isArray(source) ? source : [source];
	let prevValues;
	effectFn((values, previousValues) => {
		if (once && prevValues) return;
		prevValues = values;
		runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? previousValues : previousValues?.[0]);
	}, { lazy });
	return {
		get current() {
			return current;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		mutate: (value) => {
			current = value;
		},
		refetch: (info) => {
			const values = sources.map((s) => s());
			return runFetcher(Array.isArray(source) ? values : values[0], Array.isArray(source) ? values : values[0], info ?? true);
		}
	};
}
function resource(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getters = () => sources.map((s) => s());
		watch(getters, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
function resourcePre(source, fetcher, options) {
	return runResource(source, fetcher, options, (fn, options) => {
		const sources = Array.isArray(source) ? source : [source];
		const getter = () => sources.map((s) => s());
		watch.pre(getter, (values, previousValues) => {
			fn(values, previousValues ?? []);
		}, options);
	});
}
resource.pre = resourcePre;
new Context("richColorsContext");
var sonnerContext = new Context("<Toaster/>");
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/types.js
function isAction(action) {
	return action.label !== void 0;
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/internal/use-document-hidden.svelte.js
function useDocumentHidden() {
	let current = typeof document !== "undefined" ? document.hidden : false;
	return { get current() {
		return current;
	} };
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/Toast.svelte
var TOAST_LIFETIME$1 = 4e3;
var GAP$1 = 14;
var TIME_BEFORE_UNMOUNT = 200;
var DEFAULT_TOAST_CLASSES = {
	toast: "",
	title: "",
	description: "",
	loader: "",
	closeButton: "",
	cancelButton: "",
	actionButton: "",
	action: "",
	warning: "",
	error: "",
	success: "",
	default: "",
	info: "",
	loading: ""
};
function Toast($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { toast, index, expanded, invert: invertFromToaster, position, visibleToasts, expandByDefault, closeButton: closeButtonFromToaster, interacting, cancelButtonStyle = "", actionButtonStyle = "", duration: durationFromToaster, descriptionClass = "", classes: classesProp, unstyled = false, loadingIcon, successIcon, errorIcon, warningIcon, closeIcon, infoIcon, defaultRichColors = false, swipeDirections: swipeDirectionsProp, closeButtonAriaLabel, pauseWhenPageIsHidden, $$slots, $$events, ...restProps } = $$props;
		const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
		let mounted = false;
		let removed = false;
		let swiping = false;
		let swipeOut = false;
		let isSwiped = false;
		let offsetBeforeRemove = 0;
		let initialHeight = 0;
		toast.duration;
		let swipeOutDirection = null;
		const isFront = derived(() => index === 0);
		const isVisible = derived(() => index + 1 <= visibleToasts);
		const toastType = derived(() => toast.type);
		const dismissible = derived(() => toast.dismissible !== void 0 ? toast.dismissible !== false : toast.dismissable !== false);
		const toastClass = derived(() => toast.class || "");
		const toastDescriptionClass = derived(() => toast.descriptionClass || "");
		const heightIndex = derived(() => toastState.heights.findIndex((height) => height.toastId === toast.id) || 0);
		const closeButton = derived(() => toast.closeButton ?? closeButtonFromToaster);
		derived(() => toast.duration ?? durationFromToaster ?? TOAST_LIFETIME$1);
		const coords = derived(() => position.split("-"));
		const toastsHeightBefore = derived(() => toastState.heights.reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= heightIndex()) return prev;
			return prev + curr.height;
		}, 0));
		useDocumentHidden();
		const invert = derived(() => toast.invert || invertFromToaster);
		const disabled = derived(() => toastType() === "loading");
		const classes = derived(() => ({
			...defaultClasses,
			...classesProp
		}));
		derived(() => toast.title);
		derived(() => toast.description);
		const offset = derived(() => Math.round(heightIndex() * GAP$1 + toastsHeightBefore()));
		function deleteToast() {
			removed = true;
			offsetBeforeRemove = offset();
			toastState.removeHeight(toast.id);
			setTimeout(() => {
				toastState.remove(toast.id);
			}, TIME_BEFORE_UNMOUNT);
		}
		derived(() => toast.promise && toastType() === "loading" || toast.duration === Number.POSITIVE_INFINITY);
		const icon = derived(() => {
			if (toast.icon) return toast.icon;
			if (toastType() === "success") return successIcon;
			if (toastType() === "error") return errorIcon;
			if (toastType() === "warning") return warningIcon;
			if (toastType() === "info") return infoIcon;
			if (toastType() === "loading") return loadingIcon;
			return null;
		});
		function LoadingIcon($$renderer) {
			if (loadingIcon) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx(cn$1(classes()?.loader, toast?.classes?.loader, "sonner-loader")))}${attr("data-visible", toastType() === "loading")}>`);
				loadingIcon($$renderer);
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				Loader($$renderer, {
					class: cn$1(classes()?.loader, toast.classes?.loader),
					visible: toastType() === "loading"
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<li${attr("tabindex", 0)}${attr_class(clsx(cn$1(restProps.class, toastClass(), classes()?.toast, toast?.classes?.toast, classes()?.[toastType()], toast?.classes?.[toastType()])))}${attr("aria-live", toast.important ? "assertive" : "polite")} aria-atomic="true" data-sonner-toast=""${attr("data-rich-colors", toast.richColors ?? defaultRichColors)}${attr("data-styled", !(toast.component || toast.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-swiped", isSwiped)}${attr("data-removed", removed)}${attr("data-visible", isVisible())}${attr("data-y-position", coords()[0])}${attr("data-x-position", coords()[1])}${attr("data-index", index)}${attr("data-front", isFront())}${attr("data-swiping", swiping)}${attr("data-dismissible", dismissible())}${attr("data-type", toastType())}${attr("data-invert", invert())}${attr("data-swipe-out", swipeOut)}${attr("data-swipe-direction", swipeOutDirection)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${restProps.style} ${toast.style}`, {
			"--index": index,
			"--toasts-before": index,
			"--z-index": toastState.toasts.length - index,
			"--offset": `${removed ? offsetBeforeRemove : offset()}px`,
			"--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
		})}>`);
		if (closeButton() && !toast.component && toastType() !== "loading" && closeIcon !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button${attr("aria-label", closeButtonAriaLabel)}${attr("data-disabled", disabled())} data-close-button=""${attr_class(clsx(cn$1(classes()?.closeButton, toast?.classes?.closeButton)))}>`);
			closeIcon?.($$renderer);
			$$renderer.push(`<!----></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (toast.component) {
			$$renderer.push("<!--[0-->");
			const Component = toast.component;
			if (Component) {
				$$renderer.push("<!--[-->");
				Component($$renderer, spread_props([toast.componentProps, { closeToast: deleteToast }]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else {
			$$renderer.push("<!--[-1-->");
			if ((toastType() || toast.icon || toast.promise) && toast.icon !== null && (icon() !== null || toast.icon)) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div data-icon=""${attr_class(clsx(cn$1(classes()?.icon, toast?.classes?.icon)))}>`);
				if (toast.promise || toastType() === "loading") {
					$$renderer.push("<!--[0-->");
					if (toast.icon) {
						$$renderer.push("<!--[0-->");
						if (toast.icon) {
							$$renderer.push("<!--[-->");
							toast.icon($$renderer, {});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					} else {
						$$renderer.push("<!--[-1-->");
						LoadingIcon($$renderer);
					}
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (toast.type !== "loading") {
					$$renderer.push("<!--[0-->");
					if (toast.icon) {
						$$renderer.push("<!--[0-->");
						if (toast.icon) {
							$$renderer.push("<!--[-->");
							toast.icon($$renderer, {});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					} else if (toastType() === "success") {
						$$renderer.push("<!--[1-->");
						successIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "error") {
						$$renderer.push("<!--[2-->");
						errorIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "warning") {
						$$renderer.push("<!--[3-->");
						warningIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else if (toastType() === "info") {
						$$renderer.push("<!--[4-->");
						infoIcon?.($$renderer);
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div data-content=""${attr_class(clsx(cn$1(classes()?.content, toast?.classes?.content)))}><div data-title=""${attr_class(clsx(cn$1(classes()?.title, toast?.classes?.title)))}>`);
			if (toast.title) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.title !== "string") {
					$$renderer.push("<!--[0-->");
					const Title = toast.title;
					if (Title) {
						$$renderer.push("<!--[-->");
						Title($$renderer, spread_props([toast.componentProps]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`${escape_html(toast.title)}`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (toast.description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div data-description=""${attr_class(clsx(cn$1(descriptionClass, toastDescriptionClass(), classes()?.description, toast.classes?.description)))}>`);
				if (typeof toast.description !== "string") {
					$$renderer.push("<!--[0-->");
					const Description = toast.description;
					if (Description) {
						$$renderer.push("<!--[-->");
						Description($$renderer, spread_props([toast.componentProps]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`${escape_html(toast.description)}`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (toast.cancel) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.cancel === "function") {
					$$renderer.push("<!--[0-->");
					if (toast.cancel) {
						$$renderer.push("<!--[-->");
						toast.cancel($$renderer, {});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else if (isAction(toast.cancel)) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<button data-button="" data-cancel=""${attr_style(toast.cancelButtonStyle ?? cancelButtonStyle)}${attr_class(clsx(cn$1(classes()?.cancelButton, toast?.classes?.cancelButton)))}>${escape_html(toast.cancel.label)}</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (toast.action) {
				$$renderer.push("<!--[0-->");
				if (typeof toast.action === "function") {
					$$renderer.push("<!--[0-->");
					if (toast.action) {
						$$renderer.push("<!--[-->");
						toast.action($$renderer, {});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else if (isAction(toast.action)) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<button data-button=""${attr_style(toast.actionButtonStyle ?? actionButtonStyle)}${attr_class(clsx(cn$1(classes()?.actionButton, toast?.classes?.actionButton)))}>${escape_html(toast.action.label)}</button>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></li>`);
	});
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/icons/SuccessIcon.svelte
function SuccessIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/icons/ErrorIcon.svelte
function ErrorIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/icons/WarningIcon.svelte
function WarningIcon($$renderer) {
	$$renderer.push(`<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/icons/InfoIcon.svelte
function InfoIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/icons/CloseIcon.svelte
function CloseIcon($$renderer) {
	$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
}
//#endregion
//#region node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.8/node_modules/svelte-sonner/dist/Toaster.svelte
var VISIBLE_TOASTS_AMOUNT = 3;
var VIEWPORT_OFFSET = "24px";
var MOBILE_VIEWPORT_OFFSET = "16px";
var TOAST_LIFETIME = 4e3;
var TOAST_WIDTH = 356;
var GAP = 14;
var DARK = "dark";
var LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
	const styles = {};
	[defaultOffset, mobileOffset].forEach((offset, index) => {
		const isMobile = index === 1;
		const prefix = isMobile ? "--mobile-offset" : "--offset";
		const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
		function assignAll(offset) {
			[
				"top",
				"right",
				"bottom",
				"left"
			].forEach((key) => {
				styles[`${prefix}-${key}`] = typeof offset === "number" ? `${offset}px` : offset;
			});
		}
		if (typeof offset === "number" || typeof offset === "string") assignAll(offset);
		else if (typeof offset === "object") [
			"top",
			"right",
			"bottom",
			"left"
		].forEach((key) => {
			const value = offset[key];
			if (value === void 0) styles[`${prefix}-${key}`] = defaultValue;
			else styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
		});
		else assignAll(defaultValue);
	});
	return styles;
}
function Toaster($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getInitialTheme(t) {
			if (t !== "system") return t;
			if (typeof window !== "undefined") {
				if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return DARK;
				return LIGHT;
			}
			return LIGHT;
		}
		let { invert = false, position = "bottom-right", hotkey = ["altKey", "KeyT"], expand = false, closeButton = false, offset = VIEWPORT_OFFSET, mobileOffset = MOBILE_VIEWPORT_OFFSET, theme = "light", richColors = false, duration = TOAST_LIFETIME, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions = {}, dir = "auto", gap = GAP, pauseWhenPageIsHidden = false, loadingIcon: loadingIconProp, successIcon: successIconProp, errorIcon: errorIconProp, warningIcon: warningIconProp, closeIcon: closeIconProp, infoIcon: infoIconProp, containerAriaLabel = "Notifications", class: className, closeButtonAriaLabel = "Close toast", onblur, onfocus, onmouseenter, onmousemove, onmouseleave, ondragend, onpointerdown, onpointerup, $$slots, $$events, ...restProps } = $$props;
		function getDocumentDirection() {
			if (dir !== "auto") return dir;
			if (typeof window === "undefined") return "ltr";
			if (typeof document === "undefined") return "ltr";
			const dirAttribute = document.documentElement.getAttribute("dir");
			if (dirAttribute === "auto" || !dirAttribute) {
				run(() => dir = window.getComputedStyle(document.documentElement).direction ?? "ltr");
				return dir;
			}
			run(() => dir = dirAttribute);
			return dirAttribute;
		}
		const possiblePositions = derived(() => Array.from(new Set([position, ...toastState.toasts.filter((toast) => toast.position).map((toast) => toast.position)].filter(Boolean))));
		let expanded = false;
		let interacting = false;
		let actualTheme = getInitialTheme(theme);
		const hotkeyLabel = derived(() => hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, ""));
		sonnerContext.set(new SonnerState());
		$$renderer.push(`<section${attr("aria-label", `${stringify(containerAriaLabel)} ${stringify(hotkeyLabel())}`)}${attr("tabindex", -1)} aria-live="polite" aria-relevant="additions text" aria-atomic="false" class="svelte-zg9fsy">`);
		if (toastState.toasts.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(possiblePositions());
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let position = each_array[index];
				const [y, x] = position.split("-");
				const offsetObject = getOffsetObject(offset, mobileOffset);
				$$renderer.push(`<ol${attributes({
					tabindex: -1,
					dir: getDocumentDirection(),
					class: clsx(className),
					"data-sonner-toaster": true,
					"data-sonner-theme": actualTheme,
					"data-y-position": y,
					"data-x-position": x,
					style: restProps.style,
					...restProps
				}, "svelte-zg9fsy", void 0, {
					"--front-toast-height": `${toastState.heights[0]?.height}px`,
					"--width": `${TOAST_WIDTH}px`,
					"--gap": `${gap}px`,
					"--offset-top": offsetObject["--offset-top"],
					"--offset-right": offsetObject["--offset-right"],
					"--offset-bottom": offsetObject["--offset-bottom"],
					"--offset-left": offsetObject["--offset-left"],
					"--mobile-offset-top": offsetObject["--mobile-offset-top"],
					"--mobile-offset-right": offsetObject["--mobile-offset-right"],
					"--mobile-offset-bottom": offsetObject["--mobile-offset-bottom"],
					"--mobile-offset-left": offsetObject["--mobile-offset-left"]
				})}><!--[-->`);
				const each_array_1 = ensure_array_like(toastState.toasts.filter((toast) => !toast.position && index === 0 || toast.position === position));
				for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
					let toast = each_array_1[index];
					{
						function successIcon($$renderer) {
							if (successIconProp) {
								$$renderer.push("<!--[0-->");
								successIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (successIconProp !== null) {
								$$renderer.push("<!--[1-->");
								SuccessIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function errorIcon($$renderer) {
							if (errorIconProp) {
								$$renderer.push("<!--[0-->");
								errorIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (errorIconProp !== null) {
								$$renderer.push("<!--[1-->");
								ErrorIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function warningIcon($$renderer) {
							if (warningIconProp) {
								$$renderer.push("<!--[0-->");
								warningIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (warningIconProp !== null) {
								$$renderer.push("<!--[1-->");
								WarningIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function infoIcon($$renderer) {
							if (infoIconProp) {
								$$renderer.push("<!--[0-->");
								infoIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (infoIconProp !== null) {
								$$renderer.push("<!--[1-->");
								InfoIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						function closeIcon($$renderer) {
							if (closeIconProp) {
								$$renderer.push("<!--[0-->");
								closeIconProp?.($$renderer);
								$$renderer.push(`<!---->`);
							} else if (closeIconProp !== null) {
								$$renderer.push("<!--[1-->");
								CloseIcon($$renderer, {});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						}
						Toast($$renderer, {
							index,
							toast,
							defaultRichColors: richColors,
							duration: toastOptions?.duration ?? duration,
							class: toastOptions?.class ?? "",
							descriptionClass: toastOptions?.descriptionClass || "",
							invert,
							visibleToasts,
							closeButton,
							interacting,
							position,
							style: toastOptions?.style ?? "",
							classes: toastOptions.classes || {},
							unstyled: toastOptions.unstyled ?? false,
							cancelButtonStyle: toastOptions?.cancelButtonStyle ?? "",
							actionButtonStyle: toastOptions?.actionButtonStyle ?? "",
							closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? closeButtonAriaLabel,
							expandByDefault: expand,
							expanded,
							pauseWhenPageIsHidden,
							loadingIcon: loadingIconProp,
							successIcon,
							errorIcon,
							warningIcon,
							infoIcon,
							closeIcon,
							$$slots: {
								successIcon: true,
								errorIcon: true,
								warningIcon: true,
								infoIcon: true,
								closeIcon: true
							}
						});
					}
				}
				$$renderer.push(`<!--]--></ol>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></section>`);
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-action.svelte
function Alert_dialog_action($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "default", size = "default", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Alert_dialog_action$1) {
				$$renderer.push("<!--[-->");
				Alert_dialog_action$1($$renderer, spread_props([
					{
						"data-slot": "alert-dialog-action",
						class: cn(buttonVariants({
							variant,
							size
						}), "cn-alert-dialog-action", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-cancel.svelte
function Alert_dialog_cancel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "outline", size = "default", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Alert_dialog_cancel$1) {
				$$renderer.push("<!--[-->");
				Alert_dialog_cancel$1($$renderer, spread_props([
					{
						"data-slot": "alert-dialog-cancel",
						class: cn(buttonVariants({
							variant,
							size
						}), "cn-alert-dialog-cancel", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-overlay.svelte
function Alert_dialog_overlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_overlay$1) {
				$$renderer.push("<!--[-->");
				Dialog_overlay$1($$renderer, spread_props([
					{
						"data-slot": "alert-dialog-overlay",
						class: cn("bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-portal.svelte
function Alert_dialog_portal($$renderer, $$props) {
	let { $$slots, $$events, ...restProps } = $$props;
	if (Portal) {
		$$renderer.push("<!--[-->");
		Portal($$renderer, spread_props([restProps]));
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-content.svelte
function Alert_dialog_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, size = "default", portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Alert_dialog_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					Alert_dialog_overlay($$renderer, {});
					$$renderer.push(`<!----> `);
					if (Alert_dialog_content$1) {
						$$renderer.push("<!--[-->");
						Alert_dialog_content$1($$renderer, spread_props([
							{
								"data-slot": "alert-dialog-content",
								"data-size": size,
								class: cn("gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none", className)
							},
							restProps,
							{
								get ref() {
									return ref;
								},
								set ref($$value) {
									ref = $$value;
									$$settled = false;
								}
							}
						]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-description.svelte
function Alert_dialog_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_description$1) {
				$$renderer.push("<!--[-->");
				Dialog_description$1($$renderer, spread_props([
					{
						"data-slot": "alert-dialog-description",
						class: cn("text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-header.svelte
function Alert_dialog_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-dialog-header",
			class: clsx(cn("grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog-title.svelte
function Alert_dialog_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dialog_title$1) {
				$$renderer.push("<!--[-->");
				Dialog_title$1($$renderer, spread_props([
					{
						"data-slot": "alert-dialog-title",
						class: cn("text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert-dialog/alert-dialog.svelte
function Alert_dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Alert_dialog$1) {
				$$renderer.push("<!--[-->");
				Alert_dialog$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					}
				}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/modals/SendFileModal.svelte
function SendFileModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let open = false;
		let target = null;
		let selectedFile = null;
		let sending = false;
		modals.subscribe((state) => {
			open = state.sendFile;
			target = state.sendFileTarget;
			if (!open) {
				selectedFile = null;
				sending = false;
			}
		});
		function formatSize(bytes) {
			if (bytes < 1024) return `${bytes} B`;
			if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
			return `${(bytes / 1048576).toFixed(1)} MB`;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Alert_dialog($$renderer, {
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					Alert_dialog_content($$renderer, {
						children: ($$renderer) => {
							Alert_dialog_header($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<div class="flex items-center justify-between">`);
									Alert_dialog_title($$renderer, {
										class: "flex items-center gap-2",
										children: ($$renderer) => {
											Upload($$renderer, { class: "h-5 w-5 text-foreground" });
											$$renderer.push(`<!----> Send file to workstation`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <button type="button" class="rounded-full p-1 hover:bg-muted">`);
									X($$renderer, { class: "h-4 w-4" });
									$$renderer.push(`<!----></button></div> `);
									Alert_dialog_description($$renderer, {
										children: ($$renderer) => {
											$$renderer.push(`<!---->Push a file to the customer PC via the Workstation Agent RPC channel. The
        customer must have allowed incoming files on their end.`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!---->`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							if (target) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<div class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm"><div class="flex items-center gap-2 font-medium text-foreground">`);
								Monitor($$renderer, { class: "h-4 w-4 text-primary" });
								$$renderer.push(`<!----> ${escape_html(target.computerName)}</div></div>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> <form class="space-y-4 py-2"><div class="space-y-2">`);
							Label($$renderer, {
								for: "send-file-input",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Choose file`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <input id="send-file-input" type="file" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary-foreground"/> `);
							if (selectedFile) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<p class="text-xs text-muted-foreground">${escape_html(selectedFile.name)} · ${escape_html(formatSize(selectedFile.size))}</p>`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div> <div class="flex justify-end gap-2 pt-2">`);
							Alert_dialog_cancel($$renderer, {
								type: "button",
								onclick: () => modals.closeSendFile(),
								children: ($$renderer) => {
									$$renderer.push(`<!---->Cancel`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Alert_dialog_action($$renderer, {
								type: "submit",
								disabled: !selectedFile || sending,
								class: "btn-app-primary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(sending ? "Sending…" : "Send file")}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div></form>`);
						},
						$$slots: { default: true }
					});
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/lib/components/ui/sonner/sonner.svelte
function Sonner_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		{
			function loadingIcon($$renderer) {
				Loader_circle($$renderer, { class: "size-4 animate-spin" });
			}
			function successIcon($$renderer) {
				Circle_check($$renderer, { class: "size-4" });
			}
			function errorIcon($$renderer) {
				Octagon_x($$renderer, { class: "size-4" });
			}
			function infoIcon($$renderer) {
				Info($$renderer, { class: "size-4" });
			}
			function warningIcon($$renderer) {
				Triangle_alert($$renderer, { class: "size-4" });
			}
			Toaster($$renderer, spread_props([
				{
					theme: derivedMode.current,
					class: "toaster group",
					style: "--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
				},
				restProps,
				{
					loadingIcon,
					successIcon,
					errorIcon,
					infoIcon,
					warningIcon,
					$$slots: {
						loadingIcon: true,
						successIcon: true,
						errorIcon: true,
						infoIcon: true,
						warningIcon: true
					}
				}
			]));
		}
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children } = $$props;
		initializeAuth();
		Mode_watcher($$renderer, {});
		$$renderer.push(`<!----> `);
		Sonner_1($$renderer, {
			richColors: true,
			closeButton: true,
			position: "top-right"
		});
		$$renderer.push(`<!----> `);
		DailySalesModal($$renderer, {});
		$$renderer.push(`<!----> `);
		NewTransactionModal($$renderer, {});
		$$renderer.push(`<!----> `);
		SendFileModal($$renderer, {});
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _layout as default };
