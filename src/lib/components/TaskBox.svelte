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
		background: var(--accent-muted);
		border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--border));
		border-left: 3px solid var(--accent);
		border-radius: 18px;
		padding: 0.85rem 0.95rem;
	}

	.label {
		display: block;
		font-size: 0.66rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--accent-strong);
		margin-bottom: 0.3rem;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text);
		line-height: 1.55;
		font-weight: 600;
	}
</style>

