<script>
	// @ts-nocheck
	import CourseHeader from '$lib/components/CourseHeader.svelte';
	import LessonRow from '$lib/components/LessonRow.svelte';
	import { onMount } from 'svelte';
	import { ArrowLeft, CheckCircle2, Code2, ListChecks, Play, Route, Target } from '@lucide/svelte';
	import { getProgress } from '$lib/utils/progress.js';

	let { data } = $props();
	const { course, lessons } = data;

	const challengeCount = lessons.filter((lesson) => lesson.challenge).length;
	const totalXp = lessons.reduce((sum, lesson) => sum + (lesson.xpReward ?? 10), 0);
	let completed = $state(new Set());

	onMount(() => {
		completed = getProgress(course.id);
	});

	let nextLesson = $derived(lessons.find((lesson) => !completed.has(lesson.id)) ?? lessons[0] ?? null);
</script>

<svelte:head><title>{course.title} | Out of Tutorial Hell</title></svelte:head>

<main class="course-page">
	<a href="/courses" class="back"><ArrowLeft size={16} /> Roadmap</a>

	<CourseHeader {course} {lessons} courseId={course.id} />

	<section class="course-command" aria-label="Course command center">
		<div>
			<span><Target size={16} /> Current objective</span>
			<h2>{nextLesson ? nextLesson.title : 'Review the course'}</h2>
			<p>{nextLesson ? 'Open the next lesson, complete the check, and keep your local progress moving.' : 'All lessons are complete in this browser.'}</p>
		</div>
		{#if nextLesson}
			<a href="/courses/{course.id}/{nextLesson.id}"><Play size={17} /> Continue</a>
		{/if}
	</section>

	<section class="quick-stats" aria-label="Course stats">
		<div><Route size={18} /><strong>{lessons.length}</strong><span>lessons</span></div>
		<div><Code2 size={18} /><strong>{challengeCount}</strong><span>coding labs</span></div>
		<div><CheckCircle2 size={18} /><strong>{totalXp}</strong><span>total XP</span></div>
	</section>

	<section class="path-section">
		<div class="section-title">
			<span><ListChecks size={16} /> Course path</span>
			<p>Complete each node to unlock the next one locally in this browser.</p>
		</div>
		<ol class="lesson-list">
			{#each lessons as lesson, i}
				<li>
					<div class="lesson-index">{String(i + 1).padStart(2, '0')}</div>
					<LessonRow
						{lesson}
						courseId={course.id}
						prevLessonId={i > 0 ? lessons[i - 1].id : null}
					/>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	.course-page {
		max-width: 920px;
		margin: 0 auto;
		padding: 1rem 1rem 5rem;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.86rem;
		font-weight: 800;
		margin-bottom: 0.75rem;
	}

	.back:hover { color: var(--accent-strong); }

	.course-command {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
	}

	.course-command span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--accent-strong);
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.course-command h2 { margin: 0.35rem 0; color: var(--text); font-size: 1.45rem; }
	.course-command p { margin: 0; color: var(--text-muted); line-height: 1.55; }
	.course-command a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 42px;
		padding: 0.7rem 0.95rem;
		border-radius: 18px;
		background: var(--accent);
		color: #160d14;
		font-weight: 900;
		text-decoration: none;
		white-space: nowrap;
	}

	.quick-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin: 1rem 0;
	}

	.quick-stats div {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
	}

	.quick-stats svg { color: var(--accent-strong); flex-shrink: 0; }
	.quick-stats strong { color: var(--text); font-size: 1.2rem; }
	.quick-stats span { color: var(--text-muted); font-size: 0.8rem; font-weight: 800; }

	.path-section {
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
		padding: 1rem;
	}

	.section-title {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.section-title span {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--text);
		font-weight: 900;
		font-size: 1.1rem;
	}

	.section-title p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.86rem;
		line-height: 1.5;
		text-align: right;
	}

	.lesson-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.lesson-list li {
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 0.65rem;
		align-items: stretch;
	}

	.lesson-index {
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface-elevated);
		color: var(--text-dim);
		font-size: 0.75rem;
		font-weight: 900;
		display: grid;
		place-items: center;
	}

	@media (max-width: 720px) {
		.course-page { padding: 0 0 4rem; }
		.back { margin: 1rem; }
		.course-command { border-radius: 0; border-left: 0; border-right: 0; flex-direction: column; align-items: flex-start; }
		.course-command a { width: 100%; justify-content: center; }
		.quick-stats { grid-template-columns: 1fr; padding: 0 1rem; }
		.path-section { border-radius: 0; border-left: 0; border-right: 0; }
		.section-title { flex-direction: column; }
		.section-title p { text-align: left; }
		.lesson-list li { grid-template-columns: 1fr; }
		.lesson-index { display: none; }
	}
</style>


