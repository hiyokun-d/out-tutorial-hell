<script>
	import CourseCard from '$lib/components/CourseCard.svelte';

	let { data } = $props();
</script>

<main>
	<header>
		<h1>Pick your path.</h1>
		<p class="subtitle">Build something real. Stop watching tutorials.</p>
	</header>

	<div class="course-grid">
		{#each data.courses as course}
			<CourseCard {course} />
		{/each}
	</div>
</main>

<style>
	main {
		max-width: 860px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		font-size: 2.25rem;
		font-weight: 800;
		margin: 0 0 0.4rem;
		color: var(--text);
		letter-spacing: -0.02em;
	}

	.subtitle {
		color: var(--text-muted);
		margin: 0;
		font-size: 1rem;
	}

	.course-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
