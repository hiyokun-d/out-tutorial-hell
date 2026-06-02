<script>
	import TestItem from './TestItem.svelte';

	/**
	 * @typedef {{ id: number, description: string, passed: boolean | null, detail?: string | null }} TestResult
	 * @type {{ results: TestResult[] }}
	 */
	let { results } = $props();
</script>

<ul>
	{#each results as r (r.id)}
		<TestItem description={r.description} passed={r.passed} detail={r.detail} />
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}
</style>
