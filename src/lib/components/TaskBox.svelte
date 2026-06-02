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
		background: #fafafa;
		border: 1px solid #e5e7eb;
		border-left: 3px solid #6366f1;
		border-radius: 8px;
		padding: 0.7rem 0.9rem;
	}

	.label {
		display: block;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: #6366f1;
		margin-bottom: 0.25rem;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: #374151;
		line-height: 1.5;
	}
</style>
