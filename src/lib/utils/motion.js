// Motion helpers. Every animation in the app is opt-out: nothing here runs
// when the user asked the OS for reduced motion.

// Set by +layout.svelte after the first mount. Before that, components are
// hydrating server HTML that's already painted — animating it in would blink.
// After it, they're mounting on client-side navigation and can animate freely.
export const motionState = { hydrated: false };

/** @returns {boolean} */
export function prefersReducedMotion() {
	return typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Svelte action: adds `revealed` once the element scrolls into view, and sets
 * `--reveal-delay` from `index` so siblings arrive in sequence.
 *
 * Elements already on screen at mount are left alone — hiding and re-showing
 * them would flash on hydration. Only content below the fold animates in.
 *
 * @param {HTMLElement} node
 * @param {{ index?: number }} [opts]
 */
export function reveal(node, opts = {}) {
	if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
	const navigated = motionState.hydrated; // read now; the observer fires after hydration ends
	node.style.setProperty('--reveal-delay', `${Math.min(opts.index ?? 0, 6) * 70}ms`);

	let first = true;
	const io = new IntersectionObserver(
		([entry]) => {
			if (first) {
				first = false;
				if (entry.isIntersecting && !navigated) {
					io.disconnect();
					return;
				}
				node.classList.add('reveal-pending');
				if (entry.isIntersecting) {
					requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('revealed')));
					io.disconnect();
				}
				return;
			}
			if (entry.isIntersecting) {
				node.classList.add('revealed');
				io.disconnect();
			}
		},
		{ threshold: 0.15 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
