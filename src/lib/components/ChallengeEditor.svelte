<script>
	import InstructionsPanel from './InstructionsPanel.svelte';
	import CodingPanel from './CodingPanel.svelte';
	import WalkthroughOverlay from './WalkthroughOverlay.svelte';
	import { runCheck, buildDetail, computeTestDiagnostics, runJsCheck, buildJsDetail } from '$lib/checker.js';
	import { DEFAULT_CONFIG } from '$lib/courses.js';
	import { markComplete } from '$lib/utils/progress.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG, courseSlug = '', lessonId = '' } = $props();

	const { challenge } = lesson;

	// ── State ─────────────────────────────────────────────────────────────────
	let code = $state(challenge.starter);

	/**
	 * @typedef {{ id: number, description: string, check: string, passed: boolean|null, actual?: string, detail?: string|null, [k: string]: any }} TestResult
	 */
	/** @type {TestResult[]} */
	let testResults = $state(challenge.tests.map((t) => ({ ...t, passed: null })));
	let allPassed = $derived(testResults.length > 0 && testResults.every((r) => r.passed === true));
	let running = $state(false);

	/** @type {{ setExternalDiags: (d: any[]) => void, setContent: (s: string) => void } | null} */
	let editorApi = $state.raw(null);

	/** @type {{ runCode: (src: string) => Promise<{type:string,text:string}[]> } | null} */
	let consolePaneApi = $state.raw(null);

	// ── Push test diagnostics into editor whenever results change ─────────────
	$effect(() => {
		if (!editorApi) return;
		// Console-mode challenges: errors show in ConsolePane, not as editor squiggles
		if (config.features?.consoleOutput) { editorApi.setExternalDiags([]); return; }
		editorApi.setExternalDiags(computeTestDiagnostics(testResults, code));
	});

	// ── Mark lesson complete when all tests pass ──────────────────────────────
	$effect(() => {
		if (allPassed && courseSlug && lessonId) {
			markComplete(courseSlug, lessonId);
		}
	});

	// ── Walkthrough overlay ───────────────────────────────────────────────────
	let walkthroughOpen = $state(false);
	let hasWalkthrough = $derived(!!(challenge.walkthrough?.steps?.length));

	// ── Panel resize ──────────────────────────────────────────────────────────
	let leftWidth = $state(390);
	let dragging = $state(false);

	/** @param {MouseEvent} e */
	function startResize(e) {
		e.preventDefault();
		dragging = true;
		const startX = e.clientX;
		const startWidth = leftWidth;

		function onMove(e) {
			leftWidth = Math.max(280, Math.min(startWidth + e.clientX - startX, window.innerWidth - 360));
		}
		function onUp() {
			dragging = false;
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
		}
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
	}

	// ── Test runner ───────────────────────────────────────────────────────────

	/**
	 * @param {string} src
	 * @param {boolean} [silent]
	 */
	async function executeTests(src, silent = false) {
		if (!silent) running = true;

		if (config.features?.consoleOutput) {
			if (!consolePaneApi) { if (!silent) running = false; return testResults; }
			const logs = await consolePaneApi.runCode(src);
			testResults = challenge.tests.map((test) => {
				const { passed, actual } = runJsCheck(test, logs, src);
				return { ...test, passed, actual, detail: passed ? null : buildJsDetail(test, actual, logs) };
			});
		} else {
			const doc = new DOMParser().parseFromString(src, 'text/html');
			testResults = challenge.tests.map((test) => {
				const { passed, actual } = runCheck(test, doc, src);
				return { ...test, passed, actual, detail: passed ? null : buildDetail(test, actual, doc, src) };
			});
		}

		if (!silent) running = false;
		return testResults;
	}

	function runTests() {
		executeTests(code, false);
	}

	function handleReset() {
		testResults = challenge.tests.map((t) => ({ ...t, passed: null, actual: undefined, detail: null }));
	}
</script>

<svelte:window on:mouseup={() => (dragging = false)} />

{#if walkthroughOpen}
	<WalkthroughOverlay
		{code}
		language={challenge.language}
		steps={challenge.walkthrough.steps}
		walkthroughStyle={config.features?.walkthroughStyle ?? 'spotlight'}
		onClose={() => (walkthroughOpen = false)}
	/>
{/if}

<div class="layout" class:dragging style="grid-template-columns: {leftWidth}px 4px 1fr">
	<InstructionsPanel
		{lesson}
		{course}
		{prev}
		{next}
		{testResults}
		{allPassed}
		{running}
		onRun={runTests}
		features={config.features}
		{courseSlug}
		{lessonId}
	/>

	<div
		class="resize-handle"
		role="separator"
		aria-orientation="vertical"
		aria-label="Resize panels"
		onmousedown={startResize}
	></div>

	<CodingPanel
		bind:code
		language={challenge.language}
		starter={challenge.starter}
		onReset={handleReset}
		onEditorReady={(api) => (editorApi = api)}
		onConsolePaneReady={(api) => (consolePaneApi = api)}
		features={config.features}
	/>
</div>

{#if allPassed && hasWalkthrough && !walkthroughOpen}
	<div class="wt-trigger">
		<button onclick={() => (walkthroughOpen = true)}>
			Walk through your solution →
		</button>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		height: 100vh;
		overflow: hidden;
	}

	.layout.dragging :global(iframe) {
		pointer-events: none;
	}

	.resize-handle {
		background: #272733;
		cursor: col-resize;
		transition: background 0.15s;
		position: relative;
	}

	.resize-handle:hover,
	.layout.dragging .resize-handle {
		background: #6366f1;
	}

	.resize-handle::before {
		content: '';
		position: absolute;
		inset: 0 -4px;
	}

	.wt-trigger {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 100;
		animation: wtSlideUp 0.3s ease;
	}

	.wt-trigger button {
		padding: 0.65rem 1.25rem;
		background: var(--accent);
		color: #fff;
		border: none;
		border-radius: 10px;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
		transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
	}

	.wt-trigger button:hover {
		background: var(--accent-hover);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(99, 102, 241, 0.55);
	}

	@keyframes wtSlideUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
