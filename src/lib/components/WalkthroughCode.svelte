<script>
	import CodeEditor from './CodeEditor.svelte';
	import PreviewPane from './PreviewPane.svelte';
	import { resolveHighlightLines } from '$lib/utils/walkthrough.js';

	/**
	 * @type {{ code: string, language?: string, highlightSpec?: any, walkthroughStyle?: string, showPreview?: boolean, onEditorReady?: (api: any) => void }}
	 */
	let { code, language = 'html', highlightSpec = null, walkthroughStyle = 'spotlight', showPreview = true, onEditorReady = undefined } = $props();

	let resolved = $derived(resolveHighlightLines(highlightSpec, code));

	let spotlight = $derived(
		resolved ? { fromLine: resolved.fromLine, toLine: resolved.toLine, style: walkthroughStyle } : null
	);
</script>

<div class="panel" class:no-preview={!showPreview}>
	<div class="toolbar">
		<span class="badge readonly-badge">Read Only</span>
		<span class="lang">{language.toUpperCase()}</span>
	</div>

	<div class="editor-section">
		<CodeEditor value={code} {language} snippets={false} readonly={true} {spotlight} onReady={onEditorReady} />
	</div>

	{#if showPreview}
		<div class="preview-bar">
			<span class="label">Preview</span>
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
		background: var(--sandbox-bg);
	}

	.panel.no-preview {
		grid-template-rows: auto 1fr;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.35rem 0.75rem;
		background: var(--sandbox-bar-bg);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.readonly-badge {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: var(--success);
		background: var(--success-muted);
		border: 1px solid var(--success-muted);
		border-radius: 4px;
		padding: 0.15rem 0.45rem;
	}

	.lang {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		color: var(--accent);
	}

	.editor-section {
		overflow: hidden;
	}

	.preview-bar {
		display: flex;
		align-items: center;
		padding: 0.35rem 0.75rem;
		background: var(--sandbox-bar-bg);
		border-top: 1px solid var(--sandbox-border);
		border-bottom: 1px solid var(--sandbox-border);
		flex-shrink: 0;
	}

	.label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		color: var(--sandbox-text-muted);
	}

	.preview-section {
		overflow: hidden;
		background: #fff;
	}
</style>
