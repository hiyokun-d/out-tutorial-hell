<script>
	import { onMount } from 'svelte';
	import { motionState, reducedMotion } from '$lib/motion.js';

	/**
	 * Renders a course asset resolved by getCourseAsset(). SVGs go inline so their
	 * f-* / s-* classes pick up the theme; rasters fall back to <img>.
	 *
	 * SVGs with seq-1…seq-8 groups can explain themselves: `animate` plays the
	 * groups in order when the art mounts after client-side navigation, and
	 * `replay` adds a button so the learner can watch the mechanism again.
	 * Nothing is tied to scrolling.
	 *
	 * `vtName` gives the art a view-transition-name, so it can morph between pages.
	 *
	 * @type {{ art: { svg: string | null, url: string | null }, alt?: string, decorative?: boolean, class?: string, animate?: boolean, replay?: boolean, vtName?: string }}
	 */
	let { art, alt = '', decorative = false, class: className = '', animate = false, replay = false, vtName = '' } = $props();

	let playing = $state(false);
	let motionOk = $derived(!reducedMotion.current);

	let sequenced = $derived(!!art.svg && art.svg.includes('seq-1'));

	onMount(() => {
		// Hydration: the art is already painted; hiding it to animate would blink.
		// During a route transition the page (or this cover, as a shared element)
		// is already moving — don't stack a second animation on it.
		// Replay covers both cases.
		if (!animate || !sequenced || !motionOk || !motionState.hydrated || motionState.transition) return;
		playing = true;
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
		class="art {className}"
		style:view-transition-name={vtName || null}
		class:play={playing}
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
	<img class="art {className}" style:view-transition-name={vtName || null} src={art.url} alt={decorative ? '' : alt} loading="lazy" />
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
</style>
