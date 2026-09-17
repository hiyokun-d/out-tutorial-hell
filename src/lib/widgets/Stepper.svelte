<script>
	import { marked } from 'marked';
	import MemoryView from './MemoryView.svelte';

	/**
	 * Ordered stages, one panel at a time. Also how cycles are shown: set `wrap`
	 * or give a step a `branches` entry that jumps back — never draw a ring.
	 *
	 * @typedef {{ label: string, value: string, tone?: 'ok' | 'bad' | 'accent' }} Tag
	 * @typedef {{ label: string, to: string }} Branch
	 * @typedef {{
	 *   id?: string, title: string, body?: string, tags?: Tag[],
	 *   cells?: { label: string, value: string | number, note?: string }[], cellsTitle?: string,
	 *   branches?: Branch[], callout?: string, calloutTone?: 'ok' | 'bad',
	 *   next?: string | false
	 * }} Step
	 * `next` overrides where Next goes: a step id to loop back, or false to end there.
	 */

	/**
	 * @type {{ title?: string, steps: Step[], wrap?: boolean }}
	 */
	let { title = 'Step through it', steps, wrap = false } = $props();

	// History instead of a bare index: branches can jump, and Prev should undo the jump.
	let history = $state([0]);

	let index = $derived(history[history.length - 1]);
	let step = $derived(steps[index]);
	let previousStep = $derived(history.length > 1 ? steps[history[history.length - 2]] : null);
	let atEnd = $derived(index === steps.length - 1);
	let nextIndex = $derived(
		step.next === false ? null
		: step.next ? indexOf(step.next)
		: atEnd ? (wrap ? 0 : null)
		: index + 1
	);

	/** @param {string} to */
	function indexOf(to) {
		const byId = steps.findIndex((s) => s.id === to);
		const i = byId !== -1 ? byId : Number(to);
		return Number.isInteger(i) && i >= 0 && i < steps.length ? i : null;
	}

	function next() {
		if (nextIndex !== null) history = [...history, nextIndex];
	}

	function prev() {
		if (history.length > 1) history = history.slice(0, -1);
	}

	/** @param {Branch} branch */
	function jump(branch) {
		const target = indexOf(branch.to);
		if (target !== null) history = [...history, target];
	}

	function reset() {
		history = [0];
	}
</script>

<section class="widget stepper" aria-label={title}>
	<div class="widget-head">
		<p class="widget-title">{title}</p>
		<button class="w-btn" onclick={reset}>Reset</button>
	</div>

	<div class="position">
		<span aria-live="polite">Step {index + 1} of {steps.length}<span class="w-sr">: {step.title}</span></span>
		<span class="dots" aria-hidden="true">
			{#each steps as _, i}
				<span class="dot" class:on={i === index} class:seen={history.includes(i)}></span>
			{/each}
		</span>
	</div>

	{#key index}
	<div class="panel">
		<h3>{step.title}</h3>

		{#if step.tags?.length}
			<ul class="tags">
				{#each step.tags as tag}
					<li class="tag {tag.tone ?? ''}"><span>{tag.label}</span> <strong>{tag.value}</strong></li>
				{/each}
			</ul>
		{/if}

		{#if step.body}
			<div class="body">{@html marked(step.body)}</div>
		{/if}

		{#if step.cells?.length}
			{#if step.cellsTitle}<p class="cells-title">{step.cellsTitle}</p>{/if}
			<MemoryView cells={step.cells} previous={previousStep?.cells ?? null} />
		{/if}

		{#if step.callout}
			<p class="w-note {step.calloutTone ?? ''}">{step.callout}</p>
		{/if}
	</div>
	{/key}

	<div class="widget-controls nav">
		<button class="w-btn" onclick={prev} disabled={history.length === 1}>Prev</button>
		{#each step.branches ?? [] as branch}
			<button class="w-btn" onclick={() => jump(branch)}>{branch.label}</button>
		{/each}
		<button class="w-btn primary" onclick={next} disabled={nextIndex === null}>
			{nextIndex === null ? 'End' : nextIndex < index && !step.next ? 'Back to start' : 'Next'}
		</button>
	</div>
</section>

<style>
	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		font-size: 0.8rem;
		color: var(--text-dim);
	}

	.dots { display: flex; gap: 0.3rem; flex-wrap: wrap; }
	.dot { width: 8px; height: 8px; border-radius: 999px; background: var(--border); }
	.dot.seen { background: color-mix(in srgb, var(--accent) 45%, transparent); }
	.dot.on { background: var(--accent); }

	.panel { margin: 0.75rem 0 1rem; }

	h3 {
		margin: 0 0 0.6rem;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 1.15rem;
		color: var(--text);
		overflow-wrap: anywhere;
	}

	.tags { list-style: none; margin: 0 0 0.6rem; padding: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.tag {
		font-size: 0.8rem;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-muted);
	}
	.tag strong { color: var(--text); }
	.tag.ok { border-color: var(--success); }
	.tag.ok strong { color: var(--success); }
	.tag.bad { border-color: var(--error); }
	.tag.bad strong { color: var(--error); }
	.tag.accent { border-color: var(--accent); }
	.tag.accent strong { color: var(--accent); }

	.body { color: var(--text-muted); line-height: 1.7; }
	.body :global(p) { margin: 0.4rem 0; }
	.body :global(code) { font-family: 'Fira Code', monospace; color: var(--accent); font-size: 0.9em; }
	.body :global(strong) { color: var(--text); }

	.cells-title { margin: 0.75rem 0 0.4rem; font-size: 0.8rem; font-weight: 700; color: var(--text-dim); }

	.nav { justify-content: flex-end; }

	@media (prefers-reduced-motion: no-preference) {
		.panel { animation: enter 0.25s ease-out; }
	}

	@keyframes enter {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
