import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<Array<{ id: number, xp: number, level?: number, levelUp?: boolean }>>} */
export const toasts = writable([]);

let nextId = 0;

/** @param {number} xp @param {{ level?: number, levelUp?: boolean }} [meta] */
export function showXpToast(xp, meta = {}) {
	const id = nextId++;
	toasts.update((t) => [...t, { id, xp, ...meta }]);
	setTimeout(() => {
		toasts.update((t) => t.filter((x) => x.id !== id));
	}, 2800);
}
