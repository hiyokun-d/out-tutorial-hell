<script>
	import { untrack } from 'svelte';
	import Timeline from './Timeline.svelte';
	import { simulate } from './lib/servers.js';

	/**
	 * Threads vs a single blocking loop vs an event-driven state machine, all
	 * serving the same burst on one core. Composed from <Timeline>, one track
	 * per architecture. The load slider and the blocking-read toggle rebuild the
	 * data; the Timeline jumps to the end so the three finish lines can be compared.
	 *
	 * @type {{ title?: string, initialLoad?: number, initialBlocking?: boolean }}
	 */
	let { title = 'One core, one burst, three servers', initialLoad = 3, initialBlocking = false } = $props();

	const uid = $props.id();
	let load = $state(untrack(() => initialLoad));
	let blocking = $state(untrack(() => initialBlocking));
	let sim = $derived(simulate(load, blocking));
	let index = $state(0);

	// New data: show the finished picture first; Prev / the scrubber replay it.
	$effect(() => {
		const last = sim.stops.length - 1;
		untrack(() => (index = last));
	});

	function reset() {
		load = initialLoad;
		blocking = initialBlocking;
	}

	const tracks = [
		{ id: 'threads', label: 'Thread per request' },
		{ id: 'loop', label: 'Single loop (blocking)' },
		{ id: 'fsm', label: 'Event loop + state machines' }
	];

	let best = $derived(Math.min(sim.finish.threads, sim.finish.loop, sim.finish.fsm));
</script>

<div class="compose">
	<section class="widget controls" aria-label="Load">
		<div class="widget-head">
			<p class="widget-title">{title}</p>
			<button class="w-btn" onclick={reset}>Reset</button>
		</div>
		<label class="row" for="{uid}-load">
			<span>Requests in the burst: <strong>{load}</strong></span>
			<input id="{uid}-load" type="range" min="2" max="8" step="1" bind:value={load} />
		</label>
		<label class="row check" for="{uid}-block">
			<input id="{uid}-block" type="checkbox" bind:checked={blocking} />
			<span>Request 2 has to read from disk (takes 3 units)</span>
		</label>
		<p class="w-note">
			Each thread switch costs <strong>{sim.switchCost}</strong> units at this load — it grows with the number of threads.
		</p>
	</section>

	<Timeline
		title="Who is using the core"
		end={sim.end}
		ticks={Array.from({ length: Math.floor(sim.end / 2) + 1 }, (_, k) => k * 2)}
		{tracks}
		spans={sim.spans}
		events={sim.events}
		stops={sim.stops}
		minWidth="36rem"
		logSpans={false}
		bind:index
	/>

	<div class="verdicts">
		<article class:win={sim.finish.threads === best}>
			<h4>Thread per request <span>done at {sim.finish.threads}</span></h4>
			<p><span class="k ok">Good at</span> Simple code. A slow request only stops its own thread.</p>
			<p><span class="k bad">Killed by</span> Switching overhead and per-thread memory as load climbs — {sim.switching} units lost to switches here.</p>
		</article>
		<article class:win={sim.finish.loop === best}>
			<h4>Single loop <span>done at {sim.finish.loop}</span></h4>
			<p><span class="k ok">Good at</span> No switches, no locks, tiny. Fastest when nothing blocks.</p>
			<p><span class="k bad">Killed by</span> One blocking call stalls every request{sim.stalled ? ` — ${sim.stalled} units stalled here` : ''}.</p>
		</article>
		<article class:win={sim.finish.fsm === best}>
			<h4>Event loop + state machines <span>done at {sim.finish.fsm}</span></h4>
			<p><span class="k ok">Good at</span> One thread that never waits: it starts I/O and moves on. Flat under load.</p>
			<p><span class="k bad">Killed by</span> Hard to write. Every request’s progress is state you track by hand.</p>
		</article>
	</div>
</div>

<style>
	.compose { display: grid; gap: 0.75rem; margin: 1.25rem 0; }
	.compose :global(.widget) { margin: 0; }
	.row { display: grid; gap: 0.25rem; margin-top: 0.5rem; color: var(--text-muted); }
	.row strong { color: var(--text); }
	.row input[type='range'] { width: 100%; min-height: 44px; accent-color: var(--accent); }
	.check { grid-template-columns: auto 1fr; align-items: center; gap: 0.6rem; min-height: 44px; }
	.check input { width: 1.4rem; height: 1.4rem; accent-color: var(--accent); }

	.verdicts { display: grid; gap: 0.6rem; }
	article {
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--surface-elevated);
	}
	article.win { border-color: var(--success); }
	h4 { margin: 0 0 0.35rem; font-size: 0.95rem; color: var(--text); display: flex; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
	h4 span { font-family: 'Fira Code', monospace; font-size: 0.8rem; color: var(--text-dim); }
	article.win h4 span { color: var(--success); }
	article p { margin: 0.2rem 0; color: var(--text-muted); line-height: 1.5; font-size: 0.9rem; }
	.k { display: inline-block; min-width: 5.2rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
	.k.ok { color: var(--success); }
	.k.bad { color: var(--error); }

	@media (min-width: 768px) {
		.verdicts { grid-template-columns: repeat(3, 1fr); }
	}
	@media (prefers-reduced-motion: no-preference) {
		article { transition: border-color var(--dur-base) var(--ease-enter); }
	}
</style>
