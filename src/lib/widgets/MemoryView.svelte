<script>
	/**
	 * Labelled cells or registers whose values change per step.
	 *
	 * Two ways to use it:
	 *  - Composed: pass `cells` (and optionally `previous`) from a parent that owns the step.
	 *  - Standalone widget: pass `frames`; MemoryView renders its own Prev / Next / Reset.
	 *
	 * @typedef {{ label: string, value: string | number, note?: string }} Cell
	 * @typedef {{ caption?: string, cells: Cell[] }} Frame
	 */

	/**
	 * `dir` is the direction of the last move: 'back' plays the value change in reverse,
	 * 'none' (Reset) shows the state without animating.
	 *
	 * @type {{ title?: string, cells?: Cell[], previous?: Cell[] | null, frames?: Frame[], dir?: 'fwd' | 'back' | 'none' }}
	 */
	let { title = '', cells = [], previous = null, frames = [], dir = 'fwd' } = $props();

	let index = $state(0);
	// Standalone mode tracks its own direction.
	let ownDir = $state(/** @type {'fwd' | 'back' | 'none'} */ ('fwd'));

	let standalone = $derived(frames.length > 0);
	let moveDir = $derived(standalone ? ownDir : dir);
	let shown = $derived(standalone ? frames[index].cells : cells);
	// Going back, the frame we came from is the one after this one.
	let before = $derived(
		standalone
			? ownDir === 'none' ? null : ownDir === 'back' ? (frames[index + 1]?.cells ?? null) : index > 0 ? frames[index - 1].cells : null
			: previous
	);
	let caption = $derived(standalone ? (frames[index].caption ?? '') : '');

	/** Previous value of a cell, for the slide-out, or null if it's new. @param {Cell} cell */
	function oldValue(cell) {
		const old = before?.find((c) => c.label === cell.label);
		return old && String(old.value) !== String(cell.value) ? old.value : null;
	}

	/** @param {Cell} cell */
	function changed(cell) {
		if (!before) return false;
		const old = before.find((c) => c.label === cell.label);
		return !old || String(old.value) !== String(cell.value);
	}
</script>

<div class="memory {moveDir}" class:widget={standalone}>
	{#if standalone}
		<div class="widget-head">
			<p class="widget-title">{title || 'Memory'}</p>
			<div class="widget-controls">
				<button class="w-btn" onclick={() => ((ownDir = 'back'), index--)} disabled={index === 0}>Prev</button>
				<button class="w-btn" onclick={() => ((ownDir = 'fwd'), index++)} disabled={index === frames.length - 1}>Next</button>
				<button class="w-btn" onclick={() => ((ownDir = 'none'), (index = 0))}>Reset</button>
			</div>
		</div>
		<p class="position">Step {index + 1} of {frames.length}</p>
	{/if}

	<ul class="cells">
		{#each shown as cell (cell.label)}
			<li class="cell" class:changed={changed(cell)}>
				<span class="label">{cell.label}</span>
				<span class="value-box">
					{#if oldValue(cell) !== null}
						{#key cell.value}<span class="old" aria-hidden="true">{oldValue(cell)}</span>{/key}
					{/if}
					{#key cell.value}<span class="value">{cell.value}</span>{/key}
				</span>
				{#if cell.note}<span class="note">{cell.note}</span>{/if}
				{#if changed(cell)}<span class="w-sr">changed</span>{/if}
			</li>
		{/each}
	</ul>

	{#if caption}
		<p class="w-note" aria-live="polite">{caption}</p>
	{/if}
</div>

<style>
	.position { margin: 0 0 0.5rem; font-size: 0.8rem; color: var(--text-dim); }

	.cells {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
		gap: 0.5rem;
	}

	.cell {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--sandbox-bg);
		min-width: 0;
	}

	.cell.changed {
		border-color: var(--accent);
		background: var(--accent-muted);
	}

	.label {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	.value {
		display: block;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 1rem;
		color: var(--sandbox-text);
		overflow-wrap: anywhere;
	}

	.cell.changed .value { color: var(--accent); }

	.value-box { position: relative; display: block; }
	.old {
		position: absolute;
		inset: 0 auto auto 0;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 1rem;
		color: var(--text-dim);
		text-decoration: line-through;
		opacity: 0;
		pointer-events: none;
	}

	.note { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }

	@media (prefers-reduced-motion: no-preference) {
		/* The old value lifts away as the new one drops in: you see *what* changed. */
		.cell.changed .value { animation: value-in var(--dur-teach) var(--ease-back) var(--dur-fast) both; }
		.old { animation: value-out var(--dur-teach-out) var(--ease-exit) both; }
		/* Back: the same motion reversed — new value drops from above, old sinks away. */
		.back .cell.changed .value { animation-name: value-in-rev; }
		.back .old { animation-name: value-out-rev; }
		.cell { transition: border-color var(--dur-base) var(--ease-enter), background-color var(--dur-base) var(--ease-enter); }
	}

	@keyframes value-in {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: none; }
	}

	@keyframes value-out {
		from { opacity: 1; transform: none; }
		to { opacity: 0; transform: translateY(-12px); }
	}

	@keyframes value-in-rev {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: none; }
	}

	@keyframes value-out-rev {
		from { opacity: 1; transform: none; }
		to { opacity: 0; transform: translateY(12px); }
	}
</style>
