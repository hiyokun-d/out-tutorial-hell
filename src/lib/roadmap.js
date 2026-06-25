// @ts-nocheck
export const ROADMAP_TRACKS = [
	{
		id: 'first-code',
		title: 'First Code',
		subtitle: 'Think like a programmer before picking a stack.',
		courseIds: ['new-coder'],
		skills: ['Mental models', 'Variables', 'Branches', 'Loops'],
		outcome: 'Write small programs without copying a tutorial.',
		level: 'Start here'
	},
	{
		id: 'frontend-builder',
		title: 'Frontend Builder',
		subtitle: 'Ship pages, interfaces, and browser projects.',
		courseIds: ['web-dev'],
		skills: ['HTML', 'CSS', 'JavaScript', 'DOM tests'],
		outcome: 'Build and inspect real web pages in the browser.',
		level: 'Beginner'
	},
	{
		id: 'python-problem-solver',
		title: 'Python Problem Solver',
		subtitle: 'Use code for automation, data, and problem solving.',
		courseIds: ['python-intro'],
		skills: ['Python syntax', 'Loops', 'Input/output', 'Tracing'],
		outcome: 'Solve small programming tasks with executable feedback.',
		level: 'Beginner'
	},
	{
		id: 'systems-foundation',
		title: 'Systems Foundation',
		subtitle: 'Understand memory, compiled code, and lower-level thinking.',
		courseIds: ['c-intro'],
		skills: ['C syntax', 'Compilation', 'Terminal output', 'Machine basics'],
		outcome: 'Read and write basic C with a clearer mental model.',
		level: 'Intermediate'
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
		detail: 'HTML, JavaScript, Python, and C challenges run with instant feedback.'
	},
	{
		title: 'Step-by-step tracing',
		detail: 'Trace code execution line by line instead of guessing what changed.'
	}
];

export const SKILL_MATRIX = [
	{ skill: 'Programming basics', courseId: 'new-coder', status: 'available' },
	{ skill: 'Frontend UI', courseId: 'web-dev', status: 'available' },
	{ skill: 'Python scripting', courseId: 'python-intro', status: 'available' },
	{ skill: 'C and systems', courseId: 'c-intro', status: 'available' },
	{ skill: 'Git and GitHub', courseId: null, status: 'planned' },
	{ skill: 'APIs and backend', courseId: null, status: 'planned' },
	{ skill: 'Databases', courseId: null, status: 'planned' },
	{ skill: 'Deployment', courseId: null, status: 'planned' }
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

