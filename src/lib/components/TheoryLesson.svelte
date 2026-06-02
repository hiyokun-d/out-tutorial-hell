<script>
	import { marked } from 'marked';
	import Breadcrumb from './Breadcrumb.svelte';
	import LessonNav from './LessonNav.svelte';

	/** @type {{ lesson: any, course: any, prev: any, next: any }} */
	let { lesson, course, prev, next } = $props();
</script>

<main>
	<Breadcrumb {course} {lesson} />

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

	<LessonNav {course} {prev} {next} />
</main>

<style>
	main {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	.meta {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.xp-pill,
	.type-pill {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-weight: 600;
	}

	.xp-pill { background: #d1fae5; color: #065f46; }
	.type-pill { background: #e0e7ff; color: #4338ca; }

	h1 { margin: 0; font-size: 2rem; }

	.content :global(h1) { font-size: 1.75rem; margin: 1.5rem 0 0.75rem; }
	.content :global(h2) { font-size: 1.3rem; margin: 1.75rem 0 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
	.content :global(p) { line-height: 1.7; margin: 0.75rem 0; color: #374151; }
	.content :global(code) { background: #f3f4f6; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.875em; font-family: monospace; }
	.content :global(pre) { background: #1e1e2e; color: #cdd6f4; padding: 1.25rem; border-radius: 10px; overflow-x: auto; margin: 1rem 0; }
	.content :global(pre code) { background: none; padding: 0; font-size: 0.9rem; }
	.content :global(ul), .content :global(ol) { padding-left: 1.5rem; line-height: 1.8; color: #374151; }
	.content :global(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; }
	.content :global(th) { background: #f9fafb; font-weight: 600; }
	.content :global(strong) { color: #111827; }
</style>
