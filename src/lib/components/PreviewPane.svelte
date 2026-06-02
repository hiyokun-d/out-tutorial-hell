<script>
	/** @type {{ code: string, language?: string }} */
	let { code, language = 'html' } = $props();

	/**
	 * For CSS challenges the challenge JSON provides a `previewHtml` field to
	 * wrap the user's CSS in a real page.  For HTML (default) we just use the
	 * code as-is.
	 */
	let srcdoc = $derived(
		language === 'css'
			? `<!DOCTYPE html><html><head><style>${code}</style></head><body><p>Preview</p></body></html>`
			: code
	);
</script>

<div class="preview-wrap">
	<iframe title="Live preview" {srcdoc} sandbox="allow-scripts"></iframe>
</div>

<style>
	.preview-wrap {
		height: 100%;
		background: #fff;
		overflow: hidden;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
