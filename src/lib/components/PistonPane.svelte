<script>
	import { langLabel } from '$lib/utils/piston.js';

	/** @type {{ language?: string, stdout?: string, stderr?: string, exitCode?: number, running?: boolean, error?: string | null }} */
	let { language = 'code', stdout = '', stderr = '', exitCode = 0, running = false, error = null } = $props();

	let hasRun = $derived(stdout !== '' || stderr !== '' || error !== null);
	let label = $derived(langLabel(language));
</script>

<div class="pane" data-lenis-prevent>
	<div class="bar">
		<span class="label">Output</span>
		{#if running}
			<span class="status running">running {label}…</span>
		{:else if hasRun}
			{#if error}
				<span class="status err">error</span>
			{:else if exitCode !== 0}
				<span class="status err">exit {exitCode}</span>
			{:else}
				<span class="status ok">exit 0</span>
			{/if}
		{/if}
	</div>

	<div class="terminal">
		{#if running}
			<div class="waiting">
				<span class="spinner">⠋</span>
				Running {label}…
			</div>
		{:else if error}
			<div class="line stderr">Error: {error}</div>
		{:else if !hasRun}
			<div class="placeholder">Click "Run Tests" to execute your code</div>
		{:else}
			{#if stdout}
				{#each stdout.split('\n') as line, i (i)}
					<div class="line stdout">{line}</div>
				{/each}
			{/if}
			{#if stderr}
				<div class="sep">— stderr —</div>
				{#each stderr.split('\n') as line, i (i)}
					{#if line}
						<div class="line stderr">{line}</div>
					{/if}
				{/each}
			{/if}
			{#if !stdout && !stderr}
				<div class="placeholder">(no output)</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
		overflow: hidden;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.3rem 0.75rem;
		background: var(--sandbox-bar-bg);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: var(--sandbox-text-muted);
		text-transform: uppercase;
	}

	.status {
		font-size: 0.62rem;
		font-weight: 600;
		padding: 0.1rem 0.45rem;
		border-radius: 999px;
	}

	.status.ok      { background: var(--success-muted); color: var(--success); }
	.status.err     { background: var(--error-muted);  color: var(--error); }
	.status.running { background: var(--accent-muted); color: var(--accent); }

	.terminal {
		flex: 1;
		overflow-y: auto;
		padding: 0.6rem 0.75rem;
		background: var(--sandbox-bg);
		min-height: 0;
	}

	.line {
		font-size: 0.82rem;
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.line.stdout { color: var(--sandbox-text); }
	.line.stderr { color: var(--error); }

	.sep {
		font-size: 0.62rem;
		color: var(--sandbox-text-dim);
		margin: 0.25rem 0;
		letter-spacing: 0.06em;
	}

	.placeholder {
		font-size: 0.78rem;
		color: var(--sandbox-text-dim);
		font-style: italic;
		padding: 0.5rem 0;
	}

	.waiting {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.78rem;
		color: var(--sandbox-text-muted);
		padding: 0.5rem 0;
	}

	.spinner {
		display: inline-block;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
