<script>
	import { tick, untrack } from 'svelte';
	import Stepper from './Stepper.svelte';
	import StateMachine from './StateMachine.svelte';
	import { minimize, layoutDfa } from './lib/automata.js';
	import { flipFrom } from '$lib/motion.js';

	/**
	 * DFA minimisation by partition refinement, composed from <Stepper> (one
	 * refinement round per step) and <StateMachine> (states tinted by block).
	 *
	 * The partition board is one keyed list laid out in a grid: when a block
	 * splits, each departing state is the same element, moved with FLIP. A toggle
	 * shows the same computation as the table-filling grid.
	 *
	 * @type {{ title?: string, states?: string[], alphabet?: string[], start?: string, accept?: string[], transitions?: { from: string, to: string, symbol: string }[] }}
	 */
	let {
		title = 'Minimise by splitting',
		states = ['A', 'B', 'C', 'D', 'E'],
		alphabet = ['a', 'b'],
		start = 'A',
		accept = ['E'],
		transitions = [
			{ from: 'A', symbol: 'a', to: 'B' }, { from: 'A', symbol: 'b', to: 'C' },
			{ from: 'B', symbol: 'a', to: 'B' }, { from: 'B', symbol: 'b', to: 'D' },
			{ from: 'C', symbol: 'a', to: 'B' }, { from: 'C', symbol: 'b', to: 'C' },
			{ from: 'D', symbol: 'a', to: 'B' }, { from: 'D', symbol: 'b', to: 'E' },
			{ from: 'E', symbol: 'a', to: 'B' }, { from: 'E', symbol: 'b', to: 'C' }
		]
	} = $props();

	const result = untrack(() => minimize({ states, alphabet, start, accept, transitions }));
	const { rounds, marks, minimal } = result;
	const TINTS = ['var(--info)', 'var(--success)', 'var(--accent)', 'var(--error)', 'var(--text-muted)'];

	let step = $state(0);
	let view = $state(/** @type {'partition' | 'table'} */ ('partition'));
	let round = $derived(Math.min(step, rounds.length - 1));
	let done = $derived(step >= rounds.length);
	let blocks = $derived(rounds[round].blocks);
	let blockOf = $derived(new Map(blocks.flatMap((b, k) => b.map((s) => [s, k]))));

	/** @type {HTMLElement | undefined} */
	let board = $state();

	/** @param {number} index @param {'fwd' | 'back' | 'none'} dir */
	async function onchange(index, dir) {
		// FLIP: remember where every chip is, let the DOM move them, then glide from there.
		const before = new Map();
		if (board && dir !== 'none') {
			for (const el of board.querySelectorAll('[data-chip]')) before.set(el, el.getBoundingClientRect());
		}
		step = index;
		await tick();
		for (const [el, rect] of before) flipFrom(el, rect);
	}

	// Props are the lesson's fixed DFA; the widget never re-reads them.
	const S = untrack(() => ({ states, accept, transitions }));

	let steps = [
		{
			title: 'Round 0: accepting vs not',
			tags: [{ label: 'blocks', value: String(rounds[0].blocks.length) }],
			body: `Start with the one split you know is real: an accepting state and a non-accepting state can never be merged — one says yes to the empty string, the other says no.\n\nEverything else is **assumed equal until proven different**.`
		},
		...rounds.slice(1).map((r, k) => ({
			title: `Round ${k + 1}: split`,
			tags: [{ label: 'blocks', value: String(r.blocks.length), tone: /** @type {'accent'} */ ('accent') }],
			body:
				`For every state, ask: *on each symbol, which block do I land in?* States in the same block that land in different blocks get split apart.\n\n` +
				r.splits.map((s) => `- **${s.state}** leaves: ${s.reason}.`).join('\n')
		})),
		{
			title: 'Fixed point',
			tags: [
				{ label: 'before', value: `${S.states.length} states` },
				{ label: 'after', value: `${minimal.states.length} states`, tone: /** @type {'ok'} */ ('ok') }
			],
			body: `Run another round and nothing splits. That's the fixed point: every block is a set of states that no input string can tell apart. Each block becomes one state.`,
			callout: `States still sharing a block are equivalent: ${rounds[rounds.length - 1].blocks.filter((b) => b.length > 1).map((b) => b.join(' = ')).join(', ') || 'none — this DFA was already minimal'}.`,
			calloutTone: /** @type {'ok'} */ ('ok')
		}
	];

	let tinted = $derived(
		layoutDfa({
			states: states.map((s) => ({ name: s, accept: accept.includes(s), tint: TINTS[/** @type {number} */ (blockOf.get(s)) % TINTS.length] })),
			transitions
		})
	);
	const original = layoutDfa({ states: S.states.map((s) => ({ name: s, accept: S.accept.includes(s) })), transitions: S.transitions });
	const small = layoutDfa({ states: minimal.states.map((s) => ({ name: s, accept: minimal.accept.includes(s) })), transitions: minimal.transitions });

	/** Pair mark visible at the current round, or null. @param {string} a @param {string} b */
	function mark(a, b) {
		const r = marks.get(`${a}|${b}`);
		return r !== undefined && r <= round ? r : null;
	}
</script>

<div class="compose">
	<Stepper {title} {steps} {onchange} />

	<section class="widget view" aria-label="Current partition">
		<div class="widget-head">
			<p class="widget-title">{done ? 'Final partition' : `After round ${round}`}</p>
			<div class="toggle" role="group" aria-label="View">
				<button class="w-btn" aria-pressed={view === 'partition'} onclick={() => (view = 'partition')}>Blocks</button>
				<button class="w-btn" aria-pressed={view === 'table'} onclick={() => (view = 'table')}>Table</button>
			</div>
		</div>

		{#if view === 'partition'}
			<div class="board" bind:this={board} style:--cols={blocks.length}>
				{#each blocks as block, k (k)}
					<span class="block-head" style:grid-column={k + 1} style:--tint={TINTS[k % TINTS.length]}>Block {k + 1}</span>
				{/each}
				{#each states as s (s)}
					{@const k = /** @type {number} */ (blockOf.get(s))}
					<span
						class="chip"
						class:acc={accept.includes(s)}
						data-chip={s}
						style:grid-column={k + 1}
						style:grid-row={blocks[k].indexOf(s) + 2}
						style:--tint={TINTS[k % TINTS.length]}
					>{s}</span>
				{/each}
			</div>
			<p class="legend">Double border = accepting. Each column is one block: states nobody has told apart yet.</p>
		{:else}
			<div class="table-wrap">
				<table class="pairs">
					<caption class="w-sr">Which pairs of states are distinguishable, and in which round</caption>
					<tbody>
						{#each states.slice(1) as a, i}
							<tr>
								<th scope="row">{a}</th>
								{#each states.slice(0, i + 1) as b}
									{@const m = mark(a, b)}
									<td class:marked={m !== null}>{m === null ? '' : `×${m}`}</td>
								{/each}
							</tr>
						{/each}
						<tr>
							<th></th>
							{#each states.slice(0, -1) as b}<th scope="col">{b}</th>{/each}
						</tr>
					</tbody>
				</table>
			</div>
			<p class="legend">×r = these two were told apart in round r. An empty cell at the end means the pair is equivalent — the same pairs that share a block.</p>
		{/if}
	</section>

	<StateMachine
		title="The DFA, tinted by block"
		nodes={tinted.nodes}
		edges={tinted.edges}
		{start}
		width={tinted.width}
		height={tinted.height}
		initialInput="abb"
	/>

	{#if done}
		<div class="compare">
			<div>
				<p class="count">Original: <strong>{states.length} states</strong></p>
				<StateMachine title="Original" nodes={original.nodes} edges={original.edges} {start} width={original.width} height={original.height} initialInput="babb" />
			</div>
			<div>
				<p class="count">Minimised: <strong>{minimal.states.length} states</strong></p>
				<StateMachine title="Minimised" nodes={small.nodes} edges={small.edges} start={minimal.start} width={small.width} height={small.height} initialInput="babb" />
			</div>
		</div>
	{/if}
</div>

<style>
	.compose { display: grid; gap: 0.75rem; margin: 1.25rem 0; }
	.compose :global(.widget) { margin: 0; }

	.toggle { display: flex; gap: 0.4rem; }
	.toggle .w-btn[aria-pressed='true'] { border-color: var(--accent); color: var(--accent); background: var(--accent-muted); }

	.board {
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(3.4rem, 1fr));
		grid-auto-rows: minmax(2.5rem, auto);
		gap: 0.4rem 0.5rem;
		margin-top: 0.75rem;
	}
	.block-head {
		grid-row: 1;
		align-self: end;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--tint);
		border-bottom: 2px solid var(--tint);
		padding-bottom: 0.2rem;
	}
	.chip {
		display: grid;
		place-items: center;
		min-height: 2.5rem;
		border-radius: 12px;
		border: 2px solid var(--tint);
		background: color-mix(in srgb, var(--tint) 14%, var(--sandbox-bg));
		font-family: 'Fira Code', monospace;
		font-weight: 800;
		color: var(--text);
	}
	.chip.acc { border-style: double; border-width: 4px; }
	.legend { margin: 0.6rem 0 0; font-size: 0.82rem; color: var(--text-dim); line-height: 1.5; }

	.table-wrap { overflow-x: auto; margin-top: 0.75rem; }
	.pairs { border-collapse: collapse; font-family: 'Fira Code', monospace; }
	.pairs th { padding: 0.35rem 0.6rem; color: var(--text-muted); font-weight: 800; }
	.pairs td {
		width: 2.8rem;
		height: 2.5rem;
		text-align: center;
		border: 1px solid var(--border);
		color: var(--error);
		background: var(--sandbox-bg);
	}
	.pairs td.marked { background: var(--error-muted); font-weight: 800; }

	.compare { display: grid; gap: 0.75rem; }
	.count { margin: 0 0 0.4rem; color: var(--text-muted); }
	.count strong { color: var(--text); }

	@media (min-width: 768px) {
		.compare { grid-template-columns: 1fr 1fr; }
	}

	@media (prefers-reduced-motion: no-preference) {
		.chip, .block-head { transition: border-color var(--dur-base) var(--ease-enter), background-color var(--dur-base) var(--ease-enter), color var(--dur-base); }
		.pairs td { transition: background-color var(--dur-base) var(--ease-enter); }
	}
</style>
