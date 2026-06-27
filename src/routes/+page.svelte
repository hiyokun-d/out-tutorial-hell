<script>
	import FaultyTerminal from '$lib/components/FaultyTerminal.svelte';
	import FuzzyText from '$lib/components/FuzzyText.svelte';
</script>

<svelte:head>
	<style>
		/* remove layout padding on landing page */
		.main-content {
			padding: 0 !important;
		}
	</style>
</svelte:head>

<!-- Section 1: Hero with FaultyTerminal background -->
<section class="relative h-screen overflow-hidden bg-black">
	<div class="pointer-events-none absolute inset-0">
		<FaultyTerminal
			scale={1.2}
			digitSize={1.4}
			timeScale={0.4}
			scanlineIntensity={0.6}
			curvature={0.18}
			tint="#002e7a"
			mouseReact={true}
			mouseStrength={0.7}
			globalMouse={true}
			pageLoadAnimation={true}
			noiseAmp={1}
			brightness={0.8}
		/>
	</div>

	<!-- Hero content -->
	<div class="relative z-10 flex h-full items-center justify-center">
		<FuzzyText
			text="404"
			baseIntensity={0.2}
			hoverIntensity={0.5}
			enableHover={true}
			fuzzRange={30}
			fps={60}
			direction="horizontal"
			transitionDuration={0}
			clickEffect={false}
			glitchMode={false}
			glitchInterval={2000}
			glitchDuration={200}
			letterSpacing={0}
			fontSize={140}
		/>
	</div>
</section>

<!-- Section 2 -->
<section class="min-h-screen"></section>

<!-- Section 3 -->
<section class="min-h-screen"></section>
