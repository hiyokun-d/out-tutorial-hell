import { getLessons } from '$lib/courses.js';
import { getAllCourses } from '$lib/courses.js';
import { error } from '@sveltejs/kit';
import { buildAdvancedTrack, isAdvancedCourse } from '$lib/roadmap.js';
import { getCourseSummaries } from '$lib/courses.js';

export function load({ params }) {
	const courses = getAllCourses();
	const course = courses.find((c) => c.id === params.course);
	if (!course) error(404, 'Course not found');

	const lessons = getLessons(params.course);
	// Advanced courses get a soft "beginner path first" note — never a lock.
	const advanced = isAdvancedCourse(course.id) ? buildAdvancedTrack(getCourseSummaries()) : null;
	return { course, lessons, advanced };
}
