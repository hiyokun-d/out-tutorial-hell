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
			<p class="done">No more hints — you've got this!</p>
		{/if}
	</div>
{/if}

<style>
	.hints {
		border-top: 1px solid var(--border);
		padding-top: 0.75rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0 0 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	li {
		font-size: 0.82rem;
		color: var(--text);
		background: var(--warning-muted);
		border: 1px solid rgba(245, 158, 11, 0.25);
		border-radius: 6px;
		padding: 0.45rem 0.65rem;
	}

	.num {
		font-weight: 700;
		color: var(--warning);
		margin-right: 0.3rem;
	}

	button {
		width: 100%;
		font-size: 0.8rem;
		color: var(--accent);
		background: none;
		border: 1px dashed rgba(99, 102, 241, 0.35);
		border-radius: 6px;
		padding: 0.3rem 0.65rem;
		cursor: pointer;
		transition: background 0.15s, border-color 0.15s;
	}

	button:hover {
		background: var(--accent-muted);
		border-color: var(--accent);
	}

	.done {
		font-size: 0.78rem;
		color: var(--text-dim);
		text-align: center;
		margin: 0;
	}
</style>
