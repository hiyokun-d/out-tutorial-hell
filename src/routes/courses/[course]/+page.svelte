<script>
	import CourseHeader from '$lib/components/CourseHeader.svelte';
	import LessonRow from '$lib/components/LessonRow.svelte';

	let { data } = $props();
	const { course, lessons } = data;
</script>

<main>
	<a href="/courses" class="back">← All Courses</a>

	<CourseHeader {course} />

	<section>
		<h2>Lessons</h2>
		<ol class="lesson-list">
			{#each lessons as lesson}
				<li>
					<LessonRow {lesson} courseId={course.id} />
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	main {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem;
	}

	.back {
		color: #6366f1;
		text-decoration: none;
		font-size: 0.9rem;
	}

	h2 {
		margin-bottom: 0.75rem;
	}

	.lesson-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
