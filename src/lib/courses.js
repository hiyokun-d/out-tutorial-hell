// File-based course system. Adding a lesson = dropping a .md file.
// Adding a coding challenge = dropping a matching .json file with the same base name.
// No DB, no backend, no config changes needed.

const metaFiles = import.meta.glob('/courses/*/meta.json', { eager: true, import: 'default' });
const configFiles = import.meta.glob('/courses/*/config.json', { eager: true, import: 'default' });
const lessonFiles = import.meta.glob('/courses/*/lessons/*/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const challengeFiles = import.meta.glob('/courses/*/lessons/*/*.json', {
	eager: true,
	import: 'default'
});

/**
 * Parse YAML frontmatter from a markdown string.
 * Supports string, number, and boolean values (no nested objects).
 * @param {string} raw
 * @returns {{ data: Record<string, any>, content: string }}
 */
function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return { data: {}, content: raw };

	const data = {};
	for (const line of match[1].split('\n')) {
		const colon = line.indexOf(':');
		if (colon === -1) continue;
		const key = line.slice(0, colon).trim();
		let value = line.slice(colon + 1).trim().replace(/^"|"$/g, '');
		if (value === 'true') value = true;
		else if (value === 'false') value = false;
		else if (!isNaN(Number(value)) && value !== '') value = Number(value);
		data[key] = value;
	}

	return { data, content: match[2].trim() };
}

// ── Config ────────────────────────────────────────────────────────────────────

const KNOWN_FEATURES = ['snippets', 'hints', 'livePreview', 'consoleOutput', 'theorySandbox', 'formatButton', 'walkthroughStyle'];

/**
 * Global default — all features ON.
 * Any course without a config.json gets this automatically.
 * Per-course config.json can only override individual flags.
 * @type {{ features: { snippets: boolean, hints: boolean, livePreview: boolean, formatButton: boolean, walkthroughStyle: string } }}
 */
export const DEFAULT_CONFIG = {
	features: {
		snippets: true,
		hints: true,
		livePreview: true,
		consoleOutput: false,
		theorySandbox: false,
		formatButton: true,
		walkthroughStyle: 'spotlight'
	}
};

/**
 * Returns the feature config for a course, falling back to defaults.
 * Throws if config.json contains unknown keys or non-boolean values.
 * @param {string} courseId
 */
export function getCourseConfig(courseId) {
	const raw = configFiles[`/courses/${courseId}/config.json`];
	if (!raw) return DEFAULT_CONFIG;

	const features = { ...DEFAULT_CONFIG.features };

	if (raw.features && typeof raw.features === 'object') {
		for (const [key, val] of Object.entries(raw.features)) {
			if (!KNOWN_FEATURES.includes(key)) {
				throw new Error(
					`Unknown feature "${key}" in courses/${courseId}/config.json — valid features: ${KNOWN_FEATURES.join(', ')}`
				);
			}
			if (key === 'walkthroughStyle') {
				const valid = ['spotlight', 'pulse', 'none'];
				if (!valid.includes(val)) {
					throw new Error(
						`Feature "walkthroughStyle" must be one of: ${valid.join(', ')}, got: ${JSON.stringify(val)}`
					);
				}
			} else if (typeof val !== 'boolean') {
				throw new Error(
					`Feature "${key}" in courses/${courseId}/config.json must be true or false, got: ${JSON.stringify(val)}`
				);
			}
			features[key] = val;
		}
	}

	return { features };
}

// ── Courses ───────────────────────────────────────────────────────────────────

/**
 * Returns all courses sorted by their `order` field.
 * Excludes the _template folder.
 */
export function getAllCourses() {
	return Object.entries(metaFiles)
		.map(([path, data]) => {
			const id = path.match(/\/courses\/([^/]+)\/meta\.json/)?.[1] ?? '';
			return { ...data, id };
		})
		.filter((c) => c.id !== '_template')
		.sort((a, b) => a.order - b.order);
}

/**
 * Returns all lessons for a course, sorted by `order`.
 * Each lesson includes a `challenge` field (null if no .json file exists).
 * @param {string} courseId
 */
export function getLessons(courseId) {
	const prefix = `/courses/${courseId}/lessons/`;

	// ── Validate: exactly 1 .md and at most 1 .json per lesson folder ─────────
	const mdByFolder = /** @type {Map<string, string[]>} */ (new Map());
	const jsonByFolder = /** @type {Map<string, string[]>} */ (new Map());

	for (const p of Object.keys(lessonFiles)) {
		if (!p.startsWith(prefix)) continue;
		const folder = p.slice(0, p.lastIndexOf('/') + 1);
		const entry = mdByFolder.get(folder) ?? [];
		entry.push(p.split('/').pop() ?? p);
		mdByFolder.set(folder, entry);
	}
	for (const p of Object.keys(challengeFiles)) {
		if (!p.startsWith(prefix)) continue;
		const folder = p.slice(0, p.lastIndexOf('/') + 1);
		const entry = jsonByFolder.get(folder) ?? [];
		entry.push(p.split('/').pop() ?? p);
		jsonByFolder.set(folder, entry);
	}

	for (const [folder, files] of mdByFolder) {
		if (files.length > 1) {
			throw new Error(
				`Lesson folder "${folder}" has ${files.length} .md files: ${files.join(', ')} — only one allowed.`
			);
		}
	}
	for (const [folder, files] of jsonByFolder) {
		if (files.length > 1) {
			throw new Error(
				`Lesson folder "${folder}" has ${files.length} .json files: ${files.join(', ')} — only one allowed.`
			);
		}
	}

	// ── Build lesson list ──────────────────────────────────────────────────────
	const lessons = [];

	for (const [path, raw] of Object.entries(lessonFiles)) {
		if (!path.startsWith(prefix)) continue;

		const { data, content } = parseFrontmatter(raw);

		const folderMatch = path.match(/\/lessons\/(\d+)\//);
		const order = folderMatch ? Number(folderMatch[1]) : 0;

		// Find the single .json in the same lesson folder — name doesn't matter
		const folderPath = path.slice(0, path.lastIndexOf('/') + 1);
		const challenge =
			Object.entries(challengeFiles).find(
				([p]) => p.startsWith(folderPath) && p.endsWith('.json')
			)?.[1] ?? null;

		lessons.push({ ...data, order, content, challenge });
	}

	return lessons.sort((a, b) => a.order - b.order);
}

/**
 * Returns a single lesson by courseId + lessonId.
 * @param {string} courseId
 * @param {string} lessonId
 */
export function getLesson(courseId, lessonId) {
	return getLessons(courseId).find((l) => l.id === lessonId) ?? null;
}
