<script>
	import EditorToolbar from './EditorToolbar.svelte';
	import CodeEditor from './CodeEditor.svelte';
	import PreviewPane from './PreviewPane.svelte';
	import { DEFAULT_CONFIG } from '$lib/courses.js';

	/**
	 * @typedef {import('./CodeEditor.svelte').EditorApi} EditorApi
	 * @type {{ code?: string, language?: string, starter?: string, onReset?: () => void, onEditorReady?: (api: EditorApi) => void, features?: any }}
	 */
	let { code = $bindable(''), language = 'html', starter = '', onReset, onEditorReady, features = DEFAULT_CONFIG.features } = $props();

	const snippets = features.snippets !== false;
	const showFormat = features.formatButton !== false;
	const showPreview = features.livePreview !== false;

	let resetKey = $state(0);
	let formatting = $state(false);

	/** @type {EditorApi | null} */
	let editorApi = null;

	/** Called by CodeEditor once its view is ready */
	function handleReady(api) {
		editorApi = api;
		onEditorReady?.(api); // also notify parent (ChallengeEditor)
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

<div class="panel" class:no-preview={!showPreview}>
	<EditorToolbar {language} onReset={handleReset} onFormat={handleFormat} {formatting} {showFormat} />

	<div class="editor-section">
		{#key resetKey}
			<CodeEditor bind:value={code} {language} onReady={handleReady} {snippets} />
		{/key}
	</div>

	{#if showPreview}
		<div class="preview-bar">
			<span class="label">Preview</span>
			<span class="note">updates as you type</span>
		</div>

		<div class="preview-section">
			<PreviewPane {code} {language} />
		</div>
	{/if}
</div>

<style>
	.panel {
		display: grid;
		grid-template-rows: auto 1fr auto 1fr;
		height: 100%;
		overflow: hidden;
		background: #1e1e2e;
	}

	.panel.no-preview {
		grid-template-rows: auto 1fr;
	}

	.preview-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.35rem 0.75rem;
		background: #17171f;
		border-top: 2px solid #11111b;
		border-bottom: 1px solid #272733;
		flex-shrink: 0;
	}

	.label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: #8888a8;
	}

	.note {
		font-size: 0.65rem;
		color: #4e4e6a;
	}

	.editor-section {
		overflow: hidden;
	}

	.preview-section {
		overflow: hidden;
		background: #fff;
	}
</style>
