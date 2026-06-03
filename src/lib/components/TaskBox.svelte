<script>
	/** @type {{ instructions: string }} */
	let { instructions } = $props();
</script>

<div class="task-box">
	<span class="label">Your task</span>
	<p>{instructions}</p>
</div>

<style>
	.task-box {
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-left: 3px solid var(--accent);
		border-radius: 8px;
		padding: 0.7rem 0.9rem;
	}

	.label {
		display: block;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--accent);
		margin-bottom: 0.25rem;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text);
		line-height: 1.5;
	}
</style>
