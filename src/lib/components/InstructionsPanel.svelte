<script>
	import { marked } from 'marked';
	import Breadcrumb from './Breadcrumb.svelte';
	import TaskBox from './TaskBox.svelte';
	import TestPanel from './TestPanel.svelte';
	import LessonNav from './LessonNav.svelte';
	import NotesPanel from './NotesPanel.svelte';
	import { DEFAULT_CONFIG } from '$lib/courses.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, testResults: any[], allPassed: boolean, running: boolean, onRun: () => void, features?: any, courseSlug?: string, lessonId?: string }} */
	let {
		lesson,
		course,
		prev,
		next,
		testResults,
		allPassed,
		running,
		onRun,
		features = DEFAULT_CONFIG.features,
		courseSlug = '',
		lessonId = ''
	} = $props();

	let hintsEnabled = $derived(features.hints !== false);
	let html = $derived(marked(lesson.content));

	let showNotes = $state(false);
</script>

<aside class="panel">
	<div class="panel-top">
		<Breadcrumb {course} {lesson} />
		<button class="notes-toggle" onclick={() => (showNotes = !showNotes)}>
			{showNotes ? 'Hide Notes' : 'Notes'}
		</button>
	</div>

	<h1>{lesson.title}</h1>

	<div class="content">{@html html}</div>

	{#if lesson.challenge?.instructions}
		<TaskBox instructions={lesson.challenge.instructions} />
	{/if}

	<TestPanel
		{testResults}
		{allPassed}
		{running}
		hints={hintsEnabled ? (lesson.challenge?.hints ?? []) : []}
		{onRun}
	/>

	<LessonNav {course} {prev} {next} />

	{#if showNotes && courseSlug && lessonId}
		<div class="notes-wrap">
			<NotesPanel {courseSlug} {lessonId} />
		</div>
	{/if}
</aside>

<style>
	.panel {
		height: 100%;
		overflow-y: auto;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--surface);
		border-right: 1px solid var(--border);
	}

	.panel-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.notes-toggle {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.6rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition: border-color 0.15s, color 0.15s;
		flex-shrink: 0;
	}

	.notes-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	h1 {
		font-size: 1.3rem;
		margin: 0;
		line-height: 1.3;
		font-weight: 700;
		color: var(--text);
	}

	.content {
		font-size: 0.875rem;
		line-height: 1.75;
		color: var(--text-muted);
	}

	.content :global(h1) { font-size: 1.1rem; margin: 1rem 0 0.35rem; color: var(--text); }
	.content :global(h2) { font-size: 0.95rem; margin: 1.1rem 0 0.3rem; border-bottom: 1px solid var(--border); padding-bottom: 0.2rem; color: var(--text); }
	.content :global(p) { margin: 0.45rem 0; color: var(--text-muted); }
	.content :global(code) { background: var(--bg); border: 1px solid var(--border); padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.82em; font-family: 'Fira Code', monospace; color: #cba6f7; }
	.content :global(pre) { background: #11111b; color: #cdd6f4; padding: 0.85rem 1rem; border-radius: 8px; overflow-x: auto; margin: 0.5rem 0; }
	.content :global(pre code) { background: none; border: none; padding: 0; font-size: 0.8rem; color: #cdd6f4; }
	.content :global(table) { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.5rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid var(--border); padding: 0.3rem 0.55rem; }
	.content :global(th) { background: var(--surface-elevated); font-weight: 600; color: var(--text); }
	.content :global(ul), .content :global(ol) { padding-left: 1.2rem; margin: 0.4rem 0; }
	.content :global(li) { margin: 0.15rem 0; }
	.content :global(strong) { color: var(--text); font-weight: 600; }

	.notes-wrap {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
		margin-top: 0.25rem;
	}
</style>
