<script>
	import CourseCard from '$lib/components/CourseCard.svelte';

	let { data } = $props();
</script>

<main>
	<h1>Courses</h1>
	<p class="subtitle">Pick a course. Build something. Stop watching tutorials.</p>

	<div class="course-grid">
		{#each data.courses as course}
			<CourseCard {course} />
		{/each}
	</div>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.subtitle {
		color: #666;
		margin-top: 0.25rem;
	}

	.course-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 2rem;
	}
</style>
