<script>
	// @ts-nocheck
	import { xp, xpProgress } from '$lib/stores/xp.js';
	import { page } from '$app/stores';
	import { BookOpen, Flame, Home, Map, Trophy, Zap } from '@lucide/svelte';

	function isRoadmapActive(pathname) {
		return pathname === '/courses' || (pathname.startsWith('/courses/') && pathname !== '/courses/new-coder');
	}
</script>

<header class="topbar">
	<div class="topbar-inner">
		<a href="/" class="brand" aria-label="Out of Tutorial Hell home">
			<Zap size={22} strokeWidth={2.8} />
			<span>OutTH</span>
		</a>

		<nav class="nav-pill" aria-label="Main navigation">
			<a href="/" class:active={$page.url.pathname === '/'}>
				<Home size={16} strokeWidth={2.2} />
				<span>Dashboard</span>
			</a>
			<a href="/courses" class:active={isRoadmapActive($page.url.pathname)}>
				<Map size={16} strokeWidth={2.2} />
				<span>Roadmap</span>
			</a>
			<a href="/courses/getting-started" class:active={$page.url.pathname === '/courses/getting-started'}>
				<BookOpen size={16} strokeWidth={2.2} />
				<span>Start Here</span>
			</a>
		</nav>

		<div class="actions">
			<div class="xp-chip" title="{$xp.xp} XP total">
				<Trophy size={15} strokeWidth={2.3} />
				<span>Lv {$xp.level}</span>
				<div class="mini-bar" aria-hidden="true"><i style="width:{$xpProgress * 100}%"></i></div>
			</div>
			{#if $xp.streak > 1}
				<div class="streak" title="Day streak"><Flame size={14} fill="currentColor" /> {$xp.streak}d</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.topbar {
		position: sticky;
		top: 0;
		z-index: 100;
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--surface) 84%, transparent);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid color-mix(in srgb, var(--border) 76%, transparent);
	}

	.topbar-inner {
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		width: fit-content;
		text-decoration: none;
		color: var(--text);
		font-family: 'Outfit', sans-serif;
		font-weight: 900;
		font-size: 1.15rem;
		letter-spacing: 0;
	}

	.brand svg { color: var(--accent-strong); }

	.nav-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.28rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-elevated) 92%, transparent);
		box-shadow: var(--base-shadow);
	}

	.nav-pill a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		min-height: 38px;
		padding: 0 0.9rem;
		border-radius: 999px;
		color: var(--text-muted);
		font-size: 0.86rem;
		font-weight: 850;
		text-decoration: none;
		white-space: nowrap;
		transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
	}

	.nav-pill a:hover {
		color: var(--text);
		background: var(--surface);
	}

	.nav-pill a.active {
		color: #160d14;
		background: var(--accent);
		box-shadow: 0 8px 18px -14px var(--accent-strong);
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.xp-chip,
	.streak {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: color-mix(in srgb, var(--surface-elevated) 92%, transparent);
		color: var(--text);
		box-shadow: var(--base-shadow);
	}

	.xp-chip {
		gap: 0.45rem;
		min-height: 38px;
		padding: 0 0.75rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 900;
		color: var(--accent-strong);
	}

	.mini-bar {
		width: 38px;
		height: 6px;
		border-radius: 999px;
		background: var(--surface);
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.mini-bar i {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: var(--accent);
	}

	.streak {
		gap: 0.3rem;
		min-height: 38px;
		padding: 0 0.65rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 900;
		color: var(--warning);
	}
	@media (max-width: 820px) {
		.topbar { padding: 0.65rem 0.75rem; }
		.topbar-inner {
			grid-template-columns: auto 1fr auto;
			gap: 0.55rem;
		}

		.brand span,
		.xp-chip,
		.streak { display: none; }
		.nav-pill { justify-self: center; max-width: 100%; }
		.nav-pill a { padding: 0 0.65rem; font-size: 0.78rem; }
	}

	@media (max-width: 520px) {
		.nav-pill a { width: 38px; padding: 0; }
		.nav-pill a span { display: none; }
	}
</style>

