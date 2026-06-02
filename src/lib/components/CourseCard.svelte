<script>
	/** @type {{ course: { id: string, icon: string, title: string, description: string, difficulty: string } }} */
	let { course } = $props();
</script>

<a href="/courses/{course.id}" class="course-card">
	<span class="icon">{course.icon}</span>
	<div>
		<h2>{course.title}</h2>
		<p>{course.description}</p>
		<span class="badge">{course.difficulty}</span>
	</div>
</a>

<style>
	.course-card {
		display: flex;
		gap: 1.25rem;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.course-card:hover {
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.icon {
		font-size: 2.5rem;
		line-height: 1;
	}

	h2 {
		margin: 0 0 0.25rem;
		font-size: 1.2rem;
	}

	p {
		margin: 0 0 0.5rem;
		color: #555;
		font-size: 0.95rem;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #e0e7ff;
		color: #4338ca;
		font-weight: 600;
	}
</style>
