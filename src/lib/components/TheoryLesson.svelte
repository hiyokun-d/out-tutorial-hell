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
	import TracerStep from './TracerStep.svelte';
	import TracerVars from './TracerVars.svelte';
	import PistonPane from './PistonPane.svelte';
	import { isPistonLanguage, pistonRun, langLabel } from '$lib/utils/piston.js';
	import { buildPythonTracerCode, parsePythonTrace } from '$lib/utils/python-tracer.js';
	import { markComplete, isComplete } from '$lib/utils/progress.js';
	import { browser } from '$app/environment';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG, courseSlug = '', lessonId = '' } = $props();

	const showSandbox = config.features?.theorySandbox === true;
	const sandboxLang = config.language ?? 'javascript';
	const sandboxIsPiston = isPistonLanguage(sandboxLang);
	const sandboxIsPythonTraceable = sandboxLang === 'python' || sandboxLang === 'python3';

	const SANDBOX_STARTERS = /** @type {Record<string,string>} */ ({
		c:       '#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}\n',
		cpp:     '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}\n',
		'c++':   '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}\n',
		python:  'x = 5\ny = 3\n\ntotal = x + y\nprint("Total:", total)\n\nfor i in range(1, 4):\n    total += i\n    print(f"Step {i}: total = {total}")\n',
		python3: 'x = 5\ny = 3\n\ntotal = x + y\nprint("Total:", total)\n\nfor i in range(1, 4):\n    total += i\n    print(f"Step {i}: total = {total}")\n',
		rust:    'fn main() {\n    // Write your Rust code here\n}\n',
		go:      'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your Go code here\n    fmt.Println("Hello!")\n}\n',
		java:    'public class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}\n',
	});

	let sandboxCode = $state(SANDBOX_STARTERS[sandboxLang] ?? '// Try it out!\n');
	let sandboxOpen = $state(false);
	let showNotes = $state(false);
	let completed = $state(false);

	let sandboxPistonStdout = $state('');
	let sandboxPistonStderr = $state('');
	let sandboxPistonExitCode = $state(0);
	let sandboxPistonRunning = $state(false);
	let sandboxPistonError = $state(/** @type {string|null} */ (null));

	let traceMode = $state(false);
	/**
	 * @typedef {{ type: string, line: number, vars?: Record<string,any>, text?: string, stepType?: string, explanation?: string | null }} TraceEvent
	 * @type {TraceEvent[]}
	 */
	let traceEvents = $state([]);
	let traceIndex = $state(0);
	let tracing = $state(false);

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

	$effect(() => {
		if (browser && courseSlug && lessonId) {
			completed = isComplete(courseSlug, lessonId);
		}
	});

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
				resolve([{ type: 'error', line: 0, text: 'Timed out after 3 seconds” check for infinite loops' }]);
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
			markComplete(courseSlug, lessonId, lesson.xpReward ?? 10);
			completed = true;
		}
	}

	async function runSandbox() {
		if (sandboxPistonRunning) return;
		sandboxPistonRunning = true;
		sandboxPistonError = null;
		try {
			const result = await pistonRun(sandboxCode, sandboxLang);
			sandboxPistonStdout = result.stdout;
			sandboxPistonStderr = result.stderr;
			sandboxPistonExitCode = result.exitCode;
		} catch (err) {
			sandboxPistonError = err instanceof Error ? err.message : String(err);
		} finally {
			sandboxPistonRunning = false;
		}
	}

	async function runPythonTracer() {
		if (tracing) return;
		tracing = true;
		exitTrace();

		try {
			const instrumented = buildPythonTracerCode(sandboxCode);
			const result = await pistonRun(instrumented, 'python');
			const rawEvents = parsePythonTrace(result.stderr);

			if (rawEvents.length === 0) {
				const errText = result.stderr.replace('__TRACE__', '').trim() || result.stdout.trim() || 'No trace events” check for syntax errors.';
				traceEvents = [{ type: 'error', line: 0, text: errText }];
			} else {
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
			}

			traceIndex = 0;
			traceMode = true;
		} catch (err) {
			traceEvents = [{ type: 'error', line: 0, text: err instanceof Error ? err.message : String(err) }];
			traceIndex = 0;
			traceMode = true;
		} finally {
			tracing = false;
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
				{#if sandboxIsPiston && !sandboxIsPythonTraceable}
					<span class="lang-badge">{langLabel(sandboxLang)}</span>
					<button class="trace-btn" onclick={runSandbox} disabled={sandboxPistonRunning}>
						{sandboxPistonRunning ? 'Running' : 'Run'}
					</button>
				{:else if !traceMode}
					{#if sandboxIsPythonTraceable}
						<span class="lang-badge">{langLabel(sandboxLang)}</span>
					{/if}
					<button
						class="trace-btn"
						onclick={sandboxIsPythonTraceable ? runPythonTracer : runTracer}
						disabled={tracing}
						title="Step through your code line by line"
					>
						{tracing ? 'Running' : 'Step Through'}
					</button>
				{:else}
					<div class="trace-header-info">
						<span class="trace-step-badge" style="background:{currentStepColor}22; color:{currentStepColor}; border-color:{currentStepColor}44">
							{currentStepType}
						</span>
						<span class="trace-keyboard-hint"> to navigate· Esc to exit</span>
					</div>
					<button class="exit-trace-btn" onclick={exitTrace}>✖ Exit</button>
				{/if}
				<button class="close-btn" onclick={() => (sandboxOpen = false)} aria-label="Close sandbox">✖</button>
			</div>

			<!-- Truncation warning (shown above editor when limit hit) -->
			{#if isTruncated}
				<div class="truncation-banner">
					<span class="truncation-icon">⚠️</span>
					Loop too large” showing first {TRACE_STEP_LIMIT} steps. Try a smaller range.
				</div>
			{/if}

			<!-- Editor -->
			<div
				class="sandbox-editor"
				style={traceMode ? `--step-color: ${currentStepColor}` : ''}
			>
				<CodeEditor
					bind:value={sandboxCode}
					language={sandboxLang}
					snippets={true}
					readonly={traceMode}
					spotlight={sandboxIsPiston && !sandboxIsPythonTraceable ? null : spotlight}
				/>
			</div>

			<!-- Lower section -->
			{#if traceMode}
				<div class="sandbox-lower">

					<!-- Explanation card -->
					<TracerStep
						{traceIndex}
						stepType={currentStepType}
						stepColor={currentStepColor}
						sourceLine={currentSourceLine}
						explanation={currentExplanation}
						nextSourceLine={nextSourceLine}
						lineIteration={currentLineIteration()}
						currentLine={currentLine}
					/>

					<!-- Variable panel -->
					<div class="panel-bar vars-bar">
						<span class="panel-label">Variables</span>
						<span class="panel-hint">state after this step</span>
					</div>
					<TracerVars vars={currentVars} prevVars={prevVars} changedNames={changedVarNames} />

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
			{:else if sandboxIsPiston && !sandboxIsPythonTraceable}
				<div class="sandbox-lower piston-lower">
					<PistonPane
						language={sandboxLang}
						stdout={sandboxPistonStdout}
						stderr={sandboxPistonStderr}
						exitCode={sandboxPistonExitCode}
						running={sandboxPistonRunning}
						error={sandboxPistonError}
					/>
				</div>
			{:else if sandboxIsPythonTraceable}
				<div class="sandbox-lower">
					<div class="trace-prompt">
						<span class="trace-prompt-icon">▶</span>
						Press <strong>Step Through</strong> to trace your code line by line
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
		flex: 1;
		max-width: 840px;
		background: var(--surface);
		border-radius: 24px;
		box-shadow: var(--depth-shadow);
		border: 1px solid var(--border);
		padding: 3rem;
		margin: 0 auto;
	}

	main.sandbox-active {
		max-width: none;
		margin: 0;
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
	.content :global(code) { background: var(--surface-elevated); border: 1px solid var(--border); padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.875em; font-family: 'Fira Code', 'Cascadia Code', monospace; color: var(--accent); }
	.content :global(pre) { background: var(--sandbox-bg); color: var(--sandbox-text); padding: 1.25rem; border-radius: 20px; overflow-x: auto; margin: 1.25rem 0; border: 1px solid var(--sandbox-border); }
	.content :global(pre code) { background: none; border: none; padding: 0; font-size: 0.9rem; color: var(--sandbox-text); }
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

	.mark-btn { padding: 0.6rem 1.4rem; background: var(--accent); color: #160d14; border: none; border-radius: 18px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
	.mark-btn:hover { background: var(--accent-hover); }
	.done-label { font-size: 0.875rem; font-weight: 600; color: var(--success); }

	.sandbox-panel {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 4rem);
		border: 1px solid var(--sandbox-border);
		border-radius: 24px;
		background: var(--sandbox-bg);
		overflow: hidden;
		flex: 1;
		max-width: 600px;
		box-shadow: var(--depth-shadow);
	}

	.panel-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: var(--sandbox-bar-bg);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.console-bar { border-top: 1px solid var(--sandbox-border); }
	.vars-bar    { border-top: 1px solid var(--sandbox-border); }

	.panel-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; color: var(--sandbox-text-muted); }
	.panel-hint  { font-size: 0.62rem; color: var(--sandbox-text-dim); flex: 1; }
	.lang-badge  { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.05em; color: var(--accent); text-transform: uppercase; flex: 1; }
	.piston-lower { flex: 1; overflow: hidden; min-height: 0; display: flex; flex-direction: column; }

	.trace-btn {
		font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.6rem;
		background: var(--accent-muted); border: 1px solid var(--accent);
		border-radius: 5px; color: var(--accent); cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.trace-btn:hover:not(:disabled) { background: var(--accent); color: #160d14; }
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
		color: var(--sandbox-text-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.exit-trace-btn {
		font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem;
		background: none; border: 1px solid var(--sandbox-border); border-radius: 5px;
		color: var(--sandbox-text-muted); cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
		white-space: nowrap; flex-shrink: 0;
	}
	.exit-trace-btn:hover { border-color: var(--error); color: var(--error); }

	.close-btn {
		background: none; border: none; color: var(--sandbox-text-dim); cursor: pointer;
		font-size: 0.75rem; padding: 0.1rem 0.25rem; border-radius: 4px;
		transition: color 0.15s; margin-left: auto; flex-shrink: 0;
	}
	.close-btn:hover { color: var(--error); }

	/* Truncation warning */
	.truncation-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: var(--warning-muted);
		border-bottom: 1px solid var(--warning);
		font-size: 0.7rem;
		color: var(--warning);
		flex-shrink: 0;
	}
	.truncation-icon { font-size: 0.8rem; }

	/* Editor */
	.sandbox-editor { flex: 1; overflow: hidden; min-height: 0; }

	.sandbox-editor :global(.wt-pulse) {
		animation: none;
		background: color-mix(in srgb, var(--step-color, var(--accent)) 12%, transparent);
		border-left: 3px solid var(--step-color, var(--accent));
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
	.line.log   { color: var(--sandbox-text); }
	.line.error { color: var(--error); }
	.line.warn  { color: var(--warning); }
	.line.info  { color: var(--accent); }
	.line-empty { font-size: 0.72rem; color: var(--sandbox-text-dim); font-style: italic; }

	.step-progress-wrap { height: 3px; background: var(--sandbox-bar-bg); flex-shrink: 0; overflow: hidden; position: relative; }
	.step-progress-fill {
		height: 100%;
		transition: width 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), background 0.3s ease;
		border-radius: 0 2px 2px 0;
		position: relative;
	}
	.step-progress-fill::after {
		content: '';
		position: absolute;
		right: 0; top: 0; bottom: 0;
		width: 20px;
		background: linear-gradient(to right, transparent, rgba(255,255,255,0.3));
		border-radius: 0 2px 2px 0;
	}

	.step-controls {
		display: flex;
		align-items: center;
		padding: 0.4rem 0.75rem;
		background: var(--sandbox-bar-bg);
		border-top: 1px solid var(--sandbox-border);
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
	.step-counter { font-size: 0.68rem; color: var(--sandbox-text-muted); font-family: 'Fira Code', monospace; }
	.step-sep { color: var(--sandbox-text-dim); margin: 0 0.1rem; }
	.truncated-note { font-size: 0.58rem; color: var(--warning); }

	.trace-prompt {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--sandbox-text-dim);
		padding: 1.5rem;
		text-align: center;
	}
	.trace-prompt strong { color: var(--sandbox-text-muted); font-weight: 600; }
	.trace-prompt-icon { font-size: 1rem; color: var(--accent); opacity: 0.6; }

	.notes-sidebar { border-left: 1px solid var(--border); background: var(--surface); }
	.notes-inner { padding: 2.5rem 1.25rem; position: sticky; top: 0; }
</style>


