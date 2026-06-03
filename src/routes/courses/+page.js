import { getAllCourses, getLessons } from '$lib/courses.js';

export function load() {
	const courses = getAllCourses().map((course) => ({
		...course,
		lessonCount: getLessons(course.id).length
	}));
	return { courses };
}
