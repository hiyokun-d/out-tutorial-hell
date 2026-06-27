<script>
	//styling
	import '$lib/styles/Landingpage.css';

	// @ts-nocheck
	import { onMount } from 'svelte';
	import {
		ArrowRight,
		BookOpen,
		CheckCircle2,
		Code2,
		FileTerminal,
		GitBranch,
		Lock,
		Map,
		Play,
		Star,
		TerminalSquare,
		TerminalSquareIcon,
		Trophy,
		Zap
	} from '@lucide/svelte';
	import { getProgress } from '$lib/utils/progress.js';
	import { xp } from '$lib/stores/xp.js';

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

	let completionPercent = $derived(
		stats.lessons ? Math.round((totalCompleted / stats.lessons) * 100) : 0
	);
	let nextHref = $derived(nextCourse ? `/courses/${nextCourse.id}` : '/courses');

	function trackProgress(track) {
		const complete = track.courses.reduce(
			(sum, course) => sum + (completedByCourse[course.id] ?? 0),
			0
		);
		return track.lessonCount ? Math.round((complete / track.lessonCount) * 100) : 0;
	}
</script>

<svelte:head>
	<title>Out of Tutorial Hell | Roadmaps with no login</title>
	<meta
		name="description"
		content="A no-login coding roadmap with lessons, browser labs, XP, notes, and instant feedback."
	/>
</svelte:head>

<main class="home-shell">
	<section class="hero-band">
		<div class="hero-copy">
			<span class="eyebrow"><Zap size={15} /> No login required</span>
			<h1>Out of Tutorial Hell</h1>
			<p>
				A no-login coding roadmap that turns beginner courses into a working path: learn a concept,
				run code, trace what happens, take notes, and keep local progress.
			</p>
			<div class="hero-actions">
				<a class="primary-action" href={nextHref}><Play size={17} /> Continue learning</a>
				<a class="secondary-action" href="/courses"><Map size={17} /> View roadmap</a>
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
			<p>Pick one path, finish the next lesson, and run the lab to build your local progress.</p>
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
					<a
						class="track-action"
						href="/courses/{track.courses[0].id}"
						aria-label="Open {track.title}"><ArrowRight size={18} /></a
					>
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
					<FileTerminal size={20} />
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
