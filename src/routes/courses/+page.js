import { getCourseSummaries } from '$lib/courses.js';
import { buildRoadmapTracks, SKILL_MATRIX } from '$lib/roadmap.js';

export function load() {
	const courses = getCourseSummaries();
	return {
		courses,
		tracks: buildRoadmapTracks(courses),
		skillMatrix: SKILL_MATRIX
	};
}
