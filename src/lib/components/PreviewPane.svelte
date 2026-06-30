<script>
	/** @type {{ code: string, language?: string }} */
	let { code, language = 'html' } = $props();

	/**
	 * Injected at the top of every HTML document that has inline scripts.
	 * Sets up window.__g() — called inside every loop body by the transform below.
	 * Throws if iterations exceed 100k OR elapsed time exceeds 3.5s.
	 * Also installs a window.onerror handler that displays the error visually
	 * in the preview instead of silently dying.
	 */
	const GUARD = `<script>(function(){
  var _n=0,_t=Date.now();
  window.__g=function(){
    if(++_n>100000||Date.now()-_t>3500)
      throw new RangeError('Stopped: too many iterations — check for while(true) or a missing break');
  };
  window.addEventListener('error',function(e){
    var d=document.createElement('div');
    d.style.cssText='position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#1e1e2e;color:#f38ba8;font:600 14px/1.6 monospace;padding:2rem;text-align:center;z-index:9999;white-space:pre-wrap;';
    d.textContent='⚠️  '+(e.message||'Script error');
    (document.body||document.documentElement).appendChild(d);
  });
})();<\/script>`;

	/**
	 * Transforms inline <script> blocks so every while/for/do loop body
	 * calls window.__g() on each iteration, then injects the guard setup.
	 * External scripts (src="...") are left untouched.
	 * @param {string} html
	 * @returns {string}
	 */
	function guardLoops(html) {
		// Step 1 — transform inline script bodies
		const guarded = html.replace(
			/<script(\b[^>]*)>([\s\S]*?)<\/script>/gi,
			(match, attrs, body) => {
				if (/\bsrc\b/i.test(attrs)) return match; // external script, skip
				const safe = body
					// while(cond) { → while(cond) { __g();
					// for(init;cond;step) { → for(init;cond;step) { __g();
					// [^){}]* avoids matching across nested parens/braces;
					// good enough for beginner code without fn-call loop headers
					.replace(/\b(while|for)\s*\([^){}]*\)\s*\{/g, '$& __g();')
					// do { → do { __g();
					.replace(/\bdo\s*\{/g, 'do { __g();');
				return `<script${attrs}>${safe}<\/script>`;
			}
		);

		// Step 2 — inject guard setup as early as possible
		if (/<head[^>]*>/i.test(guarded)) {
			return guarded.replace(/(<head[^>]*>)/i, `$1${GUARD}`);
		}
		// No <head> tag (bare HTML snippet) — prepend
		return GUARD + guarded;
	}

	let srcdoc = $derived(
		language === 'css'
			? `<!DOCTYPE html><html><head><style>${code}</style></head><body><p>Preview</p></body></html>`
			: guardLoops(code)
	);
</script>

<div class="preview-wrap">
	<iframe title="Live preview" {srcdoc} sandbox="allow-scripts"></iframe>
</div>

<style>
	.preview-wrap {
		height: 100%;
		background: #fff7ed;
		overflow: hidden;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
