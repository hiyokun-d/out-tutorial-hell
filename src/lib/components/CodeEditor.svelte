<script>
	import { onMount, onDestroy } from 'svelte';
	import { expandEmmet, HTML_BOILERPLATE, SNIPPET_CURSOR_OFFSET, EMMET_ABBREVIATIONS } from '$lib/emmet.js';

	/**
	 * @typedef {{ setExternalDiags: (d: import('@codemirror/lint').Diagnostic[]) => void, setContent: (s: string) => void }} EditorApi
	 * @type {{ value?: string, language?: string, snippets?: boolean, onReady?: (api: EditorApi) => void }}
	 */
	let { value = $bindable(''), language = 'html', snippets = true, onReady } = $props();

	/** @type {HTMLDivElement} */
	let editorEl;
	/** @type {import('@codemirror/view').EditorView | null} */
	let view = null;

	// External diagnostics injected by test runner (closure var — lintFn reads this on each run)
	/** @type {import('@codemirror/lint').Diagnostic[]} */
	let extDiags = [];

	// ── Valid HTML5 elements ─────────────────────────────────────────────────
	const VALID_HTML = new Set([
		'a','abbr','address','area','article','aside','audio',
		'b','base','bdi','bdo','blockquote','body','br','button',
		'canvas','caption','cite','code','col','colgroup',
		'data','datalist','dd','del','details','dfn','dialog','div','dl','dt',
		'em','embed',
		'fieldset','figcaption','figure','footer','form',
		'h1','h2','h3','h4','h5','h6','head','header','hgroup','hr','html',
		'i','iframe','img','input','ins',
		'kbd',
		'label','legend','li','link',
		'main','map','mark','menu','meta','meter',
		'nav','noscript',
		'object','ol','optgroup','option','output',
		'p','picture','pre','progress','q',
		'rp','rt','ruby',
		's','samp','script','section','select','small','source','span',
		'strong','style','sub','summary','sup','svg',
		'table','tbody','td','template','textarea','tfoot','th','thead',
		'time','title','tr','track',
		'u','ul','var','video','wbr'
	]);

	/** Levenshtein distance — "did you mean?" for unknown tags */
	function closest(input, pool) {
		let best = null, bestD = 3;
		for (const c of pool) {
			if (Math.abs(c.length - input.length) >= bestD) continue;
			const a = input, b = c, m = a.length, n = b.length;
			let row = Array.from({ length: n + 1 }, (_, i) => i);
			for (let i = 1; i <= m; i++) {
				let prev = i;
				for (let j = 1; j <= n; j++) {
					const val = a[i - 1] === b[j - 1] ? row[j - 1] : 1 + Math.min(row[j - 1], row[j], prev);
					row[j - 1] = prev;
					prev = val;
				}
				row[n] = prev;
			}
			if (row[n] < bestD) { bestD = row[n]; best = c; }
		}
		return best;
	}

	onMount(async () => {
		const [
			{ EditorView, basicSetup },
			{ oneDark },
			{ linter, lintGutter, forceLinting },
			{ syntaxTree },
			{ keymap },
			{ acceptCompletion },
			{ indentWithTab },
			{ Prec }
		] = await Promise.all([
			import('codemirror'),
			import('@codemirror/theme-one-dark'),
			import('@codemirror/lint'),
			import('@codemirror/language'),
			import('@codemirror/view'),
			import('@codemirror/autocomplete'),
			import('@codemirror/commands'),
			import('@codemirror/state')
		]);

		function expandSnippet(view) {
			if (language !== 'html') return false;
			const { state } = view;
			const { from, to } = state.selection.main;
			if (from !== to) return false; // has selection — let Tab indent

			const line = state.doc.lineAt(from);
			const textBefore = state.sliceDoc(line.from, from);
			const textAfter = state.sliceDoc(from, line.to);
			const trimmed = textBefore.trim();
			// Only expand at end of abbreviation (nothing after cursor except whitespace)
			if (!trimmed || textAfter.trim()) return false;

			// ── Special: ! → full HTML boilerplate ───────────────────────────────
			if (trimmed === '!') {
				view.dispatch({
					changes: { from: line.from, to: from, insert: HTML_BOILERPLATE },
					selection: { anchor: line.from + SNIPPET_CURSOR_OFFSET }
				});
				return true;
			}

			// ── Emmet abbreviation ────────────────────────────────────────────────
			const result = expandEmmet(trimmed);
			if (!result) return false;

			// Re-apply leading whitespace of current line to continuation lines
			const leadingWs = textBefore.slice(0, textBefore.length - textBefore.trimStart().length);
			const lines = result.html.split('\n');
			const reindented = [lines[0], ...lines.slice(1).map((l) => leadingWs + l)].join('\n');

			// Adjust cursor offset: each re-indented newline adds leadingWs.length chars
			const newlinesBefore = (result.html.slice(0, result.cursorOffset).match(/\n/g) || []).length;
			const adjustedOffset = result.cursorOffset + newlinesBefore * leadingWs.length;

			view.dispatch({
				changes: { from: line.from + leadingWs.length, to: from, insert: reindented },
				selection: { anchor: line.from + leadingWs.length + adjustedOffset }
			});
			return true;
		}

		// Capture htmlLanguage for attaching Emmet completions to the HTML language data
		let htmlLanguage = null;
		const langLoaders = {
			html: async () => {
				const m = await import('@codemirror/lang-html');
				htmlLanguage = m.htmlLanguage;
				return m.html({ autoCloseTags: true });
			},
			css: () => import('@codemirror/lang-css').then((m) => m.css()),
			javascript: () => import('@codemirror/lang-javascript').then((m) => m.javascript())
		};
		const lang = await (langLoaders[language] ?? langLoaders.html)();

		// ── Emmet completion source ───────────────────────────────────────────────

		function applyEmmetCompletion(view, abbr, from, to) {
			if (abbr === '!') {
				view.dispatch({
					changes: { from, to, insert: HTML_BOILERPLATE },
					selection: { anchor: from + SNIPPET_CURSOR_OFFSET }
				});
				return;
			}
			const result = expandEmmet(abbr);
			if (!result) return;

			const line = view.state.doc.lineAt(from);
			const leadingWs = view.state.sliceDoc(line.from, from).match(/^(\s*)/)?.[1] ?? '';
			const lines = result.html.split('\n');
			const reindented = [lines[0], ...lines.slice(1).map((l) => leadingWs + l)].join('\n');
			const nlBefore = (result.html.slice(0, result.cursorOffset).match(/\n/g) || []).length;

			view.dispatch({
				changes: { from, to, insert: reindented },
				selection: { anchor: from + result.cursorOffset + nlBefore * leadingWs.length }
			});
		}

		function makePreviewEl(html) {
			const el = document.createElement('div');
			el.className = 'cm-emmet-info';
			const pre = el.appendChild(document.createElement('pre'));
			pre.textContent = html;
			return el;
		}

		function emmetCompletionSource(context) {
			const line = context.state.doc.lineAt(context.pos);
			const textBefore = context.state.sliceDoc(line.from, context.pos);
			const textAfter = context.state.sliceDoc(context.pos, line.to);

			// Only suggest on a "clean" line — abbreviation is the only content before cursor
			if (textAfter.trim()) return null;

			const leadingWs = textBefore.match(/^(\s*)/)?.[1] ?? '';
			const trimmed = textBefore.trim();
			const from = line.from + leadingWs.length;

			if (!trimmed) return null;

			const options = [];

			// If current text is already a valid abbreviation, show it as top option
			if (trimmed === '!' || expandEmmet(trimmed)) {
				const preview = trimmed === '!'
					? HTML_BOILERPLATE
					: expandEmmet(trimmed)?.html ?? '';
				options.push({
					label: trimmed,
					detail: '↵ expand',
					type: 'function',
					boost: 99,
					info: () => makePreviewEl(preview),
					apply: (view, _c, from, to) => applyEmmetCompletion(view, trimmed, from, to)
				});
			}

			// Suggestions from known abbreviations that start with typed text
			for (const { label, detail } of EMMET_ABBREVIATIONS) {
				if (label === trimmed) continue; // already shown above
				if (!label.startsWith(trimmed)) continue;
				const result = label === '!' ? null : expandEmmet(label);
				options.push({
					label,
					detail,
					type: 'keyword',
					info: result ? () => makePreviewEl(result.html) : undefined,
					apply: (view, _c, from, to) => applyEmmetCompletion(view, label, from, to)
				});
			}

			if (!options.length) return null;
			return { from, options, validFor: /^[!a-z0-9.#>*:-]*$/i };
		}

		// ── Linters ──────────────────────────────────────────────────────────────

		function htmlSyntaxDiags(view) {
			/** @type {import('@codemirror/lint').Diagnostic[]} */
			const out = [];
			const { state } = view;
			syntaxTree(state).cursor().iterate((node) => {
				if (node.type.isError) {
					out.push({ from: node.from, to: Math.max(node.to, node.from + 1), severity: 'error', message: 'HTML error — check for unclosed tags or missing `>`' });
					return;
				}
				if (node.name === 'MismatchedCloseTag') {
					out.push({ from: node.from, to: node.to, severity: 'error', message: 'Mismatched closing tag — open and close tags do not match' });
					return;
				}
				if (node.name === 'TagName') {
					const tag = state.sliceDoc(node.from, node.to).toLowerCase();
					if (tag && !VALID_HTML.has(tag)) {
						const s = closest(tag, [...VALID_HTML]);
						out.push({ from: node.from, to: node.to, severity: 'error', message: `<${tag}> is not a valid HTML element${s ? ` — did you mean <${s}>?` : ''}` });
					}
				}
			});
			return out;
		}

		function lezerSyntaxDiags(view) {
			/** @type {import('@codemirror/lint').Diagnostic[]} */
			const out = [];
			syntaxTree(view.state).cursor().iterate((node) => {
				if (node.type.isError)
					out.push({ from: node.from, to: Math.max(node.to, node.from + 1), severity: 'error', message: 'Syntax error' });
			});
			return out;
		}

		// Merged lint function: syntax errors + externally injected test-failure markers
		const syntaxFn = language === 'html' ? htmlSyntaxDiags : lezerSyntaxDiags;
		const mergedLintFn = (view) => [...syntaxFn(view), ...extDiags];

		// ── Build view ────────────────────────────────────────────────────────────
		view = new EditorView({
			doc: value,
			extensions: [
				basicSetup,
				lang,
				oneDark,
				lintGutter(),
				linter(mergedLintFn, { delay: 450 }),
				// Emmet autocomplete — attached to the HTML language data so it merges
				// with existing HTML tag/attribute completions from basicSetup
				...(snippets && language === 'html' && htmlLanguage
					? [htmlLanguage.data.of({ autocomplete: emmetCompletionSource })]
					: []),
				// Snippet: ! + Tab / abbr + Tab → expand (highest precedence, HTML only)
				...(snippets && language === 'html'
					? [Prec.highest(keymap.of([{ key: 'Tab', run: expandSnippet }]))]
					: []),
				// Tab: accept completion first, else indent
				keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
				EditorView.theme({
					'&': { fontSize: '13.5px', fontFamily: "'Fira Code','Cascadia Code','JetBrains Mono',monospace" },
					'.cm-scroller': { fontFamily: 'inherit' },
					// Autocomplete dropdown
					'.cm-tooltip-autocomplete': { borderRadius: '8px', border: '1px solid #313244', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' },
					'.cm-tooltip-autocomplete ul': { maxHeight: '220px' },
					'.cm-tooltip-autocomplete ul li[aria-selected]': { background: '#45475a !important' },
					'.cm-completionDetail': { color: '#a6e3a1', marginLeft: '0.5rem', fontSize: '0.8em' },
					// Emmet expansion preview panel
					'.cm-completionInfo': { background: '#181825', border: '1px solid #313244', borderRadius: '8px', padding: '0' },
					'.cm-emmet-info': { padding: '0.5rem 0.75rem' },
					'.cm-emmet-info pre': { margin: '0', fontSize: '0.75rem', color: '#cdd6f4', fontFamily: "'Fira Code',monospace", whiteSpace: 'pre', lineHeight: '1.5' },
					// Squiggles
					'.cm-lintRange-error': { backgroundImage: 'none', borderBottom: '2px solid #f38ba8' },
					'.cm-lintRange-warning': { backgroundImage: 'none', borderBottom: '2px dotted #fab387' }
				}),
				EditorView.updateListener.of((u) => {
					if (u.docChanged) value = u.state.doc.toString();
				})
			],
			parent: editorEl
		});

		// ── Expose API to parent ──────────────────────────────────────────────────
		onReady?.({
			/** Inject test-failure diagnostics into the editor */
			setExternalDiags(diags) {
				extDiags = diags;
				forceLinting(view);
			},
			/** Replace editor content while preserving undo history */
			setContent(content) {
				if (!view) return;
				view.dispatch(
					view.state.update({
						changes: { from: 0, to: view.state.doc.length, insert: content },
						scrollIntoView: true
					})
				);
			}
		});
	});

	onDestroy(() => view?.destroy());
</script>

<div class="wrap" bind:this={editorEl}></div>

<style>
	.wrap {
		height: 100%;
		overflow: hidden;
	}

	.wrap :global(.cm-editor) {
		height: 100%;
	}

	.wrap :global(.cm-scroller) {
		overflow: auto;
	}

	/* Error/warning panel (Ctrl-Shift-m) */
	.wrap :global(.cm-panel.cm-panel-lint) {
		border-top: 1px solid #313244;
		background: #181825;
		color: #cdd6f4;
		font-size: 0.8rem;
		max-height: 130px;
		overflow-y: auto;
	}

	.wrap :global(.cm-diagnostic-error) {
		border-left: 3px solid #f38ba8;
		padding-left: 6px;
	}

	.wrap :global(.cm-diagnostic-warning) {
		border-left: 3px solid #fab387;
		padding-left: 6px;
	}

	.wrap :global(.cm-diagnosticText) {
		color: #cdd6f4;
	}
</style>
