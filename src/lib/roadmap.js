// @ts-nocheck
export const ROADMAP_TRACKS = [
	{
		id: 'getting-started',
		title: 'Getting Started',
		subtitle: 'Understand how programming actually works — through C, the language that shows you what\'s really happening.',
		courseIds: ['getting-started'],
		skills: ['How computers work', 'Data types', 'Variables', 'Conditions', 'Loops', 'Functions', 'Arrays', 'Structs'],
		outcome: 'Think like a programmer. Understand what every language is doing under the hood.',
		level: 'Start here'
	},
	{
		id: 'web-development',
		title: 'Web Development',
		subtitle: 'Build real websites with HTML, CSS, and JavaScript — then deploy one so anyone can visit it.',
		courseIds: ['web-development'],
		skills: ['HTML', 'CSS', 'JavaScript', 'Flexbox', 'Responsive design', 'DOM manipulation', 'Deployment'],
		outcome: 'Build and deploy your own portfolio website.',
		level: 'Next step'
	}
];

// A separate track for people who already code. Never locked — the beginner
// path is a recommendation, shown as a soft note, not a gate.
export const ADVANCED_TRACK = {
	id: 'advanced',
	title: 'Advanced track',
	subtitle: 'How the machinery under your code works — compilers, operating systems, testing, embedded C and Android.',
	courseIds: ['compilation-techniques', 'operating-systems', 'software-testing', 'embedded-systems', 'mobile-android'],
	recommendedFirst: ['getting-started', 'web-development'],
	note: 'Built for people who can already read a loop and write a function. New to code? Start with Getting Started and Web Development — nothing here is locked, but these courses assume that ground.',
	readyNote: 'You finished the beginner path. This is where it goes next.',
	level: 'Already code?'
};

/** @param {string} courseId */
export function isAdvancedCourse(courseId) {
	return ADVANCED_TRACK.courseIds.includes(courseId);
}

/**
 * @param {Array<{ id: string, title?: string, lessonCount?: number, totalXp?: number }>} courses
 */
export function buildAdvancedTrack(courses) {
	const byId = new Map(courses.map((course) => [course.id, course]));
	const pick = (/** @type {string[]} */ ids) => ids.map((id) => byId.get(id)).filter((c) => c !== undefined);
	const trackCourses = pick(ADVANCED_TRACK.courseIds);
	return {
		...ADVANCED_TRACK,
		courses: trackCourses,
		recommended: pick(ADVANCED_TRACK.recommendedFirst).map((c) => ({ id: c.id, title: c.title, lessonCount: c.lessonCount ?? 0 })),
		lessonCount: trackCourses.reduce((sum, course) => sum + (course.lessonCount ?? 0), 0),
		totalXp: trackCourses.reduce((sum, course) => sum + (course.totalXp ?? 0), 0)
	};
}

export const PLATFORM_FEATURES = [
	{
		title: 'No account wall',
		detail: 'Progress, notes, XP, streaks, and lesson state live locally in the browser.'
	},
	{
		title: 'Roadmap plus practice',
		detail: 'Every path points to actual lessons, checks, sandboxes, and projects.'
	},
	{
		title: 'Browser coding labs',
		detail: 'HTML and CSS challenges run directly in the browser with instant feedback.'
	},
	{
		title: 'Step-by-step tracing',
		detail: 'Trace code execution line by line instead of guessing what changed.'
	}
];

export const SKILL_MATRIX = [
	{ skill: 'How computers work', courseId: 'getting-started', status: 'available' },
	{ skill: 'Data types & memory', courseId: 'getting-started', status: 'available' },
	{ skill: 'Conditions & loops', courseId: 'getting-started', status: 'available' },
	{ skill: 'Functions & structs', courseId: 'getting-started', status: 'available' },
	{ skill: 'HTML & CSS', courseId: 'web-development', status: 'available' },
	{ skill: 'JavaScript', courseId: 'web-development', status: 'available' },
	{ skill: 'Deploy a website', courseId: 'web-development', status: 'available' },
	{ skill: 'Git and GitHub', courseId: null, status: 'planned' },
	{ skill: 'React or Svelte', courseId: null, status: 'planned' },
	{ skill: 'Backend and APIs', courseId: null, status: 'planned' }
];

/**
 * @param {Array<{ id: string, lessonCount?: number, totalXp?: number }>} courses
 */
export function buildRoadmapTracks(courses) {
	const byId = new Map(courses.map((course) => [course.id, course]));
	return ROADMAP_TRACKS.map((track, index) => {
		const trackCourses = track.courseIds.map((id) => byId.get(id)).filter(Boolean);
		return {
			...track,
			order: index + 1,
			courses: trackCourses,
			lessonCount: trackCourses.reduce((sum, course) => sum + (course.lessonCount ?? 0), 0),
			totalXp: trackCourses.reduce((sum, course) => sum + (course.totalXp ?? 0), 0)
		};
	});
}
