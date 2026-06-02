<script>
	/** @type {{ language: string, onReset: () => void, onFormat: () => void, formatting?: boolean, showFormat?: boolean }} */
	let { language, onReset, onFormat, formatting = false, showFormat = true } = $props();
</script>

<div class="toolbar">
	<span class="lang">{language.toUpperCase()}</span>

	<div class="actions">
		{#if showFormat}
			<button class="fmt-btn" onclick={onFormat} disabled={formatting} title="Format code (Shift+Alt+F)">
				{formatting ? '…' : '⌥⇧F'}
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
		padding: 0.35rem 0.75rem;
		background: #181825;
		border-bottom: 1px solid #313244;
		flex-shrink: 0;
	}

	.lang {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		color: #cba6f7;
	}

	.actions {
		display: flex;
		gap: 0.4rem;
	}

	button {
		font-size: 0.7rem;
		color: #6c7086;
		background: none;
		border: 1px solid #313244;
		border-radius: 4px;
		padding: 0.15rem 0.5rem;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}

	button:hover:not(:disabled) {
		color: #cdd6f4;
		border-color: #585b70;
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.fmt-btn {
		font-family: 'Apple Color Emoji', sans-serif;
	}
</style>
