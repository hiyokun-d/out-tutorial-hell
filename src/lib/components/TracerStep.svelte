<script>
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	/** @type {{
	 *   traceIndex: number,
	 *   stepType: string,
	 *   stepColor: string,
	 *   sourceLine: string,
	 *   explanation: string | null,
	 *   nextSourceLine: string,
	 *   lineIteration: number,
	 *   currentLine: number
	 * }} */
	let {
		traceIndex,
		stepType,
		stepColor,
		sourceLine,
		explanation,
		nextSourceLine,
		lineIteration,
		currentLine,
	} = $props();
</script>

{#key traceIndex}
	<div
		class="card"
		style="--sc: {stepColor}; border-left-color: {stepColor}"
		in:fly={{ y: -10, duration: 200, easing: cubicOut }}
	>
		<div class="card-top">
			<span class="type-badge" style="background:{stepColor}20; color:{stepColor}">
				{stepType}
			</span>
			{#if lineIteration > 1}
				<span class="iter-badge">iteration {lineIteration}</span>
			{/if}
			<span class="line-pos">line {currentLine}</span>
		</div>

		<div class="card-main">
			<code class="src-line">{sourceLine}</code>
			{#if explanation}
				<span class="arrow">→</span>
				<span class="explain">{explanation}</span>
			{/if}
		</div>

		{#if nextSourceLine}
			<div class="next-row">
				<span class="next-lbl">next</span>
				<code class="next-code">{nextSourceLine}</code>
			</div>
		{/if}
	</div>
{/key}

<style>
	.card {
		background: #13131c;
		border-left: 3px solid var(--sc, #6366f1);
		padding: 0.5rem 0.75rem;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		position: relative;
		overflow: hidden;
		transition: border-left-color 0.25s ease;
	}

	.card::after {
		content: '';
		position: absolute;
		left: 0; top: 0; bottom: 0;
		width: 50px;
		background: linear-gradient(to right, color-mix(in srgb, var(--sc) 10%, transparent), transparent);
		pointer-events: none;
		transition: background 0.25s ease;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.type-badge {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 0.1rem 0.45rem;
		border-radius: 999px;
		text-transform: uppercase;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background 0.25s ease, color 0.25s ease;
	}

	.iter-badge {
		font-size: 0.6rem;
		color: #fab387;
		font-family: 'Fira Code', monospace;
		background: #fab38718;
		padding: 0.05rem 0.4rem;
		border-radius: 999px;
	}

	.line-pos {
		font-size: 0.6rem;
		color: #4e4e6a;
		margin-left: auto;
		font-family: 'Fira Code', monospace;
	}

	.card-main {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.src-line {
		font-family: 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.75rem;
		color: #cdd6f4;
		background: #1e1e2e;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		white-space: nowrap;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		flex-shrink: 0;
	}

	.arrow { color: #6c7086; font-size: 0.7rem; flex-shrink: 0; }

	.explain {
		font-size: 0.72rem;
		color: #a6adc8;
		flex: 1;
		line-height: 1.45;
	}

	.next-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding-top: 0.15rem;
		border-top: 1px solid #1e1e2e;
	}

	.next-lbl {
		font-size: 0.58rem;
		color: #4e4e6a;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		flex-shrink: 0;
	}

	.next-code {
		font-family: 'Fira Code', monospace;
		font-size: 0.68rem;
		color: #6c7086;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
