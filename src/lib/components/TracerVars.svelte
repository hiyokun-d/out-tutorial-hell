<script>
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';

	/** @type {{ vars: Record<string,any>, prevVars: Record<string,any>, changedNames: Set<string> }} */
	let { vars, prevVars, changedNames } = $props();

	/** @param {unknown} v @returns {{ display: string, type: string }} */
	function describeValue(v) {
		if (v === undefined) return { display: 'undefined', type: 'nil' };
		if (v === null)      return { display: 'null',      type: 'nil' };
		if (Array.isArray(v)) return { display: JSON.stringify(v), type: 'array' };
		if (typeof v === 'object') return { display: JSON.stringify(v), type: 'object' };
		if (typeof v === 'string')  return { display: `"${v}"`,  type: 'string' };
		if (typeof v === 'boolean') return { display: String(v), type: 'boolean' };
		if (typeof v === 'number')  return { display: String(v), type: 'number' };
		return { display: String(v), type: 'other' };
	}

	const TYPE_COLORS = /** @type {Record<string,string>} */ ({
		number:  'var(--syntax-num)',
		string:  'var(--syntax-str)',
		boolean: 'var(--syntax-bool)',
		array:   'var(--syntax-arr)',
		object:  'var(--syntax-obj)',
		nil:     'var(--syntax-nil)',
		other:   'var(--syntax-other)',
	});

	let entries = $derived(
		Object.entries(vars).map(([name, value]) => {
			const desc = describeValue(value);
			const changed = changedNames.has(name);
			const prevDesc = prevVars[name] !== undefined ? describeValue(prevVars[name]) : null;
			const color = TYPE_COLORS[desc.type] ?? 'var(--syntax-other)';
			return { name, desc, changed, prevDesc, color };
		})
	);
</script>

<div class="vars-grid">
	{#if entries.length === 0}
		<div class="empty">No variables yet</div>
	{:else}
		{#each entries as entry (entry.name)}
			<div
				class="bubble"
				class:changed={entry.changed}
				style="--tc: {entry.color}"
				animate:flip={{ duration: 260, easing: cubicOut }}
				in:fly={{ y: 14, duration: 220, easing: cubicOut }}
				out:fly={{ y: -8, duration: 140, easing: cubicOut }}
			>
				<div class="bubble-top">
					<span class="var-name">{entry.name}</span>
					<span class="type-badge type-{entry.desc.type}">{entry.desc.type}</span>
				</div>
				{#key entry.desc.display}
					<div class="var-value type-{entry.desc.type}" in:fly={{ y: -5, duration: 160, easing: cubicOut }}>
						{entry.desc.display}
					</div>
				{/key}
				{#if entry.changed && entry.prevDesc}
					<div class="was-prev" in:fly={{ y: 4, duration: 130, easing: cubicOut }}>
						← {entry.prevDesc.display}
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</div>

<style>
	.vars-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		padding: 0.45rem 0.75rem;
		background: var(--sandbox-bg);
		flex-shrink: 0;
		max-height: 130px;
		overflow-y: auto;
		min-height: 48px;
	}

	.empty {
		font-size: 0.72rem;
		color: var(--sandbox-text-dim);
		font-style: italic;
		font-family: 'Fira Code', monospace;
		padding: 0.2rem 0;
		width: 100%;
		align-self: center;
	}

	.bubble {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		background: var(--sandbox-bar-bg);
		border: 1px solid var(--sandbox-border);
		border-radius: 18px;
		padding: 0.28rem 0.5rem 0.32rem;
		min-width: 64px;
		max-width: 160px;
		position: relative;
		overflow: hidden;
		transition: border-color 0.22s ease, box-shadow 0.22s ease;
	}

	.bubble::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--tc, var(--accent)) 0%, transparent 55%);
		opacity: 0.04;
		pointer-events: none;
		border-radius: 18px;
	}

	.bubble.changed {
		border-color: var(--tc, var(--accent));
		box-shadow: 0 0 12px -3px color-mix(in srgb, var(--tc, var(--accent)) 60%, transparent);
		animation: pop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes pop {
		0%   { transform: scale(0.93); }
		60%  { transform: scale(1.06); }
		100% { transform: scale(1); }
	}

	.bubble-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.25rem;
	}

	.var-name {
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		color: var(--sandbox-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.type-badge {
		font-size: 0.48rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding: 0.04rem 0.25rem;
		border-radius: 999px;
		text-transform: uppercase;
		flex-shrink: 0;
	}
	.type-badge.type-number  { background: color-mix(in srgb, var(--syntax-num) 12%, transparent); color: var(--syntax-num); }
	.type-badge.type-string  { background: color-mix(in srgb, var(--syntax-str) 12%, transparent); color: var(--syntax-str); }
	.type-badge.type-boolean { background: color-mix(in srgb, var(--syntax-bool) 12%, transparent); color: var(--syntax-bool); }
	.type-badge.type-array   { background: color-mix(in srgb, var(--syntax-arr) 12%, transparent); color: var(--syntax-arr); }
	.type-badge.type-object  { background: color-mix(in srgb, var(--syntax-obj) 12%, transparent); color: var(--syntax-obj); }
	.type-badge.type-nil     { background: color-mix(in srgb, var(--syntax-nil) 12%, transparent); color: var(--syntax-nil); }

	.var-value {
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.8rem;
		font-weight: 600;
		word-break: break-all;
		line-height: 1.25;
	}
	.var-value.type-number  { color: var(--syntax-num); }
	.var-value.type-string  { color: var(--syntax-str); }
	.var-value.type-boolean { color: var(--syntax-bool); }
	.var-value.type-array   { color: var(--syntax-arr); }
	.var-value.type-object  { color: var(--syntax-obj); }
	.var-value.type-nil     { color: var(--syntax-nil); font-style: italic; }

	.was-prev {
		font-size: 0.54rem;
		color: var(--sandbox-text-dim);
		font-style: italic;
		font-family: 'Fira Code', monospace;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

