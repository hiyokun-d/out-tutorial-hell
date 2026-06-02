import { getAllCourses } from '$lib/courses.js';

export function load() {
	return { courses: getAllCourses() };
}
