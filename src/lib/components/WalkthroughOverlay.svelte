<script>
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { animate } from 'animejs';
	import WalkthroughCode from './WalkthroughCode.svelte';
	import { resolveHighlightLines } from '$lib/utils/walkthrough.js';

	/** @type {{ code: string, language?: string, steps: any[], walkthroughStyle?: string, onClose: () => void }} */
	let { code, language = 'html', steps, walkthroughStyle = 'spotlight', onClose } = $props();

	// ── Step state ─────────────────────────────────────────────────────────────
	let currentStep = $state(0);
	/** @type {any} */
	let editorApi = $state(null);

	const step = $derived(steps[currentStep]);
	const isFirst = $derived(currentStep === 0);
	const isLast = $derived(currentStep === steps.length - 1);
	const highlightSpec = $derived(step?.highlight ?? null);
	const resolved = $derived(resolveHighlightLines(highlightSpec, code));

	/** Line indicator label — "L1" or "L3–5" */
	const lineLabel = $derived(
		resolved
			? resolved.fromLine === resolved.toLine
				? `L${resolved.fromLine}`
				: `L${resolved.fromLine}–${resolved.toLine}`
			: null
	);

	// ── Panel position & state ─────────────────────────────────────────────────
	const PANEL_WIDTH = 320;

	let panelX = $state(0);
	let panelY = $state(0);
	let initialized = $state(false);
	let minimized = $state(false);
	let isDragging = $state(false);

	onMount(() => {
		panelX = Math.max(0, window.innerWidth - PANEL_WIDTH - 28);
		panelY = Math.max(80, window.innerHeight - 330);
		initialized = true;
	});

	/** @param {PointerEvent} e */
	function startDrag(e) {
		if (/** @type {Element} */ (e.target)?.closest('button')) return;
		e.preventDefault();
		isDragging = true;

		const startX = e.clientX;
		const startY = e.clientY;
		const startPanelX = panelX;
		const startPanelY = panelY;

		/** @param {PointerEvent} e */
		function onMove(e) {
			const maxX = window.innerWidth - PANEL_WIDTH;
			const maxY = window.innerHeight - 60;
			panelX = Math.max(0, Math.min(startPanelX + e.clientX - startX, maxX));
			panelY = Math.max(0, Math.min(startPanelY + e.clientY - startY, maxY));
		}

		function onUp() {
			isDragging = false;
			document.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerup', onUp);
		}

		document.addEventListener('pointermove', onMove);
		document.addEventListener('pointerup', onUp);
	}

	// ── Navigation ─────────────────────────────────────────────────────────────
	function goNext() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			onClose();
		}
	}

	function goBack() {
		if (currentStep > 0) currentStep--;
	}

	// ── Scroll editor to highlighted line when step changes ───────────────────
	$effect(() => {
		const r = resolved;
		const api = editorApi;
		if (!api || !r) return;
		api.scrollToLine(r.fromLine);
	});

	// ── Dot animation ──────────────────────────────────────────────────────────
	/** @type {HTMLElement | null} */
	let dotsEl = $state(null);
	$effect(() => {
		const n = currentStep;
		if (!dotsEl) return;
		const active = dotsEl.querySelectorAll('.wt-ov-dot')[n];
		if (active) {
			animate(active, { scale: [1, 1.5, 1], duration: 300, easing: 'outElastic(1, 0.5)' });
		}
	});

	// ── Keyboard shortcuts ─────────────────────────────────────────────────────
	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowRight' && !isLast) goNext();
		if (e.key === 'ArrowLeft' && !isFirst) goBack();
		if (e.key === 'm') minimized = !minimized;
	}
</script>

<svelte:window onkeydown={handleKey} />

<div class="overlay" role="dialog" aria-modal="true" aria-label="Code walkthrough" in:fade={{ duration: 180 }} out:fade={{ duration: 150 }}>

	<!-- Top bar: progress + skip -->
	<div class="ov-header">
		<div class="ov-left">
			<div class="ov-dots" bind:this={dotsEl}>
				{#each steps as _, i}
					<span class="wt-ov-dot" class:done={i < currentStep} class:active={i === currentStep}></span>
				{/each}
			</div>
			<span class="ov-label">Walk-through</span>
			<span class="ov-counter">{currentStep + 1} / {steps.length}</span>
		</div>
		<div class="ov-right">
			<span class="ov-hint">← → navigate · M minimize · Esc exit</span>
			<button class="ov-skip" onclick={onClose} aria-label="Exit walkthrough">
				✕ Exit
			</button>
		</div>
	</div>

	<!-- Code area (full height below header) -->
	<div class="ov-code-area">
		<WalkthroughCode
			{code}
			{language}
			{highlightSpec}
			{walkthroughStyle}
			showPreview={false}
			onEditorReady={(api) => (editorApi = api)}
		/>

		<!-- Draggable floating panel -->
		{#if initialized}
			<div
				class="wt-panel"
				class:minimized
				class:is-dragging={isDragging}
				style="left: {panelX}px; top: {panelY}px; width: {PANEL_WIDTH}px"
			>
				<!-- Drag handle header -->
				<div
					class="panel-header"
					role="toolbar"
					tabindex="-1"
					aria-label="Drag to move"
					onpointerdown={startDrag}
				>
					<div class="panel-drag-grip" aria-hidden="true">
						<span></span><span></span>
						<span></span><span></span>
						<span></span><span></span>
					</div>

					<div class="panel-header-text">
						<span class="panel-step-title">{step.title}</span>
						{#if lineLabel}
							<span class="panel-line-badge">{lineLabel}</span>
						{/if}
					</div>

					<div class="panel-controls">
						<button
							class="ctrl-btn"
							onclick={() => (minimized = !minimized)}
							title={minimized ? 'Expand (M)' : 'Minimize (M)'}
							aria-label={minimized ? 'Expand' : 'Minimize'}
						>
							{minimized ? '▢' : '−'}
						</button>
					</div>
				</div>

				<!-- Panel body (collapses when minimized) -->
				{#if !minimized}
					<div class="panel-body" transition:slide={{ duration: 180 }}>
						{#key currentStep}
							<div class="panel-content" in:fade={{ duration: 150 }}>
								<p class="panel-explanation">{step.explanation}</p>

								{#if step.why}
									<div class="panel-why">
										<span class="why-label">Why?</span>
										<span class="why-text">{step.why}</span>
									</div>
								{/if}
							</div>
						{/key}

						<div class="panel-nav">
							<button class="pn-btn back" onclick={goBack} disabled={isFirst} title="← Arrow key">
								← Back
							</button>
							<span class="pn-dots">
								{#each steps as _, i}
									<span class="pn-dot" class:active={i === currentStep}></span>
								{/each}
							</span>
							<button class="pn-btn next" onclick={goNext} title="→ Arrow key">
								{isLast ? 'Done ✓' : 'Next →'}
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* ── Overlay ─────────────────────────────────────────────────────────────── */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: var(--bg);
		display: flex;
		flex-direction: column;
	}

	/* ── Top header bar ────────────────────────────────────────────────────────── */
	.ov-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.55rem 1.25rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
		gap: 1rem;
	}

	.ov-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ov-dots {
		display: flex;
		gap: 0.28rem;
		align-items: center;
	}

	.wt-ov-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--border);
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.wt-ov-dot.done { background: var(--success); }
	.wt-ov-dot.active { background: var(--accent); transform: scale(1.3); }

	.ov-label {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--text-muted);
		letter-spacing: 0.04em;
	}

	.ov-counter {
		font-size: 0.72rem;
		color: var(--text-dim);
		font-weight: 500;
	}

	.ov-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.ov-hint {
		font-size: 0.68rem;
		color: var(--text-dim);
		letter-spacing: 0.02em;
	}

	@media (max-width: 640px) {
		.ov-hint { display: none; }
	}

	.ov-skip {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-muted);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.25rem 0.65rem;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
	}

	.ov-skip:hover {
		color: var(--error);
		border-color: var(--error);
	}

	/* ── Code area ─────────────────────────────────────────────────────────────── */
	.ov-code-area {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.ov-code-area :global(.panel) {
		height: 100%;
	}

	/* ── Draggable panel ────────────────────────────────────────────────────────── */
	.wt-panel {
		position: absolute;
		z-index: 20;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.1);
		overflow: hidden;
		transition: box-shadow 0.15s;
	}

	.wt-panel.is-dragging {
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(99, 102, 241, 0.3);
		opacity: 0.97;
		cursor: grabbing;
	}

	/* ── Panel header (drag handle) ─────────────────────────────────────────────── */
	.panel-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.65rem 0.55rem 0.5rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		cursor: grab;
		user-select: none;
	}

	.panel-header:active {
		cursor: grabbing;
	}

	/* 6-dot grip */
	.panel-drag-grip {
		display: grid;
		grid-template-columns: 3px 3px;
		gap: 2.5px;
		flex-shrink: 0;
		padding: 2px;
		opacity: 0.35;
		transition: opacity 0.15s;
	}

	.panel-header:hover .panel-drag-grip {
		opacity: 0.7;
	}

	.panel-drag-grip span {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--text-muted);
		display: block;
	}

	.panel-header-text {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		min-width: 0;
	}

	.panel-step-title {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.panel-line-badge {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--accent);
		background: var(--accent-muted);
		border-radius: 4px;
		padding: 0.1rem 0.35rem;
		white-space: nowrap;
		flex-shrink: 0;
		font-family: 'Fira Code', monospace;
	}

	.panel-controls {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.ctrl-btn {
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 5px;
		font-size: 0.7rem;
		color: var(--text-muted);
		cursor: pointer;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
		line-height: 1;
	}

	.ctrl-btn:hover {
		background: var(--surface-elevated);
		color: var(--text);
		border-color: var(--accent);
	}

	/* ── Panel body ─────────────────────────────────────────────────────────────── */
	.panel-body {
		display: flex;
		flex-direction: column;
	}

	.panel-content {
		padding: 0.75rem 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.panel-explanation {
		margin: 0;
		font-size: 0.83rem;
		line-height: 1.65;
		color: var(--text-muted);
	}

	.panel-why {
		background: var(--accent-muted);
		border-left: 3px solid var(--accent);
		border-radius: 0 6px 6px 0;
		padding: 0.4rem 0.6rem;
		display: flex;
		gap: 0.4rem;
		align-items: flex-start;
	}

	.why-label {
		font-size: 0.68rem;
		font-weight: 700;
		color: var(--accent);
		white-space: nowrap;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.why-text {
		font-size: 0.78rem;
		color: var(--text);
		line-height: 1.5;
	}

	/* ── Panel navigation ─────────────────────────────────────────────────────── */
	.panel-nav {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.75rem;
		border-top: 1px solid var(--border);
	}

	.pn-btn {
		flex: 1;
		padding: 0.35rem 0.5rem;
		border-radius: 7px;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;
		border: 1px solid var(--border);
	}

	.pn-btn.back {
		background: transparent;
		color: var(--text-muted);
	}

	.pn-btn.back:hover:not(:disabled) {
		border-color: var(--text-muted);
		color: var(--text);
	}

	.pn-btn.back:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}

	.pn-btn.next {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}

	.pn-btn.next:hover {
		background: var(--accent-hover);
	}

	.pn-dots {
		display: flex;
		gap: 4px;
		align-items: center;
		flex-shrink: 0;
	}

	.pn-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--border);
		transition: background 0.2s, transform 0.2s;
	}

	.pn-dot.active {
		background: var(--accent);
		transform: scale(1.3);
	}
</style>
