<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	let {
		text = '',
		baseVelocity = -5,
		class: className = '',
		scrollDependent = true,
		delay = 0
	} = $props();

	function wrap(min, max, v) {
		const rangeSize = max - min;
		return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
	}

	let baseX = $state(0);
	let translateX = $derived(`${wrap(-20, -45, baseX)}%`);

	let directionFactor = 1;
	let started = false;
	let scrollY = 0;
	let lastScrollY = 0;
	let smoothVelocity = 0;
	let lastTime = 0;
	let rafId = 0;
	let hovered = $state(false);

	onMount(() => {
		scrollY = window.scrollY;
		lastScrollY = scrollY;

		const onScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		const timer = delay > 0 ? setTimeout(() => (started = true), delay) : null;
		if (delay === 0) started = true;

		function tick(t) {
			rafId = requestAnimationFrame(tick);
			if (lastTime === 0) {
				lastTime = t;
				return;
			}

			const delta = Math.min(t - lastTime, 50);
			lastTime = t;
			if (!started) return;

			const rawVel = (scrollY - lastScrollY) / (delta / 1000);
			lastScrollY = scrollY;

			// spring-smooth the scroll velocity
			smoothVelocity += (rawVel - smoothVelocity) * Math.min(1, (delta / 1000) * 8);

			const vf = (smoothVelocity / 1000) * 2;

			if (scrollDependent) {
				if (vf < 0) directionFactor = -1;
				else if (vf > 0) directionFactor = 1;
			}

			let moveBy = directionFactor * baseVelocity * (delta / 1000);
			moveBy += directionFactor * moveBy * vf;

			// hover: nearly freeze
			if (hovered) moveBy *= 0.08;

			baseX += moveBy;
		}

		rafId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', onScroll);
			if (timer) clearTimeout(timer);
		};
	});
</script>

<div
	class="overflow-hidden whitespace-nowrap flex flex-nowrap select-none cursor-default"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	role="marquee"
	aria-label={text}
>
	<div
		class="flex whitespace-nowrap flex-nowrap gap-10 {className}"
		style="transform: translateX({translateX});"
	>
		<span class="block">{text}</span>
		<span class="block">{text}</span>
		<span class="block">{text}</span>
		<span class="block">{text}</span>
	</div>
</div>
