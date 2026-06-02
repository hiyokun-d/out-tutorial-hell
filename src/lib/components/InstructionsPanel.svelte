<script>
	import { marked } from 'marked';
	import Breadcrumb from './Breadcrumb.svelte';
	import TaskBox from './TaskBox.svelte';
	import TestPanel from './TestPanel.svelte';
	import LessonNav from './LessonNav.svelte';
	import { DEFAULT_CONFIG } from '$lib/courses.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, testResults: any[], allPassed: boolean, running: boolean, onRun: () => void, features?: any }} */
	let { lesson, course, prev, next, testResults, allPassed, running, onRun, features = DEFAULT_CONFIG.features } = $props();

	const hintsEnabled = features.hints !== false;

	const html = marked(lesson.content);
</script>

<aside class="panel">
	<Breadcrumb {course} {lesson} />

	<div class="pills">
		<span class="pill xp">+{lesson.xpReward} XP</span>
		<span class="pill type">{lesson.type}</span>
	</div>

	<h1>{lesson.title}</h1>

	<div class="content">{@html html}</div>

	{#if lesson.challenge?.instructions}
		<TaskBox instructions={lesson.challenge.instructions} />
	{/if}

	<TestPanel {testResults} {allPassed} {running} hints={hintsEnabled ? (lesson.challenge?.hints ?? []) : []} {onRun} />

	<LessonNav {course} {prev} {next} />
</aside>

<style>
	.panel {
		height: 100%;
		overflow-y: auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		border-right: 1px solid #e5e7eb;
		background: #fff;
	}

	.pills {
		display: flex;
		gap: 0.4rem;
	}

	.pill {
		font-size: 0.7rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-weight: 700;
	}

	.pill.xp { background: #d1fae5; color: #065f46; }
	.pill.type { background: #e0e7ff; color: #4338ca; }

	h1 {
		font-size: 1.35rem;
		margin: 0;
		line-height: 1.3;
	}

	.content {
		font-size: 0.875rem;
		line-height: 1.75;
		color: #374151;
	}

	.content :global(h1) { font-size: 1.15rem; margin: 1rem 0 0.35rem; }
	.content :global(h2) { font-size: 1rem; margin: 1.1rem 0 0.3rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.2rem; }
	.content :global(p) { margin: 0.45rem 0; }
	.content :global(code) { background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.82em; font-family: 'Fira Code', monospace; }
	.content :global(pre) { background: #1e1e2e; color: #cdd6f4; padding: 0.85rem 1rem; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
	.content :global(pre code) { background: none; padding: 0; font-size: 0.8rem; }
	.content :global(table) { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.5rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid #e5e7eb; padding: 0.3rem 0.55rem; }
	.content :global(th) { background: #f9fafb; font-weight: 600; }
	.content :global(ul), .content :global(ol) { padding-left: 1.2rem; margin: 0.4rem 0; }
	.content :global(li) { margin: 0.15rem 0; }
	.content :global(strong) { color: #111827; font-weight: 600; }
</style>
