// @ts-nocheck
// File-based course system. Adding a lesson = dropping a .md file.
// Adding a coding challenge = dropping a matching .json file with the same base name.
// No DB, no backend, no config changes needed.

import { hasWidget } from '$lib/widgets/registry.js';

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
// Course assets live inside the course: courses/<slug>/assets/. Referenced by filename.
// SVGs are imported as raw markup and rendered inline, so they can use the theme's
// CSS variables (an <img>-loaded SVG is a separate document and can't).
// Rasters get a hashed, build-safe URL.
const svgAssets = import.meta.glob('/courses/*/assets/*.svg', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const rasterAssets = import.meta.glob('/courses/*/assets/*.{png,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
});

/**
 * Throws if an SVG asset could run code or is missing its accessible label.
 * @param {string} path
 * @param {string} svg
 */
function validateSvg(path, svg) {
	if (/<script|\son[a-z]+\s*=|javascript:/i.test(svg)) {
		throw new Error(`${path} contains script or an event handler — assets must be static.`);
	}
	if (!/<svg[^>]*role="img"/.test(svg) || !/<title[\s>]/.test(svg) || !/<desc[\s>]/.test(svg)) {
		throw new Error(`${path} needs role="img" on <svg> plus <title> and <desc>.`);
	}
}

/**
 * Resolves a filename inside courses/<courseId>/assets/.
 * Returns null when no filename is given; throws if the named file is missing.
 * @param {string} courseId
 * @param {string | undefined} filename
 * @param {string} field  frontmatter / meta key, for the error message
 * @returns {{ svg: string, url: null } | { svg: null, url: string } | null}
 */
export function getCourseAsset(courseId, filename, field = 'asset') {
	if (!filename) return null;
	const path = `/courses/${courseId}/assets/${filename}`;
	if (svgAssets[path] !== undefined) {
		validateSvg(path, svgAssets[path]);
		return { svg: svgAssets[path], url: null };
	}
	if (rasterAssets[path] !== undefined) return { svg: null, url: rasterAssets[path] };
	throw new Error(`${field} "${filename}" not found — put the file in courses/${courseId}/assets/`);
}

/**
 * Parse YAML frontmatter from a markdown string.
 * Supports string, number, and boolean values (no nested objects).
 * @param {string} raw
 * @returns {{ data: Record<string, any>, content: string }}
 */
function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { data: {}, content: raw };

	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
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
		theorySandbox: true,
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

	return { features, language: raw.language ?? null };
}

// ── Interactive lessons ───────────────────────────────────────────────────────

const WIDGET_BLOCK = /^```widget[ \t]*\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;

/**
 * INTERACTIVE lessons name a widget in frontmatter and carry its props as JSON in
 * a single ```widget fenced block. The block's position is where the widget renders.
 * @param {string} path
 * @param {string} content
 * @param {string | undefined} widget
 */
function parseWidget(path, content, widget) {
	if (!widget) throw new Error(`${path} is INTERACTIVE but has no \`widget\` in frontmatter.`);
	if (!hasWidget(widget)) {
		throw new Error(`${path} uses widget "${widget}" — no src/lib/widgets/${widget}.svelte exists.`);
	}
	const blocks = [...content.matchAll(WIDGET_BLOCK)];
	if (blocks.length !== 1) {
		throw new Error(`${path} needs exactly one \`\`\`widget block with the widget's JSON props, found ${blocks.length}.`);
	}
	const [block, json] = blocks[0];
	let widgetProps;
	try {
		widgetProps = JSON.parse(json);
	} catch (err) {
		throw new Error(`${path} widget block is not valid JSON: ${err.message}`);
	}
	const at = content.indexOf(block);
	return {
		widgetProps,
		content: content.slice(0, at).trim(),
		contentAfter: content.slice(at + block.length).trim()
	};
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
			return { ...data, id, coverArt: getCourseAsset(id, data.cover, 'cover') };
		})
		.filter((c) => c.id !== '_template')
		.sort((a, b) => a.order - b.order);
}

/**
 * Returns courses with lesson and XP totals for roadmap/dashboard views.
 */
export function getCourseSummaries() {
	return getAllCourses().map((course) => {
		const lessons = getLessons(course.id);
		return {
			...course,
			lessonCount: lessons.length,
			totalXp: lessons.reduce((sum, lesson) => sum + (lesson.xpReward ?? 10), 0),
			challengeCount: lessons.filter((lesson) => lesson.challenge).length,
			projectCount: lessons.filter((lesson) => lesson.type === 'PROJECT').length
		};
	});
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

		const lesson = { ...data, order, content, challenge };
		lesson.figureArt = getCourseAsset(courseId, data.figure, `figure in ${path}`);
		// Optional phone variant: interrupt-cycle.svg -> interrupt-cycle.narrow.svg
		const narrow = data.figure?.replace(/\.svg$/, '.narrow.svg');
		lesson.figureArtNarrow =
			narrow && svgAssets[`/courses/${courseId}/assets/${narrow}`] !== undefined
				? getCourseAsset(courseId, narrow, `figure in ${path}`)
				: null;
		if (data.type === 'INTERACTIVE') Object.assign(lesson, parseWidget(path, content, data.widget));

		lessons.push(lesson);
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


