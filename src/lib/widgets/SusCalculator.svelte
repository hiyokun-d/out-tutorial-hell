<script>
	import MemoryView from './MemoryView.svelte';

	/**
	 * System Usability Scale scorer. Ten 1–5 answers; odd items are positively
	 * worded (score = answer − 1), even items negatively worded (score = 5 − answer).
	 * Raw total 0–40 × 2.5 = a 0–100 score — which is NOT a percentage.
	 * Per-item contributions are a composed <MemoryView>.
	 *
	 * @type {{ title?: string }}
	 */
	let { title = 'Score a SUS form' } = $props();

	const uid = $props.id();

	const ITEMS = [
		'I think that I would like to use this system frequently.',
		'I found the system unnecessarily complex.',
		'I thought the system was easy to use.',
		'I think that I would need the support of a technical person to be able to use this system.',
		'I found the various functions in this system were well integrated.',
		'I thought there was too much inconsistency in this system.',
		'I would imagine that most people would learn to use this system very quickly.',
		'I found the system very cumbersome to use.',
		'I felt very confident using the system.',
		'I needed to learn a lot of things before I could get going with this system.'
	];

	// Sauro & Lewis curved grading scale.
	const BANDS = [
		{ min: 84.1, grade: 'A+' }, { min: 80.8, grade: 'A' }, { min: 78.9, grade: 'A−' },
		{ min: 77.2, grade: 'B+' }, { min: 74.1, grade: 'B' }, { min: 72.6, grade: 'B−' },
		{ min: 71.1, grade: 'C+' }, { min: 65.0, grade: 'C' }, { min: 62.7, grade: 'C−' },
		{ min: 51.7, grade: 'D' }, { min: 0, grade: 'F' }
	];

	/** @type {(number | null)[]} */
	let answers = $state(Array(10).fill(null));
	/** @type {{ label: string, value: string, note?: string }[] | null} */
	let previous = $state(null);

	const positive = (/** @type {number} */ i) => i % 2 === 0; // item 1, 3, 5… (index 0, 2, 4…)
	/** @param {number} i @param {number | null} a */
	const contribution = (i, a) => (a === null ? null : positive(i) ? a - 1 : 5 - a);

	/** @param {(number | null)[]} list */
	const cellsFor = (list) =>
		list.map((a, i) => ({
			label: `Item ${i + 1}`,
			value: a === null ? '—' : String(contribution(i, a)),
			note: positive(i) ? `positive: ${a ?? 'answer'} − 1` : `negative: 5 − ${a ?? 'answer'}`
		}));

	let cells = $derived(cellsFor(answers));
	let answered = $derived(answers.filter((a) => a !== null).length);
	let raw = $derived(answers.reduce((/** @type {number} */ sum, a, i) => sum + (contribution(i, a) ?? 0), 0));
	let complete = $derived(answered === 10);
	let score = $derived(complete ? raw * 2.5 : null);
	let grade = $derived(score === null ? null : (BANDS.find((b) => score >= b.min)?.grade ?? 'F'));
	let straightLined = $derived(complete && answers.every((a) => a === 5));

	/** @param {number} i @param {number} value */
	function answer(i, value) {
		previous = cellsFor(answers);
		answers[i] = value;
	}

	function straightLine() {
		previous = cellsFor(answers);
		answers = Array(10).fill(5);
	}

	function reset() {
		previous = null;
		answers = Array(10).fill(null);
	}
</script>

<section class="widget sus" aria-label={title}>
	<div class="widget-head">
		<p class="widget-title">{title}</p>
		<div class="widget-controls">
			<button class="w-btn" onclick={straightLine}>Straight-line the form (all 5s)</button>
			<button class="w-btn" onclick={reset}>Reset</button>
		</div>
	</div>

	<p class="scale-key">1 = strongly disagree · 5 = strongly agree</p>

	<ol class="items">
		{#each ITEMS as text, i}
			<li class="item" class:pos={positive(i)}>
				<p class="q" id="{uid}-q{i}">
					<span class="num">{i + 1}</span>
					{text}
					<span class="kind">{positive(i) ? 'positive wording' : 'negative wording'}</span>
				</p>
				<div class="likert" role="radiogroup" aria-labelledby="{uid}-q{i}">
					{#each [1, 2, 3, 4, 5] as v}
						<label class="opt" class:on={answers[i] === v}>
							<input type="radio" name="{uid}-q{i}" value={v} checked={answers[i] === v} onchange={() => answer(i, v)} />
							<span>{v}</span>
						</label>
					{/each}
					<span class="contrib" aria-live="polite">
						{#if answers[i] !== null}→ {contribution(i, answers[i])}{/if}
					</span>
				</div>
			</li>
		{/each}
	</ol>

	<p class="cells-title">Each item’s contribution (0–4)</p>
	<MemoryView {cells} {previous} />

	<div class="result" aria-live="polite">
		<p class="line">Raw total: <strong>{raw}</strong> / 40 <span class="dim">({answered} of 10 answered)</span></p>
		{#if complete}
			<p class="line big">SUS score (0–100): <strong>{score}</strong> <span class="grade">grade {grade}</span></p>
		{:else}
			<p class="w-note">Answer all 10 to get a score. The × 2.5 applies to all ten items together or not at all — a partial form has no SUS score.</p>
		{/if}

		<div class="meter" aria-hidden="true">
			<div class="track"></div>
			<span class="avg" style:left="68%"><i></i>68 average</span>
			{#if score !== null}<span class="pointer" style:transform="translateX({score}cqw)"><i></i></span>{/if}
			<div class="ticks"><span>0</span><span>50</span><span>100</span></div>
		</div>

		{#if straightLined}
			<p class="w-note bad">
				All 5s scores {score}, not 100. Agreeing with everything means agreeing that the system is <em>also</em> complex, inconsistent and cumbersome.
				Alternating positive and negative items is how SUS catches people who answer without reading.
			</p>
		{/if}
	</div>
</section>

<style>
	.scale-key { margin: 0.25rem 0 0.75rem; font-size: 0.82rem; color: var(--text-dim); }
	.items { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
	.item { padding: 0.65rem 0.75rem; border: 1px solid var(--border); border-radius: 14px; background: var(--sandbox-bg); border-left: 3px solid var(--error); }
	.item.pos { border-left-color: var(--success); }
	.q { margin: 0 0 0.5rem; color: var(--text); line-height: 1.45; font-size: 0.92rem; }
	.num { font-family: 'Fira Code', monospace; font-weight: 800; color: var(--accent); margin-right: 0.35rem; }
	.kind { display: block; margin-top: 0.15rem; font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }

	.likert { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
	.opt { position: relative; }
	.opt input { position: absolute; opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
	.opt span {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--border);
		border-radius: 12px;
		font-weight: 800;
		color: var(--text-muted);
		background: var(--surface-elevated);
	}
	.opt.on span { border-color: var(--accent); background: var(--accent); color: #160d14; }
	.opt input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 2px; }
	.contrib { font-family: 'Fira Code', monospace; color: var(--accent); min-width: 2.5rem; }

	.cells-title { margin: 1rem 0 0.4rem; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); }

	.result { margin-top: 1rem; }
	.line { margin: 0.3rem 0; color: var(--text-muted); }
	.line strong { font-family: 'Fira Code', monospace; color: var(--text); }
	.big { font-size: 1.1rem; }
	.big strong { font-size: 1.4rem; color: var(--accent); }
	.grade { margin-left: 0.4rem; padding: 0.15rem 0.55rem; border-radius: 999px; background: var(--accent-muted); color: var(--accent); font-weight: 800; font-size: 0.85rem; }
	.dim { color: var(--text-dim); font-size: 0.85rem; }

	.meter { position: relative; margin: 1.6rem 0 0.5rem; height: 2.6rem; container-type: inline-size; }
	.track { position: absolute; left: 0; right: 0; top: 0.9rem; height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--error), var(--warning) 60%, var(--success)); opacity: 0.55; }
	.avg { position: absolute; top: -0.9rem; transform: translateX(-50%); font-size: 0.7rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }
	.avg i { position: absolute; left: 50%; top: 1.1rem; width: 2px; height: 1.6rem; background: var(--text-muted); }
	.pointer { position: absolute; left: 0; top: 0.35rem; width: 0; }
	.pointer i { position: absolute; left: -9px; width: 18px; height: 18px; border-radius: 999px; background: var(--accent); border: 3px solid var(--sandbox-bg); }
	.ticks { position: absolute; left: 0; right: 0; top: 1.75rem; display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); }

	@media (prefers-reduced-motion: no-preference) {
		.pointer { transition: transform var(--dur-teach) var(--ease-move); }
		.opt span { transition: background-color var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast); }
	}
</style>
