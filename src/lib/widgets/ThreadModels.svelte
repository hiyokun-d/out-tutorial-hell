<script>
	import Timeline from './Timeline.svelte';

	/**
	 * ULT vs KLT vs hybrid M:N, one scenario: four threads, two cores, and T2
	 * makes a blocking read() at tick 2 that takes four ticks. Composed from
	 * <Timeline>: one track per core, one per thread. Its Prev / Next / scrubber
	 * are the scheduler ticks.
	 *
	 * @type {{ title?: string }}
	 */
	let { title = 'Same four threads, three thread models' } = $props();
	const uid = $props.id();

	const tracks = [
		{ id: 'c1', label: 'Core 1' },
		{ id: 'c2', label: 'Core 2' },
		{ id: 't1', label: 'T1' },
		{ id: 't2', label: 'T2' },
		{ id: 't3', label: 'T3' },
		{ id: 't4', label: 'T4' }
	];

	/** @typedef {'ok' | 'bad' | 'accent' | 'dim'} Tone */
	/** @param {string} track @param {number} from @param {number} to @param {string} label @param {Tone} [tone] */
	const s = (track, from, to, label, tone = 'accent') => ({ track, from, to, label, tone });
	const run = (/** @type {string} */ t, /** @type {number} */ a, /** @type {number} */ b) => s(t, a, b, 'running', 'accent');
	const ready = (/** @type {string} */ t, /** @type {number} */ a, /** @type {number} */ b) => s(t, a, b, 'ready', 'dim');
	const io = [
		{ track: 't2', t: 2, label: 'calls read() — blocks', tone: /** @type {Tone} */ ('bad') },
		{ track: 't2', t: 6, label: 'disk answers', tone: /** @type {Tone} */ ('ok') }
	];

	const MODELS = {
		ult: {
			tab: 'User-level (many-to-one)',
			verdict: {
				good: 'Switching threads is a function call inside your process — no kernel, very fast.',
				bad: 'One blocking system call freezes every thread, and the kernel can only use one core.'
			},
			spans: [
				s('c1', 0, 1, 'T1'), s('c1', 1, 2, 'T2'), s('c1', 2, 6, 'process blocked', 'bad'),
				s('c1', 6, 7, 'T3'), s('c1', 7, 8, 'T4'), s('c1', 8, 9, 'T1'), s('c1', 9, 10, 'T2'),
				s('c2', 0, 10, 'idle — the kernel sees only one thread', 'dim'),
				run('t1', 0, 1), ready('t1', 1, 2), s('t1', 2, 6, 'frozen — not its fault', 'bad'), ready('t1', 6, 8), run('t1', 8, 9), ready('t1', 9, 10),
				ready('t2', 0, 1), run('t2', 1, 2), s('t2', 2, 6, 'blocked on disk', 'bad'), ready('t2', 6, 9), run('t2', 9, 10),
				ready('t3', 0, 2), s('t3', 2, 6, 'frozen — not its fault', 'bad'), run('t3', 6, 7), ready('t3', 7, 10),
				ready('t4', 0, 2), s('t4', 2, 6, 'frozen — not its fault', 'bad'), ready('t4', 6, 7), run('t4', 7, 8), ready('t4', 8, 10)
			],
			events: io,
			stops: [
				{ t: 0, caption: 'Four threads, managed by a library inside the process. The kernel sees one thread and schedules only that.' },
				{ t: 1, caption: 'The library switches from T1 to T2. No system call needed — this is why user-level threads are cheap.' },
				{ t: 2, caption: 'T2 calls read(). That is a real system call, and the kernel blocks the only thread it knows about: the whole process.', tone: /** @type {'bad'} */ ('bad') },
				{ t: 4, caption: 'T1, T3 and T4 are ready to run. Nothing is wrong with them. They are frozen anyway, and core 2 sits idle.', tone: /** @type {'bad'} */ ('bad') },
				{ t: 6, caption: 'The disk answers. The process can run again, and the library resumes switching between its threads.' },
				{ t: 10, caption: 'Result: three threads lost four ticks each waiting for I/O they never asked for. Core 2 did nothing all run.' }
			],
			frozen: 12,
			idle: 10
		},
		klt: {
			tab: 'Kernel-level (one-to-one)',
			verdict: {
				good: 'A blocking call stops only the thread that made it, and threads run on several cores at once.',
				bad: 'Every switch goes through the kernel, and every thread costs kernel memory. Thousands of them get expensive.'
			},
			spans: [
				s('c1', 0, 2, 'T1'), s('c1', 2, 4, 'T3'), s('c1', 4, 6, 'T1'), s('c1', 6, 8, 'T2'), s('c1', 8, 10, 'T1'),
				s('c2', 0, 2, 'T2'), s('c2', 2, 4, 'T4'), s('c2', 4, 6, 'T3'), s('c2', 6, 8, 'T4'), s('c2', 8, 10, 'T3'),
				run('t1', 0, 2), ready('t1', 2, 4), run('t1', 4, 6), ready('t1', 6, 8), run('t1', 8, 10),
				run('t2', 0, 2), s('t2', 2, 6, 'blocked on disk', 'bad'), run('t2', 6, 8), ready('t2', 8, 10),
				ready('t3', 0, 2), run('t3', 2, 6), ready('t3', 6, 8), run('t3', 8, 10),
				ready('t4', 0, 2), run('t4', 2, 4), ready('t4', 4, 6), run('t4', 6, 8), ready('t4', 8, 10)
			],
			events: io,
			stops: [
				{ t: 0, caption: 'Each thread has its own kernel thread. The kernel schedules all four, across both cores.' },
				{ t: 2, caption: 'T2 calls read(). The kernel blocks T2’s kernel thread — only that one.', tone: /** @type {'bad'} */ ('bad') },
				{ t: 3, caption: 'T3 and T4 keep running, in parallel, one per core. The block stayed where it belonged.', tone: /** @type {'ok'} */ ('ok') },
				{ t: 6, caption: 'The disk answers. T2 is ready again and gets a core at the next switch.' },
				{ t: 10, caption: 'Nobody froze. The cost is invisible here: each of those switches was a trip into the kernel.' }
			],
			frozen: 0,
			idle: 0
		},
		hybrid: {
			tab: 'Hybrid (many-to-many)',
			verdict: {
				good: 'Cheap user-level switching most of the time, and a blocked kernel thread doesn’t strand the others.',
				bad: 'The thread library and kernel have to cooperate closely. It is hard to build, and most systems dropped it for one-to-one.'
			},
			spans: [
				s('c1', 0, 2, 'K1: T1'), s('c1', 2, 4, 'K1: T3'), s('c1', 4, 6, 'K1: T4'), s('c1', 6, 8, 'K1: T1'), s('c1', 8, 10, 'K1: T3'),
				s('c2', 0, 2, 'K2: T2'), s('c2', 2, 6, 'K2 blocked in read()', 'bad'), s('c2', 6, 8, 'K2: T4'), s('c2', 8, 10, 'K2: T2'),
				run('t1', 0, 2), ready('t1', 2, 6), run('t1', 6, 8), ready('t1', 8, 10),
				run('t2', 0, 2), s('t2', 2, 6, 'blocked on disk', 'bad'), ready('t2', 6, 8), run('t2', 8, 10),
				ready('t3', 0, 2), run('t3', 2, 4), ready('t3', 4, 8), run('t3', 8, 10),
				ready('t4', 0, 2), s('t4', 2, 4, 'waiting on K2', 'dim'), run('t4', 4, 8), ready('t4', 8, 10)
			],
			events: [...io, { track: 't4', t: 4, label: 'remapped from K2 to K1', tone: /** @type {Tone} */ ('ok') }],
			stops: [
				{ t: 0, caption: 'Four user threads share two kernel threads, K1 and K2. The library decides which user thread runs on which kernel thread.' },
				{ t: 2, caption: 'T2 calls read(). K2, the kernel thread carrying it, blocks with it. Core 2 has nothing to run.', tone: /** @type {'bad'} */ ('bad') },
				{ t: 4, caption: 'T4 was queued behind T2 on K2. The library moves it onto K1, which is still running, and it runs.', tone: /** @type {'ok'} */ ('ok') },
				{ t: 6, caption: 'The disk answers and K2 is free again. Both cores are busy.' },
				{ t: 10, caption: 'Nobody froze for someone else’s I/O, and most switches never touched the kernel. The price is a complicated library.' }
			],
			frozen: 0,
			idle: 4
		}
	};

	/** @type {(keyof typeof MODELS)[]} */
	const ORDER = ['ult', 'klt', 'hybrid'];
	let tab = $state(/** @type {keyof typeof MODELS} */ ('ult'));
	let index = $state(0);
	let model = $derived(MODELS[tab]);

	/** @param {keyof typeof MODELS} id */
	function choose(id) {
		tab = id;
		index = 0;
	}

	/** Arrow keys move between tabs, per the ARIA tabs pattern. @param {KeyboardEvent} e */
	function onKey(e) {
		const k = ORDER.indexOf(tab);
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			const next = ORDER[(k + (e.key === 'ArrowRight' ? 1 : ORDER.length - 1)) % ORDER.length];
			choose(next);
			/** @type {HTMLElement | null} */ (document.getElementById(`${uid}-${next}`))?.focus();
		}
	}
</script>

<div class="compose">
	<div class="tabs" role="tablist" aria-label="Thread model" tabindex="-1" onkeydown={onKey}>
		{#each ORDER as id}
			<button
				id="{uid}-{id}"
				class="w-btn tab"
				role="tab"
				aria-selected={tab === id}
				tabindex={tab === id ? 0 : -1}
				onclick={() => choose(id)}
			>{MODELS[id].tab}</button>
		{/each}
	</div>

	<div role="tabpanel" aria-labelledby="{uid}-{tab}">
		{#key tab}
			<Timeline
				title="{title}: {model.tab}"
				end={10}
				ticks={[0, 2, 4, 6, 8, 10]}
				{tracks}
				spans={model.spans}
				events={model.events}
				stops={model.stops}
				minWidth="30rem"
				bind:index
			/>
		{/key}

		<div class="verdict">
			<p><span class="k ok">Good at</span> {model.verdict.good}</p>
			<p><span class="k bad">Killed by</span> {model.verdict.bad}</p>
			<p class="tally">
				Thread-ticks frozen by another thread’s I/O: <strong class:bad={model.frozen > 0}>{model.frozen}</strong>
				· Core-ticks idle: <strong class:bad={model.idle > 0}>{model.idle}</strong>
			</p>
		</div>
	</div>
</div>

<style>
	.compose { display: grid; gap: 0.75rem; margin: 1.25rem 0; }
	.compose :global(.widget) { margin: 0; }
	.tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
	.tab[aria-selected='true'] { border-color: var(--accent); color: var(--accent); background: var(--accent-muted); }

	.verdict {
		margin-top: 0.75rem;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--surface-elevated);
		display: grid;
		gap: 0.4rem;
	}
	.verdict p { margin: 0; color: var(--text-muted); line-height: 1.55; }
	.k { display: inline-block; min-width: 5.2rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
	.k.ok { color: var(--success); }
	.k.bad { color: var(--error); }
	.tally { font-size: 0.85rem; }
	.tally strong { color: var(--success); }
	.tally strong.bad { color: var(--error); }
</style>
