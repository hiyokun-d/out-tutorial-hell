<script>
	/** @type {{ language: string, onReset: () => void, onFormat: () => void, formatting?: boolean, showFormat?: boolean }} */
	let { language, onReset, onFormat, formatting = false, showFormat = true } = $props();
</script>

<div class="toolbar">
	<span class="lang">{language.toUpperCase()}</span>

	<div class="actions">
		{#if showFormat}
			<button class="fmt-btn" onclick={onFormat} disabled={formatting} title="Format code (Shift+Alt+F)">
				{formatting ? '...' : 'Format'}
			</button>
		{/if}
		<button class="reset-btn" onclick={onReset} title="Restore starter code">Reset</button>
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 46px;
		padding: 0.55rem 0.85rem;
		background: var(--sandbox-bar-bg);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.lang {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		padding: 0 0.55rem;
		border: 1px solid var(--sandbox-border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-elevated) 62%, transparent);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--accent);
	}

	.actions {
		display: flex;
		gap: 0.45rem;
	}

	button {
		min-height: 28px;
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--sandbox-text-muted);
		background: color-mix(in srgb, var(--surface-elevated) 62%, transparent);
		border: 1px solid var(--sandbox-border);
		border-radius: 18px;
		padding: 0.2rem 0.6rem;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s, background 0.15s;
	}

	button:hover:not(:disabled) {
		color: var(--sandbox-text);
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		border-color: color-mix(in srgb, var(--accent) 42%, var(--sandbox-border));
	}

	button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
</style>


