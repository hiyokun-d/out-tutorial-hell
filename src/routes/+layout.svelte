<script>
	import '$lib/styles/theme.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import XpToast from '$lib/components/XpToast.svelte';
	import FloatingNotes from '$lib/components/FloatingNotes.svelte';
	import { xp } from '$lib/stores/xp.js';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';

	let { children } = $props();

	onMount(() => {
		xp.init();

		const lenis = new Lenis({
			lerp: 0.08,
			wheelMultiplier: 1.1,
			smoothWheel: true
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<Sidebar />
	<main class="main-content">
		{@render children()}
	</main>
</div>

<XpToast />
<FloatingNotes />

<style>
	.app-layout {
		min-height: 100vh;
		display: block;
	}

	.main-content {
		padding: 1rem;
		min-width: 0;
		overflow: visible;
	}

	@media (max-width: 760px) {
		.main-content {
			padding: 0;
		}
	}
</style>


