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
