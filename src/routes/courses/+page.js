import { getCourseSummaries } from '$lib/courses.js';
import { buildAdvancedTrack, buildRoadmapTracks, SKILL_MATRIX } from '$lib/roadmap.js';

export function load() {
	const courses = getCourseSummaries();
	return {
		courses,
		tracks: buildRoadmapTracks(courses),
		advanced: buildAdvancedTrack(courses),
		skillMatrix: SKILL_MATRIX
	};
}
