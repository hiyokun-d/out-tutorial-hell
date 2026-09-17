<script>
	/**
	 * Renders a course asset resolved by getCourseAsset(). SVGs go inline so their
	 * f-* / s-* classes pick up the theme; rasters fall back to <img>.
	 * @type {{ art: { svg: string | null, url: string | null }, alt?: string, decorative?: boolean, class?: string }}
	 */
	let { art, alt = '', decorative = false, class: className = '' } = $props();
</script>

{#if art.svg}
	<div class="art {className}" aria-hidden={decorative || undefined}>{@html art.svg}</div>
{:else if art.url}
	<img class="art {className}" src={art.url} alt={decorative ? '' : alt} loading="lazy" />
{/if}
