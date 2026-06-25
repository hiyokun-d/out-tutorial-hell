<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { ArrowRight, BookOpen, CheckCircle2, Code2, Download, GitBranch, Lock, Map, Play, Star, TerminalSquare, Trophy, Zap } from '@lucide/svelte';
	import { getProgress } from '$lib/utils/progress.js';
	import { xp } from '$lib/stores/xp.js';
	import { downloadLearningSnapshot } from '$lib/utils/local-data.js';

	let { data } = $props();
	const { courses, tracks, features, skillMatrix, stats } = data;

	let completedByCourse = $state({});
	let totalCompleted = $state(0);
	let nextCourse = $state(courses[0] ?? null);
	let studyPlan = $state([]);

	onMount(() => {
		const nextCompletedByCourse = {};
		let completed = 0;
		let firstOpen = null;

		for (const course of courses) {
			const done = getProgress(course.id).size;
			nextCompletedByCourse[course.id] = done;
			completed += done;
			if (!firstOpen && done < course.lessonCount) firstOpen = course;
		}

		completedByCourse = nextCompletedByCourse;
		totalCompleted = completed;
		nextCourse = firstOpen ?? courses[0] ?? null;
		studyPlan = courses.slice(0, 3).map((course) => {
			const done = nextCompletedByCourse[course.id] ?? 0;
			return {
				...course,
				done,
				label: done === 0 ? 'Start' : done >= course.lessonCount ? 'Review' : 'Continue'
			};
		});
	});

	let completionPercent = $derived(stats.lessons ? Math.round((totalCompleted / stats.lessons) * 100) : 0);
	let nextHref = $derived(nextCourse ? `/courses/${nextCourse.id}` : '/courses');

	function trackProgress(track) {
		const complete = track.courses.reduce((sum, course) => sum + (completedByCourse[course.id] ?? 0), 0);
		return track.lessonCount ? Math.round((complete / track.lessonCount) * 100) : 0;
	}
</script>

<svelte:head>
	<title>Out of Tutorial Hell | Roadmaps with no login</title>
	<meta name="description" content="A no-login coding roadmap with lessons, browser labs, XP, notes, and instant feedback." />
</svelte:head>

<main class="home-shell">
	<section class="hero-band">
		<div class="hero-copy">
			<span class="eyebrow"><Zap size={15} /> No login required</span>
			<h1>Out of Tutorial Hell</h1>
			<p>
				A no-login coding roadmap that turns beginner courses into a working path: learn a concept, run code, trace what happens, take notes, and keep local progress.
			</p>
			<div class="hero-actions">
				<a class="primary-action" href={nextHref}><Play size={17} /> Continue learning</a>
				<a class="secondary-action" href="/courses"><Map size={17} /> View roadmap</a>
				<button class="secondary-action button-action" onclick={downloadLearningSnapshot}><Download size={17} /> Export progress</button>
			</div>
		</div>

		<aside class="command-center" aria-label="Learning dashboard">
			<div class="panel-topline">
				<span>Local dashboard</span>
				<span>{$xp.xp} XP</span>
			</div>
			<div class="progress-ring" style={`--pct:${completionPercent}%`}>
				<div>
					<strong>{completionPercent}%</strong>
					<span>complete</span>
				</div>
			</div>
			<div class="dashboard-grid">
				<div><strong>{stats.courses}</strong><span>paths</span></div>
				<div><strong>{stats.lessons}</strong><span>lessons</span></div>
				<div><strong>{stats.challenges}</strong><span>labs</span></div>
				<div><strong>{stats.totalXp}</strong><span>XP</span></div>
			</div>
			{#if nextCourse}
				<a class="next-card" href={nextHref}>
					<span>Next path</span>
					<strong>{nextCourse.title}</strong>
					<ArrowRight size={18} />
				</a>
			{/if}
		</aside>
	</section>

	<section class="focus-board" aria-label="Today learning plan">
		<div class="focus-copy">
			<span class="eyebrow"><CheckCircle2 size={15} /> Today</span>
			<h2>Use this like a study desk, not a content feed.</h2>
			<p>Pick one path, finish the next lesson, run the lab, and export your local progress when you want a backup.</p>
		</div>
		<div class="focus-steps">
			{#each studyPlan as item, index}
				<a href="/courses/{item.id}" class="focus-step">
					<span>{String(index + 1).padStart(2, '0')}</span>
					<div>
						<strong>{item.label}: {item.title}</strong>
						<small>{item.done}/{item.lessonCount} lessons complete</small>
					</div>
					<ArrowRight size={17} />
				</a>
			{/each}
		</div>
	</section>

	<section class="feature-strip" aria-label="Platform features">
		{#each features as feature}
			<article>
				<CheckCircle2 size={18} />
				<div>
					<h2>{feature.title}</h2>
					<p>{feature.detail}</p>
				</div>
			</article>
		{/each}
	</section>

	<section class="section-head">
		<div>
			<span class="eyebrow"><GitBranch size={15} /> Roadmap tracks</span>
			<h2>Pick a path and keep moving.</h2>
		</div>
		<a href="/courses">Open full roadmap <ArrowRight size={16} /></a>
	</section>

	<section class="roadmap-stack">
		{#each tracks as track}
			<article class="track-card">
				<div class="track-marker">
					<span>{track.order}</span>
				</div>
				<div class="track-body">
					<div class="track-heading">
						<div>
							<span class="track-level">{track.level}</span>
							<h3>{track.title}</h3>
							<p>{track.subtitle}</p>
						</div>
						<strong>{trackProgress(track)}%</strong>
					</div>
					<div class="track-progress"><span style={`width:${trackProgress(track)}%`}></span></div>
					<div class="skill-row">
						{#each track.skills as skill}<span>{skill}</span>{/each}
					</div>
					<div class="track-bottom">
						<span>{track.lessonCount} lessons</span>
						<span>{track.totalXp} XP</span>
						<span>{track.outcome}</span>
					</div>
				</div>
				{#if track.courses[0]}
					<a class="track-action" href="/courses/{track.courses[0].id}" aria-label="Open {track.title}"><ArrowRight size={18} /></a>
				{/if}
			</article>
		{/each}
	</section>

	<section class="matrix-section">
		<div class="section-head compact">
			<div>
				<span class="eyebrow"><Trophy size={15} /> Skill map</span>
				<h2>Roadmap coverage without the account wall.</h2>
			</div>
		</div>
		<div class="skill-matrix">
			{#each skillMatrix as item}
				{#if item.courseId}
					<a href="/courses/{item.courseId}" class="skill-cell available">
						<Code2 size={17} />
						<span>{item.skill}</span>
						<strong>Ready</strong>
					</a>
				{:else}
					<div class="skill-cell planned">
						<Lock size={17} />
						<span>{item.skill}</span>
						<strong>Planned</strong>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<section class="course-shelf">
		<div class="section-head compact">
			<div>
				<span class="eyebrow"><BookOpen size={15} /> Courses</span>
				<h2>Start with the work in front of you.</h2>
			</div>
		</div>
		<div class="course-grid">
			{#each courses as course}
				<a href="/courses/{course.id}" class="course-mini">
					<TerminalSquare size={20} />
					<div>
						<h3>{course.title}</h3>
						<p>{course.lessonCount} lessons, {course.challengeCount} labs</p>
					</div>
					<Star size={17} />
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.home-shell {
		max-width: 1180px;
		margin: 0 auto;
		padding: 1rem 1rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.hero-band {
		min-height: 520px;
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.72fr);
		align-items: center;
		gap: 2rem;
		padding: clamp(2rem, 5vw, 4rem);
		border: 1px solid var(--border);
		border-radius: 18px;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--surface) 96%, transparent), color-mix(in srgb, var(--surface-elevated) 88%, transparent)),
			var(--bg-gradient);
		box-shadow: var(--depth-shadow);
		overflow: hidden;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--accent-strong);
		font-size: 0.76rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero-copy h1 {
		max-width: 760px;
		margin: 1rem 0;
		font-size: clamp(3.4rem, 7vw, 6.2rem);
		line-height: 0.96;
		letter-spacing: 0;
		color: var(--text);
	}

	.hero-copy p {
		max-width: 660px;
		margin: 0;
		color: var(--text-muted);
		font-size: 1.12rem;
		line-height: 1.75;
	}

	.hero-actions,
	.section-head,
	.track-bottom,
	.skill-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.hero-actions { margin-top: 2rem; }

	.primary-action,
	.secondary-action,
	.section-head a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 44px;
		padding: 0.75rem 1rem;
		border-radius: 18px;
		font-weight: 800;
		text-decoration: none;
		cursor: pointer;
	}

	.primary-action { background: var(--accent); color: #160d14; border: 1px solid var(--accent); }
	.secondary-action, .section-head a { border: 1px solid var(--border); color: var(--text); background: var(--surface-elevated); }
	.button-action { font: inherit; }

	.command-center,
	.focus-board,
	.track-card,
	.matrix-section,
	.course-shelf {
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
	}

	.command-center {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel-topline,
	.track-heading,
	.next-card,
	.course-mini,
	.skill-cell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.panel-topline { color: var(--text-muted); font-size: 0.82rem; font-weight: 800; }

	.progress-ring {
		width: min(240px, 75vw);
		aspect-ratio: 1;
		margin: 0.5rem auto;
		border-radius: 50%;
		background: conic-gradient(var(--accent) var(--pct), var(--surface-elevated) 0);
		display: grid;
		place-items: center;
	}

	.progress-ring div {
		width: 72%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--surface);
		display: grid;
		place-items: center;
		align-content: center;
	}

	.progress-ring strong { font-size: 2.4rem; color: var(--text); }
	.progress-ring span, .dashboard-grid span { color: var(--text-muted); font-size: 0.78rem; font-weight: 700; }

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}

	.dashboard-grid div {
		padding: 0.85rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface-elevated);
		text-align: center;
	}

	.dashboard-grid strong { display: block; color: var(--text); font-size: 1.15rem; }

	.next-card {
		padding: 1rem;
		border-radius: 18px;
		background: var(--accent);
		color: #160d14;
		text-decoration: none;
	}

	.next-card span { display: block; font-size: 0.72rem; color: rgba(17, 24, 39, 0.72); }
	.next-card strong { display: block; margin-top: 0.2rem; }

	.focus-board {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(320px, 1.2fr);
		gap: 1rem;
		padding: 1.25rem;
	}

	.focus-copy h2 {
		margin: 0.35rem 0;
		font-size: clamp(1.5rem, 3vw, 2.2rem);
		color: var(--text);
	}

	.focus-copy p { margin: 0; color: var(--text-muted); line-height: 1.65; }
	.focus-steps { display: grid; gap: 0.65rem; }
	.focus-step {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface-elevated);
		color: var(--text);
		text-decoration: none;
	}
	.focus-step > span {
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
		border-radius: 18px;
		background: var(--accent-muted);
		color: var(--accent-strong);
		font-weight: 900;
		font-size: 0.75rem;
	}
	.focus-step strong { display: block; font-size: 0.94rem; }
	.focus-step small { display: block; color: var(--text-muted); margin-top: 0.2rem; font-weight: 700; }

	.feature-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}

	.feature-strip article {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface);
		box-shadow: var(--base-shadow);
	}

	.feature-strip svg { color: var(--success); flex-shrink: 0; }
	.feature-strip h2, .course-mini h3 { margin: 0 0 0.25rem; font-size: 0.95rem; color: var(--text); }
	.feature-strip p, .course-mini p, .track-heading p { margin: 0; color: var(--text-muted); font-size: 0.86rem; line-height: 1.55; }

	.section-head { justify-content: space-between; margin-top: 1rem; }
	.section-head.compact { margin: 0 0 1rem; }
	.section-head h2 { margin: 0.35rem 0 0; color: var(--text); font-size: clamp(1.7rem, 3vw, 2.4rem); }

	.roadmap-stack { display: flex; flex-direction: column; gap: 0.85rem; }

	.track-card {
		display: grid;
		grid-template-columns: 54px 1fr 44px;
		gap: 1rem;
		padding: 1rem;
		align-items: center;
	}

	.track-marker {
		width: 44px;
		height: 44px;
		border-radius: 18px;
		background: var(--accent-muted);
		color: var(--accent-strong);
		display: grid;
		place-items: center;
		font-weight: 900;
	}

	.track-heading h3 { margin: 0.2rem 0; color: var(--text); font-size: 1.25rem; }
	.track-heading strong { color: var(--accent-strong); font-size: 1.3rem; }
	.track-level { color: var(--text-dim); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }

	.track-progress { height: 8px; margin: 1rem 0; border-radius: 999px; overflow: hidden; background: var(--surface-elevated); border: 1px solid var(--border); }
	.track-progress span { display: block; height: 100%; background: var(--accent); }

	.skill-row span, .track-bottom span {
		padding: 0.28rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface-elevated);
		color: var(--text-muted);
		font-size: 0.74rem;
		font-weight: 700;
	}

	.track-bottom { margin-top: 0.8rem; }
	.track-action {
		width: 40px;
		height: 40px;
		border-radius: 18px;
		background: var(--accent);
		color: #160d14;
		display: grid;
		place-items: center;
	}

	.matrix-section,
	.course-shelf { padding: 1.25rem; }

	.skill-matrix,
	.course-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.7rem;
	}

	.skill-cell,
	.course-mini {
		min-height: 72px;
		padding: 0.9rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--surface-elevated);
		color: var(--text);
		text-decoration: none;
	}

	.skill-cell span { flex: 1; font-weight: 800; font-size: 0.88rem; }
	.skill-cell strong { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; }
	.skill-cell.available svg { color: var(--success); }
	.skill-cell.planned { opacity: 0.72; }

	.course-mini { justify-content: flex-start; }
	.course-mini > svg:first-child { color: var(--accent-strong); flex-shrink: 0; }
	.course-mini > svg:last-child { margin-left: auto; color: var(--text-dim); }

	@media (max-width: 1020px) {
		.hero-band { grid-template-columns: 1fr; }
		.focus-board { grid-template-columns: 1fr; }
		.feature-strip, .skill-matrix, .course-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 680px) {
		.home-shell { padding: 0 0 4rem; }
		.hero-band, .command-center, .focus-board, .track-card, .matrix-section, .course-shelf { border-radius: 0; }
		.hero-band { padding: 2rem 1rem; min-height: auto; }
		.feature-strip, .skill-matrix, .course-grid { grid-template-columns: 1fr; }
		.track-card { grid-template-columns: 44px 1fr; }
		.track-action { grid-column: 2; width: 100%; }
		.dashboard-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>


