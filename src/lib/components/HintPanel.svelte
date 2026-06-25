<script>
	/** @type {{ hints: string[] }} */
	let { hints } = $props();

	let revealed = $state(0);
</script>

{#if hints.length > 0}
	<div class="hints">
		{#if revealed > 0}
			<ul>
				{#each hints.slice(0, revealed) as hint, i}
					<li>
						<span class="num">Hint {i + 1}</span>
						{hint}
					</li>
				{/each}
			</ul>
		{/if}

		{#if revealed < hints.length}
			<button onclick={() => revealed++}>
				{revealed === 0 ? 'Get a hint' : 'Another hint'}
			</button>
		{:else}
			<p class="done">No more hints available.</p>
		{/if}
	</div>
{/if}

<style>
	.hints {
		border-top: 1px solid var(--border);
		padding-top: 0.85rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0 0 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	li {
		font-size: 0.82rem;
		color: var(--text);
		background: var(--warning-muted);
		border: 1px solid color-mix(in srgb, var(--warning) 24%, var(--border));
		border-radius: 18px;
		padding: 0.55rem 0.7rem;
		line-height: 1.55;
	}

	.num {
		font-weight: 800;
		color: var(--warning);
		margin-right: 0.35rem;
	}

	button {
		width: 100%;
		min-height: 38px;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--accent-strong);
		background: transparent;
		border: 1px dashed color-mix(in srgb, var(--accent) 62%, var(--border));
		border-radius: 18px;
		padding: 0.45rem 0.65rem;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
	}

	button:hover {
		background: var(--accent-muted);
		border-color: var(--accent);
		color: var(--accent-strong);
	}

	.done {
		font-size: 0.78rem;
		color: var(--text-dim);
		text-align: center;
		margin: 0;
	}
</style>
