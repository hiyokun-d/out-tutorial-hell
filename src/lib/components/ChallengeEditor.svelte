<script>
	import InstructionsPanel from './InstructionsPanel.svelte';
	import CodingPanel from './CodingPanel.svelte';
	import { runCheck, buildDetail, computeTestDiagnostics } from '$lib/checker.js';
	import { DEFAULT_CONFIG } from '$lib/courses.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG } = $props();

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

	// ── Push test diagnostics into editor whenever results change ─────────────
	$effect(() => {
		if (!editorApi) return;
		editorApi.setExternalDiags(computeTestDiagnostics(testResults, code));
	});

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
	function executeTests(src, silent = false) {
		return new Promise((resolve) => {
			if (!silent) running = true;

			const doc = new DOMParser().parseFromString(src, 'text/html');

			testResults = challenge.tests.map((test) => {
				const { passed, actual } = runCheck(test, doc, src);
				return { ...test, passed, actual, detail: passed ? null : buildDetail(test, actual, doc, src) };
			});

			if (!silent) running = false;
			resolve(testResults);
		});
	}

	function runTests() {
		executeTests(code, false);
	}

	function handleReset() {
		testResults = challenge.tests.map((t) => ({ ...t, passed: null, actual: undefined, detail: null }));
	}
</script>

<svelte:window on:mouseup={() => (dragging = false)} />

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
		features={config.features}
	/>
</div>

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
		background: #e5e7eb;
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
</style>
