// Three ways one CPU core can serve the same burst of requests. Pure data in,
// Timeline-shaped data out. Times are in abstract "units".
//
//  - threads: one thread per request, round-robin. Every switch between
//             threads costs time, and that cost grows with how many threads
//             are competing (more to schedule, colder caches).
//  - loop:    a single thread handles requests one at a time with blocking
//             calls. No switching — but a blocking read stalls everything.
//  - fsm:     a single thread with non-blocking I/O. Each request is a small
//             state machine: start the read, move on, finish when it's back.

const QUANTUM = 0.5;
const IO_TIME = 3;
const SWITCH_PER_THREAD = 0.04;

/** @typedef {{ cpu?: number, io?: number }} Phase */
/** @typedef {{ track: string, from: number, to: number, label: string, tone?: 'ok' | 'bad' | 'accent' | 'dim' }} Span */
/** @typedef {{ track: string, t: number, label: string, tone?: 'ok' | 'bad' | 'accent' | 'dim' }} Ev */

const r2 = (/** @type {number} */ x) => Math.round(x * 100) / 100;

/**
 * @param {number} n  number of requests in the burst
 * @param {boolean} blocking  whether request 2 has to read from disk
 * @returns {Phase[][]}
 */
function workload(n, blocking) {
	return Array.from({ length: n }, (_, k) =>
		blocking && k === 1 ? [{ cpu: 0.5 }, { io: IO_TIME }, { cpu: 0.5 }] : [{ cpu: 1 }]
	);
}

/**
 * @param {number} n
 * @param {boolean} blocking
 */
export function simulate(n, blocking) {
	const work = workload(n, blocking);
	/** @type {Span[]} */
	const spans = [];
	/** @type {Ev[]} */
	const events = [];
	const done = { threads: /** @type {number[]} */ ([]), loop: /** @type {number[]} */ ([]), fsm: /** @type {number[]} */ ([]) };
	let switching = 0;
	let stalled = 0;

	// ── Threads ──
	{
		const cost = r2(SWITCH_PER_THREAD * n);
		const state = work.map((phases) => ({ phases: phases.map((p) => ({ ...p })), wakeAt: 0 }));
		/** @type {number[]} */
		let queue = state.map((_, k) => k);
		let t = 0;
		let last = -1;
		while (state.some((s) => s.phases.length)) {
			// Wake threads whose I/O finished.
			for (let k = 0; k < state.length; k++) {
				if (state[k].wakeAt && state[k].wakeAt <= t + 1e-9) {
					state[k].wakeAt = 0;
					queue.push(k);
					events.push({ track: 'threads', t: r2(t), label: `r${k + 1} data back, thread ready`, tone: 'ok' });
				}
			}
			const k = queue.shift();
			if (k === undefined) {
				const next = Math.min(...state.filter((s) => s.wakeAt).map((s) => s.wakeAt));
				spans.push({ track: 'threads', from: r2(t), to: r2(next), label: 'idle', tone: 'dim' });
				t = next;
				continue;
			}
			if (last !== -1 && last !== k) {
				spans.push({ track: 'threads', from: r2(t), to: r2(t + cost), label: 'switch', tone: 'bad' });
				t += cost;
				switching += cost;
			}
			last = k;
			const phase = state[k].phases[0];
			const slice = Math.min(QUANTUM, /** @type {number} */ (phase.cpu));
			spans.push({ track: 'threads', from: r2(t), to: r2(t + slice), label: `r${k + 1}`, tone: 'accent' });
			t += slice;
			phase.cpu = r2(/** @type {number} */ (phase.cpu) - slice);
			if (phase.cpu <= 0) {
				state[k].phases.shift();
				const io = state[k].phases[0];
				if (io?.io) {
					state[k].phases.shift();
					state[k].wakeAt = t + io.io;
					events.push({ track: 'threads', t: r2(t), label: `r${k + 1} blocks on disk (others keep going)`, tone: 'accent' });
					continue;
				}
				if (!state[k].phases.length) {
					done.threads.push(r2(t));
					events.push({ track: 'threads', t: r2(t), label: `r${k + 1} done`, tone: 'ok' });
					continue;
				}
			}
			queue.push(k);
		}
	}

	// ── Single loop, blocking calls ──
	{
		let t = 0;
		work.forEach((phases, k) => {
			for (const p of phases) {
				if (p.cpu) {
					spans.push({ track: 'loop', from: r2(t), to: r2(t + p.cpu), label: `r${k + 1}`, tone: 'accent' });
					t += p.cpu;
				} else if (p.io) {
					spans.push({ track: 'loop', from: r2(t), to: r2(t + p.io), label: `stalled: r${k + 1} waits on disk`, tone: 'bad' });
					events.push({ track: 'loop', t: r2(t), label: `r${k + 1} blocking read — the whole server stops`, tone: 'bad' });
					t += p.io;
					stalled += p.io;
				}
			}
			done.loop.push(r2(t));
			events.push({ track: 'loop', t: r2(t), label: `r${k + 1} done`, tone: 'ok' });
		});
	}

	// ── Event loop + non-blocking I/O (finite-state machine per request) ──
	{
		let t = 0;
		/** @type {{ k: number, phases: Phase[] }[]} */
		const queue = work.map((phases, k) => ({ k, phases: phases.map((p) => ({ ...p })) }));
		/** @type {{ at: number, item: { k: number, phases: Phase[] } }[]} */
		const pending = [];
		while (queue.length || pending.length) {
			pending.sort((a, b) => a.at - b.at);
			while (pending.length && pending[0].at <= t + 1e-9) {
				const p = /** @type {{ at: number, item: { k: number, phases: Phase[] } }} */ (pending.shift());
				queue.push(p.item);
				events.push({ track: 'fsm', t: r2(p.at), label: `r${p.item.k + 1} data back — queued as an event`, tone: 'ok' });
			}
			const item = queue.shift();
			if (!item) {
				const next = pending[0].at;
				spans.push({ track: 'fsm', from: r2(t), to: r2(next), label: 'idle', tone: 'dim' });
				t = next;
				continue;
			}
			const p = /** @type {Phase} */ (item.phases.shift());
			spans.push({ track: 'fsm', from: r2(t), to: r2(t + /** @type {number} */ (p.cpu)), label: `r${item.k + 1}`, tone: 'accent' });
			t += /** @type {number} */ (p.cpu);
			const io = item.phases[0];
			if (io?.io) {
				item.phases.shift();
				pending.push({ at: t + io.io, item });
				events.push({ track: 'fsm', t: r2(t), label: `r${item.k + 1} starts a read, loop moves on`, tone: 'accent' });
			} else if (item.phases.length) {
				queue.push(item);
			} else {
				done.fsm.push(r2(t));
				events.push({ track: 'fsm', t: r2(t), label: `r${item.k + 1} done`, tone: 'ok' });
			}
		}
	}

	const finish = {
		threads: Math.max(...done.threads),
		loop: Math.max(...done.loop),
		fsm: Math.max(...done.fsm)
	};
	const end = Math.ceil(Math.max(finish.threads, finish.loop, finish.fsm));
	const count = (/** @type {number[]} */ list, /** @type {number} */ t) => list.filter((x) => x <= t + 1e-9).length;
	const stops = Array.from({ length: end + 1 }, (_, t) => {
		const parts = `threads ${count(done.threads, t)}/${n} · loop ${count(done.loop, t)}/${n} · state machine ${count(done.fsm, t)}/${n} done`;
		const loopStuck = spans.some((s) => s.track === 'loop' && s.tone === 'bad' && s.from <= t && s.to > t);
		return {
			t,
			caption: t === 0 ? `A burst of ${n} requests arrives at once. ${parts}.` : loopStuck ? `The single loop is stuck waiting on the disk. ${parts}.` : `${parts}.`,
			tone: loopStuck ? /** @type {'bad'} */ ('bad') : undefined
		};
	});
	return {
		spans,
		events,
		stops,
		end,
		finish: { threads: r2(finish.threads), loop: r2(finish.loop), fsm: r2(finish.fsm) },
		switching: r2(switching),
		stalled: r2(stalled),
		switchCost: r2(SWITCH_PER_THREAD * n)
	};
}
