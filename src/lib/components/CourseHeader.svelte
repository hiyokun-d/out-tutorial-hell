<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getProgress } from '$lib/utils/progress.js';
	import { Compass, Cpu, Globe, Terminal } from '@lucide/svelte';

	/** @type {{ course: { icon: string, title: string, description: string, difficulty?: string }, lessons?: any[], courseId?: string }} */
	let { course, lessons = [], courseId = '' } = $props();

	let completedCount = $state(0);

	const ICON_MAP = /** @type {Record<string, any>} */ ({
		globe: Globe,
		terminal: Terminal,
		cpu: Cpu,
		compass: Compass
	});

	let IconComponent = $derived(ICON_MAP[course.icon] || Terminal);

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
		<div class="icon-wrap">
			<IconComponent size={32} strokeWidth={2.1} class="course-icon" />
		</div>
		<div class="info">
			<span class="eyebrow">{course.difficulty ?? 'Roadmap path'}</span>
			<h1>{course.title}</h1>
			<p>{course.description}</p>
		</div>
	</div>

	{#if lessons.length > 0}
		<div class="progress-wrap">
			<div class="progress-copy">
				<strong>{pct}% complete</strong>
				<span>{completedCount}/{lessons.length} lessons finished locally</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {pct}%"></div>
			</div>
		</div>
	{/if}
</header>

<style>
	header {
		padding: clamp(1.5rem, 4vw, 2.4rem);
		border: 1px solid var(--border);
		border-radius: 18px;
		margin-bottom: 1rem;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--surface) 96%, transparent), color-mix(in srgb, var(--surface-elevated) 88%, transparent)),
			var(--bg-gradient);
		box-shadow: var(--depth-shadow);
	}

	.top {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.icon-wrap {
		width: 64px;
		height: 64px;
		border-radius: 18px;
		background: var(--accent-muted);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent-strong);
		flex-shrink: 0;
	}

	.info { flex: 1; min-width: 0; }

	.eyebrow {
		color: var(--accent-strong);
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0.25rem 0 0.45rem;
		font-size: clamp(2.1rem, 5vw, 3.6rem);
		font-weight: 900;
		letter-spacing: 0;
		line-height: 1;
		color: var(--text);
	}

	p {
		margin: 0;
		color: var(--text-muted);
		font-size: 1rem;
		line-height: 1.65;
		max-width: 680px;
	}

	.progress-wrap {
		display: grid;
		grid-template-columns: minmax(160px, 220px) 1fr;
		align-items: center;
		gap: 1rem;
	}

	.progress-copy strong { display: block; color: var(--text); }
	.progress-copy span { color: var(--text-muted); font-size: 0.78rem; font-weight: 700; }

	.progress-bar {
		height: 10px;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	@media (max-width: 720px) {
		header { border-radius: 0; border-left: 0; border-right: 0; }
		.top { flex-direction: column; }
		.progress-wrap { grid-template-columns: 1fr; }
	}
</style>



