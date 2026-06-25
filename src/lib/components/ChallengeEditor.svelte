<script>
	import InstructionsPanel from './InstructionsPanel.svelte';
	import CodingPanel from './CodingPanel.svelte';
	import WalkthroughOverlay from './WalkthroughOverlay.svelte';
	import { runCheck, buildDetail, computeTestDiagnostics, runJsCheck, buildJsDetail, runPistonCheck, buildPistonDetail } from '$lib/checker.js';
	import { DEFAULT_CONFIG } from '$lib/courses.js';
	import { markComplete } from '$lib/utils/progress.js';
	import { pistonRun, isPistonLanguage } from '$lib/utils/piston.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG, courseSlug = '', lessonId = '' } = $props();

	const { challenge } = lesson;

	// Effective language: lesson-level overrides course-level, defaults to html
	const language = $derived(challenge.language ?? config.language ?? 'html');
	const usePiston = $derived(isPistonLanguage(language));

	let code = $state(challenge.starter);

	// Piston output state
	let pistonStdout = $state('');
	let pistonStderr = $state('');
	let pistonExitCode = $state(0);
	let pistonRunning = $state(false);
	let pistonError = $state(/** @type {string|null} */ (null));

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

	$effect(() => {
		if (!editorApi) return;
		// Piston / console-mode: no editor squiggles (errors shown in output pane)
		if (usePiston || config.features?.consoleOutput) { editorApi.setExternalDiags([]); return; }
		editorApi.setExternalDiags(computeTestDiagnostics(testResults, code));
	});

	let _prevAllPassed = false;
	$effect(() => {
		if (allPassed && !_prevAllPassed && courseSlug && lessonId) {
			_prevAllPassed = true;
			markComplete(courseSlug, lessonId, lesson.xpReward ?? 10);
		}
		if (!allPassed) _prevAllPassed = false;
	});

	let walkthroughOpen = $state(false);
	let hasWalkthrough = $derived(!!(challenge.walkthrough?.steps?.length));

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

	/**
	 * @param {string} src
	 * @param {boolean} [silent]
	 */
	async function executeTests(src, silent = false) {
		if (!silent) running = true;

		if (usePiston) {
			pistonRunning = true;
			pistonError = null;
			try {
				const stdin = challenge.stdin ?? '';
				const result = await pistonRun(src, language, stdin);
				pistonStdout = result.stdout;
				pistonStderr = result.stderr;
				pistonExitCode = result.exitCode;
				testResults = challenge.tests.map((test) => {
					const { passed, actual } = runPistonCheck(test, result.stdout, result.stderr, src, result.exitCode);
					return { ...test, passed, actual, detail: passed ? null : buildPistonDetail(test, actual, result.stdout, result.stderr) };
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				pistonError = msg;
				testResults = challenge.tests.map((t) => ({ ...t, passed: false, actual: 'run failed', detail: msg }));
			} finally {
				pistonRunning = false;
			}
		} else if (config.features?.consoleOutput) {
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
		{language}
		starter={challenge.starter}
		onReset={handleReset}
		onEditorReady={(api) => (editorApi = api)}
		onConsolePaneReady={(api) => (consolePaneApi = api)}
		features={config.features}
		pistonStdout={pistonStdout}
		pistonStderr={pistonStderr}
		pistonExitCode={pistonExitCode}
		pistonRunning={pistonRunning}
		pistonError={pistonError}
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
		height: clamp(42rem, calc(100dvh - 8.5rem), 50rem);
		min-height: 0;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: color-mix(in srgb, var(--surface) 78%, transparent);
		box-shadow: var(--depth-shadow);
	}

	.layout.dragging :global(iframe) {
		pointer-events: none;
	}

	.resize-handle {
		background: color-mix(in srgb, var(--border) 72%, transparent);
		cursor: col-resize;
		transition: background 0.15s;
		position: relative;
	}

	.resize-handle::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 2px;
		height: 44px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-dim) 42%, transparent);
		transform: translate(-50%, -50%);
	}

	.resize-handle:hover,
	.layout.dragging .resize-handle {
		background: color-mix(in srgb, var(--accent) 34%, transparent);
	}

	.resize-handle:hover::after,
	.layout.dragging .resize-handle::after {
		background: var(--accent-strong);
	}

	.resize-handle::before {
		content: '';
		position: absolute;
		inset: 0 -5px;
	}

	.wt-trigger {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 100;
		animation: wtSlideUp 0.3s ease;
	}

	.wt-trigger button {
		padding: 0.7rem 1rem;
		background: var(--accent);
		color: #160d14;
		border: none;
		border-radius: 18px;
		font-size: 0.86rem;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 0 12px 30px color-mix(in srgb, var(--accent) 28%, transparent);
		transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
	}

	.wt-trigger button:hover {
		background: var(--accent-hover);
		transform: translateY(-2px);
		box-shadow: 0 16px 34px color-mix(in srgb, var(--accent) 36%, transparent);
	}

	@media (max-width: 920px) {
		.layout {
			display: flex;
			flex-direction: column;
			height: auto;
			min-height: 0;
			border-radius: 0;
		}

		.resize-handle { display: none; }
	}

	@keyframes wtSlideUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>


