<script>
	// @ts-nocheck
	import CourseHeader from '$lib/components/CourseHeader.svelte';
	import { ArrowLeft, BookOpen, CheckCircle2, Code2, FlaskConical, Play, Route, ScrollText, Target } from '@lucide/svelte';
	import { getProgress } from '$lib/utils/progress.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let course = $derived(data.course);
	let lessons = $derived(data.lessons);

	let challengeCount = $derived(lessons.filter((lesson) => lesson.challenge).length);
	let totalXp = $derived(lessons.reduce((sum, lesson) => sum + (lesson.xpReward ?? 10), 0));
	let completed = $state(new Set());
	let lessonGroups = $derived(groupLessons(lessons, completed));

	$effect(() => {
		completed = getProgress(course.id);
	});

	let nextLesson = $derived(lessons.find((lesson) => !completed.has(lesson.id)) ?? lessons[0] ?? null);

	function groupLessons(items, completedLessons = new Set()) {
		const groups = [];
		const byName = new Map();

		for (const lesson of items) {
			const name = lesson.module || 'Core path';
			if (!byName.has(name)) {
				const group = { name, lessons: [], labs: 0, xp: 0, completed: 0 };
				byName.set(name, group);
				groups.push(group);
			}

			const group = byName.get(name);
			group.lessons.push(lesson);
			group.labs += lesson.challenge ? 1 : 0;
			group.xp += lesson.xpReward ?? 10;
			group.completed += completedLessons.has(lesson.id) ? 1 : 0;
		}

		return groups;
	}

	function moduleSummary(group) {
		const parts = [`${group.lessons.length} lessons`, `${group.xp} XP`];
		if (group.labs > 0) parts.splice(1, 0, `${group.labs} labs`);
		return parts.join(' / ');
	}

	function lessonIndex(lesson) {
		return lessons.findIndex((item) => item.id === lesson.id);
	}

	/** @type {{ lesson: any, skipped: number } | null} */
	let skipDialog = $state(null);

	/** @param {MouseEvent} e @param {any} lesson @param {number} i */
	function handleNodeClick(e, lesson, i) {
		const skippedCount = lessons.slice(0, i).filter((l) => !completed.has(l.id)).length;
		if (skippedCount > 0) {
			e.preventDefault();
			skipDialog = { lesson, skipped: skippedCount };
		}
	}

	function confirmSkip() {
		if (!skipDialog) return;
		const target = skipDialog.lesson;
		skipDialog = null;
		goto(`/courses/${course.id}/${target.id}`);
	}

	function typeLabel(lesson) {
		if (lesson.challenge) return 'Lab';
		return lesson.type === 'PROJECT' ? 'Project' : lesson.type === 'WALKTHROUGH' ? 'Walkthrough' : 'Lesson';
	}
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
			<span><Route size={16} /> Visual roadmap</span>
			<p>Follow the connected path. Every node opens a lesson, lab, walkthrough, or project.</p>
		</div>
		<div class="roadmap-board">
			{#each lessonGroups as group, groupIndex}
				{@const moduleNumber = String(groupIndex + 1).padStart(2, '0')}
				{@const pct = Math.round((group.completed / group.lessons.length) * 100)}
				<section class="module-track" aria-labelledby={`module-${groupIndex}`}>
					<div class="module-card">
						<div class="module-kicker">
							<span class="module-number">Module {moduleNumber}</span>
							<span class="module-state">{group.completed}/{group.lessons.length} done</span>
						</div>
						<div class="module-title-row">
							<div>
								<h3 id={`module-${groupIndex}`}>{group.name}</h3>
								<p>{moduleSummary(group)}</p>
							</div>
							<div class="module-icons" aria-label={moduleSummary(group)}>
								<span><BookOpen size={15} /> {group.lessons.length}</span>
								<span><FlaskConical size={15} /> {group.labs}</span>
							</div>
						</div>
						<div class="module-progress" aria-label={`Module ${groupIndex + 1} is ${pct}% complete`}>
							<span style={`width: ${pct}%`}></span>
						</div>
					</div>

					<div class="roadmap-nodes">
						{#each group.lessons as lesson, localIndex}
							{@const i = lessonIndex(lesson)}
							{@const done = completed.has(lesson.id)}
							<a
								href="/courses/{course.id}/{lesson.id}"
								class="roadmap-node"
								class:branch-right={localIndex % 2 === 1}
								class:completed={done}
								onclick={(e) => handleNodeClick(e, lesson, i)}
							>
								<span class="node-number">{String(i + 1).padStart(2, '0')}</span>
								<span class="node-copy">
									<strong>{lesson.title}</strong>
									<small>{typeLabel(lesson)} / +{lesson.xpReward ?? 10} XP</small>
								</span>
								<span class="node-status" aria-hidden="true">
									{#if lesson.challenge}
										<FlaskConical size={15} />
									{:else}
										<ScrollText size={15} />
									{/if}
								</span>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</section>
</main>

{#if skipDialog}
	<div class="skip-overlay" role="dialog" aria-modal="true" onclick={() => (skipDialog = null)}>
		<div class="skip-dialog" onclick={(e) => e.stopPropagation()}>
			<h3>Skip ahead?</h3>
			<p>
				{skipDialog.skipped === 1
					? 'There is 1 uncompleted lesson'
					: `There are ${skipDialog.skipped} uncompleted lessons`} before this one.
				You can always come back to them — your progress is saved locally in your browser, nothing is sent anywhere.
			</p>
			<div class="skip-actions">
				<button class="skip-cancel" onclick={() => (skipDialog = null)}>Stay here</button>
				<button class="skip-confirm" onclick={confirmSkip}>Go anyway</button>
			</div>
		</div>
	</div>
{/if}

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

	.roadmap-board {
		position: relative;
		display: grid;
		gap: 1.35rem;
		padding: 0.4rem 0.2rem;
	}

	.module-track {
		position: relative;
		display: grid;
		grid-template-columns: minmax(220px, 280px) 1fr;
		gap: 1.1rem;
		align-items: start;
	}

	.module-track::before {
		content: '';
		position: absolute;
		left: 280px;
		top: 64px;
		width: calc(100% - 280px);
		height: 2px;
		background: color-mix(in srgb, var(--border) 70%, transparent);
	}

	.module-track:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 138px;
		top: calc(100% - 0.05rem);
		width: 2px;
		height: 1.4rem;
		background: color-mix(in srgb, var(--border) 70%, transparent);
	}

	.module-card,
	.roadmap-node {
		position: relative;
		z-index: 1;
		border: 1px solid var(--border);
		box-shadow: var(--base-shadow);
	}

	.module-card {
		display: grid;
		gap: 0.85rem;
		padding: 1rem;
		border-radius: 18px;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--accent-muted) 60%, transparent), transparent 64%),
			var(--surface-elevated);
	}

	.module-kicker,
	.module-title-row,
	.module-icons,
	.module-icons span,
	.roadmap-node,
	.node-status {
		display: flex;
		align-items: center;
	}

	.module-kicker,
	.module-title-row {
		justify-content: space-between;
		gap: 1rem;
	}

	.module-number,
	.module-state {
		font-size: 0.68rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.module-number { color: var(--accent-strong); }
	.module-state { color: var(--text-dim); }

	.module-card h3 {
		margin: 0;
		color: var(--text);
		font-size: 1.25rem;
		line-height: 1.2;
	}

	.module-card p {
		margin: 0.3rem 0 0;
		color: var(--text-muted);
		font-size: 0.84rem;
		font-weight: 750;
	}

	.module-icons {
		gap: 0.45rem;
		flex-shrink: 0;
	}

	.module-icons span {
		gap: 0.35rem;
		min-height: 34px;
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		color: var(--text-muted);
		font-size: 0.76rem;
		font-weight: 900;
	}

	.module-progress {
		height: 7px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.module-progress span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--accent);
		transition: width 0.35s ease;
	}

	.roadmap-nodes {
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, minmax(170px, 1fr));
		gap: 0.75rem 1rem;
		padding-top: 1.25rem;
	}

	.roadmap-nodes::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: color-mix(in srgb, var(--border) 70%, transparent);
		transform: translateX(-50%);
	}

	.roadmap-node {
		gap: 0.75rem;
		min-height: 72px;
		padding: 0.8rem;
		border-radius: 16px;
		background: var(--surface-elevated);
		color: var(--text);
		text-decoration: none;
		transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
	}

	.roadmap-node:nth-child(odd) { grid-column: 1; }
	.roadmap-node:nth-child(even) { grid-column: 2; }

	.roadmap-node::before {
		content: '';
		position: absolute;
		top: 50%;
		width: 1rem;
		height: 2px;
		background: color-mix(in srgb, var(--border) 70%, transparent);
	}

	.roadmap-node:nth-child(odd)::before { right: -1rem; }
	.roadmap-node:nth-child(even)::before { left: -1rem; }

	.roadmap-node:hover:not(.locked) {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
		box-shadow: var(--depth-shadow);
	}

	.roadmap-node.completed {
		border-color: color-mix(in srgb, var(--success) 35%, var(--border));
		background: linear-gradient(90deg, var(--surface-elevated), color-mix(in srgb, var(--success) 5%, var(--surface-elevated)));
	}

	.node-number,
	.node-status {
		width: 34px;
		height: 34px;
		border-radius: 999px;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.node-number {
		display: grid;
		place-items: center;
		background: var(--surface);
		color: var(--text-dim);
		font-size: 0.72rem;
		font-weight: 900;
	}

	.node-copy {
		display: grid;
		gap: 0.22rem;
		min-width: 0;
		flex: 1;
	}

	.node-copy strong {
		font-size: 0.9rem;
		line-height: 1.25;
		color: var(--text);
	}

	.node-copy small {
		color: var(--text-muted);
		font-size: 0.68rem;
		font-weight: 850;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.node-status {
		justify-content: center;
		background: var(--accent-muted);
		color: var(--accent-strong);
	}

	.roadmap-node.completed .node-status {
		background: var(--success);
		border-color: var(--success);
		color: #fff;
	}

	.skip-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		backdrop-filter: blur(3px);
		padding: 1rem;
	}

	.skip-dialog {
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 1.75rem;
		max-width: 400px;
		width: 100%;
		box-shadow: var(--depth-shadow);
	}

	.skip-dialog h3 {
		margin: 0 0 0.75rem;
		font-size: 1.15rem;
		color: var(--text);
	}

	.skip-dialog p {
		margin: 0 0 1.25rem;
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.skip-actions {
		display: flex;
		gap: 0.6rem;
		justify-content: flex-end;
	}

	.skip-cancel,
	.skip-confirm {
		padding: 0.55rem 1.1rem;
		border-radius: 18px;
		font-size: 0.84rem;
		font-weight: 800;
		cursor: pointer;
		font-family: inherit;
		transition: background 0.15s, border-color 0.15s;
	}

	.skip-cancel {
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text-muted);
	}

	.skip-cancel:hover { border-color: var(--text-muted); color: var(--text); }

	.skip-confirm {
		background: var(--accent);
		border: 1px solid var(--accent);
		color: #160d14;
	}

	.skip-confirm:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

	@media (max-width: 720px) {
		.course-page { padding: 0 0 4rem; }
		.back { margin: 1rem; }
		.course-command { border-radius: 0; border-left: 0; border-right: 0; flex-direction: column; align-items: flex-start; }
		.course-command a { width: 100%; justify-content: center; }
		.quick-stats { grid-template-columns: 1fr; padding: 0 1rem; }
		.path-section { border-radius: 0; border-left: 0; border-right: 0; }
		.module-track { grid-template-columns: 1fr; gap: 0.75rem; }
		.module-track::before,
		.module-track::after,
		.roadmap-nodes::before,
		.roadmap-node::before { display: none; }
		.module-card { border-radius: 14px; }
		.module-title-row { flex-direction: column; align-items: flex-start; }
		.module-icons { width: 100%; }
		.module-icons span { flex: 1; justify-content: center; }
		.section-title { flex-direction: column; }
		.section-title p { text-align: left; }
		.roadmap-nodes { grid-template-columns: 1fr; padding-top: 0; }
		.roadmap-node:nth-child(odd),
		.roadmap-node:nth-child(even) { grid-column: 1; }
	}
</style>









