<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { isComplete } from '$lib/utils/progress.js';
	import { Check, FlaskConical, Lock, PlayCircle, ScrollText } from '@lucide/svelte';

	/** @type {Record<string, string>} */
	const typeLabel = { THEORY: 'Theory', CHALLENGE: 'Lab', PROJECT: 'Project', WALKTHROUGH: 'Walkthrough' };

	/** @type {{ lesson: any, courseId: string, prevLessonId?: string | null }} */
	let { lesson, courseId, prevLessonId = null } = $props();

	let completed = $state(false);
	let prevDone = $state(true);

	onMount(() => {
		completed = isComplete(courseId, lesson.id);
		prevDone = prevLessonId === null || isComplete(courseId, prevLessonId);
	});

	let TypeIcon = $derived(lesson.challenge ? FlaskConical : lesson.type === 'WALKTHROUGH' ? PlayCircle : ScrollText);
</script>

<a
	href="/courses/{courseId}/{lesson.id}"
	class="lesson-row"
	class:completed
	class:locked={!prevDone}
	aria-disabled={!prevDone}
>
	<div class="status-container">
		<span class="dot" class:done={completed} class:lock={!prevDone} aria-hidden="true">
			{#if completed}
				<Check size={13} strokeWidth={4} />
			{:else if !prevDone}
				<Lock size={12} strokeWidth={2.5} />
			{:else}
				<TypeIcon size={13} strokeWidth={2.5} />
			{/if}
		</span>
	</div>

	<div class="lesson-main">
		<span class="lesson-title">{lesson.title}</span>
		<div class="meta-tags">
			<span class="badge {lesson.type.toLowerCase()}">{typeLabel[lesson.type] ?? lesson.type}</span>
			<span class="xp">+{lesson.xpReward ?? 10} XP</span>
		</div>
	</div>
</a>

<style>
	.lesson-row {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 0.95rem 1rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 18px;
		text-decoration: none;
		color: var(--text);
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
		box-shadow: var(--base-shadow);
		min-height: 70px;
	}

	.lesson-row:hover:not(.locked) {
		transform: translateY(-1px);
		box-shadow: var(--depth-shadow);
		border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
	}

	.lesson-row.completed {
		border-color: color-mix(in srgb, var(--success) 28%, var(--border));
		background: linear-gradient(90deg, var(--surface-elevated), color-mix(in srgb, var(--success) 4%, var(--surface-elevated)));
	}

	.lesson-row.locked {
		opacity: 0.58;
		cursor: not-allowed;
		pointer-events: none;
	}

	.status-container { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

	.dot {
		width: 30px;
		height: 30px;
		border-radius: 18px;
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent-strong);
		flex-shrink: 0;
		background: var(--accent-muted);
	}

	.dot.done { border-color: var(--success); background: var(--success); color: #fff; }
	.dot.lock { border-color: var(--border); background: var(--surface); color: var(--text-dim); }

	.lesson-main {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.lesson-title {
		font-weight: 800;
		font-size: 0.96rem;
		line-height: 1.35;
	}

	.lesson-row.completed .lesson-title { color: color-mix(in srgb, var(--text) 82%, var(--success)); }

	.meta-tags {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-shrink: 0;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.badge,
	.xp {
		font-size: 0.66rem;
		padding: 0.22rem 0.5rem;
		border-radius: 999px;
		font-weight: 800;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		border: 1px solid var(--border);
	}

	.badge.theory { background: var(--accent-muted); color: var(--accent-strong); }
	.badge.challenge { background: var(--success-muted); color: var(--success); }
	.badge.project { background: var(--warning-muted); color: var(--warning); }
	.badge.walkthrough { background: var(--info-muted); color: var(--info); }

	.xp { color: var(--text-dim); background: var(--surface); }

	@media (max-width: 620px) {
		.lesson-main { flex-direction: column; align-items: flex-start; gap: 0.55rem; }
		.meta-tags { justify-content: flex-start; }
	}
</style>



