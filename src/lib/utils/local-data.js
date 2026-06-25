// @ts-nocheck
import { browser } from '$app/environment';

const VERSION = 1;
const PROGRESS_PREFIX = 'progress:';
const NOTES_PREFIX = 'notes:';
const XP_KEY = 'user_xp';

function readJson(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

export function getLearningSnapshot() {
	if (!browser) return null;

	const progress = {};
	const notes = {};
	let noteCount = 0;

	for (let i = 0; i < localStorage.length; i += 1) {
		const key = localStorage.key(i);
		if (!key) continue;

		if (key.startsWith(PROGRESS_PREFIX)) {
			progress[key.slice(PROGRESS_PREFIX.length)] = readJson(key, []);
		} else if (key.startsWith(NOTES_PREFIX)) {
			notes[key.slice(NOTES_PREFIX.length)] = localStorage.getItem(key) ?? '';
			noteCount += 1;
		}
	}

	const completedLessons = Object.values(progress).reduce(
		(sum, lessons) => sum + (Array.isArray(lessons) ? lessons.length : 0),
		0
	);

	return {
		version: VERSION,
		exportedAt: new Date().toISOString(),
		xp: readJson(XP_KEY, { xp: 0, level: 1, streak: 0, lastActive: null }),
		progress,
		notes,
		summary: { completedLessons, noteCount }
	};
}

export function downloadLearningSnapshot() {
	const snapshot = getLearningSnapshot();
	if (!snapshot) return;

	const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = `outth-progress-${new Date().toISOString().slice(0, 10)}.json`;
	anchor.click();
	URL.revokeObjectURL(url);
}

export function importLearningSnapshot(snapshot) {
	if (!browser || !snapshot || typeof snapshot !== 'object') return false;

	if (snapshot.xp && typeof snapshot.xp === 'object') {
		localStorage.setItem(XP_KEY, JSON.stringify(snapshot.xp));
	}

	if (snapshot.progress && typeof snapshot.progress === 'object') {
		for (const [courseId, lessons] of Object.entries(snapshot.progress)) {
			if (!Array.isArray(lessons)) continue;
			localStorage.setItem(`${PROGRESS_PREFIX}${courseId}`, JSON.stringify(lessons));
		}
	}

	if (snapshot.notes && typeof snapshot.notes === 'object') {
		for (const [noteKey, text] of Object.entries(snapshot.notes)) {
			if (typeof text !== 'string') continue;
			localStorage.setItem(`${NOTES_PREFIX}${noteKey}`, text);
		}
	}

	return true;
}
