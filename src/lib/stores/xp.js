import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'user_xp';
const XP_PER_LEVEL = 100;

/** @returns {{ xp: number, level: number, streak: number, lastActive: string | null }} */
function load() {
	if (!browser) return { xp: 0, level: 1, streak: 0, lastActive: null };
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? { xp: 0, level: 1, streak: 0, lastActive: null };
	} catch {
		return { xp: 0, level: 1, streak: 0, lastActive: null };
	}
}

function save(val) {
	if (browser) localStorage.setItem(KEY, JSON.stringify(val));
}

const { subscribe, set, update } = writable(load());

function updateStreak(state) {
	const today = new Date().toDateString();
	if (state.lastActive === today) return state;
	const yesterday = new Date(Date.now() - 86_400_000).toDateString();
	return {
		...state,
		streak: state.lastActive === yesterday ? state.streak + 1 : 1,
		lastActive: today,
	};
}

export const xp = {
	subscribe,
	/** Re-load from localStorage (call on mount) */
	init() {
		set(load());
	},
	/**
	 * @param {number} amount
	 * @returns {{ xpAwarded: number, newLevel: number, levelUp: boolean }}
	 */
	award(amount) {
		let result = { xpAwarded: amount, newLevel: 1, levelUp: false };
		update((s) => {
			const withStreak = updateStreak(s);
			const newXp = withStreak.xp + amount;
			const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
			result = { xpAwarded: amount, newLevel, levelUp: newLevel > withStreak.level };
			const next = { ...withStreak, xp: newXp, level: newLevel };
			save(next);
			return next;
		});
		return result;
	},
};

export const xpLevel = derived(xp, ($x) => $x.level);
export const xpStreak = derived(xp, ($x) => $x.streak);
export const xpProgress = derived(xp, ($x) => ($x.xp % XP_PER_LEVEL) / XP_PER_LEVEL);
export const xpToNext = derived(xp, ($x) => XP_PER_LEVEL - ($x.xp % XP_PER_LEVEL));
