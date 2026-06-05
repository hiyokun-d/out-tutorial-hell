<script>
	import { onMount, onDestroy } from 'svelte';

	/** @type {{ code?: string, onReady?: (api: { runCode: (src: string) => Promise<{type:string,text:string}[]> }) => void }} */
	let { code = '', onReady } = $props();

	/** @type {{ type: string, text: string }[]} */
	let lines = $state([]);
	let running = $state(false);

	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let debounceTimer;
	/** @type {Worker | null} */
	let activeWorker = null;

	/**
	 * Build the worker source string.
	 * Runs in a separate thread — while(true) will be killed by terminate().
	 * @param {string} src
	 */
	function buildWorkerSrc(src) {
		// Embed user code via JSON.stringify to safely handle any string content
		return `
const __logs = [];

function __fmt(a) {
  if (a === null) return 'null';
  if (a === undefined) return 'undefined';
  if (typeof a === 'object') { try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); } }
  return String(a);
}

const console = {
  log:   (...a) => __logs.push({ type: 'log',   text: a.map(__fmt).join(' ') }),
  error: (...a) => __logs.push({ type: 'error', text: a.map(__fmt).join(' ') }),
  warn:  (...a) => __logs.push({ type: 'warn',  text: a.map(__fmt).join(' ') }),
  info:  (...a) => __logs.push({ type: 'info',  text: a.map(__fmt).join(' ') }),
};

try {
  (new Function(${JSON.stringify(src)}))();
} catch(e) {
  __logs.push({ type: 'error', text: e?.message ?? String(e) });
}

self.postMessage(__logs);
`;
	}

	/** @param {string} src @returns {Promise<{type:string,text:string}[]>} */
	function runCode(src) {
		// Kill any previous worker that might still be running
		if (activeWorker) { activeWorker.terminate(); activeWorker = null; }

		lines = [];
		running = true;

		return new Promise((resolve) => {
			const blob = new Blob([buildWorkerSrc(src)], { type: 'application/javascript' });
			const url = URL.createObjectURL(blob);
			const worker = new Worker(url);
			activeWorker = worker;

			const timeout = setTimeout(() => {
				worker.terminate();
				URL.revokeObjectURL(url);
				activeWorker = null;
				const err = [{ type: 'error', text: 'Timed out — check for infinite loops (e.g. while(true))' }];
				lines = err;
				running = false;
				resolve(err);
			}, 3000);

			worker.onmessage = (e) => {
				clearTimeout(timeout);
				worker.terminate();
				URL.revokeObjectURL(url);
				activeWorker = null;
				lines = e.data ?? [];
				running = false;
				resolve(e.data ?? []);
			};

			worker.onerror = (e) => {
				clearTimeout(timeout);
				worker.terminate();
				URL.revokeObjectURL(url);
				activeWorker = null;
				const err = [{ type: 'error', text: e.message || 'Unknown error' }];
				lines = err;
				running = false;
				resolve(err);
			};
		});
	}

	$effect(() => {
		const src = code;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => runCode(src), 600);
	});

	onMount(() => {
		onReady?.({ runCode });
	});

	onDestroy(() => {
		clearTimeout(debounceTimer);
		if (activeWorker) { activeWorker.terminate(); activeWorker = null; }
	});
</script>

<div class="console-wrap">
	<div class="output" aria-live="polite">
		{#each lines as line}
			<div class="line {line.type}">{line.text}</div>
		{/each}
		{#if lines.length === 0 && !running}
			<div class="empty-hint">Output will appear here as you type</div>
		{/if}
	</div>
	{#if running}
		<div class="running-indicator">running…</div>
	{/if}
</div>

<style>
	.console-wrap {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: #11111b;
		overflow: hidden;
		position: relative;
	}

	.output {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem 0.75rem;
		font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		line-height: 1.7;
	}

	.line { white-space: pre-wrap; word-break: break-word; padding: 0.05rem 0; }
	.line.log   { color: #cdd6f4; }
	.line.error { color: #f38ba8; }
	.line.warn  { color: #f9e2af; }
	.line.info  { color: #89dceb; }

	.empty-hint { color: #4e4e6a; font-style: italic; font-size: 0.75rem; }

	.running-indicator {
		position: absolute;
		top: 0.35rem;
		right: 0.75rem;
		font-size: 0.65rem;
		color: #4e4e6a;
	}
</style>
