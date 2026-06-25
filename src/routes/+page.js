import { getCourseSummaries } from '$lib/courses.js';
import { buildRoadmapTracks, PLATFORM_FEATURES, SKILL_MATRIX } from '$lib/roadmap.js';

export function load() {
	const courses = getCourseSummaries();
	const lessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);
	const challenges = courses.reduce((sum, course) => sum + course.challengeCount, 0);
	const totalXp = courses.reduce((sum, course) => sum + course.totalXp, 0);

	return {
		courses,
		tracks: buildRoadmapTracks(courses),
		features: PLATFORM_FEATURES,
		skillMatrix: SKILL_MATRIX,
		stats: { courses: courses.length, lessons, challenges, totalXp }
	};
}
