<script>
	import TestList from './TestList.svelte';
	import HintPanel from './HintPanel.svelte';
	import { untrack } from 'svelte';
	import { draw } from 'svelte/transition';
	import { shake, dur, EASE } from '$lib/motion.js';

	/**
	 * @typedef {{ id: number, description: string, passed: boolean | null, detail?: string | null }} TestResult
	 * @type {{ testResults: TestResult[], allPassed: boolean, running: boolean, hints?: string[], onRun: () => void }}
	 */
	let { testResults, allPassed, running, hints = [], onRun } = $props();

	let passed = $derived(testResults.filter((t) => t.passed === true).length);
	let total = $derived(testResults.length);

	/** @type {HTMLDivElement | undefined} */
	let panel = $state();

	// Every run replaces the results array. One that ends with failures shakes the
	// panel once: "not yet". (Reset also replaces it, but with no failures.)
	$effect(() => {
		if (testResults.some((t) => t.passed === false)) untrack(() => shake(panel));
	});
</script>

<div class="panel" class:passed={allPassed} bind:this={panel}>
	<div class="header">
		<h3>Tests</h3>
		<!-- Progress pill: shows passing count even before Run Tests -->
		{#if testResults.some((t) => t.passed !== null)}
			<span class="progress" class:all={allPassed}>
				{passed}/{total}
			</span>
		{/if}
	</div>

	<TestList results={testResults} />

	<button class="run-btn" onclick={onRun} disabled={running}>
		{running ? 'Running...' : 'Run Tests'}
	</button>

	{#if allPassed}
		<p class="success">
			<svg class="check" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<path d="M5 12.5l4.5 4.5L19 7.5" in:draw={{ duration: dur('base'), easing: EASE.enter }} />
			</svg>
			All tests pass. Keep going.
		</p>
	{/if}

	<HintPanel {hints} />
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.95rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: color-mix(in srgb, var(--surface-elevated) 78%, transparent);
		transition: border-color var(--dur-base) var(--ease-enter);
	}

	.panel.passed { border-color: var(--success); }

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	h3 {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0;
		font-weight: 800;
	}

	.progress {
		font-size: 0.7rem;
		font-weight: 800;
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		background: var(--error-muted);
		color: var(--error);
		transition: background var(--dur-base), color var(--dur-base);
	}

	.progress.all {
		background: var(--success-muted);
		color: var(--success);
	}

	.run-btn {
		width: 100%;
		min-height: 42px;
		padding: 0.65rem;
		background: var(--accent);
		color: #160d14;
		border: none;
		border-radius: 18px;
		font-size: 0.88rem;
		font-weight: 800;
		cursor: pointer;
		transition: background var(--dur-fast), transform var(--dur-fast) var(--ease-enter);
	}

	.run-btn:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
	.run-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

	.success {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		text-align: center;
		font-size: 0.86rem;
		font-weight: 800;
		color: var(--success);
		margin: 0;
	}

	.check path { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
</style>


