<script>
	/**
	 * On-screen row of the characters phone keyboards bury. Only shown on small or
	 * touch screens. Buttons don't take focus, so the editor keeps the keyboard open.
	 * @type {{ onInsert: (text: string) => void, onTab: () => void }}
	 */
	let { onInsert, onTab } = $props();

	const SYMBOLS = ['{', '}', '[', ']', '(', ')', '<', '>', ';', ':', '"', "'", '/', '\\', '|', '=', '_', '$', '^', '*'];
</script>

<div class="symbols" role="toolbar" aria-label="Insert symbol">
	<button type="button" class="key tab" onpointerdown={(e) => e.preventDefault()} onclick={onTab}>Tab</button>
	{#each SYMBOLS as sym}
		<button type="button" class="key" aria-label="Insert {sym}" onpointerdown={(e) => e.preventDefault()} onclick={() => onInsert(sym)}>{sym}</button>
	{/each}
</div>

<style>
	.symbols {
		display: none;
		gap: 8px;
		padding: 6px 8px;
		overflow-x: auto;
		flex-shrink: 0;
		background: var(--sandbox-bar-bg);
		border-bottom: 1px solid var(--sandbox-border);
		scrollbar-width: none;
	}

	@media (max-width: 767px), (pointer: coarse) {
		.symbols { display: flex; }
	}

	.key {
		flex: 0 0 auto;
		min-width: 44px;
		min-height: 44px;
		border: 1px solid var(--sandbox-border);
		border-radius: 10px;
		background: var(--sandbox-bg);
		color: var(--sandbox-text);
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 1rem;
		cursor: pointer;
	}

	.key:active { border-color: var(--accent); color: var(--accent); }
	.key:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
	.tab { padding: 0 0.8rem; font-size: 0.85rem; font-weight: 700; }
</style>
