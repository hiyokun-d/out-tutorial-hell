<script>
	import { fly } from 'svelte/transition';
	import Timeline from './Timeline.svelte';
	import { DUR, dur, EASE, reducedMotion } from '$lib/motion.js';

	/**
	 * The back stack plus lifecycle callbacks in the order they really fire.
	 * Left: the task's stack as cards. Right: a <Timeline> of the callbacks from
	 * the last action, played one per `teach` beat so the order is readable.
	 *
	 * The point: when A starts B, A.onStop fires *after* B.onResume. In between,
	 * A is still on screen.
	 *
	 * @type {{ title?: string }}
	 */
	let { title = 'Back stack and lifecycle' } = $props();

	const NAMES = ['A', 'B', 'C', 'D'];

	/** @typedef {{ name: string, inst: number, taps: number }} Card */
	/** @typedef {{ who: string, cb: string, t: number, caption: string }} Call */

	const id = (/** @type {Card} */ c) => `${c.name}#${c.inst}`;

	/** @type {Card[]} */
	let stack = $state([{ name: 'A', inst: 1, taps: 0 }]);
	let background = $state(false);
	let saveState = $state(false);
	/** @type {Call[]} */
	let calls = $state(launchCalls());
	/** @type {{ track: string, from: number, to: number, label: string, tone: 'accent' | 'bad' | 'dim' | 'ok' }[]} */
	let gaps = $state([]);
	let lastAction = $state('Launched the app');
	let index = $state(2);
	let timer = 0;

	let top = $derived(stack.at(-1));

	/** @param {Card} c @param {string} cb */
	function explain(c, cb) {
		const x = id(c);
		return {
			onCreate: `${x}.onCreate — a brand-new object. Inflate the layout and set up state here.`,
			onStart: `${x}.onStart — ${c.name} is becoming visible.`,
			onResume: `${x}.onResume — ${c.name} is in front and receives touches.`,
			onPause: `${x}.onPause — ${c.name} is losing focus. It is still visible. Keep this fast.`,
			onStop: `${x}.onStop — ${c.name} is completely hidden now.`,
			onRestart: `${x}.onRestart — coming back from stopped. Same object as before, not a new one.`,
			onDestroy: `${x}.onDestroy — this object is finished. Anything stored only in its fields is gone.`
		}[cb] ?? cb;
	}

	function launchCalls() {
		const a = { name: 'A', inst: 1, taps: 0 };
		return ['onCreate', 'onStart', 'onResume'].map((cb, t) => ({ who: id(a), cb, t, caption: explain(a, cb) }));
	}

	/** Records an action's callbacks, then plays them one beat at a time. @param {string} label @param {[Card, string, number][]} list @param {typeof gaps} [g] */
	function play(label, list, g = []) {
		clearInterval(timer);
		lastAction = label;
		calls = list.map(([c, cb, t]) => ({ who: id(c), cb, t, caption: explain(c, cb) }));
		gaps = g;
		const last = calls.length - 1;
		if (reducedMotion.current) {
			index = last;
			return;
		}
		index = 0;
		timer = window.setInterval(() => {
			if (index >= last) clearInterval(timer);
			else index++;
		}, DUR.teach * 2);
	}

	function startNext() {
		const from = /** @type {Card} */ (top);
		const next = { name: NAMES[stack.length], inst: 1, taps: 0 };
		stack = [...stack, next];
		play(
			`${from.name} started ${next.name}`,
			[[from, 'onPause', 0], [next, 'onCreate', 1], [next, 'onStart', 2], [next, 'onResume', 3], [from, 'onStop', 5]],
			[{ track: id(from), from: 3, to: 5, label: `${from.name} is still visible here`, tone: 'accent' }]
		);
		/** @type {Call} */ (calls.at(-1)).caption = `${id(from)}.onStop — only now, after ${next.name}.onResume. Between the two, ${from.name} was still on screen while ${next.name} drew its first frame.`;
	}

	function back() {
		const leaving = /** @type {Card} */ (top);
		if (stack.length === 1) {
			stack = [];
			play(`Back from ${leaving.name}: the task is finished`, [[leaving, 'onPause', 0], [leaving, 'onStop', 1], [leaving, 'onDestroy', 2]]);
			return;
		}
		const under = stack[stack.length - 2];
		stack = stack.slice(0, -1);
		play(
			`Back: ${leaving.name} popped`,
			[[leaving, 'onPause', 0], [under, 'onRestart', 1], [under, 'onStart', 2], [under, 'onResume', 3], [leaving, 'onStop', 5], [leaving, 'onDestroy', 6]],
			[{ track: id(leaving), from: 3, to: 5, label: `${leaving.name} still visible, animating out`, tone: 'accent' }]
		);
		/** @type {Call} */ (calls.at(-1)).caption = `${id(leaving)}.onDestroy — Back doesn't just hide ${leaving.name}, it finishes it. Pressing Back never returns to this object.`;
	}

	function home() {
		const c = /** @type {Card} */ (top);
		background = true;
		play('Home: the task goes to the background', [[c, 'onPause', 0], [c, 'onStop', 1]]);
		/** @type {Call} */ (calls.at(-1)).caption = `${id(c)}.onStop — hidden but not destroyed. The whole stack is kept, in order, for when you come back.`;
	}

	function resume() {
		const c = /** @type {Card} */ (top);
		background = false;
		play('Back to the app', [[c, 'onRestart', 0], [c, 'onStart', 1], [c, 'onResume', 2]]);
	}

	function rotate() {
		const old = /** @type {Card} */ (top);
		const fresh = { name: old.name, inst: old.inst + 1, taps: saveState ? old.taps : 0 };
		stack = [...stack.slice(0, -1), fresh];
		play(
			`Rotated: ${old.name} destroyed and recreated`,
			[[old, 'onPause', 0], [old, 'onStop', 1], [old, 'onDestroy', 2], [fresh, 'onCreate', 3], [fresh, 'onStart', 4], [fresh, 'onResume', 5]]
		);
		const create = /** @type {Call} */ (calls[3]);
		create.caption = saveState
			? `${id(fresh)}.onCreate — a new object, but the tap count was saved and handed back (${fresh.taps}).`
			: `${id(fresh)}.onCreate — a new object. The tap count lived in ${id(old)}, so it's back to 0.`;
	}

	function launch() {
		stack = [{ name: 'A', inst: 1, taps: 0 }];
		background = false;
		play('Launched the app', [[stack[0], 'onCreate', 0], [stack[0], 'onStart', 1], [stack[0], 'onResume', 2]]);
	}

	function tap() {
		const c = /** @type {Card} */ (top);
		stack = [...stack.slice(0, -1), { ...c, taps: c.taps + 1 }];
	}

	// Reset is instant: no replay, no card animation.
	let instant = $state(false);
	function reset() {
		clearInterval(timer);
		instant = true;
		stack = [{ name: 'A', inst: 1, taps: 0 }];
		background = false;
		saveState = false;
		calls = launchCalls();
		gaps = [];
		lastAction = 'Launched the app';
		index = 2;
		requestAnimationFrame(() => (instant = false));
	}

	$effect(() => () => clearInterval(timer));

	let tracks = $derived([...new Set(calls.map((c) => c.who))].map((w) => ({ id: w, label: w })));
	let events = $derived(
		calls.map((c) => ({
			track: c.who,
			t: c.t,
			label: c.cb,
			tone: /** @type {'ok' | 'bad' | 'accent'} */ (c.cb === 'onResume' ? 'ok' : c.cb === 'onDestroy' ? 'bad' : 'accent')
		}))
	);
	let stops = $derived(calls.map((c) => ({ t: c.t, caption: c.caption })));
	let end = $derived(Math.max(...calls.map((c) => c.t)) + 0.6);

	let cardIn = $derived({ x: 40, duration: instant ? 0 : dur('teach'), easing: EASE.enter });
	let cardOut = $derived({ x: 40, duration: instant ? 0 : dur('teach', { exit: true }), easing: EASE.exit });
</script>

<div class="compose">
	<section class="widget" aria-label={title}>
		<div class="widget-head">
			<p class="widget-title">{title}</p>
			<button class="w-btn" onclick={reset}>Reset</button>
		</div>

		<div class="widget-controls actions">
			{#if stack.length === 0}
				<button class="w-btn primary" onclick={launch}>Launch app</button>
			{:else if background}
				<button class="w-btn primary" onclick={resume}>Return to app</button>
			{:else}
				<button class="w-btn primary" onclick={startNext} disabled={stack.length >= NAMES.length}>Start {NAMES[stack.length] ?? '—'}</button>
				<button class="w-btn" onclick={back}>Back</button>
				<button class="w-btn" onclick={home}>Home</button>
				<button class="w-btn" onclick={rotate}>Rotate</button>
			{/if}
		</div>

		<div class="split">
			<div class="stack-col">
				<p class="col-title">Task back stack <span>(top first)</span></p>
				<ol class="stack" class:bg={background} aria-label="Back stack, top first">
					{#each [...stack].reverse() as card, i (id(card))}
						<li class="card" class:top={i === 0} in:fly={cardIn} out:fly={cardOut}>
							<strong>{card.name}</strong>
							<span class="inst">object #{card.inst}</span>
							{#if i === 0 && !background}
								<span class="taps">
									Taps: <b>{card.taps}</b>
									<button class="w-btn small" onclick={tap}>+1</button>
								</span>
							{/if}
						</li>
					{:else}
						<li class="empty">Empty — the task is gone.</li>
					{/each}
				</ol>
				{#if background}<p class="w-note">In the background. Nothing was destroyed.</p>{/if}
				<label class="save">
					<input type="checkbox" bind:checked={saveState} />
					<span>Save the tap count across recreation (onSaveInstanceState / ViewModel)</span>
				</label>
			</div>

			<div class="calls-col">
				<p class="col-title">{lastAction}</p>
				<Timeline
					title="Callbacks, in the order they fire"
					start={-0.6}
					{end}
					{tracks}
					{events}
					spans={gaps}
					{stops}
					logSpans={false}
					bind:index
				/>
			</div>
		</div>
	</section>
</div>

<style>
	.compose { margin: 1.25rem 0; }
	.compose > :global(.widget) { margin: 0; }
	.calls-col :global(.widget) { margin: 0; padding: 0.75rem; }

	.actions { margin-bottom: 0.75rem; }
	.split { display: grid; gap: 1rem; }
	.col-title { margin: 0 0 0.5rem; font-size: 0.82rem; font-weight: 800; color: var(--text-muted); }
	.col-title span { font-weight: 600; color: var(--text-dim); }

	.stack { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.card {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.75rem;
		min-height: 3.2rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--sandbox-bg);
		color: var(--text-muted);
	}
	.card.top { border-color: var(--accent); background: var(--accent-muted); color: var(--text); }
	.card strong { font-family: 'Fira Code', monospace; font-size: 1.1rem; color: var(--text); }
	.inst { font-size: 0.78rem; color: var(--text-dim); }
	.taps { margin-left: auto; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }
	.taps b { font-family: 'Fira Code', monospace; color: var(--accent); }
	.small { min-width: 44px; }
	.stack.bg { opacity: 0.45; transform: translateY(6px); }
	.empty { padding: 0.8rem; color: var(--text-dim); border: 1px dashed var(--border); border-radius: 14px; }
	.save { display: flex; gap: 0.6rem; align-items: center; min-height: 44px; margin-top: 0.6rem; font-size: 0.85rem; color: var(--text-muted); }
	.save input { width: 1.3rem; height: 1.3rem; flex-shrink: 0; accent-color: var(--accent); }

	@media (min-width: 768px) {
		.split { grid-template-columns: minmax(12rem, 1fr) 2fr; }
	}
	@media (prefers-reduced-motion: no-preference) {
		/* The task leaving for the background: where it went. */
		.stack { transition: opacity var(--dur-slow) var(--ease-exit), transform var(--dur-slow) var(--ease-exit); }
	}
</style>
