<script>
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { animate } from 'animejs';
	import Breadcrumb from './Breadcrumb.svelte';
	import NotesPanel from './NotesPanel.svelte';

	/** @type {{ lesson: any, course: any, steps: any[], currentStep: number, onNext: () => void, onBack: () => void, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, steps, currentStep, onNext, onBack, courseSlug = '', lessonId = '' } = $props();

	let showNotes = $state(false);
	/** @type {HTMLElement | null} */
	let dotContainer = $state(null);

	const step = $derived(steps[currentStep]);
	const isFirst = $derived(currentStep === 0);
	const isLast = $derived(currentStep === steps.length - 1);

	// Animate active dot when step changes
	$effect(() => {
		const n = currentStep; // track
		if (!dotContainer) return;
		const activeDot = dotContainer.querySelectorAll('.wt-dot')[n];
		if (activeDot) {
			animate(activeDot, { scale: [1, 1.5, 1], duration: 350, easing: 'outElastic(1, 0.5)' });
		}
	});
</script>

<aside class="panel">
	<div class="panel-top">
		<Breadcrumb {course} {lesson} />
		<button class="notes-toggle" onclick={() => (showNotes = !showNotes)}>
			{showNotes ? 'Hide Notes' : 'Notes'}
		</button>
	</div>

	<div class="lesson-meta">
		<h2 class="lesson-title">{lesson.title}</h2>
		{#if lesson.content}
			<p class="lesson-intro">{lesson.content}</p>
		{/if}
	</div>

	<!-- Step progress -->
	<div class="step-progress">
		<div class="dots" bind:this={dotContainer}>
			{#each steps as _, i}
				<span
					class="wt-dot"
					class:done={i < currentStep}
					class:active={i === currentStep}
					aria-hidden="true"
				></span>
			{/each}
		</div>
		<span class="step-counter">Step {currentStep + 1} of {steps.length}</span>
	</div>

	<!-- Step content (keyed so Svelte remounts on step change → fade animates) -->
	{#key currentStep}
		<div class="step-content" in:fade={{ duration: 180 }}>
			<h3 class="step-title">{step.title}</h3>
			<p class="step-explanation">{step.explanation}</p>

			{#if step.why}
				<div class="why-box">
					<span class="why-label">Why?</span>
					<p>{step.why}</p>
				</div>
			{/if}
		</div>
	{/key}

	<!-- Navigation -->
	<div class="nav">
		<button class="nav-btn back" onclick={onBack} disabled={isFirst}>
			← Back
		</button>
		<button class="nav-btn next" onclick={onNext}>
			{isLast ? 'Finish' : 'Next →'}
		</button>
	</div>

	<!-- Notes -->
	{#if showNotes && courseSlug && lessonId}
		<div class="notes-wrap">
			<NotesPanel {courseSlug} {lessonId} />
		</div>
	{/if}
</aside>

<style>
	.panel {
		height: 100%;
		overflow-y: auto;
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		background: var(--surface);
		border-right: 1px solid var(--border);
	}

	.panel-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.notes-toggle {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.2rem 0.6rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-muted);
		cursor: pointer;
		white-space: nowrap;
		transition: border-color 0.15s, color 0.15s;
		flex-shrink: 0;
	}

	.notes-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.lesson-meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.lesson-title {
		font-size: 1.2rem;
		font-weight: 700;
		margin: 0;
		color: var(--text);
		line-height: 1.3;
	}

	.lesson-intro {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.55;
	}

	/* Progress dots */
	.step-progress {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.dots {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}

	.wt-dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--border);
		transition: background 0.2s, transform 0.2s;
	}

	.wt-dot.done {
		background: var(--success);
	}

	.wt-dot.active {
		background: var(--accent);
		transform: scale(1.2);
	}

	.step-counter {
		font-size: 0.72rem;
		color: var(--text-dim);
		font-weight: 500;
	}

	/* Step content */
	.step-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.step-title {
		font-size: 1.45rem;
		font-weight: 800;
		margin: 0;
		color: var(--text);
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.step-explanation {
		font-size: 0.9rem;
		line-height: 1.75;
		color: var(--text-muted);
		margin: 0;
	}

	.why-box {
		background: var(--accent-muted);
		border: 1px solid rgba(99, 102, 241, 0.2);
		border-left: 3px solid var(--accent);
		border-radius: 8px;
		padding: 0.65rem 0.9rem;
		margin-top: 0.25rem;
	}

	.why-label {
		display: block;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--accent);
		margin-bottom: 0.25rem;
	}

	.why-box p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text);
		line-height: 1.55;
	}

	/* Navigation */
	.nav {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		flex-shrink: 0;
	}

	.nav-btn {
		flex: 1;
		padding: 0.55rem 0.75rem;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, opacity 0.15s;
		border: 1px solid var(--border);
	}

	.nav-btn.back {
		background: transparent;
		color: var(--text-muted);
	}

	.nav-btn.back:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--text);
	}

	.nav-btn.back:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.nav-btn.next {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}

	.nav-btn.next:hover {
		background: var(--accent-hover);
		border-color: var(--accent-hover);
	}

	.notes-wrap {
		border-top: 1px solid var(--border);
		padding-top: 1rem;
	}
</style>
