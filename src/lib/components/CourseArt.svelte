<script>
	import { onMount } from 'svelte';
	import { motionState, prefersReducedMotion } from '$lib/utils/motion.js';

	/**
	 * Renders a course asset resolved by getCourseAsset(). SVGs go inline so their
	 * f-* / s-* classes pick up the theme; rasters fall back to <img>.
	 *
	 * SVGs with seq-1…seq-8 groups can explain themselves: `animate` plays the
	 * groups in order when the art scrolls into view, and `replay` adds a button
	 * so the learner can watch the mechanism again.
	 *
	 * @type {{ art: { svg: string | null, url: string | null }, alt?: string, decorative?: boolean, class?: string, animate?: boolean, replay?: boolean }}
	 */
	let { art, alt = '', decorative = false, class: className = '', animate = false, replay = false } = $props();

	let playing = $state(false);
	let primed = $state(false);
	let motionOk = $state(false);
	/** @type {HTMLDivElement | undefined} */
	let el = $state();

	let sequenced = $derived(!!art.svg && art.svg.includes('seq-1'));

	onMount(() => {
		// Read now: the observer callback runs later, after the layout has flipped this flag.
		const navigated = motionState.hydrated;
		motionOk = !prefersReducedMotion();
		if (!animate || !sequenced || !motionOk || !el || !('IntersectionObserver' in window)) return;

		let first = true;
		const io = new IntersectionObserver(
			([entry]) => {
				if (first) {
					first = false;
					if (entry.isIntersecting) {
						io.disconnect();
						// Client-side navigation: nothing painted yet, so play now.
						// Hydration: stay put rather than blink — the Play button covers it.
						if (navigated) playing = true;
						return;
					}
					primed = true;
					return;
				}
				if (entry.isIntersecting) {
					playing = true;
					io.disconnect();
				}
			},
			{ threshold: 0.45 }
		);
		io.observe(el);
		return () => io.disconnect();
	});

	async function play() {
		playing = false;
		// Let the class drop for a frame so the animation restarts.
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		playing = true;
	}
</script>

{#if art.svg}
	<div
		bind:this={el}
		class="art {className}"
		class:play={playing}
		class:primed
		class:has-replay={replay && sequenced && motionOk}
		aria-hidden={decorative || undefined}
	>
		{@html art.svg}
		{#if replay && sequenced && motionOk}
			<button type="button" class="art-replay" onclick={play} aria-label="Play this diagram step by step">
				<span aria-hidden="true">▶</span> {playing ? 'Replay' : 'Play'}
			</button>
		{/if}
	</div>
{:else if art.url}
	<img class="art {className}" src={art.url} alt={decorative ? '' : alt} loading="lazy" />
{/if}

<style>
	.has-replay { position: relative; }

	.art-replay {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		min-height: 44px;
		padding: 0 0.85rem;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-elevated) 88%, transparent);
		color: var(--accent);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 800;
		cursor: pointer;
	}

	.art-replay:hover { border-color: var(--accent); }
	.art-replay:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

	@media (prefers-reduced-motion: no-preference) {
		.primed:not(.play) :global([class*='seq-']) { opacity: 0; }
	}
</style>
