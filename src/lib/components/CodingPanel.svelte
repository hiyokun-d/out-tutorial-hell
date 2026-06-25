<script>
	import EditorToolbar from './EditorToolbar.svelte';
	import CodeEditor from './CodeEditor.svelte';
	import PreviewPane from './PreviewPane.svelte';
	import ConsolePane from './ConsolePane.svelte';
	import PistonPane from './PistonPane.svelte';
	import { DEFAULT_CONFIG } from '$lib/courses.js';
	import { isPistonLanguage } from '$lib/utils/piston.js';

	/**
	 * @typedef {import('./CodeEditor.svelte').EditorApi} EditorApi
	 * @type {{
	 *   code?: string, language?: string, starter?: string,
	 *   onReset?: () => void, onEditorReady?: (api: EditorApi) => void,
	 *   onConsolePaneReady?: (api: any) => void, features?: any,
	 *   pistonStdout?: string, pistonStderr?: string,
	 *   pistonExitCode?: number, pistonRunning?: boolean, pistonError?: string | null
	 * }}
	 */
	let {
		code = $bindable(''),
		language = 'html',
		starter = '',
		onReset,
		onEditorReady,
		onConsolePaneReady,
		features = DEFAULT_CONFIG.features,
		pistonStdout = '',
		pistonStderr = '',
		pistonExitCode = 0,
		pistonRunning = false,
		pistonError = null,
	} = $props();

	const isPiston = $derived(isPistonLanguage(language));
	const snippets = $derived(features.snippets !== false && !isPiston);
	const showFormat = $derived(features.formatButton !== false && !isPiston);
	const showConsole = $derived(!isPiston && features.consoleOutput === true);
	const showPreview = $derived(!isPiston && features.livePreview !== false && !showConsole);

	let resetKey = $state(0);
	let formatting = $state(false);

	/** @type {EditorApi | null} */
	let editorApi = null;

	function handleReady(api) {
		editorApi = api;
		onEditorReady?.(api);
	}

	function handleReset() {
		code = starter;
		resetKey++;
		onReset?.();
	}

	async function handleFormat() {
		if (!editorApi || formatting) return;
		formatting = true;
		try {
			const formatted = await formatWithPrettier(code, language);
			editorApi.setContent(formatted);
			code = formatted;
		} catch (err) {
			console.error('Format failed:', err);
		} finally {
			formatting = false;
		}
	}

	/** @param {string} src @param {string} lang */
	async function formatWithPrettier(src, lang) {
		const [{ default: prettier }, html, css, babel, estree] = await Promise.all([
			import('prettier/standalone'),
			import('prettier/plugins/html'),
			import('prettier/plugins/postcss'),
			import('prettier/plugins/babel'),
			import('prettier/plugins/estree')
		]);

		const configs = {
			html: { parser: 'html', plugins: [html] },
			css: { parser: 'css', plugins: [css] },
			javascript: { parser: 'babel', plugins: [babel, estree] }
		};

		const cfg = configs[lang] ?? configs.html;
		return await prettier.format(src, {
			...cfg,
			printWidth: 80,
			tabWidth: 2,
			useTabs: false,
			singleQuote: false,
			htmlWhitespaceSensitivity: 'ignore'
		});
	}
</script>

<div
	class="panel"
	class:no-right={!showPreview && !showConsole && !isPiston}
	class:with-piston={isPiston}
>
	<EditorToolbar {language} onReset={handleReset} onFormat={handleFormat} {formatting} {showFormat} />

	<div class="editor-section">
		{#key resetKey}
			<CodeEditor bind:value={code} {language} onReady={handleReady} {snippets} />
		{/key}
	</div>

	{#if isPiston}
		<div class="right-section">
			<PistonPane
				{language}
				stdout={pistonStdout}
				stderr={pistonStderr}
				exitCode={pistonExitCode}
				running={pistonRunning}
				error={pistonError}
			/>
		</div>
	{:else if showPreview}
		<div class="preview-bar">
			<span class="label">Preview</span>
			<span class="note">updates as you type</span>
		</div>
		<div class="preview-section">
			<PreviewPane {code} {language} />
		</div>
	{:else if showConsole}
		<div class="preview-bar">
			<span class="label">Console</span>
			<span class="note">updates as you type</span>
		</div>
		<div class="console-section">
			<ConsolePane {code} onReady={onConsolePaneReady} />
		</div>
	{/if}
</div>

<style>
	.panel {
		display: grid;
		grid-template-rows: auto 1fr auto minmax(220px, 0.82fr);
		height: 100%;
		overflow: hidden;
		background: var(--sandbox-bg);
	}

	.panel.no-right {
		grid-template-rows: auto 1fr;
	}

	.panel.with-piston {
		grid-template-rows: auto 1fr;
		grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
	}

	.panel.with-piston .editor-section {
		grid-row: 2;
		grid-column: 1;
	}

	.panel.with-piston :global(> :first-child) {
		grid-column: 1 / -1;
	}

	.right-section {
		grid-row: 2;
		grid-column: 2;
		border-left: 1px solid var(--sandbox-border);
		overflow: hidden;
		background: var(--sandbox-bg);
	}

	.preview-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 38px;
		padding: 0.45rem 0.85rem;
		background: var(--sandbox-bar-bg);
		border-top: 1px solid var(--sandbox-border);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.label {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sandbox-text);
	}

	.note {
		font-size: 0.68rem;
		color: var(--sandbox-text-dim);
	}

	.editor-section {
		overflow: hidden;
		min-height: 0;
	}

	.preview-section {
		overflow: hidden;
		background: #fff7ed;
	}

	.console-section {
		overflow: hidden;
		background: var(--sandbox-bg);
	}

	@media (max-width: 920px) {
		.panel,
		.panel.with-piston {
			display: flex;
			min-height: 720px;
		}

		.panel.with-piston .editor-section,
		.right-section {
			grid-row: auto;
			grid-column: auto;
		}

		.right-section {
			min-height: 280px;
			border-left: none;
			border-top: 1px solid var(--sandbox-border);
		}

		.editor-section { min-height: 420px; }
		.preview-section, .console-section { min-height: 300px; }
	}
</style>

