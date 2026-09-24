// Motion tokens and helpers. Every duration and easing in the app comes from
// here (JS) or from the matching --dur-* / --ease-* variables in theme.css (CSS).
//
// The rule: motion must answer one of four questions —
//   1. where did this come from? (enter)   2. where did it go? (exit)
//   3. what just changed? (emphasis)       4. how are these two related? (shared element / FLIP)
// If it answers none of them, it doesn't ship.

import { MediaQuery } from 'svelte/reactivity';
import { cubicOut, cubicIn, cubicInOut, backOut } from 'svelte/easing';

/** @type {Record<'instant' | 'fast' | 'base' | 'slow' | 'teach', number>} */
export const DUR = {
	instant: 0, // state that must feel mechanical — checkbox, tab underline
	fast: 120, // hover, press, toggle, tooltip
	base: 200, // small element enter/exit, list item, badge
	slow: 320, // panel, drawer, route transition
	teach: 480 // ONLY inside widgets, when the eye must track a value moving
};

/** Exits get out of the way faster than enters arrive. */
export const EXIT = 0.6;

/** Svelte easing functions, by situation. `back` is for widget values only, never chrome. */
export const EASE = { enter: cubicOut, exit: cubicIn, move: cubicInOut, back: backOut };

/** The same curves as CSS strings, for the Web Animations API. Mirrored as --ease-* in theme.css. */
export const EASE_CSS = {
	enter: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
	exit: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
	move: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
	back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

/** Opacity-only fades may survive reduced motion, capped here. */
const REDUCED_FADE_CAP = 80;

export const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');

/**
 * Duration for a token, collapsed to 0 under reduced motion.
 * @param {keyof typeof DUR} name
 * @param {{ exit?: boolean }} [opts]
 */
export function dur(name, opts = {}) {
	if (reducedMotion.current) return 0;
	return Math.round(DUR[name] * (opts.exit ? EXIT : 1));
}

/**
 * Duration for an opacity-only cross-fade. Under reduced motion it stays, capped at 80ms.
 * @param {keyof typeof DUR} name
 * @param {{ exit?: boolean }} [opts]
 */
export function fadeDur(name, opts = {}) {
	const d = Math.round(DUR[name] * (opts.exit ? EXIT : 1));
	return reducedMotion.current ? Math.min(d, REDUCED_FADE_CAP) : d;
}

// Set by +layout.svelte after the first mount. Before that, components are
// hydrating server HTML that's already painted — animating it in would blink.
// After it, they're mounting on client-side navigation and can animate.
// `transition` holds the running view transition's `finished` promise, if any,
// so in-page motion can wait for the route transition instead of doubling it.
export const motionState = {
	hydrated: false,
	/** @type {Promise<void> | null} */
	transition: null
};

/**
 * Brief horizontal shake: "that didn't work". 3px, two oscillations, then stops.
 * @param {Element | null | undefined} node
 */
export function shake(node) {
	if (!node || reducedMotion.current || !('animate' in node)) return;
	node.animate(
		[
			{ transform: 'translateX(0)' },
			{ transform: 'translateX(-3px)' },
			{ transform: 'translateX(3px)' },
			{ transform: 'translateX(-3px)' },
			{ transform: 'translateX(3px)' },
			{ transform: 'translateX(0)' }
		],
		{ duration: DUR.fast * 2, easing: 'linear' }
	);
}

/**
 * FLIP: after the DOM has moved `node`, animate it from where it was.
 * The node is the same element before and after, so the learner tracks one object.
 * Pass `reverse` when stepping backwards — same path, played the other way.
 *
 * @param {Element} node
 * @param {DOMRect} first  getBoundingClientRect() taken before the DOM changed
 * @param {{ duration?: number, easing?: string }} [opts]
 */
export function flipFrom(node, first, opts = {}) {
	if (reducedMotion.current || !('animate' in node)) return;
	const last = node.getBoundingClientRect();
	const dx = first.left - last.left;
	const dy = first.top - last.top;
	if (!dx && !dy) return;
	const el = /** @type {HTMLElement} */ (node);
	el.style.willChange = 'transform';
	const anim = el.animate(
		[{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
		{ duration: opts.duration ?? DUR.teach, easing: opts.easing ?? EASE_CSS.move }
	);
	const clear = () => (el.style.willChange = '');
	anim.onfinish = clear;
	anim.oncancel = clear;
}

/**
 * One emphasis pop on an element that just became current (a step dot, say).
 * @param {Element | null | undefined} node
 */
export function pulse(node) {
	if (!node || reducedMotion.current || !('animate' in node)) return;
	node.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], {
		duration: DUR.base,
		easing: EASE_CSS.back
	});
}

/** Cancel every running animation on a node and its subtree — for instant Reset. @param {Element | null | undefined} root */
export function cancelAnimations(root) {
	if (!root || !('getAnimations' in root)) return;
	for (const a of root.getAnimations({ subtree: true })) a.cancel();
}
