<script>
	/** @type {{ course: any, prev: any, next: any }} */
	let { course, prev, next } = $props();
</script>

<nav class="lesson-nav">
	{#if prev}
		<a href="/courses/{course.id}/{prev.id}" class="btn">← {prev.title}</a>
	{:else}
		<span></span>
	{/if}

	{#if next}
		<a href="/courses/{course.id}/{next.id}" class="btn primary">Next: {next.title} →</a>
	{:else}
		<a href="/courses/{course.id}" class="btn primary">Back to course →</a>
	{/if}
</nav>

<style>
	.lesson-nav {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}

	.btn {
		padding: 0.45rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		color: var(--text-muted);
		font-size: 0.78rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 46%;
		transition: border-color 0.15s, color 0.15s;
		background: transparent;
	}

	.btn:hover {
		border-color: var(--accent);
		color: var(--text);
	}

	.btn.primary {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}

	.btn.primary:hover {
		background: var(--accent-hover);
		border-color: var(--accent-hover);
	}
</style>
