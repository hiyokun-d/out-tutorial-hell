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
		padding: 1.35rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 92%, transparent), var(--surface));
		border-right: 1px solid var(--border);
	}

	.panel-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.notes-toggle {
		font-size: 0.72rem;
		font-weight: 800;
		padding: 0.35rem 0.65rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 18px;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
		flex-shrink: 0;
	}

	.notes-toggle:hover {
		background: var(--accent-muted);
		border-color: color-mix(in srgb, var(--accent) 58%, var(--border));
		color: var(--accent-strong);
	}

	h1 {
		font-size: clamp(1.55rem, 2vw, 2.05rem);
		margin: 0;
		line-height: 1.12;
		font-weight: 800;
		letter-spacing: 0;
		color: var(--text);
	}

	.content {
		font-size: 0.92rem;
		line-height: 1.78;
		color: var(--text-muted);
	}

	.content :global(h1) { font-size: 1.15rem; margin: 1.1rem 0 0.4rem; color: var(--text); }
	.content :global(h2) { font-size: 1rem; margin: 1.2rem 0 0.35rem; border-bottom: 1px solid var(--border); padding-bottom: 0.35rem; color: var(--text); }
	.content :global(p) { margin: 0.5rem 0; color: var(--text-muted); }
	.content :global(code) { background: var(--surface-elevated); border: 1px solid var(--border); padding: 0.12rem 0.35rem; border-radius: 5px; font-size: 0.84em; font-family: 'Fira Code', monospace; color: var(--accent-strong); }
	.content :global(pre) { background: var(--sandbox-bg); color: var(--sandbox-text); padding: 0.9rem 1rem; border-radius: 18px; overflow-x: auto; margin: 0.65rem 0; border: 1px solid var(--sandbox-border); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
	.content :global(pre code) { background: none; border: none; padding: 0; font-size: 0.82rem; color: var(--sandbox-text); }
	.content :global(table) { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.65rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid var(--border); padding: 0.4rem 0.6rem; }
	.content :global(th) { background: var(--surface-elevated); font-weight: 700; color: var(--text); }
	.content :global(ul), .content :global(ol) { padding-left: 1.2rem; margin: 0.45rem 0; }
	.content :global(li) { margin: 0.18rem 0; }
	.content :global(strong) { color: var(--text); font-weight: 700; }

	.notes-wrap {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 920px) {
		.panel {
			height: auto;
			max-height: none;
			border-right: none;
			border-bottom: 1px solid var(--border);
		}
	}
</style>

