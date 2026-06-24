<script>
	import { xp, xpProgress } from '$lib/stores/xp.js';
	import { page } from '$app/stores';
</script>

<nav>
	<a href="/" class="brand">
		<span class="logo">⚡</span>
		<span class="name">Out of Tutorial Hell</span>
	</a>

	<div class="links">
		<a href="/courses" class:active={$page.url.pathname.startsWith('/courses')}>Courses</a>
	</div>

	{#if $xp.xp > 0}
		<div class="stats">
			{#if $xp.streak > 1}
				<span class="streak" title="Day streak">🔥 {$xp.streak}</span>
			{/if}
			<div class="level-wrap">
				<span class="level">Lv {$xp.level}</span>
				<div class="xp-bar" title="{$xp.xp % 100}/100 XP">
					<div class="xp-fill" style="width:{$xpProgress * 100}%"></div>
				</div>
				<span class="xp-label">{$xp.xp} XP</span>
			</div>
		</div>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text);
		font-weight: 800;
		font-size: 1rem;
		letter-spacing: -0.01em;
		flex-shrink: 0;
	}

	.logo { font-size: 1.2rem; }

	.links {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.links a {
		text-decoration: none;
		color: var(--text-muted);
		font-size: 0.875rem;
		padding: 0.3rem 0.7rem;
		border-radius: 6px;
		transition: color 0.1s, background 0.1s;
	}

	.links a:hover,
	.links a.active {
		color: var(--text);
		background: var(--surface-elevated);
	}

	.stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.3rem 0.75rem;
	}

	.streak {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--warning);
	}

	.level-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.level {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--accent);
	}

	.xp-bar {
		width: 60px;
		height: 4px;
		background: var(--border);
		border-radius: 999px;
		overflow: hidden;
	}

	.xp-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	.xp-label {
		font-size: 0.7rem;
		color: var(--text-dim);
	}
</style>
