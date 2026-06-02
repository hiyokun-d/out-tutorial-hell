import { getLesson, getAllCourses, getLessons, getCourseConfig } from '$lib/courses.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const courses = getAllCourses();
	const course = courses.find((c) => c.id === params.course);
	if (!course) error(404, 'Course not found');

	const lesson = getLesson(params.course, params.lesson);
	if (!lesson) error(404, 'Lesson not found');

	const lessons = getLessons(params.course);
	const idx = lessons.findIndex((l) => l.id === lesson.id);
	const prev = lessons[idx - 1] ?? null;
	const next = lessons[idx + 1] ?? null;

	const config = getCourseConfig(params.course);

	return { course, lesson, prev, next, config };
}
