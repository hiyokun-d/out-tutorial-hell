<script>
	import { tick, untrack } from 'svelte';
	import { DUR, EASE_CSS, reducedMotion, cancelAnimations } from '$lib/motion.js';

	/**
	 * Nodes and edges. Highlights the active state, accepts an input and walks it
	 * one symbol at a time, showing what is left to read.
	 *
	 * mode "chars":  input is a string, every character is one symbol (DFA walks).
	 * mode "events": input is space-separated event ids, and each event also gets
	 *                a button that fires it directly (process state models).
	 *
	 * @typedef {{ id: string, label: string, x: number, y: number, accept?: boolean, note?: string }} Node
	 * @typedef {{ from: string, to: string, symbol: string, label?: string, bend?: number, loop?: 'top' | 'bottom', note?: string }} Edge
	 * @typedef {{ id: string, label: string }} EventDef
	 */

	/**
	 * @type {{
	 *   title?: string, nodes: Node[], edges: Edge[], start: string,
	 *   mode?: 'chars' | 'events', events?: EventDef[], width?: number, height?: number,
	 *   initialInput?: string, placeholder?: string, stuck?: Record<string, string>,
	 *   acceptText?: string, rejectText?: string
	 * }}
	 */
	let {
		title = 'State machine',
		nodes,
		edges,
		start,
		mode = 'chars',
		events = [],
		width = 360,
		height = 220,
		initialInput = '',
		placeholder = '',
		stuck = {},
		acceptText = 'Accepted.',
		rejectText = 'Rejected.'
	} = $props();

	const uid = $props.id();

	/** @typedef {{ from: string, to: string, symbol: string, note?: string }} Move */

	// Props seed the initial state; Reset reads them again.
	let text = $state(untrack(() => initialInput));
	let tokens = $state(/** @type {string[] | null} */ (null));
	// The text that produced `tokens`; editing the box after Load forces a reload.
	let loadedText = $state('');
	let pos = $state(0);
	let current = $state(untrack(() => start));
	let moves = $state(/** @type {Move[]} */ ([]));
	let error = $state('');
	let halted = $state(false);

	let nodeById = $derived(Object.fromEntries(nodes.map((n) => [n.id, n])));
	let alphabet = $derived(mode === 'chars' ? [...new Set(edges.map((e) => e.symbol))].sort() : events.map((e) => e.id));
	let active = $derived(nodeById[current]);
	let lastMove = $derived(moves.at(-1) ?? null);
	let finished = $derived(tokens !== null && pos >= tokens.length);
	let exampleInput = $derived(mode === 'chars' ? alphabet.join('') : alphabet.slice(0, 2).join(' '));

	// ── Guidance: show where the next symbol will go before the learner commits ──
	/** @param {string} raw */
	function parse(raw) {
		const parts = mode === 'chars' ? [...raw] : raw.split(/[\s,]+/).map((t) => t.toLowerCase());
		return raw && parts.every((p) => alphabet.includes(p)) ? parts : null;
	}
	let previewTokens = $derived(tokens !== null && text.trim() === loadedText ? tokens : parse(text.trim()));
	let previewPos = $derived(tokens !== null && text.trim() === loadedText ? pos : 0);
	let previewFrom = $derived(tokens !== null && text.trim() === loadedText ? current : start);
	let nextEdge = $derived.by(() => {
		if (halted || running || !previewTokens || previewPos >= previewTokens.length) return null;
		const symbol = previewTokens[previewPos];
		return edges.find((e) => e.from === previewFrom && e.symbol === symbol) ?? null;
	});
	let possible = $derived(new Set(edges.filter((e) => e.from === current).map((e) => e.symbol)));
	let started = $derived(moves.length > 0);

	// ── Motion: a token travels along the arrow that was just taken ──────────────
	/** @type {SVGSVGElement | undefined} */
	let svgEl = $state();
	/** @type {SVGCircleElement | undefined} */
	let tokenEl = $state();
	let running = $state(false);
	let runId = 0;
	let errorKey = $state(0);

	/** @param {Edge} edge */
	async function travel(edge) {
		if (reducedMotion.current || !svgEl || !tokenEl) return;
		await tick();
		const path = /** @type {SVGPathElement | null} */ (svgEl.querySelector(`[data-edge="${edges.indexOf(edge)}"]`));
		if (!path || !tokenEl.animate) return;
		const len = path.getTotalLength();
		const frames = Array.from({ length: 13 }, (_, i) => {
			const p = path.getPointAtLength((len * i) / 12);
			return { transform: `translate(${p.x}px, ${p.y}px)`, opacity: i === 12 ? 0 : 1 };
		});
		tokenEl.animate(frames, { duration: DUR.teach, easing: EASE_CSS.move });
	}

	// Instant: stops a running walk and any token mid-flight.
	function reset() {
		runId++;
		cancelAnimations(tokenEl);
		running = false;
		text = initialInput;
		tokens = null;
		pos = 0;
		current = start;
		moves = [];
		error = '';
		halted = false;
	}

	/** @param {string} symbol */
	function labelOf(symbol) {
		return events.find((e) => e.id === symbol)?.label ?? symbol;
	}

	function load() {
		error = '';
		const raw = text.trim();
		if (!raw) {
			error = `Type an input first — for example "${exampleInput}".`;
			return;
		}
		const parts = mode === 'chars' ? [...raw] : raw.split(/[\s,]+/).map((t) => t.toLowerCase());
		const bad = parts.findIndex((p) => !alphabet.includes(p));
		if (bad !== -1) {
			error =
				mode === 'chars'
					? `"${parts[bad]}" (character ${bad + 1}) isn't a symbol this machine reads. It only reads: ${alphabet.join(', ')}.`
					: `"${parts[bad]}" isn't an event here. Valid events: ${alphabet.join(', ')}.`;
			return;
		}
		tokens = parts;
		loadedText = raw;
		pos = 0;
		current = start;
		moves = [];
		halted = false;
	}

	/**
	 * Applies one symbol. Returns false (and explains why) when there is no edge for it.
	 * @param {string} symbol
	 */
	function apply(symbol) {
		const edge = edges.find((e) => e.from === current && e.symbol === symbol);
		if (!edge) {
			const from = nodeById[current].label;
			error =
				stuck[`${current}:${symbol}`] ??
				`There is no "${labelOf(symbol)}" arrow out of ${from}. That move is impossible from here.`;
			errorKey++;
			return false;
		}
		error = '';
		moves = [...moves, { from: current, to: edge.to, symbol, note: edge.note }];
		current = edge.to;
		travel(edge);
		return true;
	}

	function stale() {
		return tokens === null || text.trim() !== loadedText;
	}

	function step() {
		if (stale()) {
			load();
			if (stale()) return; // invalid input: load() already showed why
		}
		const input = tokens;
		if (!input || halted || pos >= input.length) return;
		if (apply(input[pos])) pos++;
		else halted = true;
	}

	// Run all walks at a readable pace so the learner can follow each arrow.
	async function runAll() {
		if (stale()) {
			load();
			if (stale()) return;
		}
		const id = ++runId;
		// One step per token flight, so each arrow is finished before the next starts.
		const delay = reducedMotion.current ? 0 : DUR.teach;
		running = true;
		while (id === runId && tokens && !halted && pos < tokens.length) {
			step();
			if (delay) await new Promise((r) => setTimeout(r, delay));
		}
		if (id === runId) running = false;
	}

	/** @param {string} id */
	function fire(id) {
		// Direct event buttons: an impossible event is explained and changes nothing.
		tokens = null;
		pos = 0;
		apply(id);
	}

	// ── Geometry ────────────────────────────────────────────────────────────────
	const R = 24;

	/** @param {Node} n */
	function halfSize(n) {
		if (mode === 'chars') return { w: R, h: R };
		return { w: Math.max(34, n.label.length * 4.6 + 12), h: 18 };
	}

	/** Point on a node's outline in direction (dx, dy). @param {Node} n @param {number} dx @param {number} dy */
	function rim(n, dx, dy) {
		const len = Math.hypot(dx, dy) || 1;
		if (mode === 'chars') return { x: n.x + (dx / len) * R, y: n.y + (dy / len) * R };
		const { w, h } = halfSize(n);
		const t = Math.min(w / Math.abs(dx || 1e-6), h / Math.abs(dy || 1e-6));
		return { x: n.x + dx * t, y: n.y + dy * t };
	}

	/** @param {Edge} e */
	function geometry(e) {
		const a = nodeById[e.from];
		const b = nodeById[e.to];
		if (e.from === e.to) {
			const dir = e.loop === 'bottom' ? 1 : -1;
			const { h } = halfSize(a);
			const y0 = a.y + dir * (mode === 'chars' ? R * 0.7 : h);
			const x0 = mode === 'chars' ? R * 0.7 : 12;
			const reach = dir * 46;
			return {
				d: `M ${a.x - x0} ${y0} C ${a.x - 30} ${a.y + reach}, ${a.x + 30} ${a.y + reach}, ${a.x + x0} ${y0}`,
				lx: a.x,
				ly: a.y + dir * 40 + (dir > 0 ? 12 : -4)
			};
		}
		const mx = (a.x + b.x) / 2;
		const my = (a.y + b.y) / 2;
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const len = Math.hypot(dx, dy) || 1;
		const bend = e.bend ?? 0;
		const cx = mx + (-dy / len) * bend;
		const cy = my + (dx / len) * bend;
		const p0 = rim(a, cx - a.x, cy - a.y);
		const p2 = rim(b, cx - b.x, cy - b.y);
		return {
			d: `M ${p0.x} ${p0.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`,
			lx: 0.25 * p0.x + 0.5 * cx + 0.25 * p2.x,
			ly: 0.25 * p0.y + 0.5 * cy + 0.25 * p2.y + 4
		};
	}

	/** @param {Edge} e */
	function isLast(e) {
		return !!lastMove && lastMove.from === e.from && lastMove.to === e.to && lastMove.symbol === e.symbol;
	}

	let startNode = $derived(nodeById[start]);
</script>

<section class="widget machine" aria-label={title}>
	<div class="widget-head">
		<p class="widget-title">{title}</p>
		<button class="w-btn" onclick={reset}>Reset</button>
	</div>

	<div class="diagram">
		<svg bind:this={svgEl} viewBox="0 0 {width} {height}" role="img" aria-labelledby="{uid}-t {uid}-d" font-family="'Fira Code', ui-monospace, monospace">
			<title id="{uid}-t">{title}</title>
			<desc id="{uid}-d">
				States: {nodes.map((n) => n.label + (n.accept ? ' (accepting)' : '')).join(', ')}.
				Transitions: {edges.map((e) => `${nodeById[e.from].label} on ${labelOf(e.symbol)} goes to ${nodeById[e.to].label}`).join('; ')}.
				Currently in {active.label}.
			</desc>
			<defs>
				<marker id="{uid}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
					<path d="M0 0 L10 5 L0 10 Z" class="head" />
				</marker>
				<marker id="{uid}-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
					<path d="M0 0 L10 5 L0 10 Z" class="head on" />
				</marker>
			</defs>

			{#if startNode}
				<path
					class="edge"
					d="M {startNode.x - halfSize(startNode).w - 22} {startNode.y} L {startNode.x - halfSize(startNode).w} {startNode.y}"
					marker-end="url(#{uid}-arrow)"
				/>
			{/if}

			{#each edges as e}
				{@const g = geometry(e)}
				<path
					class="edge"
					class:on={isLast(e)}
					class:next={nextEdge === e}
					class:out={e.from === current && !isLast(e)}
					data-edge={edges.indexOf(e)}
					d={g.d}
					marker-end="url(#{uid}-arrow{isLast(e) || nextEdge === e ? '-on' : ''})"
				/>
				<text class="edge-label" class:on={isLast(e) || nextEdge === e} x={g.lx} y={g.ly} text-anchor="middle">{e.label ?? labelOf(e.symbol)}</text>
			{/each}

			{#each nodes as n}
				{@const s = halfSize(n)}
				<g class="node" class:on={n.id === current}>
					{#if mode === 'chars'}
						<circle cx={n.x} cy={n.y} r={R} />
						{#if n.accept}<circle class="inner" cx={n.x} cy={n.y} r={R - 5} />{/if}
					{:else}
						<rect x={n.x - s.w} y={n.y - s.h} width={s.w * 2} height={s.h * 2} rx="10" />
						{#if n.accept}<rect class="inner" x={n.x - s.w + 4} y={n.y - s.h + 4} width={s.w * 2 - 8} height={s.h * 2 - 8} rx="7" />{/if}
					{/if}
					<text x={n.x} y={n.y + 5} text-anchor="middle">{n.label}</text>
				</g>
			{/each}

			<circle bind:this={tokenEl} class="token" r="6" cx="0" cy="0" opacity="0" />
		</svg>
	</div>

	<p class="status" aria-live="polite">
		Now in <strong>{active.label}</strong>{#if active.accept}<span class="accepting"> (accepting)</span>{/if}
		{#if lastMove} — read <code>{labelOf(lastMove.symbol)}</code>, moved {nodeById[lastMove.from].label} → {active.label}{/if}
	</p>

	<form class="widget-controls input-row" onsubmit={(e) => { e.preventDefault(); load(); }}>
		<label class="w-sr" for="{uid}-input">{mode === 'chars' ? 'Input string' : 'Event sequence'}</label>
		<input
			id="{uid}-input"
			class="w-input"
			bind:value={text}
			placeholder={placeholder || exampleInput}
			autocapitalize="off"
			autocomplete="off"
			spellcheck="false"
		/>
		<button class="w-btn" type="submit">Load</button>
		<button class="w-btn primary" type="button" onclick={step} disabled={running || ((halted || finished) && !stale())}>Step</button>
		<button class="w-btn" type="button" onclick={runAll} disabled={running || ((halted || finished) && !stale())}>{running ? 'Running…' : 'Run all'}</button>
	</form>

	{#if !started && !error}
		<p class="hint">
			{#if mode === 'chars'}
				Press <strong>Step</strong> to read one symbol. The highlighted arrow shows where it will go.
			{:else}
				Press <strong>Step</strong> to play the sequence, or tap an event below. Highlighted events are possible from where you are.
			{/if}
		</p>
	{/if}

	{#if error}
		{#key errorKey}<p class="w-error nudge" role="alert">{error}</p>{/key}
	{/if}

	{#if tokens}
		<div class="tape" aria-label="Input">
			<span class="tape-label">Input</span>
			<span class="symbols">
				{#each tokens as t, i}
					<span class="sym" class:done={i < pos} class:next={i === pos && !halted}>{labelOf(t)}</span>
				{/each}
			</span>
			<span class="remaining">{Math.max(0, tokens.length - pos)} left</span>
		</div>
	{/if}

	{#if mode === 'events'}
		<div class="widget-controls events" aria-label="Fire an event">
			{#each events as ev}
				<button class="w-btn event" class:possible={possible.has(ev.id)} type="button" onclick={() => fire(ev.id)} disabled={running}>
					{ev.label}
				</button>
			{/each}
		</div>
	{/if}

	{#if lastMove?.note}
		{#key moves.length}<p class="w-note enter">{lastMove.note}</p>{/key}
	{/if}

	{#if active.note}
		<p class="w-note">{active.note}</p>
	{/if}

	{#if mode === 'chars' && finished && !halted}
		<p class="w-note {active.accept ? 'ok' : 'bad'}">
			{active.accept ? acceptText : rejectText}
			Ended in {active.label}{active.accept ? ', an accepting state.' : ', which is not accepting.'}
		</p>
	{/if}
</section>

<style>
	.diagram {
		overflow-x: auto;
		border-radius: 12px;
		background: var(--sandbox-bg);
		border: 1px solid var(--border);
	}

	.diagram svg {
		display: block;
		width: 100%;
		max-width: 560px;
		height: auto;
		margin: 0 auto;
	}

	.edge { fill: none; stroke: var(--text-dim); stroke-width: 1.6; }
	.edge.on { stroke: var(--accent); stroke-width: 2.6; }
	.edge.out { stroke: color-mix(in srgb, var(--accent) 45%, var(--text-dim)); }
	.edge.next { stroke: var(--accent); stroke-width: 2.2; stroke-dasharray: 6 5; }
	.token { fill: var(--accent); stroke: var(--sandbox-bg); stroke-width: 2; pointer-events: none; }

	.hint {
		margin: 0.6rem 0 0;
		font-size: 0.88rem;
		color: var(--text-dim);
		line-height: 1.5;
	}
	.hint strong { color: var(--accent); }

	.event.possible { border-color: var(--accent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent); }
	.event:not(.possible) { color: var(--text-dim); }
	:global(.machine) .head { fill: var(--text-dim); }
	:global(.machine) .head.on { fill: var(--accent); }

	.edge-label {
		font-size: 13px;
		fill: var(--text-muted);
		paint-order: stroke;
		stroke: var(--sandbox-bg);
		stroke-width: 5px;
		stroke-linejoin: round;
	}
	.edge-label.on { fill: var(--accent); font-weight: 700; }

	.node circle,
	.node rect { fill: var(--surface-elevated); stroke: var(--text-dim); stroke-width: 1.6; }
	.node .inner { fill: none; }
	.node text { fill: var(--text); font-size: 13px; font-weight: 700; }
	.node.on circle,
	.node.on rect { stroke: var(--accent); stroke-width: 3; }
	.node.on circle:not(.inner),
	.node.on rect:not(.inner) { fill: var(--accent-muted); }
	.node.on .inner { stroke-width: 1.6; }
	.node.on text { fill: var(--accent); }

	.status { margin: 0.75rem 0 0.5rem; color: var(--text-muted); line-height: 1.6; }
	.status strong { color: var(--text); }
	.status code { font-family: 'Fira Code', monospace; color: var(--accent); }
	.accepting { color: var(--success); }

	.tape {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
		margin-top: 0.75rem;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
	}
	.tape-label, .remaining { font-size: 0.75rem; color: var(--text-dim); font-family: inherit; }
	.symbols { display: flex; flex-wrap: wrap; gap: 0.25rem; }
	.sym {
		min-width: 1.8rem;
		padding: 0.2rem 0.45rem;
		text-align: center;
		border: 1px solid var(--border);
		border-radius: 8px;
		color: var(--sandbox-text);
		background: var(--sandbox-bg);
	}
	.sym.done { opacity: 0.4; text-decoration: line-through; transform: scale(0.92); }
	.sym.next { border-color: var(--accent); color: var(--accent); font-weight: 700; transform: translateY(-2px); }

	.events { margin-top: 0.75rem; }

	@media (prefers-reduced-motion: no-preference) {
		.sym { transition: opacity var(--dur-base) var(--ease-enter), transform var(--dur-base) var(--ease-enter); }
		/* Finite: draws the eye to the next arrow, then holds still (no infinite loops). */
		.edge.next { animation: breathe var(--dur-teach) var(--ease-move) 4 alternate; }
		.nudge { animation: nudge calc(var(--dur-fast) * 2) linear; }
		.enter { animation: rise var(--dur-base) var(--ease-enter); }
		.node.on { animation: pop var(--dur-base) var(--ease-back); transform-box: fill-box; transform-origin: center; }
	}

	@keyframes breathe {
		from { opacity: 1; }
		to { opacity: 0.45; }
	}

	@keyframes nudge {
		0%, 100% { transform: translateX(0); }
		20%, 60% { transform: translateX(-3px); }
		40%, 80% { transform: translateX(3px); }
	}

	@keyframes rise {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: none; }
	}

	@keyframes pop {
		from { opacity: 0.5; transform: scale(0.92); }
		to { opacity: 1; transform: scale(1); }
	}
</style>
