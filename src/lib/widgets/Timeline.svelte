<script>
	/**
	 * Horizontal time axis with parallel tracks, spans (things that take time),
	 * point events, and a scrubber over narrated stops. Prev / Next buttons are
	 * the non-drag alternative to the slider.
	 *
	 * Built from HTML, not SVG, so labels stay readable at any width.
 *
 * `index` is bindable, so a composing widget can drive the scrubber. `minWidth`
 * (e.g. "34rem") keeps dense charts legible: the chart scrolls sideways inside
 * its own container instead of squeezing.
	 *
	 * @typedef {'ok' | 'bad' | 'accent' | 'dim'} Tone
	 * @typedef {{ id: string, label: string }} Track
	 * @typedef {{ track: string, from: number, to: number, label: string, tone?: Tone }} Span
	 * @typedef {{ track: string, t: number, label: string, tone?: Tone }} TimelineEvent
	 * @typedef {{ t: number, caption: string, tone?: 'ok' | 'bad' }} Stop
	 */

	/**
	 * @type {{
	 *   title?: string, start?: number, end: number, unit?: string, ticks?: number[],
	 *   tracks: Track[], spans?: Span[], events?: TimelineEvent[], stops: Stop[],
 *   index?: number, minWidth?: string, logSpans?: boolean
	 * }}
	 */
	let {
		title = 'Timeline', start = 0, end, unit = '', ticks = [], tracks, spans = [], events = [], stops,
		index = $bindable(0), minWidth = '', logSpans = true
	} = $props();

	const uid = $props.id();

	// Reset jumps straight back: the cursor and caption don't animate the unwind.
	let snap = $state(false);

	function reset() {
		snap = true;
		index = 0;
		requestAnimationFrame(() => requestAnimationFrame(() => (snap = false)));
	}

	// Clamped: a composing widget may swap in shorter data while index is still high.
	let at = $derived(Math.max(0, Math.min(index, stops.length - 1)));
	let now = $derived(stops[at].t);
	let stop = $derived(stops[at]);
	let happened = $derived(
		[
			...events.map((e) => ({ t: e.t, track: e.track, label: e.label, tone: e.tone })),
			...(logSpans ? spans : []).map((s) => ({ t: s.from, track: s.track, label: s.label, tone: s.tone }))
		]
			.filter((e) => e.t <= now)
			.sort((a, b) => a.t - b.t)
	);

	/** @param {number} t */
	function pct(t) {
		return `${((t - start) / (end - start)) * 100}%`;
	}

	/** Fraction 0–1, for transform-based positioning. @param {number} t */
	function frac(t) {
		return (t - start) / (end - start);
	}

	/** @param {string} id */
	function trackLabel(id) {
		return tracks.find((t) => t.id === id)?.label ?? id;
	}
</script>

<section class="widget timeline" class:snap aria-label={title}>
	<div class="widget-head">
		<p class="widget-title">{title}</p>
		<button class="w-btn" onclick={reset}>Reset</button>
	</div>

	<div class="chart-scroll">
	<div class="chart" style:min-width={minWidth || null}>
		{#each tracks as track}
			<div class="row">
				<span class="track-name">{track.label}</span>
				<div class="lane" aria-hidden="true">
					{#each spans.filter((s) => s.track === track.id) as s}
						<span
							class="span {s.tone ?? 'dim'}"
							class:future={s.from > now}
							style="left:{pct(s.from)}; width:calc({pct(s.to)} - {pct(s.from)})"
						>
							<span class="span-label">{s.label}</span>
						</span>
					{/each}
					{#each events.filter((e) => e.track === track.id) as e}
						<span class="dot {e.tone ?? 'accent'}" class:future={e.t > now} style="left:{pct(e.t)}">
							{#if e.t === now}{#key index}<span class="ping"></span>{/key}{/if}
						</span>
					{/each}
					<span class="cursor" style="transform: translateX({frac(now) * 100}%)"></span>
				</div>
			</div>
		{/each}

		<div class="row axis-row" aria-hidden="true">
			<span class="track-name"></span>
			<div class="axis">
				{#each ticks as t}
					<span class="tick" style="left:{pct(t)}">{t}{unit}</span>
				{/each}
			</div>
		</div>
	</div>
	</div>

	<div class="scrub">
		<label class="w-sr" for="{uid}-range">Time</label>
		<input
			id="{uid}-range"
			type="range"
			min="0"
			max={stops.length - 1}
			step="1"
			bind:value={index}
			aria-valuetext="{now}{unit}: {stop.caption}"
		/>
		<div class="widget-controls">
			<button class="w-btn" onclick={() => index--} disabled={index === 0}>Prev</button>
			<span class="clock" aria-live="polite">t = {now}{unit} <span class="count">({index + 1}/{stops.length})</span></span>
			<button class="w-btn primary" onclick={() => index++} disabled={index === stops.length - 1}>Next</button>
		</div>
	</div>

	{#if index === 0}
		<p class="hint">Drag the slider or press <strong>Next</strong> to move through time. Watch the white line.</p>
	{/if}

	{#key index}<p class="w-note caption {stop.tone ?? ''}">{stop.caption}</p>{/key}

	<ol class="log">
		{#each happened as e (`${e.t}-${e.track}-${e.label}`)}
			<li class="{e.tone ?? ''}"><span class="when">{e.t}{unit}</span> <span class="who">{trackLabel(e.track)}</span> {e.label}</li>
		{/each}
	</ol>
</section>

<style>
	.chart-scroll { overflow-x: auto; }
	.chart { display: grid; gap: 0.5rem; }

	.row {
		display: grid;
		grid-template-columns: minmax(5.5rem, 8.5rem) 1fr;
		align-items: center;
		gap: 0.6rem;
	}

	.track-name { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); line-height: 1.3; }

	.lane {
		position: relative;
		height: 2.6rem;
		border-radius: 10px;
		background: var(--sandbox-bg);
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.span {
		position: absolute;
		top: 0.45rem;
		bottom: 0.45rem;
		border-radius: 6px;
		border: 1px solid var(--text-dim);
		background: color-mix(in srgb, var(--text-dim) 20%, transparent);
		overflow: hidden;
	}
	.span.bad { border-color: var(--error); background: var(--error-muted); }
	.span.ok { border-color: var(--success); background: var(--success-muted); }
	.span.accent { border-color: var(--accent); background: var(--accent-muted); }

	.span-label {
		display: block;
		padding: 0 0.35rem;
		font-family: 'Fira Code', monospace;
		font-size: 0.72rem;
		line-height: 1.6rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--sandbox-text);
	}

	.dot {
		position: absolute;
		top: 50%;
		width: 0.85rem;
		height: 0.85rem;
		margin: -0.425rem 0 0 -0.425rem;
		border-radius: 999px;
		border: 2px solid var(--sandbox-bg);
		background: var(--accent);
	}
	.dot.ok { background: var(--success); }
	.dot.bad { background: var(--error); }
	.dot.dim { background: var(--text-dim); }

	.future { opacity: 0.18; }

	/* Full-width layer moved with transform, so the line glides instead of jumping. */
	.cursor {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.cursor::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: -1px;
		width: 2px;
		background: var(--text);
	}

	.ping {
		position: absolute;
		inset: -2px;
		border-radius: 999px;
		border: 2px solid currentColor;
		opacity: 0;
	}
	.dot { color: var(--accent); }
	.dot.ok { color: var(--success); }
	.dot.bad { color: var(--error); }

	.hint { margin: 0.6rem 0 0; font-size: 0.88rem; color: var(--text-dim); }
	.hint strong { color: var(--accent); }

	.axis { position: relative; height: 1.2rem; }
	.tick {
		position: absolute;
		transform: translateX(-50%);
		font-size: 0.7rem;
		color: var(--text-dim);
		white-space: nowrap;
	}
	.tick:first-child { transform: none; }
	.tick:last-child { transform: translateX(-100%); }

	.scrub { margin-top: 0.75rem; }
	.scrub input[type='range'] { width: 100%; min-height: 44px; accent-color: var(--accent); }
	.scrub .widget-controls { justify-content: space-between; }
	.clock { font-family: 'Fira Code', monospace; font-size: 0.9rem; color: var(--text); }
	.count { color: var(--text-dim); font-size: 0.8rem; }

	.log {
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.3rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.log li { line-height: 1.5; }
	.log .when { font-family: 'Fira Code', monospace; color: var(--text-dim); }
	.log .who { font-weight: 700; color: var(--text); }
	.log li.bad { color: var(--error); }
	.log li.ok { color: var(--success); }

	@media (prefers-reduced-motion: no-preference) {
		.span, .dot { transition: opacity var(--dur-base) var(--ease-enter); }
		/* The same cursor glides both ways, so Prev is Next played backwards. */
		.cursor { transition: transform var(--dur-teach) var(--ease-move); }
		/* Pings as the cursor arrives. */
		.ping { animation: ping var(--dur-teach) var(--ease-enter) var(--dur-slow); }
		.log li { animation: log-in var(--dur-base) var(--ease-enter) both; }
		.caption { animation: log-in var(--dur-base) var(--ease-enter); }
		.snap .cursor, .snap .span, .snap .dot { transition: none; }
		.snap .caption, .snap .ping { animation: none; }
	}

	@keyframes ping {
		from { opacity: 0.9; transform: scale(1); }
		to { opacity: 0; transform: scale(2.6); }
	}

	@keyframes log-in {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: none; }
	}

	@media (max-width: 480px) {
		.row { grid-template-columns: 1fr; gap: 0.25rem; }
		.axis-row .track-name { display: none; }
	}
</style>
