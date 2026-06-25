<script>
	import { Check, X, Circle } from '@lucide/svelte';
	/** @type {{ description: string, passed: boolean | null, detail?: string | null }} */
	let { description, passed, detail = null } = $props();
</script>

<li class="item" class:pass={passed === true} class:fail={passed === false}>
	<span class="dot" aria-hidden="true">
		{#if passed === true}
			<Check size={14} strokeWidth={3} />
		{:else if passed === false}
			<X size={14} strokeWidth={3} />
		{:else}
			<Circle size={6} strokeWidth={3} style="fill: currentColor;" />
		{/if}
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
		gap: 0.65rem;
		padding: 0.55rem 0;
		list-style: none;
		border-bottom: 1px solid color-mix(in srgb, var(--border) 78%, transparent);
	}

	.item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.item:first-child {
		padding-top: 0.1rem;
	}

	.item.pass .desc { color: var(--success); }
	.item.fail .desc { color: var(--error); }
	.item:not(.pass):not(.fail) .desc { color: var(--text-muted); }

	.item.pass .dot {
		color: var(--success);
		background: var(--success-muted);
	}

	.item.fail .dot {
		color: var(--error);
		background: var(--error-muted);
	}

	.item:not(.pass):not(.fail) .dot {
		color: var(--text-dim);
		background: color-mix(in srgb, var(--surface-elevated) 78%, transparent);
	}

	.dot {
		width: 1.35rem;
		height: 1.35rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 1px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.desc {
		font-size: 0.86rem;
		line-height: 1.45;
		font-weight: 600;
	}

	.detail {
		font-size: 0.76rem;
		color: var(--text-muted);
		line-height: 1.55;
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: color-mix(in srgb, var(--surface-elevated) 82%, transparent);
		margin-top: 0.1rem;
	}
</style>
