<script>
	import { toasts } from '$lib/stores/toast.js';
	import { Trophy, Zap } from '@lucide/svelte';
</script>

<div class="toast-stack" aria-live="polite">
	{#each $toasts as toast (toast.id)}
		<div class="toast" class:level-up={toast.levelUp}>
			{#if toast.levelUp}
				<Trophy size={20} class="level-up-icon" />
				<div class="text">
					<strong>Level {toast.level}!</strong>
					<span>+{toast.xp} XP earned</span>
				</div>
			{:else}
				<Zap size={20} class="xp-icon" />
				<div class="text">
					<strong>+{toast.xp} XP</strong>
					<span>Lesson complete</span>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.toast-stack {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-left: 3px solid var(--success);
		border-radius: 20px;
		padding: 0.7rem 1rem;
		animation: slideIn 0.25s ease, fadeOut 0.3s ease 2.5s forwards;
		min-width: 180px;
	}

	.toast.level-up {
		border-left-color: var(--accent);
		background: var(--accent-muted);
		border-color: var(--accent);
	}

	.level-up-icon {
		color: var(--accent);
		flex-shrink: 0;
	}

	.xp-icon {
		color: var(--success);
		flex-shrink: 0;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	strong {
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--text);
	}

	span {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateX(20px); }
		to   { opacity: 1; transform: translateX(0); }
	}

	@keyframes fadeOut {
		from { opacity: 1; }
		to   { opacity: 0; }
	}
</style>

