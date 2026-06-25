<script>
	/** @type {{ course: any, prev: any, next: any, onNext?: () => void }} */
	let { course, prev, next, onNext } = $props();
</script>

<nav class="lesson-nav">
	{#if prev}
		<a href="/courses/{course.id}/{prev.id}" class="btn">Back: {prev.title}</a>
	{:else}
		<span></span>
	{/if}

	{#if next}
		{#if onNext}
			<button class="btn primary" onclick={onNext}>Next: {next.title}</button>
		{:else}
			<a href="/courses/{course.id}/{next.id}" class="btn primary">Next: {next.title}</a>
		{/if}
	{:else}
		<a href="/courses/{course.id}" class="btn primary">Back to course</a>
	{/if}
</nav>

<style>
	.lesson-nav {
		display: flex;
		justify-content: space-between;
		gap: 0.65rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--border);
	}

	.btn {
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		text-decoration: none;
		color: var(--text-muted);
		font-size: 0.78rem;
		font-weight: 800;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 48%;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
		background: var(--surface-elevated);
		cursor: pointer;
		font-family: inherit;
	}

	.btn:hover {
		border-color: color-mix(in srgb, var(--accent) 58%, var(--border));
		color: var(--text);
		background: var(--accent-muted);
	}

	.btn.primary {
		background: var(--accent);
		color: #160d14;
		border-color: var(--accent);
	}

	.btn.primary:hover {
		background: var(--accent-hover);
		border-color: var(--accent-hover);
		color: #160d14;
	}
</style>
