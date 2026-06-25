// @ts-nocheck
export const ROADMAP_TRACKS = [
	{
		id: 'getting-started',
		title: 'Getting Started',
		subtitle: 'Set up, learn how the web works, and ship your first page.',
		courseIds: ['getting-started'],
		skills: ['Dev setup', 'HTML', 'CSS', 'Web basics'],
		outcome: 'Build and style your first web page from scratch.',
		level: 'Start here'
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
	{ skill: 'Dev environment setup', courseId: 'getting-started', status: 'available' },
	{ skill: 'HTML structure', courseId: 'getting-started', status: 'available' },
	{ skill: 'CSS styling', courseId: 'getting-started', status: 'available' },
	{ skill: 'How browsers work', courseId: 'getting-started', status: 'available' },
	{ skill: 'JavaScript', courseId: null, status: 'planned' },
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
