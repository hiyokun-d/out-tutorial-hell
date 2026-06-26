<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { NotebookPen, X, GripHorizontal } from '@lucide/svelte';

	const CONTENT_KEY = 'notes:global';
	const POS_KEY = 'notes:global:pos';
	const OPEN_KEY = 'notes:global:open';

	let open = $state(false);
	let text = $state('');
	let x = $state(0);
	let y = $state(0);
	let ready = $state(false);
	let dragging = $state(false);
	/** @type {ReturnType<typeof setTimeout> | null} */
	let saveTimer = null;

	let dragStartX = 0;
	let dragStartY = 0;
	let dragOriginX = 0;
	let dragOriginY = 0;

	$effect(() => {
		if (!browser) return;

		text = localStorage.getItem(CONTENT_KEY) ?? '';
		open = localStorage.getItem(OPEN_KEY) === 'true';

		try {
			const pos = JSON.parse(localStorage.getItem(POS_KEY) ?? 'null');
			if (pos?.x !== undefined && pos?.y !== undefined) {
				x = Math.max(8, Math.min(pos.x, window.innerWidth - 316));
				y = Math.max(8, Math.min(pos.y, window.innerHeight - 60));
			} else {
				x = window.innerWidth - 336;
				y = Math.max(80, (window.innerHeight - 320) / 2);
			}
		} catch {
			x = window.innerWidth - 336;
			y = 100;
		}

		ready = true;
	});

	function toggle() {
		open = !open;
		if (browser) localStorage.setItem(OPEN_KEY, String(open));
	}

	/** @param {Event & { currentTarget: HTMLTextAreaElement }} e */
	function handleInput(e) {
		text = e.currentTarget.value;
		clearTimeout(saveTimer ?? undefined);
		saveTimer = setTimeout(() => {
			if (!browser) return;
			if (text.trim()) localStorage.setItem(CONTENT_KEY, text);
			else localStorage.removeItem(CONTENT_KEY);
		}, 400);
	}

	/** @param {MouseEvent} e */
	function startDrag(e) {
		if (e.button !== 0) return;
		e.preventDefault();
		dragging = true;
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		dragOriginX = x;
		dragOriginY = y;
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', stopDrag);
	}

	/** @param {TouchEvent} e */
	function startDragTouch(e) {
		const t = e.touches[0];
		dragging = true;
		dragStartX = t.clientX;
		dragStartY = t.clientY;
		dragOriginX = x;
		dragOriginY = y;
		window.addEventListener('touchmove', onTouchMove, { passive: false });
		window.addEventListener('touchend', stopDragTouch);
	}

	/** @param {MouseEvent} e */
	function onMouseMove(e) {
		x = Math.max(8, Math.min(dragOriginX + e.clientX - dragStartX, window.innerWidth - 316));
		y = Math.max(8, Math.min(dragOriginY + e.clientY - dragStartY, window.innerHeight - 60));
	}

	/** @param {TouchEvent} e */
	function onTouchMove(e) {
		e.preventDefault();
		const t = e.touches[0];
		x = Math.max(8, Math.min(dragOriginX + t.clientX - dragStartX, window.innerWidth - 316));
		y = Math.max(8, Math.min(dragOriginY + t.clientY - dragStartY, window.innerHeight - 60));
	}

	function stopDrag() {
		dragging = false;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', stopDrag);
		if (browser) localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
	}

	function stopDragTouch() {
		dragging = false;
		window.removeEventListener('touchmove', onTouchMove);
		window.removeEventListener('touchend', stopDragTouch);
		if (browser) localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
	}

	let hasContent = $derived(text.trim().length > 0);
</script>

<!-- Trigger button — always visible -->
<button
	class="fn-trigger"
	class:fn-open={open}
	onclick={toggle}
	aria-label={open ? 'Close notes' : 'Open notes'}
	title="Notes (saved locally)"
>
	<NotebookPen size={17} strokeWidth={2.3} />
	{#if hasContent && !open}
		<span class="fn-dot" aria-hidden="true"></span>
	{/if}
</button>

<!-- Floating window -->
{#if open && ready}
	<div
		class="fn-window"
		class:fn-dragging={dragging}
		style="left:{x}px; top:{y}px"
		role="dialog"
		aria-label="Notes"
	>
		<!-- Drag handle / header -->
		<div
			class="fn-header"
			onmousedown={startDrag}
			ontouchstart={startDragTouch}
		>
			<div class="fn-header-left">
				<GripHorizontal size={13} strokeWidth={2.5} class="grip" />
				<span class="fn-title">Notes</span>
				{#if hasContent}
					<span class="fn-count">{text.length} chars</span>
				{/if}
			</div>
			<button
				class="fn-close"
				onclick={(e) => { e.stopPropagation(); toggle(); }}
				aria-label="Close notes"
			>
				<X size={13} strokeWidth={2.5} />
			</button>
		</div>

		<textarea
			value={text}
			oninput={handleInput}
			placeholder="Write anything…&#10;&#10;Your notes save automatically to this browser. Nothing leaves your device."
			spellcheck="false"
			data-lenis-prevent
		></textarea>

		<div class="fn-footer">
			<span>Saved locally · private to this browser</span>
		</div>
	</div>
{/if}

<style>
	/* ── Trigger button ──────────────────────────────────────────────────────── */
	.fn-trigger {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 200;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: var(--surface-elevated);
		color: var(--text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: var(--depth-shadow);
		transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
	}

	.fn-trigger:hover {
		background: var(--accent-muted);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
		color: var(--accent-strong);
		transform: translateY(-2px);
	}

	.fn-trigger.fn-open {
		background: var(--accent);
		border-color: var(--accent);
		color: #160d14;
	}

	.fn-dot {
		position: absolute;
		top: 9px;
		right: 9px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent-strong);
		border: 1.5px solid var(--surface-elevated);
	}

	/* ── Floating window ─────────────────────────────────────────────────────── */
	.fn-window {
		position: fixed;
		z-index: 199;
		width: 308px;
		display: flex;
		flex-direction: column;
		background: var(--surface-elevated);
		border: 1px solid var(--border);
		border-radius: 16px;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.12);
		overflow: hidden;
	}

	.fn-dragging { box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15); }

	/* ── Header / drag handle ────────────────────────────────────────────────── */
	.fn-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.55rem 0.65rem 0.55rem 0.75rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
		flex-shrink: 0;
	}

	.fn-dragging .fn-header { cursor: grabbing; }

	.fn-header-left {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		min-width: 0;
	}

	:global(.grip) { color: var(--text-dim); flex-shrink: 0; }

	.fn-title {
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-muted);
		white-space: nowrap;
	}

	.fn-count {
		font-size: 0.62rem;
		color: var(--text-dim);
		white-space: nowrap;
	}

	.fn-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--text-dim);
		cursor: pointer;
		flex-shrink: 0;
		transition: background 0.12s, color 0.12s;
	}

	.fn-close:hover { background: var(--surface-elevated); color: var(--text); }

	/* ── Textarea ────────────────────────────────────────────────────────────── */
	textarea {
		flex: 1;
		width: 100%;
		min-height: 220px;
		max-height: 55vh;
		resize: none;
		background: var(--surface-elevated);
		border: none;
		color: var(--text);
		font-size: 0.84rem;
		font-family: inherit;
		line-height: 1.65;
		padding: 0.85rem;
		outline: none;
	}

	textarea::placeholder {
		color: var(--text-dim);
		line-height: 1.6;
	}

	/* ── Footer ─────────────────────────────────────────────────────────────── */
	.fn-footer {
		padding: 0.3rem 0.75rem;
		border-top: 1px solid var(--border);
		background: var(--surface);
		flex-shrink: 0;
	}

	.fn-footer span {
		font-size: 0.6rem;
		color: var(--text-dim);
		font-weight: 700;
	}
</style>
