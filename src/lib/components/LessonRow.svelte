<script>
	import { onMount } from 'svelte';
	import { isComplete } from '$lib/utils/progress.js';

	/** @type {Record<string, string>} */
	const typeLabel = { THEORY: 'Theory', CHALLENGE: 'Challenge', PROJECT: 'Project', WALKTHROUGH: 'Walkthrough' };

	/** @type {{ lesson: any, courseId: string, prevLessonId?: string | null }} */
	let { lesson, courseId, prevLessonId = null } = $props();

	let completed = $state(false);
	let prevDone = $state(true);

	onMount(() => {
		completed = isComplete(courseId, lesson.id);
		prevDone = prevLessonId === null || isComplete(courseId, prevLessonId);
	});
</script>

<a href="/courses/{courseId}/{lesson.id}" class="lesson-row" class:soft-lock={!prevDone}>
	<span class="dot" class:done={completed} aria-hidden="true">
		{#if completed}✓{/if}
	</span>
	<span class="lesson-title">{lesson.title}</span>
	<span class="badge">{typeLabel[lesson.type] ?? lesson.type}</span>
	<span class="xp">+{lesson.xpReward} XP</span>
</a>

<style>
	.lesson-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		text-decoration: none;
		color: var(--text);
		transition: border-color 0.15s, background 0.15s;
	}

	.lesson-row:hover {
		border-color: var(--accent);
		background: var(--surface-elevated);
	}

	.lesson-row.soft-lock {
		opacity: 0.55;
	}

	.lesson-row.soft-lock:hover {
		opacity: 0.8;
	}

	.dot {
		width: 1.3rem;
		height: 1.3rem;
		border-radius: 50%;
		border: 2px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--success);
		flex-shrink: 0;
		transition: border-color 0.15s, background 0.15s;
	}

	.dot.done {
		border-color: var(--success);
		background: var(--success-muted);
	}

	.lesson-title {
		flex: 1;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.badge {
		font-size: 0.68rem;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		font-weight: 600;
		background: var(--surface-elevated);
		color: var(--text-muted);
		letter-spacing: 0.03em;
	}

	.xp {
		font-size: 0.75rem;
		color: var(--text-dim);
		font-weight: 600;
	}
</style>
