import { browser } from '$app/environment';

/** @param {string} courseSlug @param {string} lessonId @returns {string} */
export function getNotes(courseSlug, lessonId) {
	if (!browser) return '';
	return localStorage.getItem(`notes:${courseSlug}:${lessonId}`) ?? '';
}

/** @param {string} courseSlug @param {string} lessonId @param {string} text */
export function saveNotes(courseSlug, lessonId, text) {
	if (!browser) return;
	if (text.trim()) {
		localStorage.setItem(`notes:${courseSlug}:${lessonId}`, text);
	} else {
		localStorage.removeItem(`notes:${courseSlug}:${lessonId}`);
	}
}
