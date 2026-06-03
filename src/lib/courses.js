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

const KNOWN_FEATURES = ['snippets', 'hints', 'livePreview', 'formatButton'];

/**
 * Global default — all features ON.
 * Any course without a config.json gets this automatically.
 * Per-course config.json can only override individual flags.
 * @type {{ features: { snippets: boolean, hints: boolean, livePreview: boolean, formatButton: boolean } }}
 */
export const DEFAULT_CONFIG = {
	features: {
		snippets: true,
		hints: true,
		livePreview: true,
		formatButton: true
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
			if (typeof val !== 'boolean') {
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
	const lessons = [];

	for (const [path, raw] of Object.entries(lessonFiles)) {
		if (!path.startsWith(`/courses/${courseId}/lessons/`)) continue;

		const { data, content } = parseFrontmatter(raw);

		const folderMatch = path.match(/\/lessons\/(\d+)\//);
		const order = folderMatch ? Number(folderMatch[1]) : 0;

		// Look for a matching .json challenge file (same path, different extension)
		const challengePath = path.replace(/\.md$/, '.json');
		const challenge = challengeFiles[challengePath] ?? null;

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
