<script>
	import '$lib/styles/Landingpage.css';

	// @ts-nocheck
	import { onMount } from 'svelte';
	import FaultyTerminal from '$lib/components/FaultyTerminal.svelte';
	import FuzzyText from '$lib/components/FuzzyText.svelte';
	import { ArrowBigRightDashIcon, BookOpenIcon } from '@lucide/svelte';
	import { getLearningSnapshot } from '$lib/utils/local-data.js';
	import { getProgress } from '$lib/utils/progress.js';
	import { xpProgress } from '$lib/stores/xp.js';

	let { data } = $props();
	const { courses, stats } = data;

	const FIRST_LESSON = '/courses/getting-started/1';

	let hasStarted = $state(false);
	let continuehref = $state(FIRST_LESSON);
	let completedLessons = $state(0);
	let userXp = $state(0);
	let progressPercent = $state(0);

	onMount(() => {
		const snapshot = getLearningSnapshot();
		hasStarted = (snapshot?.summary?.completedLessons ?? 0) > 0;
		completedLessons = snapshot?.summary?.completedLessons ?? 0;
		userXp = snapshot?.xp?.xp ?? 0;
		progressPercent = stats.lessons > 0 ? Math.round((completedLessons / stats.lessons) * 100) : 0;

		if (hasStarted) {
			let firstOpen = null;
			for (const course of courses) {
				const done = getProgress(course.id).size;
				if (done > 0 && done < course.lessonCount) {
					firstOpen = course;
					break;
				}
			}
			continuehref = firstOpen ? `/courses/${firstOpen.id}` : '/courses';
		}
	});

	const RING_R = 100;
	const RING_CIRC = 2 * Math.PI * RING_R;
	const ringOffset = $derived(RING_CIRC * (1 - progressPercent / 100));
</script>

<svelte:head>
	<style>
		/* remove layout padding on landing page */
		.main-content {
			padding: 0 !important;
		}
	</style>

	<title>Out of Tutorial HELL</title>
	<meta
		name="description"
		content="A no-login coding roadmap with lessons, browser labs, XP, notes, and instant feedback."
	/>
</svelte:head>

<!-- Section 1: Hero with FaultyTerminal background -->
<section class="relative h-screen overflow-hidden bg-gray-900">
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
			brightness={0.6}
		/>
	</div>

	<!-- Hero content -->
	<div class="relative z-10 flex h-full items-center justify-between px-9 gap-8">
		<!-- Left: text + CTAs -->
		<div class="flex flex-col items-start gap-6">
			<h1 class="flex flex-col items-start">
				<span class="jersey-15-regular text-7xl leading-none">Out of</span>
				<FuzzyText
					class="-ml-[50px]"
					text="Tutorial Hell"
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
					fontSize={90}
				/>
			</h1>
			<p class="jersey-15-regular max-w-lg text-xl leading-relaxed text-white/70">
				you've watched 47 tutorials. you still can't build anything. we get it.<br />
				stop watching. start breaking things.<br />
				<span class="text-white/40 text-base"
					>free. no login. your data stays in your browser (we genuinely don't want it).</span
				>
			</p>

			<div class="flex items-center gap-4">
				<a
					href={continuehref}
					class="jersey-15-regular group flex items-center gap-2 bg-orange-400 px-7 py-3 text-xl text-black transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]"
					style="box-shadow: 4px 4px 0px #c2410c;"
					onmouseenter={(e) => (e.currentTarget.style.boxShadow = '2px 2px 0px #c2410c')}
					onmouseleave={(e) => (e.currentTarget.style.boxShadow = '4px 4px 0px #c2410c')}
					onmousedown={(e) => (e.currentTarget.style.boxShadow = 'none')}
					onmouseup={(e) => (e.currentTarget.style.boxShadow = '2px 2px 0px #c2410c')}
				>
					<ArrowBigRightDashIcon size={18} />
					{hasStarted ? 'Continue Learning' : 'Start Learning'}
				</a>
				<a
					href="/courses"
					class="jersey-15-regular flex items-center gap-2 border-2 border-white/10 px-7 py-3 text-xl text-white/70 transition-all duration-100 hover:border-white/20 hover:text-white bg-black/40 backdrop-blur-md"
				>
					<BookOpenIcon size={18} />
					Browse Courses
				</a>
			</div>
		</div>

		{#if hasStarted}
			<!-- ── STARTED: clean progress card ── -->
			<div
				class="bg-black/50 backdrop-blur-md jersey-15-regular p-5 rounded-2xl border-2 border-gray-300 border-double w-96 mr-24 min-h-[480px] flex flex-col items-center gap-5"
			>
				<div class="flex justify-between w-full items-center">
					<span class="text-2xl">Your progress</span>
					<span class="text-2xl">{userXp} Xp</span>
				</div>

				<!-- Donut ring -->
				<div class="relative flex justify-center items-center">
					<svg width="240" height="240" viewBox="0 0 240 240">
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="rgba(255,255,255,0.07)"
							stroke-width="14"
						/>
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="#fff"
							stroke-width="14"
							stroke-linecap="square"
							stroke-dasharray={RING_CIRC}
							stroke-dashoffset={ringOffset}
							transform="rotate(-90 120 120)"
							style="transition: stroke-dashoffset 0.8s ease"
						/>
					</svg>
					<div
						class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1"
					>
						<span class="text-6xl">{progressPercent}%</span>
						<span class="text-2xl text-gray-500 -mt-3">COMPLETED</span>
					</div>
				</div>

				<!-- Stats -->
				<div class="cards-stats-container flex gap-4 w-full justify-center">
					<div class="cards-stats flex flex-col items-center gap-1">
						<span>{completedLessons}</span>
						<span>Lessons</span>
					</div>
					<div class="cards-stats flex flex-col items-center gap-1">
						<span>{courses.length}</span>
						<span>paths</span>
					</div>
					<div class="cards-stats flex flex-col items-center gap-1">
						<span>{stats.challenges}</span>
						<span>Challenges</span>
					</div>
				</div>
			</div>
		{:else}
			<!-- ── NOT STARTED: glitchy card ── -->
			<div
				class="bg-black/50 backdrop-blur-md jersey-15-regular p-5 rounded-2xl border-2 border-gray-300 border-dashed w-96 mr-24"
			>
				<!-- Header -->
				<div class="flex justify-between w-full items-center">
					<FuzzyText
						text="DASHBOARD ERROR"
						fontSize={18}
						baseIntensity={0.08}
						hoverIntensity={0.3}
						enableHover={true}
						fuzzRange={14}
						fps={30}
						direction="horizontal"
						transitionDuration={0}
						clickEffect={false}
						glitchMode={false}
					/>
					<FuzzyText
						text={`404 NOT FOUND`}
						fontSize={19}
						baseIntensity={0.18}
						hoverIntensity={0.45}
						enableHover={true}
						fuzzRange={20}
						fps={45}
						direction="vertical"
						transitionDuration={0}
						clickEffect={true}
						glitchMode={false}
					/>
				</div>

				<!-- Donut ring with glitch -->
				<div class="relative flex justify-center items-center ring-glitch">
					<svg
						class="ghost-orange absolute"
						width="240"
						height="240"
						viewBox="0 0 240 240"
						style="left:5px;top:-2px;"
						aria-hidden="true"
					>
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="#f97316"
							stroke-width="14"
							stroke-linecap="square"
							stroke-dasharray={RING_CIRC}
							stroke-dashoffset={ringOffset}
							transform="rotate(-90 120 120)"
						/>
					</svg>
					<svg
						class="ghost-purple absolute"
						width="240"
						height="240"
						viewBox="0 0 240 240"
						style="left:-5px;top:2px;"
						aria-hidden="true"
					>
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="#818cf8"
							stroke-width="14"
							stroke-linecap="square"
							stroke-dasharray={RING_CIRC}
							stroke-dashoffset={ringOffset}
							transform="rotate(-90 120 120)"
						/>
					</svg>
					<svg width="240" height="240" viewBox="0 0 240 240">
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="rgba(255,255,255,0.07)"
							stroke-width="14"
						/>
						<circle
							cx="120"
							cy="120"
							r={RING_R}
							fill="none"
							stroke="#fff"
							stroke-width="14"
							stroke-linecap="square"
							stroke-dasharray={RING_CIRC}
							stroke-dashoffset={ringOffset}
							transform="rotate(-90 120 120)"
							style="transition: stroke-dashoffset 0.8s ease"
						/>
					</svg>
					<div
						class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1"
					>
						<FuzzyText
							text={`404`}
							fontSize={52}
							baseIntensity={0.25}
							hoverIntensity={0.6}
							enableHover={true}
							fuzzRange={32}
							fps={60}
							direction="horizontal"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={true}
							glitchInterval={3000}
							glitchDuration={180}
						/>
						<FuzzyText
							text="START NOW"
							fontSize={23}
							baseIntensity={0.05}
							hoverIntensity={0.2}
							enableHover={true}
							fuzzRange={10}
							fps={20}
							direction="vertical"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={false}
						/>
					</div>
				</div>

				<!-- Stats -->
				<div class="flex gap-4 w-full justify-center">
					<div class="flex flex-col items-center gap-1">
						<FuzzyText
							text={'0000'}
							fontSize={28}
							baseIntensity={0.2}
							hoverIntensity={0.5}
							enableHover={true}
							fuzzRange={24}
							fps={40}
							direction="vertical"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={false}
						/>
						<FuzzyText
							text="lessons"
							fontSize={22}
							baseIntensity={0.06}
							hoverIntensity={0.25}
							enableHover={true}
							fuzzRange={8}
							fps={20}
							direction="horizontal"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={false}
						/>
					</div>
					<div class="flex flex-col items-center gap-1">
						<FuzzyText
							text={String(courses.length)}
							fontSize={28}
							baseIntensity={0.3}
							hoverIntensity={0.55}
							enableHover={true}
							fuzzRange={28}
							fps={50}
							direction="horizontal"
							transitionDuration={0}
							clickEffect={true}
							glitchMode={false}
						/>
						<FuzzyText
							text="LESSONS"
							fontSize={22}
							baseIntensity={0.04}
							hoverIntensity={0.2}
							enableHover={true}
							fuzzRange={8}
							fps={20}
							direction="vertical"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={false}
						/>
					</div>
					<div class="flex flex-col items-center gap-1">
						<FuzzyText
							text={'404'}
							fontSize={28}
							baseIntensity={0.22}
							hoverIntensity={0.5}
							enableHover={true}
							fuzzRange={26}
							fps={35}
							direction="vertical"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={true}
							glitchInterval={4000}
							glitchDuration={150}
						/>
						<FuzzyText
							text="no progress"
							fontSize={12}
							baseIntensity={0.1}
							hoverIntensity={0.35}
							enableHover={true}
							fuzzRange={12}
							fps={25}
							direction="horizontal"
							transitionDuration={0}
							clickEffect={false}
							glitchMode={false}
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Section 2 -->
<section class="min-h-screen"></section>

<!-- Section 3 -->
<section class="min-h-screen"></section>

<!-- last section should be having a lanyard effect -->
