// Pure automata logic shared by the compiler widgets. No DOM, no Svelte.
//
//  - parseRegex:   a small regex → syntax tree (symbols, |, *, parentheses)
//  - directDfa:    the followpos (direct) RE → DFA construction, with every
//                  intermediate result recorded so a widget can replay it
//  - minimize:     partition refinement, round by round, plus the equivalent
//                  table-filling marks
//  - layoutDfa:    positions + edges in the shape <StateMachine> takes

/**
 * @typedef {{ kind: 'leaf', symbol: string, pos: number, id: number }
 *   | { kind: 'or' | 'cat', left: Node, right: Node, id: number }
 *   | { kind: 'star', child: Node, id: number }} Node
 */

const SYMBOL = /^[a-z0-9]$/;

/**
 * Parses a regex over lowercase letters and digits. Operators: | * ( ).
 * Concatenation is implicit. Throws an Error with a learner-readable message.
 * @param {string} src
 * @returns {Node}
 */
export function parseRegex(src) {
	const text = src.replace(/\s+/g, '');
	if (!text) throw new Error('Type a regular expression first — for example (a|b)*abb.');
	let i = 0;
	let id = 0;

	/** @returns {Node} */
	function alt() {
		let left = cat();
		while (text[i] === '|') {
			i++;
			if (i >= text.length || text[i] === ')' || text[i] === '|') {
				throw new Error(`Nothing after "|" at character ${i}. Each side of | needs something to match.`);
			}
			left = { kind: 'or', left, right: cat(), id: id++ };
		}
		return left;
	}

	/** @returns {Node} */
	function cat() {
		let left = rep();
		while (i < text.length && text[i] !== '|' && text[i] !== ')') {
			left = { kind: 'cat', left, right: rep(), id: id++ };
		}
		return left;
	}

	/** @returns {Node} */
	function rep() {
		let node = atom();
		while (text[i] === '*') {
			i++;
			node = { kind: 'star', child: node, id: id++ };
		}
		return node;
	}

	/** @returns {Node} */
	function atom() {
		const c = text[i];
		if (c === undefined) throw new Error('The expression ends too early. Is a bracket or a symbol missing?');
		if (c === '(') {
			const open = i + 1;
			i++;
			if (text[i] === ')') throw new Error(`Empty brackets "()" at character ${i}. Put something inside them.`);
			const inner = alt();
			if (text[i] !== ')') throw new Error(`The "(" at character ${open} is never closed. Add a ")".`);
			i++;
			return inner;
		}
		if (c === '*') throw new Error(`"*" at character ${i + 1} has nothing before it to repeat.`);
		if (c === '|') throw new Error(`"|" at character ${i + 1} has nothing before it.`);
		if (c === ')') throw new Error(`The ")" at character ${i + 1} has no matching "(".`);
		if (!SYMBOL.test(c)) {
			throw new Error(`"${c}" at character ${i + 1} isn't supported. Use lowercase letters or digits, plus | * ( ).`);
		}
		i++;
		return { kind: 'leaf', symbol: c, pos: 0, id: id++ };
	}

	const tree = alt();
	if (i < text.length) throw new Error(`The ")" at character ${i + 1} has no matching "(".`);
	return tree;
}

/** @param {Set<number>} s */
export const fmtSet = (s) => `{${[...s].sort((a, b) => a - b).join(',')}}`;

/** @param {Node} n @returns {string} */
export function nodeLabel(n) {
	if (n.kind === 'leaf') return n.symbol;
	return n.kind === 'or' ? '|' : n.kind === 'star' ? '*' : '·';
}

/**
 * The direct construction. Augments r to (r)#, numbers the leaves, computes
 * nullable / firstpos / lastpos bottom-up, applies the followpos rules, then
 * builds DFA states as sets of positions.
 *
 * @param {Node} tree
 */
export function directDfa(tree) {
	/** @type {Node} */
	const hash = { kind: 'leaf', symbol: '#', pos: 0, id: -1 };
	/** @type {Node} */
	const root = { kind: 'cat', left: tree, right: hash, id: -2 };

	// Post-order walk: children before parents, left before right.
	/** @type {Node[]} */
	const order = [];
	/** @type {Node[]} */
	const leaves = [];
	/** @param {Node} n */
	function walk(n) {
		if (n.kind === 'leaf') leaves.push(n);
		else if (n.kind === 'star') walk(n.child);
		else {
			walk(n.left);
			walk(n.right);
		}
		order.push(n);
	}
	walk(root);
	leaves.forEach((l, k) => /** @type {any} */ (l).pos = k + 1);
	// Stable display numbering: n1…nk in the order they are computed.
	/** @type {Map<Node, number>} */
	const num = new Map(order.map((n, k) => [n, k + 1]));

	/** @type {Map<Node, { nullable: boolean, first: Set<number>, last: Set<number> }>} */
	const info = new Map();
	for (const n of order) {
		if (n.kind === 'leaf') {
			info.set(n, { nullable: false, first: new Set([n.pos]), last: new Set([n.pos]) });
		} else if (n.kind === 'star') {
			const c = /** @type {any} */ (info.get(n.child));
			info.set(n, { nullable: true, first: new Set(c.first), last: new Set(c.last) });
		} else {
			const l = /** @type {any} */ (info.get(n.left));
			const r = /** @type {any} */ (info.get(n.right));
			if (n.kind === 'or') {
				info.set(n, {
					nullable: l.nullable || r.nullable,
					first: new Set([...l.first, ...r.first]),
					last: new Set([...l.last, ...r.last])
				});
			} else {
				info.set(n, {
					nullable: l.nullable && r.nullable,
					first: l.nullable ? new Set([...l.first, ...r.first]) : new Set(l.first),
					last: r.nullable ? new Set([...l.last, ...r.last]) : new Set(r.last)
				});
			}
		}
	}

	// followpos: only cat and star add anything. `|` is recorded with no edges.
	/** @type {Map<number, Set<number>>} */
	const follow = new Map(leaves.map((l) => [/** @type {any} */ (l).pos, new Set()]));
	/** @type {{ node: Node, edges: [number, number][] }[]} */
	const followSteps = [];
	for (const n of order) {
		if (n.kind === 'leaf') continue;
		/** @type {[number, number][]} */
		const edges = [];
		if (n.kind === 'cat') {
			const l = /** @type {any} */ (info.get(n.left));
			const r = /** @type {any} */ (info.get(n.right));
			for (const i of l.last) for (const j of r.first) edges.push([i, j]);
		} else if (n.kind === 'star') {
			const me = /** @type {any} */ (info.get(n));
			for (const i of me.last) for (const j of me.first) edges.push([i, j]);
		}
		for (const [i, j] of edges) /** @type {Set<number>} */ (follow.get(i)).add(j);
		followSteps.push({ node: n, edges });
	}
	// Snapshot followpos after each step, for replay.
	/** @type {Map<number, Set<number>>} */
	const running = new Map(leaves.map((l) => [/** @type {any} */ (l).pos, new Set()]));
	const followSnapshots = followSteps.map((s) => {
		for (const [i, j] of s.edges) /** @type {Set<number>} */ (running.get(i)).add(j);
		return new Map([...running].map(([k, v]) => [k, new Set(v)]));
	});

	const symbolAt = new Map(leaves.map((l) => [/** @type {any} */ (l).pos, /** @type {any} */ (l).symbol]));
	const hashPos = /** @type {any} */ (hash).pos;
	const alphabet = [...new Set(leaves.map((l) => /** @type {any} */ (l).symbol).filter((s) => s !== '#'))].sort();

	// Subset-style state construction over positions.
	const startSet = /** @type {any} */ (info.get(root)).first;
	/** @type {{ name: string, set: Set<number>, accept: boolean }[]} */
	const states = [];
	/** @type {{ from: string, to: string, symbol: string }[]} */
	const transitions = [];
	/** @type {{ state: string, moves: { symbol: string, via: number[], to: string, isNew: boolean }[] }[]} */
	const stateSteps = [];
	const key = (/** @type {Set<number>} */ s) => fmtSet(s);
	/** @type {Map<string, string>} */
	const byKey = new Map();
	const nameFor = (/** @type {number} */ k) => String.fromCharCode(65 + k);

	/** @param {Set<number>} set */
	function add(set) {
		const name = nameFor(states.length);
		states.push({ name, set, accept: set.has(hashPos) });
		byKey.set(key(set), name);
		return name;
	}
	add(startSet);
	for (let k = 0; k < states.length; k++) {
		if (states.length > 12) throw new Error('This expression makes more than 12 DFA states — too many to draw here. Try a shorter one.');
		const S = states[k];
		const moves = [];
		for (const a of alphabet) {
			const via = [...S.set].filter((p) => symbolAt.get(p) === a).sort((x, y) => x - y);
			if (!via.length) continue;
			const U = new Set(via.flatMap((p) => [.../** @type {Set<number>} */ (follow.get(p))]));
			if (!U.size) continue;
			const existing = byKey.get(key(U));
			const to = existing ?? add(U);
			transitions.push({ from: S.name, to, symbol: a });
			moves.push({ symbol: a, via, to, isNew: !existing });
		}
		stateSteps.push({ state: S.name, moves });
	}

	return { root, order, num, info, leaves, follow, followSteps, followSnapshots, symbolAt, hashPos, alphabet, states, transitions, stateSteps, start: 'A' };
}

/**
 * Partition refinement (Moore). Round 0 splits accepting from non-accepting;
 * each round splits blocks whose states disagree on which block a symbol leads to.
 *
 * @param {{ states: string[], alphabet: string[], start: string, accept: string[], transitions: { from: string, to: string, symbol: string }[] }} dfa
 */
export function minimize(dfa) {
	const delta = (/** @type {string} */ s, /** @type {string} */ a) =>
		dfa.transitions.find((t) => t.from === s && t.symbol === a)?.to ?? null;
	const acc = new Set(dfa.accept);

	/** @param {string[][]} blocks */
	const blockOf = (blocks) => new Map(blocks.flatMap((b, k) => b.map((s) => [s, k])));
	/** @param {string[][]} blocks */
	const canonical = (blocks) =>
		blocks.filter((b) => b.length).map((b) => [...b].sort()).sort((x, y) => dfa.states.indexOf(x[0]) - dfa.states.indexOf(y[0]));

	/** @type {{ blocks: string[][], splits: { state: string, reason: string }[] }[]} */
	const rounds = [
		{
			blocks: canonical([dfa.states.filter((s) => !acc.has(s)), dfa.states.filter((s) => acc.has(s))]),
			splits: []
		}
	];

	for (;;) {
		const prev = rounds.at(-1)?.blocks ?? [];
		const of = blockOf(prev);
		/** @type {string[][]} */
		const next = [];
		/** @type {{ state: string, reason: string }[]} */
		const splits = [];
		for (const block of prev) {
			/** @type {Map<string, string[]>} */
			const groups = new Map();
			for (const s of block) {
				const sig = dfa.alphabet.map((a) => { const t = delta(s, a); return t === null ? '-' : of.get(t); }).join(',');
				groups.set(sig, [...(groups.get(sig) ?? []), s]);
			}
			const parts = [...groups.values()];
			next.push(...parts);
			if (parts.length > 1) {
				const anchor = parts[0][0];
				for (const part of parts.slice(1)) {
					for (const s of part) {
						const a = dfa.alphabet.find((x) => {
							const t1 = delta(anchor, x);
							const t2 = delta(s, x);
							return (t1 === null ? -1 : of.get(t1)) !== (t2 === null ? -1 : of.get(t2));
						});
						splits.push({
							state: s,
							reason: `on "${a}", ${anchor} goes to ${delta(anchor, /** @type {string} */ (a)) ?? 'nowhere'} but ${s} goes to ${delta(s, /** @type {string} */ (a)) ?? 'nowhere'} — different blocks, so they can't be the same state`
						});
					}
				}
			}
		}
		if (next.length === prev.length) break;
		rounds.push({ blocks: canonical(next), splits });
	}

	// Table filling: a pair is marked in the round that first separates it.
	/** @type {Map<string, number>} */
	const marks = new Map();
	for (let r = 0; r < rounds.length; r++) {
		const of = blockOf(rounds[r].blocks);
		for (let i = 0; i < dfa.states.length; i++)
			for (let j = 0; j < i; j++) {
				const k = `${dfa.states[i]}|${dfa.states[j]}`;
				if (!marks.has(k) && of.get(dfa.states[i]) !== of.get(dfa.states[j])) marks.set(k, r);
			}
	}

	const final = /** @type {string[][]} */ (rounds.at(-1)?.blocks);
	const of = blockOf(final);
	const name = (/** @type {number} */ k) => final[k].join('');
	/** @type {{ from: string, to: string, symbol: string }[]} */
	const transitions = [];
	final.forEach((block, k) => {
		for (const a of dfa.alphabet) {
			const t = delta(block[0], a);
			if (t !== null) transitions.push({ from: name(k), to: name(/** @type {number} */ (of.get(t))), symbol: a });
		}
	});
	const minimal = {
		states: final.map((_, k) => name(k)),
		alphabet: dfa.alphabet,
		start: name(/** @type {number} */ (of.get(dfa.start))),
		accept: final.map((b, k) => (acc.has(b[0]) ? name(k) : null)).filter((x) => x !== null),
		transitions
	};
	return { rounds, marks, minimal };
}

/**
 * Lays states out in a row for <StateMachine>: forward long arrows arc above,
 * backward ones arc below, self-loops sit on top. Parallel arrows between the
 * same two states are merged into one labelled "a,b".
 *
 * @param {{ states: { name: string, accept?: boolean, note?: string, tint?: string }[], transitions: { from: string, to: string, symbol: string }[] }} dfa
 */
export function layoutDfa(dfa) {
	const n = dfa.states.length;
	const gap = 92;
	const width = Math.max(360, 80 + gap * (n - 1));
	const index = new Map(dfa.states.map((s, k) => [s.name, k]));

	/** @type {Map<string, string[]>} */
	const grouped = new Map();
	for (const t of dfa.transitions) {
		const k = `${t.from}>${t.to}`;
		grouped.set(k, [...(grouped.get(k) ?? []), t.symbol]);
	}
	let maxBend = 0;
	/** @type {{ from: string, to: string, symbol: string, bend: number, loop: 'top', label: string }[]} */
	const edges = [];
	for (const [k, symbols] of grouped) {
		const [from, to] = k.split('>');
		const d = /** @type {number} */ (index.get(to)) - /** @type {number} */ (index.get(from));
		const reverse = grouped.has(`${to}>${from}`);
		const bend = d === 0 ? 0 : Math.abs(d) === 1 && !reverse ? 0 : -(18 + 16 * (Math.abs(d) - 1));
		maxBend = Math.max(maxBend, Math.abs(bend));
		const label = symbols.join(',');
		// One edge per symbol so input can follow it; all share the geometry, only the first is labelled.
		symbols.forEach((symbol, j) => {
			edges.push({ from, to, symbol, bend, loop: /** @type {'top'} */ ('top'), label: j === 0 ? label : '' });
		});
	}
	const half = Math.max(70, maxBend / 2 + 40);
	const height = Math.round(half * 2);
	const nodes = dfa.states.map((s, k) => ({
		id: s.name,
		label: s.name,
		x: Math.round(40 + k * ((width - 80) / Math.max(1, n - 1)) + (n === 1 ? (width - 80) / 2 : 0)),
		y: Math.round(half),
		accept: !!s.accept,
		note: s.note,
		tint: s.tint
	}));
	return { nodes, edges, width, height };
}
