import { getLessons } from '$lib/courses.js';
import { getAllCourses } from '$lib/courses.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const courses = getAllCourses();
	const course = courses.find((c) => c.id === params.course);
	if (!course) error(404, 'Course not found');

	const lessons = getLessons(params.course);
	return { course, lessons };
}
