<script>
	import { marked } from 'marked';
	import Breadcrumb from './Breadcrumb.svelte';
	import LessonNav from './LessonNav.svelte';
	import NotesPanel from './NotesPanel.svelte';
	import { markComplete, isComplete } from '$lib/utils/progress.js';
	import { browser } from '$app/environment';

	/** @type {{ lesson: any, course: any, prev: any, next: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, courseSlug = '', lessonId = '' } = $props();

	let showNotes = $state(false);
	let completed = $state(false);

	$effect(() => {
		if (browser && courseSlug && lessonId) {
			completed = isComplete(courseSlug, lessonId);
		}
	});

	function handleMarkRead() {
		if (courseSlug && lessonId) {
			markComplete(courseSlug, lessonId);
			completed = true;
		}
	}
</script>

<div class="page" class:has-notes={showNotes}>
	<main>
		<div class="top-bar">
			<Breadcrumb {course} {lesson} />
			<button class="notes-toggle" onclick={() => (showNotes = !showNotes)}>
				{showNotes ? 'Hide Notes' : 'Notes'}
			</button>
		</div>

		<header>
			<div class="meta">
				<span class="xp-pill">+{lesson.xpReward} XP</span>
				<span class="type-pill">{lesson.type}</span>
			</div>
			<h1>{lesson.title}</h1>
		</header>

		<article class="content">
			{@html marked(lesson.content)}
		</article>

		<div class="lesson-footer">
			{#if !completed}
				<button class="mark-btn" onclick={handleMarkRead}>Mark as Read</button>
			{:else}
				<span class="done-label">Lesson complete</span>
			{/if}
		</div>

		<LessonNav {course} {prev} {next} />
	</main>

	{#if showNotes}
		<aside class="notes-sidebar">
			<div class="notes-inner">
				<NotesPanel {courseSlug} {lessonId} />
			</div>
		</aside>
	{/if}
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 100vh;
	}

	@media (min-width: 1080px) {
		.page.has-notes {
			grid-template-columns: 1fr 300px;
		}
	}

	main {
		max-width: 700px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
		width: 100%;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.75rem;
	}

	.notes-toggle {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.65rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-muted);
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
		white-space: nowrap;
	}

	.notes-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	header {
		margin-bottom: 2rem;
	}

	.meta {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}

	.xp-pill,
	.type-pill {
		font-size: 0.7rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-weight: 700;
	}

	.xp-pill {
		background: var(--success-muted);
		color: var(--success);
	}

	.type-pill {
		background: var(--accent-muted);
		color: var(--accent);
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text);
		line-height: 1.2;
	}

	.content {
		color: var(--text-muted);
	}

	.content :global(h1) { font-size: 1.65rem; margin: 1.75rem 0 0.75rem; color: var(--text); font-weight: 700; }
	.content :global(h2) { font-size: 1.2rem; margin: 2rem 0 0.6rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; color: var(--text); font-weight: 600; }
	.content :global(h3) { font-size: 1rem; margin: 1.5rem 0 0.4rem; color: var(--text); font-weight: 600; }
	.content :global(p) { line-height: 1.8; margin: 0.85rem 0; color: var(--text-muted); }
	.content :global(code) { background: var(--surface-elevated); border: 1px solid var(--border); padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.875em; font-family: 'Fira Code', 'Cascadia Code', monospace; color: #cba6f7; }
	.content :global(pre) { background: #11111b; color: #cdd6f4; padding: 1.25rem; border-radius: 10px; overflow-x: auto; margin: 1.25rem 0; border: 1px solid var(--border); }
	.content :global(pre code) { background: none; border: none; padding: 0; font-size: 0.9rem; color: #cdd6f4; }
	.content :global(ul), .content :global(ol) { padding-left: 1.5rem; line-height: 1.8; color: var(--text-muted); margin: 0.75rem 0; }
	.content :global(li) { margin: 0.3rem 0; }
	.content :global(table) { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid var(--border); padding: 0.5rem 0.75rem; }
	.content :global(th) { background: var(--surface-elevated); font-weight: 600; color: var(--text); }
	.content :global(strong) { color: var(--text); font-weight: 600; }
	.content :global(blockquote) { border-left: 3px solid var(--accent); margin: 1rem 0; padding: 0.5rem 1rem; background: var(--accent-muted); border-radius: 0 6px 6px 0; }
	.content :global(blockquote p) { margin: 0; color: var(--text); }
	.content :global(a) { color: var(--accent); }

	.lesson-footer {
		margin: 2rem 0 1.5rem;
		display: flex;
		align-items: center;
	}

	.mark-btn {
		padding: 0.6rem 1.4rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	.mark-btn:hover {
		background: var(--accent-hover);
	}

	.done-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--success);
	}

	.notes-sidebar {
		border-left: 1px solid var(--border);
		background: var(--surface);
	}

	.notes-inner {
		padding: 2.5rem 1.25rem;
		position: sticky;
		top: 0;
	}
</style>
