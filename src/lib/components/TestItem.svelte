<script>
	/** @type {{ description: string, passed: boolean | null, detail?: string | null }} */
	let { description, passed, detail = null } = $props();
</script>

<li class="item" class:pass={passed === true} class:fail={passed === false}>
	<span class="dot" aria-hidden="true">
		{#if passed === true}✓{:else if passed === false}✗{:else}·{/if}
	</span>
	<div class="body">
		<span class="desc">{description}</span>
		{#if passed === false && detail}
			<span class="detail">{detail}</span>
		{/if}
	</div>
</li>

<style>
	.item {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.3rem 0;
		list-style: none;
	}

	.item.pass .desc { color: var(--success); }
	.item.fail .desc { color: var(--error); }
	.item:not(.pass):not(.fail) .desc { color: var(--text-muted); }

	.dot {
		width: 1.1rem;
		flex-shrink: 0;
		font-weight: 700;
		text-align: center;
		margin-top: 2px;
		font-size: 0.85rem;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.desc {
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.detail {
		font-size: 0.76rem;
		color: var(--text-muted);
		line-height: 1.5;
		padding: 0.25rem 0.5rem;
		border-left: 2px solid var(--border);
		margin-top: 0.1rem;
	}
</style>
