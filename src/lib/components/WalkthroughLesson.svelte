<script>
	import { goto } from '$app/navigation';
	import WalkthroughPanel from './WalkthroughPanel.svelte';
	import WalkthroughCode from './WalkthroughCode.svelte';
	import { markComplete } from '$lib/utils/progress.js';
	import { DEFAULT_CONFIG } from '$lib/courses.js';

	/** @type {{ lesson: any, course: any, prev: any, next: any, config?: any, courseSlug?: string, lessonId?: string }} */
	let { lesson, course, prev, next, config = DEFAULT_CONFIG, courseSlug = '', lessonId = '' } = $props();

	let walkthrough = $derived(lesson.challenge);
	let steps = $derived(walkthrough?.steps ?? []);
	let walkthroughStyle = $derived(config.features?.walkthroughStyle ?? 'spotlight');
	let showPreview = $derived(config.features?.livePreview !== false);

	let currentStep = $state(0);
	let leftWidth = $state(390);
	let dragging = $state(false);

	const currentHighlight = $derived(steps[currentStep]?.highlight ?? null);

	function goNext() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			// Last step — mark complete and navigate to next lesson
			if (courseSlug && lessonId) {
				markComplete(courseSlug, lessonId);
			}
			if (next) {
				goto(`/courses/${course.id}/${next.id}`);
			} else {
				goto(`/courses/${course.id}`);
			}
		}
	}

	function goBack() {
		if (currentStep > 0) currentStep--;
	}

	/** @param {MouseEvent & { currentTarget: HTMLElement }} e */
	function startResize(e) {
		e.preventDefault();
		dragging = true;
		const startX = e.clientX;
		const startWidth = leftWidth;

		/** @param {MouseEvent} e */
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
</script>

<svelte:window on:mouseup={() => (dragging = false)} />

<div class="layout" class:dragging style="grid-template-columns: {leftWidth}px 4px 1fr">
	<WalkthroughPanel
		{lesson}
		{course}
		{steps}
		{currentStep}
		onNext={goNext}
		onBack={goBack}
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

	<WalkthroughCode
		code={walkthrough?.code ?? ''}
		language={walkthrough?.language ?? 'html'}
		highlightSpec={currentHighlight}
		{walkthroughStyle}
		{showPreview}
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
</style>
