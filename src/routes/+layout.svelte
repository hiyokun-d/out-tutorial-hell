<script>
	import '$lib/styles/theme.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import XpToast from '$lib/components/XpToast.svelte';
	import { xp } from '$lib/stores/xp.js';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => xp.init());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
<XpToast />
