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
	 * @type {{ title?: string, cells?: Cell[], previous?: Cell[] | null, frames?: Frame[] }}
	 */
	let { title = '', cells = [], previous = null, frames = [] } = $props();

	let index = $state(0);

	let standalone = $derived(frames.length > 0);
	let shown = $derived(standalone ? frames[index].cells : cells);
	let before = $derived(standalone ? (index > 0 ? frames[index - 1].cells : null) : previous);
	let caption = $derived(standalone ? (frames[index].caption ?? '') : '');

	/** @param {Cell} cell */
	function changed(cell) {
		if (!before) return false;
		const old = before.find((c) => c.label === cell.label);
		return !old || String(old.value) !== String(cell.value);
	}
</script>

<div class="memory" class:widget={standalone}>
	{#if standalone}
		<div class="widget-head">
			<p class="widget-title">{title || 'Memory'}</p>
			<div class="widget-controls">
				<button class="w-btn" onclick={() => index--} disabled={index === 0}>Prev</button>
				<button class="w-btn" onclick={() => index++} disabled={index === frames.length - 1}>Next</button>
				<button class="w-btn" onclick={() => (index = 0)}>Reset</button>
			</div>
		</div>
		<p class="position">Step {index + 1} of {frames.length}</p>
	{/if}

	<ul class="cells">
		{#each shown as cell (cell.label)}
			<li class="cell" class:changed={changed(cell)}>
				<span class="label">{cell.label}</span>
				{#key cell.value}
					<span class="value">{cell.value}</span>
				{/key}
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

	.note { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }

	@media (prefers-reduced-motion: no-preference) {
		.cell.changed .value { animation: flash 0.6s ease-out; }
	}

	@keyframes flash {
		from { opacity: 0.2; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
