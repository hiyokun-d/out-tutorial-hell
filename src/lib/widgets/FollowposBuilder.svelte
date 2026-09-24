<script>
	import { untrack } from 'svelte';
	import Stepper from './Stepper.svelte';
	import StateMachine from './StateMachine.svelte';
	import { parseRegex, directDfa, layoutDfa, fmtSet, nodeLabel } from './lib/automata.js';

	/**
	 * The direct RE → DFA construction (followpos), composed from <Stepper>
	 * (one stage per step, with a <MemoryView> table) and <StateMachine>
	 * (the DFA it produces, which accepts test strings).
	 *
	 * The tree is drawn into each step's body. Followpos edges are drawn as
	 * arcs under the leaves, so a `|` node visibly adds none.
	 *
	 * @type {{ regex?: string, title?: string }}
	 */
	let { regex = '(a|b)*abb', title = 'Regex to DFA, directly' } = $props();

	const uid = $props.id();
	let text = $state(untrack(() => regex));
	let built = $state(untrack(() => regex));
	let error = $state('');

	let result = $derived.by(() => {
		try {
			return { d: directDfa(parseRegex(built)), error: '' };
		} catch (e) {
			return { d: null, error: /** @type {Error} */ (e).message };
		}
	});

	function build() {
		error = '';
		try {
			directDfa(parseRegex(text));
			built = text.replace(/\s+/g, '');
		} catch (e) {
			error = /** @type {Error} */ (e).message;
		}
	}

	function reset() {
		text = regex;
		built = regex;
		error = '';
	}

	// ── Tree drawing ─────────────────────────────────────────────────────────────
	/** @typedef {import('./lib/automata.js').Node} Node */

	/**
	 * @param {ReturnType<typeof directDfa>} d
	 * @param {{ current?: Node | null, phase?: 'tree' | 'follow' | 'dfa', oldEdges?: [number, number][], newEdges?: [number, number][], positions?: Set<number> | null }} o
	 */
	function treeSvg(d, o = {}) {
		const leafX = new Map();
		const pos = new Map();
		const L = d.leaves.length;
		const W = Math.max(340, 40 + L * 50);
		const step = (W - 40) / L;
		d.leaves.forEach((l, k) => leafX.set(l, 20 + step * (k + 0.5)));
		/** @param {Node} n @param {number} depth @returns {number} */
		function place(n, depth) {
			let x;
			if (n.kind === 'leaf') x = leafX.get(n);
			else if (n.kind === 'star') x = place(n.child, depth + 1);
			else x = (place(n.left, depth + 1) + place(n.right, depth + 1)) / 2;
			pos.set(n, { x, depth });
			return x;
		}
		place(d.root, 0);
		const maxDepth = Math.max(...[...pos.values()].map((p) => p.depth));
		const Y = (/** @type {number} */ depth) => 26 + depth * 48;
		// Leaves sit on one baseline so followpos arcs have somewhere to go.
		const leafY = Y(maxDepth);
		const at = (/** @type {Node} */ n) => {
			const p = pos.get(n);
			return { x: p.x, y: n.kind === 'leaf' ? leafY : Y(p.depth) };
		};
		const edges = [...(o.oldEdges ?? []), ...(o.newEdges ?? [])];
		const maxSpan = edges.reduce((m, [i, j]) => Math.max(m, Math.abs(i - j)), 0);
		const H = Math.round(leafY + 40 + (edges.length ? 26 + maxSpan * 9 : 0));

		let out = `<div class="art ftree"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Syntax tree of (${built})#" font-family="'Fira Code', ui-monospace, monospace">`;
		for (const n of d.order) {
			const kids = n.kind === 'leaf' ? [] : n.kind === 'star' ? [n.child] : [n.left, n.right];
			for (const c of kids) {
				const a = at(n);
				const b = at(c);
				out += `<line class="s-line" stroke="#2a2d45" stroke-width="1.5" x1="${a.x}" y1="${a.y + 14}" x2="${b.x}" y2="${b.y - 14}"/>`;
			}
		}
		const xOfPos = (/** @type {number} */ p) => leafX.get(d.leaves[p - 1]);
		/** @param {[number, number]} e @param {boolean} fresh */
		const arc = ([i, j], fresh) => {
			const cls = fresh ? 's-accent' : 's-dim';
			const col = fresh ? '#ffb15f' : '#9f948d';
			const x1 = xOfPos(i);
			const x2 = xOfPos(j);
			const y = leafY + 17;
			if (i === j) {
				return `<path class="${cls}" stroke="${col}" fill="none" stroke-width="${fresh ? 2 : 1.2}" d="M ${x1 - 5} ${y} C ${x1 - 16} ${y + 22}, ${x1 + 16} ${y + 22}, ${x1 + 5} ${y}"/>`;
			}
			const depth = 14 + Math.abs(i - j) * 9;
			const dot = `<circle class="${fresh ? 'f-accent' : 'f-dim'}" fill="${col}" cx="${x2}" cy="${y + 2}" r="3"/>`;
			return `<path class="${cls}" stroke="${col}" fill="none" stroke-width="${fresh ? 2 : 1.2}" d="M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + depth * 2} ${x2} ${y}"/>${dot}`;
		};
		for (const e of o.oldEdges ?? []) out += arc(e, false);
		for (const e of o.newEdges ?? []) out += arc(e, true);

		for (const n of d.order) {
			const { x, y } = at(n);
			const isCur = n === o.current;
			const isOr = n.kind === 'or' && o.phase === 'follow';
			const inState = n.kind === 'leaf' && o.positions?.has(n.pos);
			const stroke = isCur || inState ? 's-accent' : 's-dim';
			const strokeHex = isCur || inState ? '#ffb15f' : '#9f948d';
			const dash = isOr ? ' stroke-dasharray="3 3"' : '';
			const fill = isCur ? 'f-surface' : 'f-bg';
			out += `<circle class="${fill} ${stroke}" fill="#181a2d" stroke="${strokeHex}" stroke-width="${isCur ? 2.6 : 1.4}"${dash} cx="${x}" cy="${y}" r="14"/>`;
			out += `<text class="${isCur ? 'f-accent' : 'f-text'}" fill="${isCur ? '#ffb15f' : '#fff7ed'}" x="${x}" y="${y + 4.5}" font-size="13" font-weight="700" text-anchor="middle">${nodeLabel(n)}</text>`;
			out += `<text class="f-dim" fill="#9f948d" x="${x + 16}" y="${y - 10}" font-size="9">n${d.num.get(n)}</text>`;
			if (n.kind === 'leaf') {
				out += `<text class="${inState ? 'f-accent' : 'f-muted'}" fill="#d8c8b8" x="${x}" y="${y - 19}" font-size="10" text-anchor="middle">${n.pos}</text>`;
			}
			if (isCur && isOr) {
				out += `<text class="f-err" fill="#ff6f73" x="${x}" y="${y + 29}" font-size="10" text-anchor="middle">no followpos</text>`;
			}
		}
		return out + '</svg></div>';
	}

	// ── Steps ────────────────────────────────────────────────────────────────────
	/** @param {ReturnType<typeof directDfa>} d @param {Node} n */
	const name = (d, n) => `n${d.num.get(n)} ${n.kind === 'leaf' ? n.symbol : nodeLabel(n)}`;
	const yes = (/** @type {boolean} */ b) => (b ? 'yes' : 'no');

	let steps = $derived.by(() => {
		const d = result.d;
		if (!d) return [];
		/** @type {any[]} */
		const out = [];

		out.push({
			title: `Augment: (${built})#`,
			tags: [{ label: 'end marker', value: '#', tone: 'accent' }],
			body: `Wrap the expression in brackets and put \`#\` after it: \`(${built})#\`.\n\n\`#\` never matches real input. It marks *"the whole pattern has been matched"*. Later, any DFA state that contains the \`#\` position is an accepting state.`
		});

		out.push({
			title: 'Build the tree, number the leaves',
			tags: [{ label: 'positions', value: `1–${d.leaves.length}` }],
			body: `Every symbol in the expression is a leaf. Number the leaves left to right: these numbers are **positions**. \`#\` gets the last one, ${d.hashPos}.\n\n${treeSvg(d, { phase: 'tree' })}`
		});

		/** @type {{ label: string, value: string, note?: string }[]} */
		let rows = [];
		for (const n of d.order) {
			const me = /** @type {any} */ (d.info.get(n));
			let body = '';
			if (n.kind === 'leaf') {
				body = `A leaf matches exactly one symbol, so it can't match the empty string: **nullable = no**. The only position it can start or end with is its own: **firstpos = lastpos = {${n.pos}}**.`;
			} else if (n.kind === 'star') {
				const c = /** @type {any} */ (d.info.get(n.child));
				body = `\`*\` allows zero repetitions, so it always matches the empty string: **nullable = yes**. It starts and ends wherever its child does: firstpos = ${fmtSet(c.first)}, lastpos = ${fmtSet(c.last)}.`;
			} else if (n.kind === 'or') {
				const l = /** @type {any} */ (d.info.get(n.left));
				const r = /** @type {any} */ (d.info.get(n.right));
				body = `\`|\` matches either side. It's nullable if either side is (${yes(l.nullable)} or ${yes(r.nullable)} → **${yes(me.nullable)}**). It can start with anything either side starts with: ${fmtSet(l.first)} ∪ ${fmtSet(r.first)} = **${fmtSet(me.first)}**. Same for lastpos: **${fmtSet(me.last)}**.`;
			} else {
				const l = /** @type {any} */ (d.info.get(n.left));
				const r = /** @type {any} */ (d.info.get(n.right));
				body =
					`\`·\` is concatenation: left, then right. Nullable only if both are (${yes(l.nullable)} and ${yes(r.nullable)} → **${yes(me.nullable)}**).\n\n` +
					(l.nullable
						? `The left side can match nothing, so the match can also *start* in the right side: firstpos = ${fmtSet(l.first)} ∪ ${fmtSet(r.first)} = **${fmtSet(me.first)}**. `
						: `The left side can't be skipped, so the match starts there: firstpos = **${fmtSet(me.first)}**. `) +
					(r.nullable
						? `The right side can match nothing, so the match can also *end* in the left side: lastpos = **${fmtSet(me.last)}**.`
						: `The right side can't be skipped, so the match ends there: lastpos = **${fmtSet(me.last)}**.`);
			}
			rows = [...rows, { label: name(d, n), value: `F${fmtSet(me.first)} L${fmtSet(me.last)}`, note: `nullable: ${yes(me.nullable)}` }];
			out.push({
				title: `${name(d, n)}: nullable, firstpos, lastpos`,
				body: `${body}\n\n${treeSvg(d, { current: n, phase: 'tree' })}`,
				cellsTitle: 'Computed so far (F = firstpos, L = lastpos)',
				cells: rows
			});
		}

		/** @type {[number, number][]} */
		let seen = [];
		d.followSteps.forEach((s, k) => {
			const n = s.node;
			const me = /** @type {any} */ (d.info.get(n));
			let body = '';
			/** @type {'ok' | 'bad' | undefined} */
			let tone;
			let callout = '';
			if (n.kind === 'or') {
				body = `A \`|\` node picks **one** side. Nothing on the left is ever followed by something on the right — they are alternatives, not a sequence.`;
				callout = '| adds nothing to followpos. Only · (concatenation) and * (star) create edges. Look: no new arcs.';
				tone = 'bad';
			} else if (n.kind === 'star') {
				body = `Star repeats its child, so after the **end** of one repetition can come the **start** of the next. Every position in lastpos ${fmtSet(me.last)} is followed by every position in firstpos ${fmtSet(me.first)}.`;
			} else if (n.kind === 'cat') {
				const l = /** @type {any} */ (d.info.get(n.left));
				const r = /** @type {any} */ (d.info.get(n.right));
				body = `Concatenation puts the right side straight after the left. Every position that can **end** the left side (lastpos ${fmtSet(l.last)}) is followed by every position that can **start** the right side (firstpos ${fmtSet(r.first)}).`;
			}
			const snap = d.followSnapshots[k];
			out.push({
				title: `${name(d, n)}: followpos`,
				tags: [{ label: 'new edges', value: String(s.edges.length), tone: s.edges.length ? 'accent' : 'bad' }],
				body: `${body}\n\n${treeSvg(d, { current: n, phase: 'follow', oldEdges: seen, newEdges: s.edges })}`,
				cellsTitle: 'followpos(position)',
				cells: d.leaves.map((l) => ({ label: `${/** @type {any} */ (l).pos} ${/** @type {any} */ (l).symbol}`, value: fmtSet(/** @type {Set<number>} */ (snap.get(/** @type {any} */ (l).pos))) })),
				callout,
				calloutTone: tone
			});
			seen = [...seen, ...s.edges];
		});

		/** @type {{ label: string, value: string, note?: string }[]} */
		let found = [{ label: 'A', value: fmtSet(d.states[0].set), note: d.states[0].accept ? 'accepting' : 'start' }];
		d.stateSteps.forEach((s) => {
			const st = /** @type {any} */ (d.states.find((x) => x.name === s.state));
			const lines = s.moves.map(
				(m) =>
					`- on \`${m.symbol}\`: positions ${m.via.join(', ')} hold \`${m.symbol}\`. Union of their followpos = ${fmtSet(/** @type {any} */ (d.states.find((x) => x.name === m.to)).set)} → **${m.to}**${m.isNew ? ' (new state)' : ''}`
			);
			for (const m of s.moves) {
				if (m.isNew) {
					const t = /** @type {any} */ (d.states.find((x) => x.name === m.to));
					found = [...found, { label: t.name, value: fmtSet(t.set), note: t.accept ? `accepting — contains # (${d.hashPos})` : '' }];
				}
			}
			out.push({
				title: `State ${s.state} = ${fmtSet(st.set)}`,
				body:
					(s.state === 'A'
						? `The start state is firstpos of the root: every position that can begin a match.\n\n`
						: '') +
					`For each symbol, take the positions in ${s.state} that hold it, and union their followpos sets. That set is where you are after reading the symbol.\n\n${lines.join('\n') || '- no moves: nothing in this state can read another symbol'}\n\n${treeSvg(d, { phase: 'dfa', positions: st.set })}`,
				cellsTitle: 'DFA states found',
				cells: found,
				callout: st.accept ? `${s.state} contains the # position (${d.hashPos}), so it is accepting.` : '',
				calloutTone: 'ok'
			});
		});
		out[out.length - 1].callout =
			`${out[out.length - 1].callout ? out[out.length - 1].callout + ' ' : ''}No unprocessed states left: the DFA has ${d.states.length} states. Test it below.`;
		return out;
	});

	let machine = $derived.by(() => {
		const d = result.d;
		if (!d) return null;
		return layoutDfa({
			states: d.states.map((s) => ({ name: s.name, accept: s.accept, note: `${s.name} = positions ${fmtSet(s.set)}${s.accept ? ' — includes #, so accepting' : ''}.` })),
			transitions: d.transitions
		});
	});
</script>

<div class="compose">
	<form class="widget-controls regex-row" onsubmit={(e) => { e.preventDefault(); build(); }}>
		<label for="{uid}-re">Regular expression</label>
		<input id="{uid}-re" class="w-input" bind:value={text} autocapitalize="off" autocomplete="off" spellcheck="false" />
		<button class="w-btn primary" type="submit">Build</button>
		<button class="w-btn" type="button" onclick={reset}>Reset</button>
	</form>
	{#if error}<p class="w-error" role="alert">{error}</p>{/if}
	{#if result.error}<p class="w-error" role="alert">{result.error}</p>{/if}

	{#if result.d && machine}
		{#key built}
			<Stepper {title} {steps} />
			<StateMachine
				title="The DFA for ({built})#"
				nodes={machine.nodes}
				edges={machine.edges}
				start={result.d.start}
				width={machine.width}
				height={machine.height}
				initialInput={built === '(a|b)*abb' ? 'babb' : ''}
				acceptText="Accepted: the string matches."
				rejectText="Rejected: the string doesn't match."
			/>
		{/key}
	{/if}
</div>

<style>
	.compose { display: grid; gap: 0.75rem; margin: 1.25rem 0; }
	.compose :global(.widget) { margin: 0; }
	.regex-row { align-items: center; }
	.regex-row label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); width: 100%; }
	.regex-row input { flex: 1; min-width: 10rem; font-family: 'Fira Code', monospace; }
	.compose :global(.ftree) { margin: 0.75rem 0 0.25rem; overflow-x: auto; }
	.compose :global(.ftree svg) { max-width: 520px; margin: 0 auto; min-width: 300px; }
</style>
