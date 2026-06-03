<script>
	/** @type {{ course: any, lesson: any }} */
	let { course, lesson } = $props();
</script>

<nav class="breadcrumb" aria-label="breadcrumb">
	<a href="/courses">Courses</a>
	<span aria-hidden="true">/</span>
	<a href="/courses/{course.id}">{course.title}</a>
	<span aria-hidden="true">/</span>
	<span aria-current="page">{lesson.title}</span>
</nav>

<style>
	.breadcrumb {
		display: flex;
		gap: 0.4rem;
		align-items: center;
		font-size: 0.78rem;
		color: var(--text-dim);
	}

	a {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.15s;
	}

	a:hover {
		color: var(--accent);
	}
</style>
