<script>
	import '$lib/styles/theme.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import XpToast from '$lib/components/XpToast.svelte';
	import FloatingNotes from '$lib/components/FloatingNotes.svelte';
	import { xp } from '$lib/stores/xp.js';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { motionState, reducedMotion } from '$lib/motion.js';

	let { children } = $props();

	/**
	 * Which route transition fits this navigation:
	 *  - next / prev: lesson to its neighbour in the same course — slide the way you moved.
	 *  - fade: everything else. Course card → course page also fades, but its title,
	 *    icon and cover carry view-transition-names, so they morph into the header.
	 * @param {import('@sveltejs/kit').OnNavigate} nav
	 * @returns {'next' | 'prev' | 'fade'}
	 */
	function kind(nav) {
		const from = nav.from?.params;
		const to = nav.to?.params;
		if (!from?.lesson || !to?.lesson || from.course !== to.course) return 'fade';
		// Current page's data knows its neighbours; the browser Back button reports delta.
		if (to.lesson === page.data?.next?.id) return 'next';
		if (to.lesson === page.data?.prev?.id) return 'prev';
		if (nav.delta) return nav.delta > 0 ? 'next' : 'prev';
		return 'fade';
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition || reducedMotion.current) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;

		const root = document.documentElement;
		root.dataset.vt = kind(navigation);

		return new Promise((resolve) => {
			const vt = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			const done = vt.finished.finally(() => {
				if (motionState.transition === done) motionState.transition = null;
				delete root.dataset.vt;
			});
			motionState.transition = done;
		});
	});

	onMount(() => {
		motionState.hydrated = true;
		xp.init();
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
