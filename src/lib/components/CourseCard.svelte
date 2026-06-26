<script>
	// @ts-nocheck
	import { ArrowRight, Compass, Cpu, Globe, Terminal } from '@lucide/svelte';

	/** @type {{ course: { id: string, icon: string, title: string, description: string, difficulty: string, lessonCount?: number, challengeCount?: number, totalXp?: number, author?: { name: string, link?: string } }, completed?: number }} */
	let { course, completed = 0 } = $props();

	const ICON_MAP = /** @type {Record<string, any>} */ ({
		globe: Globe,
		terminal: Terminal,
		cpu: Cpu,
		compass: Compass
	});

	let IconComponent = $derived(ICON_MAP[course.icon] || Terminal);
	let pct = $derived(course.lessonCount ? Math.round((completed / course.lessonCount) * 100) : 0);
</script>

<a href="/courses/{course.id}" class="course-card">
	<div class="icon-wrap">
		<IconComponent size={25} strokeWidth={2.2} class="course-icon" />
	</div>

	<div class="info">
		<div class="card-header-row">
			<h2>{course.title}</h2>
			<span class="badge {course.difficulty.toLowerCase()}">{course.difficulty}</span>
		</div>
		<p>{course.description}</p>
		<div class="meter" aria-hidden="true"><span style={`width:${pct}%`}></span></div>
		<div class="meta-row">
			{#if course.language}
				<span class="lang-tag">{course.language}</span>
			{/if}
			<span>{completed}/{course.lessonCount ?? 0} complete</span>
			<span>{course.challengeCount ?? 0} labs</span>
			<span>{course.totalXp ?? 0} XP</span>
		</div>
		<div class="author-row">
			<span class="by">by</span>
			{#if course.author?.link}
				<button class="author-btn" onclick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(course.author.link, '_blank', 'noopener noreferrer'); }}>
					{course.author.name}
				</button>
			{:else}
				<span class="author-name">{course.author?.name ?? 'Unknown'}</span>
			{/if}
		</div>
	</div>

	<div class="arrow-wrap">
		<ArrowRight class="arrow" aria-hidden="true" size={18} strokeWidth={2.5} />
	</div>
</a>

<style>
	.course-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 18px;
		text-decoration: none;
		color: var(--text);
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
		box-shadow: var(--base-shadow);
		min-height: 156px;
	}

	.course-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--depth-shadow);
		border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
	}

	.icon-wrap {
		width: 52px;
		height: 52px;
		border-radius: 18px;
		background: var(--accent-muted);
		border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--accent-strong);
	}

	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.card-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	h2 {
		margin: 0;
		font-size: 1.14rem;
		font-weight: 900;
		color: var(--text);
		letter-spacing: 0;
		line-height: 1.2;
	}

	p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.meta-row span,
	.badge {
		font-size: 0.68rem;
		padding: 0.22rem 0.5rem;
		border-radius: 999px;
		font-weight: 800;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-muted);
	}

	.badge { text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
	.lang-tag { color: var(--accent-strong); background: var(--accent-muted); border-color: color-mix(in srgb, var(--accent) 28%, transparent); font-family: 'Fira Code', 'Cascadia Code', monospace; letter-spacing: 0; }
	.badge.beginner { color: var(--success); background: var(--success-muted); }
	.badge.intermediate { color: var(--warning); background: var(--warning-muted); }
	.badge.advanced { color: var(--error); background: var(--error-muted); }

	.meter {
		height: 7px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.meter span { display: block; height: 100%; background: var(--accent); }

	.arrow-wrap {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 18px;
		border: 1px solid var(--border);
		flex-shrink: 0;
		color: var(--text-dim);
		background: var(--surface);
	}

	.author-row {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.1rem;
	}

	.by {
		font-size: 0.7rem;
		color: var(--text-dim);
		font-weight: 700;
	}

	.author-btn {
		all: unset;
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--accent-strong);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: transparent;
		transition: text-decoration-color 0.15s ease;
	}

	.author-btn:hover {
		text-decoration-color: var(--accent-strong);
	}

	.author-name {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--text-muted);
	}

	.course-card:hover .arrow-wrap {
		color: var(--on-dark);
		background: var(--text);
		border-color: var(--text);
	}

	@media (max-width: 560px) {
		.course-card { align-items: flex-start; }
		.arrow-wrap { display: none; }
		.card-header-row { align-items: flex-start; flex-direction: column; }
	}
</style>




