<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { ArrowRight, CheckCircle2, Circle, Code2, Download, Lock, Map, Route, Sparkles, Upload } from '@lucide/svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import { getProgress } from '$lib/utils/progress.js';
	import { downloadLearningSnapshot, importLearningSnapshot } from '$lib/utils/local-data.js';

	let { data } = $props();
	const { courses, tracks, skillMatrix } = data;

	let completedByCourse = $state({});
	let importMessage = $state('');

	onMount(() => {
		refreshProgress();
	});

	function refreshProgress() {
		const next = {};
		for (const course of courses) next[course.id] = getProgress(course.id).size;
		completedByCourse = next;
	}

	function trackProgress(track) {
		const complete = track.courses.reduce((sum, course) => sum + (completedByCourse[course.id] ?? 0), 0);
		return track.lessonCount ? Math.round((complete / track.lessonCount) * 100) : 0;
	}

	async function handleImport(event) {
		const file = event.currentTarget.files?.[0];
		if (!file) return;

		try {
			const snapshot = JSON.parse(await file.text());
			if (!importLearningSnapshot(snapshot)) throw new Error('Invalid snapshot');
			refreshProgress();
			importMessage = 'Progress imported. Refreshing the page will update XP in the top bar.';
		} catch {
			importMessage = 'Could not import that file. Use a JSON export from this site.';
		} finally {
			event.currentTarget.value = '';
		}
	}
</script>

<svelte:head><title>Roadmap | Out of Tutorial Hell</title></svelte:head>

<main class="courses-page">
	<header class="page-hero">
		<div>
			<span class="eyebrow"><Route size={15} /> Free coding roadmap</span>
			<h1>Choose the next concrete skill.</h1>
			<p>Each node has short lessons, browser practice, local progress, and enough structure to keep you from drifting into another playlist.</p>
		</div>
		<div class="hero-actions">
			<a href="/" class="hero-link"><Map size={17} /> Dashboard</a>
			<button class="hero-link" onclick={downloadLearningSnapshot}><Download size={17} /> Export</button>
			<label class="hero-link import-link">
				<Upload size={17} /> Import
				<input type="file" accept="application/json,.json" onchange={handleImport} />
			</label>
		</div>
	</header>

	{#if importMessage}
		<p class="import-message">{importMessage}</p>
	{/if}

	<section class="timeline" aria-label="Roadmap tracks">
		{#each tracks as track}
			<article class="timeline-item">
				<div class="rail">
					<span>{track.order}</span>
				</div>
				<div class="track-panel">
					<div class="track-top">
						<div>
							<span class="level">{track.level}</span>
							<h2>{track.title}</h2>
							<p>{track.subtitle}</p>
						</div>
						<strong>{trackProgress(track)}%</strong>
					</div>
					<div class="meter"><span style={`width:${trackProgress(track)}%`}></span></div>
					<div class="track-meta">
						<span>{track.lessonCount} lessons</span>
						<span>{track.totalXp} XP</span>
						<span>{track.outcome}</span>
					</div>
					<div class="track-courses">
						{#each track.courses as course}
							<a href="/courses/{course.id}">
								<Code2 size={17} />
								<span>{course.title}</span>
								<ArrowRight size={16} />
							</a>
						{/each}
					</div>
				</div>
			</article>
		{/each}
	</section>

	<section class="catalog-section">
		<div class="section-title">
			<span class="eyebrow"><Sparkles size={15} /> Course catalog</span>
			<h2>Available now</h2>
		</div>
		<div class="course-grid">
			{#each courses as course}
				<CourseCard {course} completed={completedByCourse[course.id] ?? 0} />
			{/each}
		</div>
	</section>

	<section class="skill-board">
		<div class="section-title">
			<span class="eyebrow"><CheckCircle2 size={15} /> Coverage</span>
			<h2>Skills this roadmap covers</h2>
		</div>
		<div class="skills">
			{#each skillMatrix as item}
				{#if item.courseId}
					<a href="/courses/{item.courseId}" class="skill available"><Circle size={12} fill="currentColor" /> {item.skill}</a>
				{:else}
					<span class="skill planned"><Lock size={14} /> {item.skill}</span>
				{/if}
			{/each}
		</div>
	</section>
</main>

<style>
	.courses-page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 1rem 1rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-hero,
	.catalog-section,
	.skill-board,
	.track-panel {
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
	}

	.page-hero {
		padding: clamp(1.5rem, 4vw, 3rem);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--accent-strong);
		font-size: 0.74rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1, h2 { color: var(--text); letter-spacing: 0; }
	h1 { margin: 0.7rem 0; max-width: 760px; font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 0.98; }
	.page-hero p { max-width: 640px; margin: 0; color: var(--text-muted); line-height: 1.7; }

	.hero-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end; }
	.hero-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 42px;
		padding: 0.7rem 0.95rem;
		border-radius: 18px;
		border: 1px solid var(--accent-strong);
		background: var(--surface-elevated);
		color: var(--accent-strong);
		font: inherit;
		font-weight: 800;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
	}
	.import-link input { display: none; }
	.import-message {
		margin: 0;
		padding: 0.75rem 1rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		color: var(--text-muted);
		font-weight: 800;
	}

	.timeline { display: flex; flex-direction: column; gap: 0.9rem; }

	.timeline-item {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 0.9rem;
		align-items: stretch;
	}

	.rail {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.rail::before {
		content: '';
		position: absolute;
		top: 44px;
		bottom: -1rem;
		width: 2px;
		background: var(--accent-strong);
	}

	.timeline-item:last-child .rail::before { display: none; }

	.rail span {
		position: relative;
		z-index: 1;
		width: 44px;
		height: 44px;
		border-radius: 18px;
		background: var(--accent);
		color: #160d14;
		display: grid;
		place-items: center;
		font-weight: 900;
	}

	.track-panel { padding: 1rem; }

	.track-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.level { color: var(--text-dim); font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; }
	.track-top h2 { margin: 0.2rem 0; font-size: 1.35rem; }
	.track-top p { margin: 0; color: var(--text-muted); }
	.track-top strong { color: var(--accent-strong); font-size: 1.35rem; }

	.meter { height: 8px; margin: 1rem 0; border-radius: 999px; overflow: hidden; border: 1px solid var(--border); background: var(--surface-elevated); }
	.meter span { display: block; height: 100%; background: var(--accent); }

	.track-meta,
	.track-courses,
	.skills {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		flex-wrap: wrap;
	}

	.track-meta span,
	.skill {
		padding: 0.32rem 0.62rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface-elevated);
		color: var(--text-muted);
		font-size: 0.76rem;
		font-weight: 800;
	}

	.track-courses { margin-top: 1rem; }
	.track-courses a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.65rem 0.8rem;
		border-radius: 18px;
		background: var(--accent);
		color: #160d14;
		text-decoration: none;
		font-weight: 800;
	}

	.catalog-section,
	.skill-board { padding: 1.25rem; }
	.section-title { margin-bottom: 1rem; }
	.section-title h2 { margin: 0.35rem 0 0; font-size: 1.7rem; }

	.course-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.skill { display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none; }
	.skill.available { color: var(--success); }
	.skill.planned { opacity: 0.72; }

	@media (max-width: 840px) {
		.page-hero { flex-direction: column; }
		.hero-actions { justify-content: flex-start; }
		.course-grid { grid-template-columns: 1fr; }
	}

	@media (max-width: 620px) {
		.courses-page { padding: 0 0 4rem; }
		.page-hero, .catalog-section, .skill-board, .track-panel { border-radius: 0; }
		.timeline-item { grid-template-columns: 40px 1fr; gap: 0.5rem; }
		.rail span { width: 36px; height: 36px; }
		.track-top { flex-direction: column; }
	}
</style>


