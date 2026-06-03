<script>
	import CourseHeader from '$lib/components/CourseHeader.svelte';
	import LessonRow from '$lib/components/LessonRow.svelte';

	let { data } = $props();
	const { course, lessons } = data;
</script>

<main>
	<a href="/courses" class="back">← All Courses</a>

	<CourseHeader {course} {lessons} courseId={course.id} />

	<section>
		<h2>Lessons</h2>
		<ol class="lesson-list">
			{#each lessons as lesson, i}
				<li>
					<LessonRow
						{lesson}
						courseId={course.id}
						prevLessonId={i > 0 ? lessons[i - 1].id : null}
					/>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	main {
		max-width: 740px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
	}

	.back {
		display: inline-block;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.85rem;
		margin-bottom: 0.5rem;
		transition: color 0.15s;
	}

	.back:hover {
		color: var(--accent);
	}

	h2 {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--text-muted);
		margin: 0 0 0.75rem;
	}

	.lesson-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
</style>
