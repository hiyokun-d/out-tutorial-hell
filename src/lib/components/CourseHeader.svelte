<script>
	import { onMount } from 'svelte';
	import { getProgress } from '$lib/utils/progress.js';

	/** @type {{ course: { icon: string, title: string, description: string }, lessons?: any[], courseId?: string }} */
	let { course, lessons = [], courseId = '' } = $props();

	let completedCount = $state(0);

	onMount(() => {
		if (courseId && lessons.length > 0) {
			const progress = getProgress(courseId);
			completedCount = lessons.filter((l) => progress.has(l.id)).length;
		}
	});

	let pct = $derived(lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0);
</script>

<header>
	<div class="top">
		<span class="icon">{course.icon}</span>
		<div class="info">
			<h1>{course.title}</h1>
			<p>{course.description}</p>
		</div>
	</div>

	{#if lessons.length > 0}
		<div class="progress-wrap">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {pct}%"></div>
			</div>
			<span class="progress-label">{completedCount}/{lessons.length} complete</span>
		</div>
	{/if}
</header>

<style>
	header {
		padding: 1.75rem 0 2rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 1.5rem;
	}

	.top {
		display: flex;
		gap: 1.1rem;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.icon {
		font-size: 3rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.info {
		flex: 1;
	}

	h1 {
		margin: 0 0 0.3rem;
		font-size: 1.6rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	.progress-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.progress-bar {
		flex: 1;
		height: 4px;
		background: var(--surface-elevated);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	.progress-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		white-space: nowrap;
		font-weight: 500;
	}
</style>
