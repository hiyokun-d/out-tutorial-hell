import { browser } from '$app/environment';

/** @param {string} courseSlug @returns {Set<string>} */
export function getProgress(courseSlug) {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(`progress:${courseSlug}`);
		return new Set(raw ? JSON.parse(raw) : []);
	} catch {
		return new Set();
	}
}

/** @param {string} courseSlug @param {string} lessonId */
export function markComplete(courseSlug, lessonId) {
	if (!browser) return;
	const progress = getProgress(courseSlug);
	progress.add(lessonId);
	localStorage.setItem(`progress:${courseSlug}`, JSON.stringify([...progress]));
}

/** @param {string} courseSlug @param {string} lessonId @returns {boolean} */
export function isComplete(courseSlug, lessonId) {
	return getProgress(courseSlug).has(lessonId);
}

/** @param {string} courseSlug */
export function clearProgress(courseSlug) {
	if (!browser) return;
	localStorage.removeItem(`progress:${courseSlug}`);
}
