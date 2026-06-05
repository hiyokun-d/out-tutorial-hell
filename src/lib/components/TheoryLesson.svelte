<script>
	import { marked } from 'marked';
	import Breadcrumb from './Breadcrumb.svelte';
	import LessonNav from './LessonNav.svelte';
	import NotesPanel from './NotesPanel.svelte';
	import CodeEditor from './CodeEditor.svelte';
	import ConsolePane from './ConsolePane.svelte';
	import { DEFAULT_CONFIG } from '$lib/courses.js';
	import {
		instrumentCode, buildTracerSrcdoc,
		classifyStep, explainStep, STEP_COLORS, TRACE_STEP_LIMIT
	} from '$lib/utils/tracer.js';
	import { markComplete, isComplete } from '$lib/utils/progress.js';
	import { browser } from '$app/environment';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG, courseSlug = '', lessonId = '' } = $props();

	const showSandbox = config.features?.theorySandbox === true;

	let sandboxCode = $state('// Try it out!\n');
	let sandboxOpen = $state(false);
	let showNotes = $state(false);
	let completed = $state(false);

	// ── Tracer state ──────────────────────────────────────────────────────────
	let traceMode = $state(false);
	/**
	 * @typedef {{ type: string, line: number, vars?: Record<string,any>, text?: string, stepType?: string, explanation?: string | null }} TraceEvent
	 * @type {TraceEvent[]}
	 */
	let traceEvents = $state([]);
	let traceIndex = $state(0);
	let tracing = $state(false);

	// ── Derived trace values ──────────────────────────────────────────────────

	let currentEvent = $derived(traceEvents[traceIndex] ?? null);
	let isTruncated = $derived(traceEvents.some((e) => e.type === 'truncated'));

	let currentLine = $derived(traceMode && currentEvent ? (currentEvent.line ?? 0) : 0);

	let currentSourceLine = $derived(
		currentLine > 0 ? (sandboxCode.split('\n')[currentLine - 1]?.trim() ?? '') : ''
	);

	let currentVars = $derived(
		traceMode
			? (traceEvents.slice(0, traceIndex + 1).filter((e) => e.type === 'step').at(-1)?.vars ?? {})
			: {}
	);

	let prevVars = $derived(
		traceMode
			? (traceEvents.slice(0, traceIndex).filter((e) => e.type === 'step').at(-1)?.vars ?? {})
			: {}
	);

	let changedVarNames = $derived(
		new Set(
			Object.keys(currentVars).filter(
				(k) => JSON.stringify(currentVars[k]) !== JSON.stringify(prevVars[k])
			)
		)
	);

	let currentLogs = $derived(
		traceMode
			? traceEvents.slice(0, traceIndex + 1).filter(
				(e) => e.type === 'log' || e.type === 'warn' || e.type === 'info' || e.type === 'error'
			)
			: []
	);

	let currentStepType = $derived(currentEvent?.stepType ?? 'expression');
	let currentStepColor = $derived(STEP_COLORS[currentStepType] ?? STEP_COLORS.expression);
	let currentExplanation = $derived(currentEvent?.explanation ?? null);

	/** How many times we have visited the current line so far (1-based iteration count) */
	let currentLineIteration = $derived(() => {
		if (!traceMode || !currentLine) return 1;
		return traceEvents.slice(0, traceIndex + 1).filter(
			(e) => e.type === 'step' && e.line === currentLine
		).length;
	});

	let nextEvent = $derived(traceEvents[traceIndex + 1] ?? null);
	let nextSourceLine = $derived(
		nextEvent && nextEvent.line > 0
			? (sandboxCode.split('\n')[nextEvent.line - 1]?.trim() ?? '')
			: ''
	);

	let spotlight = $derived(
		traceMode && currentLine > 0
			? { fromLine: currentLine, toLine: currentLine, style: 'pulse' }
			: null
	);

	// ── Helpers ───────────────────────────────────────────────────────────────

	/** @param {unknown} v @returns {{ display: string, type: string }} */
	function describeValue(v) {
		if (v === undefined) return { display: 'undefined', type: 'nil' };
		if (v === null)      return { display: 'null',      type: 'nil' };
		if (Array.isArray(v)) return { display: JSON.stringify(v), type: 'array' };
		if (typeof v === 'object') return { display: JSON.stringify(v), type: 'object' };
		if (typeof v === 'string')  return { display: `"${v}"`,  type: 'string' };
		if (typeof v === 'boolean') return { display: String(v), type: 'boolean' };
		if (typeof v === 'number')  return { display: String(v), type: 'number' };
		return { display: String(v), type: 'other' };
	}

	// ── Lifecycle ─────────────────────────────────────────────────────────────

	$effect(() => {
		if (browser && courseSlug && lessonId) {
			completed = isComplete(courseSlug, lessonId);
		}
	});

	// ── Keyboard navigation for step tracer ──────────────────────────────────

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (!traceMode || !sandboxOpen) return;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			if (traceIndex < traceEvents.length - 1) traceIndex++;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (traceIndex > 0) traceIndex--;
		} else if (e.key === 'Escape') {
			exitTrace();
		}
	}

	// ── Actions ───────────────────────────────────────────────────────────────

	function toggleSandbox() {
		sandboxOpen = !sandboxOpen;
		if (sandboxOpen) showNotes = false;
		if (!sandboxOpen) exitTrace();
	}

	function toggleNotes() {
		showNotes = !showNotes;
		if (showNotes) { sandboxOpen = false; exitTrace(); }
	}

	function exitTrace() {
		traceMode = false;
		traceEvents = [];
		traceIndex = 0;
	}

	async function runTracer() {
		if (tracing) return;
		tracing = true;
		exitTrace();

		const instrumented = instrumentCode(sandboxCode);
		const srcdoc = buildTracerSrcdoc(instrumented);

		const rawEvents = await new Promise((resolve) => {
			const iframe = document.createElement('iframe');
			iframe.setAttribute('sandbox', 'allow-scripts');
			iframe.style.display = 'none';
			document.body.appendChild(iframe);

			const timeout = setTimeout(() => {
				window.removeEventListener('message', onMsg);
				iframe.remove();
				resolve([{ type: 'error', line: 0, text: 'Timed out after 3 seconds — check for infinite loops' }]);
			}, 3000);

			/** @param {MessageEvent} e */
			function onMsg(e) {
				if (!e.data?.__traceMsg) return;
				clearTimeout(timeout);
				window.removeEventListener('message', onMsg);
				iframe.remove();
				resolve(e.data.events ?? []);
			}

			window.addEventListener('message', onMsg);
			iframe.srcdoc = srcdoc;
		});

		// Enrich step events with type + explanation (client-side)
		const srcLines = sandboxCode.split('\n');
		/** @type {TraceEvent[]} */
		const enriched = rawEvents.map((/** @type {TraceEvent} */ e, /** @type {number} */ idx) => {
			if (e.type !== 'step') return e;
			const lineText = srcLines[(e.line ?? 1) - 1] ?? '';
			const stepType = classifyStep(lineText);
			const pv = rawEvents.slice(0, idx).filter((/** @type {TraceEvent} */ x) => x.type === 'step').at(-1)?.vars ?? {};
			return { ...e, stepType, explanation: explainStep(lineText, pv, e.vars ?? {}) };
		});

		traceEvents = enriched;
		traceIndex = 0;
		traceMode = true;
		tracing = false;
	}

	function handleMarkRead() {
		if (courseSlug && lessonId) {
			markComplete(courseSlug, lessonId);
			completed = true;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="page" class:has-notes={showNotes} class:has-sandbox={sandboxOpen}>
	<main class:sandbox-active={sandboxOpen}>
		<div class="top-bar">
			<Breadcrumb {course} {lesson} />
			<div class="top-actions">
				{#if showSandbox}
					<button class="action-btn" class:active={sandboxOpen} onclick={toggleSandbox}>
						{sandboxOpen ? 'Close Sandbox' : 'Sandbox'}
					</button>
				{/if}
				<button class="action-btn" class:active={showNotes} onclick={toggleNotes}>
					{showNotes ? 'Hide Notes' : 'Notes'}
				</button>
			</div>
		</div>

		<header>
			<div class="meta">
				<span class="xp-pill">+{lesson.xpReward} XP</span>
				<span class="type-pill">{lesson.type}</span>
			</div>
			<h1>{lesson.title}</h1>
		</header>

		<article class="content">
			{@html marked(lesson.content)}
		</article>

		<div class="lesson-footer">
			{#if !completed}
				<button class="mark-btn" onclick={handleMarkRead}>Mark as Read</button>
			{:else}
				<span class="done-label">Lesson complete</span>
			{/if}
		</div>

		<LessonNav {course} {prev} {next} />
	</main>

	{#if sandboxOpen}
		<aside class="sandbox-panel">
			<!-- Header bar -->
			<div class="panel-bar">
				<span class="panel-label">Sandbox</span>
				{#if !traceMode}
					<button
						class="trace-btn"
						onclick={runTracer}
						disabled={tracing}
						title="Step through your code line by line"
					>
						{tracing ? 'Running…' : '▶ Step Through'}
					</button>
				{:else}
					<div class="trace-header-info">
						<span class="trace-step-badge" style="background:{currentStepColor}22; color:{currentStepColor}; border-color:{currentStepColor}44">
							{currentStepType}
						</span>
						<span class="trace-keyboard-hint">← → to navigate · Esc to exit</span>
					</div>
					<button class="exit-trace-btn" onclick={exitTrace}>✕ Exit</button>
				{/if}
				<button class="close-btn" onclick={() => (sandboxOpen = false)} aria-label="Close sandbox">✕</button>
			</div>

			<!-- Truncation warning (shown above editor when limit hit) -->
			{#if isTruncated}
				<div class="truncation-banner">
					<span class="truncation-icon">⚠</span>
					Loop too large — showing first {TRACE_STEP_LIMIT} steps. Try a smaller range.
				</div>
			{/if}

			<!-- Editor -->
			<div
				class="sandbox-editor"
				style={traceMode ? `--step-color: ${currentStepColor}` : ''}
			>
				<CodeEditor
					bind:value={sandboxCode}
					language="javascript"
					snippets={true}
					readonly={traceMode}
					{spotlight}
				/>
			</div>

			<!-- Lower section -->
			{#if traceMode}
				<div class="sandbox-lower">

					<!-- Explanation card -->
					<div class="explanation-card" style="--step-color: {currentStepColor}; border-left-color: {currentStepColor}">
						<div class="explanation-top">
							<span class="step-type-badge" style="background:{currentStepColor}22; color:{currentStepColor}">
								{currentStepType}
							</span>
							{#if currentLineIteration() > 1}
								<span class="iteration-badge">iteration {currentLineIteration()}</span>
							{/if}
							<span class="step-pos">line {currentLine}</span>
						</div>
						<div class="explanation-main">
							<code class="step-source-line">{currentSourceLine}</code>
							{#if currentExplanation}
								<span class="explanation-arrow">→</span>
								<span class="explanation-text">{currentExplanation}</span>
							{/if}
						</div>
						{#if nextSourceLine}
							<div class="next-preview">
								<span class="next-label">next</span>
								<code class="next-source">{nextSourceLine}</code>
							</div>
						{/if}
					</div>

					<!-- Variable panel -->
					<div class="panel-bar vars-bar">
						<span class="panel-label">Variables</span>
						<span class="panel-hint">state after this step</span>
					</div>
					<div class="var-panel">
						{#each Object.entries(currentVars) as [name, value]}
							{@const desc = describeValue(value)}
							<div class="var-row" class:changed={changedVarNames.has(name)}>
								<span class="var-name">{name}</span>
								<span class="var-equals">=</span>
								<span class="var-value type-{desc.type}">{desc.display}</span>
								<span class="var-type-badge type-badge-{desc.type}">{desc.type}</span>
								{#if changedVarNames.has(name) && prevVars[name] !== undefined}
									<span class="var-prev">← was {describeValue(prevVars[name]).display}</span>
								{/if}
							</div>
						{:else}
							<div class="var-empty">No variables yet</div>
						{/each}
					</div>

					<!-- Console output so far -->
					<div class="panel-bar console-bar">
						<span class="panel-label">Console</span>
						<span class="panel-hint">up to this step</span>
					</div>
					<div class="trace-console">
						{#each currentLogs as log}
							<div class="line {log.type}">{log.text}</div>
						{:else}
							<div class="line-empty">No output yet</div>
						{/each}
					</div>

					<!-- Progress bar -->
					<div class="step-progress-wrap">
						<div
							class="step-progress-fill"
							style="width:{traceEvents.length > 1 ? (traceIndex / (traceEvents.length - 1)) * 100 : 100}%; background:{currentStepColor}"
						></div>
					</div>

					<!-- Step controls -->
					<div class="step-controls">
						<button class="step-btn" disabled={traceIndex === 0} onclick={() => traceIndex--}>
							← Prev
						</button>
						<div class="step-info">
							<span class="step-counter">{traceIndex + 1} <span class="step-sep">/</span> {traceEvents.length}</span>
							{#if isTruncated}
								<span class="truncated-note">limit reached</span>
							{/if}
						</div>
						<button class="step-btn" disabled={traceIndex >= traceEvents.length - 1} onclick={() => traceIndex++}>
							Next →
						</button>
					</div>
				</div>
			{:else}
				<div class="sandbox-lower">
					<div class="panel-bar console-bar">
						<span class="panel-label">Console</span>
						<span class="panel-hint">updates as you type</span>
					</div>
					<div class="console-wrap">
						<ConsolePane code={sandboxCode} />
					</div>
				</div>
			{/if}
		</aside>
	{/if}

	{#if showNotes}
		<aside class="notes-sidebar">
			<div class="notes-inner">
				<NotesPanel {courseSlug} {lessonId} />
			</div>
		</aside>
	{/if}
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 1fr;
		min-height: 100vh;
	}

	@media (min-width: 1080px) {
		.page.has-notes { grid-template-columns: 1fr 300px; }
	}

	.page.has-sandbox {
		grid-template-columns: 1fr 1fr;
		height: 100vh;
		overflow: hidden;
	}

	main {
		max-width: 700px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
		width: 100%;
	}

	main.sandbox-active {
		max-width: none;
		margin: 0;
		height: 100vh;
		overflow-y: auto;
		padding: 2.5rem clamp(1.5rem, 4vw, 3rem);
	}

	.top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }
	.top-actions { display: flex; gap: 0.5rem; }

	.action-btn {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.65rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-muted);
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
		white-space: nowrap;
	}

	.action-btn:hover { border-color: var(--accent); color: var(--accent); }
	.action-btn.active { background: var(--accent-muted); border-color: var(--accent); color: var(--accent); }

	header { margin-bottom: 2rem; }
	.meta { display: flex; gap: 0.5rem; margin-bottom: 0.6rem; }

	.xp-pill, .type-pill { font-size: 0.7rem; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 700; }
	.xp-pill  { background: var(--success-muted); color: var(--success); }
	.type-pill { background: var(--accent-muted); color: var(--accent); }

	h1 { margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); line-height: 1.2; }

	.content { color: var(--text-muted); }
	.content :global(h1) { font-size: 1.65rem; margin: 1.75rem 0 0.75rem; color: var(--text); font-weight: 700; }
	.content :global(h2) { font-size: 1.2rem; margin: 2rem 0 0.6rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; color: var(--text); font-weight: 600; }
	.content :global(h3) { font-size: 1rem; margin: 1.5rem 0 0.4rem; color: var(--text); font-weight: 600; }
	.content :global(p) { line-height: 1.8; margin: 0.85rem 0; color: var(--text-muted); }
	.content :global(code) { background: var(--surface-elevated); border: 1px solid var(--border); padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.875em; font-family: 'Fira Code', 'Cascadia Code', monospace; color: #cba6f7; }
	.content :global(pre) { background: #11111b; color: #cdd6f4; padding: 1.25rem; border-radius: 10px; overflow-x: auto; margin: 1.25rem 0; border: 1px solid var(--border); }
	.content :global(pre code) { background: none; border: none; padding: 0; font-size: 0.9rem; color: #cdd6f4; }
	.content :global(ul), .content :global(ol) { padding-left: 1.5rem; line-height: 1.8; color: var(--text-muted); margin: 0.75rem 0; }
	.content :global(li) { margin: 0.3rem 0; }
	.content :global(table) { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
	.content :global(th), .content :global(td) { border: 1px solid var(--border); padding: 0.5rem 0.75rem; }
	.content :global(th) { background: var(--surface-elevated); font-weight: 600; color: var(--text); }
	.content :global(strong) { color: var(--text); font-weight: 600; }
	.content :global(blockquote) { border-left: 3px solid var(--accent); margin: 1rem 0; padding: 0.5rem 1rem; background: var(--accent-muted); border-radius: 0 6px 6px 0; }
	.content :global(blockquote p) { margin: 0; color: var(--text); }
	.content :global(a) { color: var(--accent); }

	.lesson-footer { margin: 2rem 0 1.5rem; display: flex; align-items: center; }

	.mark-btn { padding: 0.6rem 1.4rem; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
	.mark-btn:hover { background: var(--accent-hover); }
	.done-label { font-size: 0.875rem; font-weight: 600; color: var(--success); }

	/* ── Sandbox panel ──────────────────────────────────────────────────────── */

	.sandbox-panel {
		display: flex;
		flex-direction: column;
		height: 100vh;
		border-left: 1px solid var(--border);
		background: #1e1e2e;
		overflow: hidden;
	}

	.panel-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: #17171f;
		border-bottom: 1px solid #11111b;
		flex-shrink: 0;
	}

	.console-bar { border-top: 2px solid #11111b; }
	.vars-bar    { border-top: 2px solid #11111b; }

	.panel-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; color: #8888a8; }
	.panel-hint  { font-size: 0.62rem; color: #4e4e6a; flex: 1; }

	.trace-btn {
		font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.6rem;
		background: var(--accent-muted); border: 1px solid var(--accent);
		border-radius: 5px; color: var(--accent); cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.trace-btn:hover:not(:disabled) { background: var(--accent); color: #fff; }
	.trace-btn:disabled { opacity: 0.5; cursor: default; }

	.trace-header-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		overflow: hidden;
	}

	.trace-step-badge {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
		border: 1px solid transparent;
		text-transform: uppercase;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background 0.2s, color 0.2s, border-color 0.2s;
	}

	.trace-keyboard-hint {
		font-size: 0.58rem;
		color: #4e4e6a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.exit-trace-btn {
		font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem;
		background: none; border: 1px solid #4e4e6a; border-radius: 5px;
		color: #8888a8; cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
		white-space: nowrap; flex-shrink: 0;
	}
	.exit-trace-btn:hover { border-color: #f38ba8; color: #f38ba8; }

	.close-btn {
		background: none; border: none; color: #4e4e6a; cursor: pointer;
		font-size: 0.75rem; padding: 0.1rem 0.25rem; border-radius: 4px;
		transition: color 0.15s; margin-left: auto; flex-shrink: 0;
	}
	.close-btn:hover { color: #f38ba8; }

	/* Truncation warning */
	.truncation-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: #2c1e14;
		border-bottom: 1px solid #f9e2af44;
		font-size: 0.7rem;
		color: #f9e2af;
		flex-shrink: 0;
	}
	.truncation-icon { font-size: 0.8rem; }

	/* Editor */
	.sandbox-editor { flex: 1; overflow: hidden; min-height: 0; }

	.sandbox-editor :global(.wt-pulse) {
		animation: none;
		background: color-mix(in srgb, var(--step-color, #6366f1) 12%, transparent);
		border-left: 3px solid var(--step-color, #6366f1);
		transition: background 0.2s ease, border-left-color 0.2s ease;
	}

	.sandbox-lower {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 0;
	}

	.console-wrap { flex: 1; overflow: hidden; min-height: 0; }

	/* ── Explanation card ───────────────────────────────────────────────────── */

	.explanation-card {
		background: #13131c;
		border-left: 3px solid var(--accent);
		padding: 0.5rem 0.75rem;
		flex-shrink: 0;
		animation: explainSlide 0.18s ease;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	@keyframes explainSlide {
		from { opacity: 0; transform: translateY(-3px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.explanation-top {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.step-type-badge {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 0.1rem 0.45rem;
		border-radius: 999px;
		text-transform: uppercase;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.iteration-badge {
		font-size: 0.6rem;
		color: #fab387;
		font-family: 'Fira Code', monospace;
		background: #fab38718;
		padding: 0.05rem 0.4rem;
		border-radius: 999px;
	}

	.step-pos {
		font-size: 0.6rem;
		color: #4e4e6a;
		margin-left: auto;
		font-family: 'Fira Code', monospace;
	}

	.explanation-main {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.step-source-line {
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.75rem;
		color: #cdd6f4;
		background: #1e1e2e;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		white-space: nowrap;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.explanation-arrow { color: #6c7086; font-size: 0.7rem; }

	.explanation-text {
		font-size: 0.72rem;
		color: #a6adc8;
		flex: 1;
	}

	.next-preview {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding-top: 0.15rem;
		border-top: 1px solid #1e1e2e;
	}

	.next-label {
		font-size: 0.58rem;
		color: #4e4e6a;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		flex-shrink: 0;
	}

	.next-source {
		font-family: 'Fira Code', monospace;
		font-size: 0.68rem;
		color: #6c7086;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ── Variable panel ─────────────────────────────────────────────────────── */

	.var-panel {
		padding: 0.3rem 0.75rem;
		overflow-y: auto;
		max-height: 100px;
		background: #13131c;
		flex-shrink: 0;
	}

	.var-row {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		padding: 0.1rem 0.2rem;
		border-radius: 4px;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.76rem;
		line-height: 1.5;
	}

	.var-row.changed { animation: varFlash 0.45s ease; }

	@keyframes varFlash {
		0%   { background: rgba(137, 180, 250, 0.2); }
		100% { background: transparent; }
	}

	.var-name   { color: #cba6f7; font-weight: 600; flex-shrink: 0; }
	.var-equals { color: #6c7086; flex-shrink: 0; }

	.var-value { word-break: break-all; }
	.var-value.type-number  { color: #fab387; }
	.var-value.type-string  { color: #a6e3a1; }
	.var-value.type-boolean { color: #89dceb; }
	.var-value.type-array   { color: #cba6f7; }
	.var-value.type-object  { color: #89b4fa; }
	.var-value.type-nil     { color: #6c7086; font-style: italic; }

	.var-type-badge {
		font-size: 0.58rem;
		padding: 0.02rem 0.3rem;
		border-radius: 3px;
		opacity: 0.7;
		flex-shrink: 0;
	}
	.var-type-badge.type-badge-number  { background: #fab38720; color: #fab387; }
	.var-type-badge.type-badge-string  { background: #a6e3a120; color: #a6e3a1; }
	.var-type-badge.type-badge-boolean { background: #89dceb20; color: #89dceb; }
	.var-type-badge.type-badge-array   { background: #cba6f720; color: #cba6f7; }
	.var-type-badge.type-badge-object  { background: #89b4fa20; color: #89b4fa; }
	.var-type-badge.type-badge-nil     { background: #6c708620; color: #6c7086; }

	.var-prev { color: #6c7086; font-size: 0.65rem; font-style: italic; }
	.var-empty { font-size: 0.72rem; color: #4e4e6a; font-style: italic; padding: 0.25rem 0; }

	/* ── Trace console ──────────────────────────────────────────────────────── */

	.trace-console {
		flex: 1;
		overflow-y: auto;
		padding: 0.4rem 0.75rem;
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.78rem;
		line-height: 1.7;
		min-height: 0;
	}

	.line { white-space: pre-wrap; word-break: break-word; }
	.line.log   { color: #cdd6f4; }
	.line.error { color: #f38ba8; }
	.line.warn  { color: #f9e2af; }
	.line.info  { color: #89dceb; }
	.line-empty { font-size: 0.72rem; color: #4e4e6a; font-style: italic; }

	/* ── Progress bar ───────────────────────────────────────────────────────── */

	.step-progress-wrap { height: 3px; background: #11111b; flex-shrink: 0; overflow: hidden; }
	.step-progress-fill { height: 100%; transition: width 0.2s ease, background 0.3s ease; border-radius: 0 2px 2px 0; }

	/* ── Step controls ──────────────────────────────────────────────────────── */

	.step-controls {
		display: flex;
		align-items: center;
		padding: 0.4rem 0.75rem;
		background: #17171f;
		border-top: 1px solid #11111b;
		flex-shrink: 0;
		gap: 0.5rem;
	}

	.step-btn {
		font-size: 0.72rem; font-weight: 600;
		padding: 0.25rem 0.75rem;
		background: var(--surface); border: 1px solid var(--border);
		border-radius: 6px; color: var(--text-muted); cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
		white-space: nowrap;
	}
	.step-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
	.step-btn:disabled { opacity: 0.35; cursor: default; }

	.step-info { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.1rem; }
	.step-counter { font-size: 0.68rem; color: #6c7086; font-family: 'Fira Code', monospace; }
	.step-sep { color: #4e4e6a; margin: 0 0.1rem; }
	.truncated-note { font-size: 0.58rem; color: #f9e2af; }

	/* ── Notes panel ────────────────────────────────────────────────────────── */

	.notes-sidebar { border-left: 1px solid var(--border); background: var(--surface); }
	.notes-inner { padding: 2.5rem 1.25rem; position: sticky; top: 0; }
</style>
