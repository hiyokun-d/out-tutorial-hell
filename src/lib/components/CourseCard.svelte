<script>
	/** @type {{ course: { id: string, icon: string, title: string, description: string, difficulty: string, lessonCount?: number } }} */
	let { course } = $props();
</script>

<a href="/courses/{course.id}" class="course-card">
	<span class="icon">{course.icon}</span>
	<div class="info">
		<h2>{course.title}</h2>
		<p>{course.description}</p>
		<div class="meta">
			<span class="badge">{course.difficulty}</span>
			{#if course.lessonCount}
				<span class="lesson-count">{course.lessonCount} lessons</span>
			{/if}
		</div>
	</div>
	<span class="arrow" aria-hidden="true">→</span>
</a>

<style>
	.course-card {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.4rem 1.5rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		text-decoration: none;
		color: var(--text);
		transition: border-color 0.15s, background 0.15s;
	}

	.course-card:hover {
		border-color: var(--accent);
		background: var(--surface-elevated);
	}

	.icon {
		font-size: 2.5rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.info {
		flex: 1;
		min-width: 0;
	}

	h2 {
		margin: 0 0 0.3rem;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
	}

	p {
		margin: 0 0 0.65rem;
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: var(--accent-muted);
		color: var(--accent);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.lesson-count {
		font-size: 0.78rem;
		color: var(--text-dim);
	}

	.arrow {
		font-size: 1.1rem;
		color: var(--text-dim);
		flex-shrink: 0;
		transition: color 0.15s, transform 0.15s;
	}

	.course-card:hover .arrow {
		color: var(--accent);
		transform: translateX(3px);
	}
</style>
