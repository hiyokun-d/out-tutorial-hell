<script>
	import { loadWidget } from '$lib/widgets/registry.js';

	/** @type {{ name: string, props: Record<string, any> }} */
	let { name, props } = $props();

	let widget = $derived(loadWidget(name));
</script>

{#await widget}
	<div class="widget widget-loading">Loading interactive…</div>
{:then Widget}
	<Widget {...props} />
{:catch err}
	<p class="w-error" role="alert">This interactive failed to load: {err.message}</p>
{/await}

<style>
	.widget-loading { min-height: 12rem; color: var(--text-dim); }
</style>
