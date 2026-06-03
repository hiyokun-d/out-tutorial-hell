<script>
	import { getNotes, saveNotes } from '$lib/utils/notes.js';

	/** @type {{ courseSlug: string, lessonId: string }} */
	let { courseSlug, lessonId } = $props();

	let text = $state('');
	/** @type {ReturnType<typeof setTimeout> | null} */
	let timer = null;

	$effect(() => {
		text = getNotes(courseSlug, lessonId);
	});

	/** @param {Event & { currentTarget: HTMLTextAreaElement }} e */
	function handleInput(e) {
		text = e.currentTarget.value;
		clearTimeout(timer ?? undefined);
		timer = setTimeout(() => saveNotes(courseSlug, lessonId, text), 500);
	}
</script>

<div class="notes">
	<div class="notes-header">
		<span class="label">Notes</span>
		{#if text.length > 0}
			<span class="count">{text.length} chars</span>
		{/if}
	</div>
	<textarea
		value={text}
		oninput={handleInput}
		placeholder="Write anything here… notes auto-save."
		spellcheck="false"
	></textarea>
</div>

<style>
	.notes {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.notes-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}

	.count {
		font-size: 0.65rem;
		color: var(--text-dim);
	}

	textarea {
		width: 100%;
		min-height: 120px;
		resize: vertical;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text);
		font-size: 0.82rem;
		font-family: inherit;
		line-height: 1.6;
		padding: 0.6rem 0.75rem;
		outline: none;
		transition: border-color 0.15s;
	}

	textarea::placeholder {
		color: var(--text-dim);
	}

	textarea:focus {
		border-color: var(--accent);
	}
</style>
