<script>
	import TestList from './TestList.svelte';
	import HintPanel from './HintPanel.svelte';

	/**
	 * @typedef {{ id: number, description: string, passed: boolean | null, detail?: string | null }} TestResult
	 * @type {{ testResults: TestResult[], allPassed: boolean, running: boolean, hints?: string[], onRun: () => void }}
	 */
	let { testResults, allPassed, running, hints = [], onRun } = $props();

	let passed = $derived(testResults.filter((t) => t.passed === true).length);
	let total = $derived(testResults.length);
	let prevAllPassed = false;

	$effect(() => {
		if (allPassed && !prevAllPassed) {
			prevAllPassed = true;
			fireConfetti();
		}
		if (!allPassed) prevAllPassed = false;
	});

	async function fireConfetti() {
		const { default: confetti } = await import('canvas-confetti');
		confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#a78bfa', '#fbbf24'] });
		setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { x: 0.1, y: 0.5 } }), 200);
		setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { x: 0.9, y: 0.5 } }), 350);
	}
</script>

<div class="panel">
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
		{running ? 'Running…' : 'Run Tests'}
	</button>

	{#if allPassed}
		<p class="success">All tests pass! Keep going 🚀</p>
	{/if}

	<HintPanel {hints} />
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	h3 {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0;
		font-weight: 700;
	}

	.progress {
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.15rem 0.45rem;
		border-radius: 999px;
		background: var(--error-muted);
		color: var(--error);
		transition: background 0.2s, color 0.2s;
	}

	.progress.all {
		background: var(--success-muted);
		color: var(--success);
	}

	.run-btn {
		width: 100%;
		padding: 0.55rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}

	.run-btn:hover:not(:disabled) { background: var(--accent-hover); }
	.run-btn:disabled { opacity: 0.55; cursor: not-allowed; }

	.success {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--success);
		margin: 0;
		animation: pop 0.3s ease;
	}

	@keyframes pop {
		from { transform: scale(0.9); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}
</style>
