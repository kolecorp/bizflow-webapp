// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/(app)/ai-tracking": [4,[2]],
		"/(app)/computers": [5,[2]],
		"/(app)/dashboard": [6,[2]],
		"/features": [15],
		"/(app)/inventory": [7,[2]],
		"/login": [16],
		"/(app)/overview": [8,[2]],
		"/(app)/printing": [9,[2]],
		"/(app)/printing/settings": [10,[2]],
		"/(app)/reports": [11,[2]],
		"/(app)/services": [12,[2]],
		"/solutions": [17],
		"/(app)/support": [13,[2]],
		"/(app)/transactions": [14,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);