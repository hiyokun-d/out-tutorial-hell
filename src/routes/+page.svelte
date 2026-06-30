<script>
	import '$lib/styles/Landingpage.css';

	// @ts-nocheck
	import { onMount } from 'svelte';
	import { animate, stagger } from 'animejs';
	import FaultyTerminal from '$lib/components/FaultyTerminal.svelte';
	import FuzzyText from '$lib/components/FuzzyText.svelte';
	import {
		ArrowBigRightDashIcon,
		ArrowRight,
		BookOpenIcon,
		CheckCircle,
		CheckCircle2,
		CheckCircle2Icon,
		CheckLineIcon,
		FileTerminal,
		Lock,
		Star
	} from '@lucide/svelte';
	import { getLearningSnapshot } from '$lib/utils/local-data.js';
	import { getProgress } from '$lib/utils/progress.js';
	import { xpProgress } from '$lib/stores/xp.js';
	import TextMarquee from '$lib/components/TextMarquee.svelte';

	let { data } = $props();
	const { tracks, courses, features, stats } = data;

	const FIRST_LESSON = '/courses/getting-started/1';

	let hasStarted = $state(false);
	let continuehref = $state(FIRST_LESSON);
	let completedLessons = $state(0);
	let userXp = $state(0);
	let progressPercent = $state(0);

	/** @type {string | null} */
	let hoveredTrack = $state(null);
	/** @type {HTMLDivElement | null} */
	let trackListEl = null;

	const COMING_SOON_TRACKS = [
		{
			id: 'python',
			title: 'Python',
			subtitle: 'Learn Python from scratch — scripting, automation, and data basics.',
			skills: ['Variables', 'Loops', 'Functions', 'Files', 'Modules', 'OOP'],
			outcome: 'Automate tasks and write real Python programs.',
			level: 'Coming Soon',
			order: 3,
			locked: true,
			courses: [],
			lessonCount: 0,
			totalXp: 0
		},
		{
			id: 'react-svelte',
			title: 'React / Svelte',
			subtitle: 'Build interactive UIs with a modern component framework.',
			skills: ['Components', 'State', 'Props', 'Effects', 'Routing', 'API calls'],
			outcome: 'Build a real app with a frontend framework.',
			level: 'Coming Soon',
			order: 4,
			locked: true,
			courses: [],
			lessonCount: 0,
			totalXp: 0
		},
		{
			id: 'backend-apis',
			title: 'Backend & APIs',
			subtitle: 'Build servers, REST APIs, and connect to databases.',
			skills: ['HTTP', 'REST', 'Databases', 'Auth', 'Deployment'],
			outcome: 'Ship a full-stack app with a real backend.',
			level: 'Coming Soon',
			order: 5,
			locked: true,
			courses: [],
			lessonCount: 0,
			totalXp: 0
		}
	];

	const allTracks = [...tracks.map((t) => ({ ...t, locked: false })), ...COMING_SOON_TRACKS];

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

		const io = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					animate('.track-item', {
						translateY: [40, 0],
						opacity: [0, 1],
						duration: 650,
						delay: stagger(110),
						easing: 'outExpo'
					});
					io.disconnect();
				}
			},
			{ threshold: 0.05 }
		);

		if (trackListEl) io.observe(trackListEl);

		// ── Random glitch engine ──────────────────────────────────────
		/** @param {number} min @param {number} max @returns {number} */
		const rnd = (min, max) => Math.random() * (max - min) + min;

		/** @param {HTMLElement} el @param {number} [intensity] @param {string} [baseFilter] */
		const glitchBurst = (el, intensity = 1, baseFilter = '') => {
			const count = 3 + Math.floor(rnd(0, 4));
			let step = 0;
			const fire = () => {
				if (step < count) {
					const x = rnd(-8, 8) * intensity;
					const y = rnd(-5, 5) * intensity;
					const skew = rnd(-6, 6) * intensity;
					const br = rnd(0.25, 2.3);
					const hue = rnd(-90, 90);
					const sat = rnd(1, 5);
					el.style.transform = `translate(${x}px,${y}px) skewX(${skew}deg)`;
					el.style.filter = `${baseFilter}brightness(${br}) hue-rotate(${hue}deg) saturate(${sat})`;
					step++;
					setTimeout(fire, 28 + rnd(0, 32));
				} else {
					el.style.transform = '';
					el.style.filter = baseFilter || '';
				}
			};
			fire();
		};

		/** @param {HTMLElement} el @param {number} baseMs @param {number} intensity @param {string} [baseFilter] @returns {() => void} */
		const scheduleGlitch = (el, baseMs, intensity, baseFilter = '') => {
			/** @type {ReturnType<typeof setTimeout>} */
			let timer;
			const loop = () => {
				glitchBurst(el, intensity, baseFilter);
				timer = setTimeout(loop, baseMs + rnd(-600, 1400));
			};
			timer = setTimeout(loop, rnd(100, baseMs * 0.6));
			return () => clearTimeout(timer);
		};

		/** @type {Array<() => void>} */
		const glitchCleanups = [];
		const cardGlitchVariants = ['a', 'b', 'c', 'd'];
		const CARD_DURS = [4.8, 6.2, 3.6];
		const CARD_DELAYS = [0, 2.1, 1.1];

		// Start after stagger completes
		const initTimer = setTimeout(() => {
			// Card-level: assign a random directional CSS variant
			document.querySelectorAll('.locked-card').forEach((card, idx) => {
				const c = /** @type {HTMLElement} */ (card);
				const variant = cardGlitchVariants[Math.floor(Math.random() * cardGlitchVariants.length)];
				c.style.animation = `brutal-glitch-${variant} ${CARD_DURS[idx] ?? 5}s infinite ${CARD_DELAYS[idx] ?? 0}s`;
			});

			// Subtitle: JS-driven random glitch
			document.querySelectorAll('.locked-subtitle').forEach((el, idx) => {
				glitchCleanups.push(scheduleGlitch(/** @type {HTMLElement} */ (el), 4200 + idx * 650, 0.65, 'blur(0.5px) '));
			});

			// Chips: JS-driven random glitch, each offset
			document.querySelectorAll('.locked-chip').forEach((el, idx) => {
				glitchCleanups.push(scheduleGlitch(/** @type {HTMLElement} */ (el), 2800 + (idx % 5) * 380, 0.45, 'blur(0.8px) '));
			});
		}, 1400);

		return () => {
			io.disconnect();
			clearTimeout(initTimer);
			glitchCleanups.forEach((fn) => fn());
		};
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

<!-- Marquee transition: tech stack -->
<div
	class="border-y border-white/5 py-5 backdrop-blur-sm bg-gradient-to-b from-gray-900/20 to-[#060712]/10"
>
	<TextMarquee
		text="Happy Learning ✦ Keep coding ✦ i don't know what to type anymore ✦ do something ✦ just do it ✦"
		baseVelocity={-4}
		scrollDependent={true}
		class="jersey-15-regular text-[2vw] text-white/40 tracking-widest uppercase"
	/>
</div>

<!-- Section 2 -->
<section class="py-5 px-2">
	<!-- Cards -->
	<div class="flex justify-center gap-3 max-w-6xl mx-auto">
		{#each features as feature}
			<article
				class="relative flex-1 bg-blue-950/65 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 backdrop-blur-sm"
			>
				<div class="pr-6">
					<FuzzyText
						text={feature.title}
						fontSize={20}
						baseIntensity={0.07}
						hoverIntensity={0.28}
						enableHover={true}
						fuzzRange={12}
						fps={25}
						direction="horizontal"
						transitionDuration={0}
						clickEffect={false}
						glitchMode={false}
					/>
				</div>
				<p class="jersey-15-regular text-sm text-white/50 leading-relaxed">{feature.detail}</p>
			</article>
		{/each}
	</div>
</section>


<!-- Section 3: Courses -->
<section class="relative py-24 px-6 overflow-hidden">
	<!-- Ambient blobs -->
	<div class="pointer-events-none absolute inset-0">
		<div class="absolute top-1/3 -left-20 w-[700px] h-[700px] rounded-full bg-blue-700/8 blur-[130px]" />
		<div class="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/6 blur-[110px]" />
	</div>

	<div class="relative z-10 max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<span class="jersey-15-regular text-orange-400 text-sm tracking-[0.3em] uppercase">
				// courses
			</span>
			<h2 class="jersey-15-regular text-5xl text-white mt-2 leading-tight">
				Start With What<br />You Want to Learn
			</h2>
			<p class="jersey-15-regular text-white/40 text-lg mt-3 max-w-xl">
				Pick a path. Follow it. Ship something real at the end. No fluff — just code.
			</p>
		</div>

		<!-- Bento grid -->
		<div class="grid grid-cols-3 gap-4" bind:this={trackListEl}>
			{#each allTracks.slice(0, 5) as track, i}
				<article
					class="bento-card track-item relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300
						{i === 0 ? 'col-span-2 min-h-[300px]' : i === 1 ? 'col-span-1 min-h-[300px]' : 'col-span-1 min-h-[210px]'}
						{track.locked
						? 'border-white/8 bg-[#070810]/90 backdrop-blur-xl'
						: 'border-white/12 bg-[#0f1330]/88 backdrop-blur-xl hover:border-white/22'}"
					style="opacity: 0;"
					onmousemove={(e) => {
						if (track.locked) return;
						const r = e.currentTarget.getBoundingClientRect();
						e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
						e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
					}}
					onmouseenter={() => !track.locked && (hoveredTrack = track.id)}
					onmouseleave={() => (hoveredTrack = null)}
				>
					<!-- Spotlight glow -->
					{#if !track.locked}
						<div class="bento-glow absolute inset-0 pointer-events-none z-0" />
					{/if}

					<!-- Scanlines on locked cards -->
					{#if track.locked}
						<div
							class="absolute inset-0 pointer-events-none z-10 opacity-60"
							style="background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px);"
						/>
					{/if}

					<!-- Top accent stripe -->
					<div
						class="h-[2px] w-full shrink-0 {track.locked
							? 'bg-white/8'
							: 'bg-gradient-to-r from-orange-500 via-orange-300 to-transparent'}"
					/>

					<!-- Content -->
					<div class="relative z-[1] flex flex-col flex-1 {i === 0 ? 'p-6' : 'p-5'}">
						<!-- Number + badge row -->
						<div class="flex items-start justify-between mb-3">
							{#if track.locked}
								<FuzzyText
									text={String(track.order).padStart(2, '0')}
									fontSize={48}
									color="rgba(255,255,255,0.08)"
									baseIntensity={0.44}
									hoverIntensity={0.78}
									enableHover={true}
									fuzzRange={42}
									fps={35}
									direction="horizontal"
									transitionDuration={0}
									clickEffect={false}
									glitchMode={true}
									glitchInterval={([1900, 2700, 1550])[i - 2] ?? 2100}
									glitchDuration={([420, 310, 490])[i - 2] ?? 410}
								/>
							{:else}
								<span
									class="jersey-15-regular leading-none tabular-nums select-none {i === 0
										? 'text-6xl'
										: 'text-5xl'} text-orange-400/35"
								>
									{String(track.order).padStart(2, '0')}
								</span>
							{/if}
							{#if !track.locked}
								<span
									class="jersey-15-regular text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-orange-400/15 text-orange-300 border border-orange-400/25"
								>
									{track.level}
								</span>
							{:else}
								<span
									class="jersey-15-regular inline-flex items-center text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-red-950/60 border border-red-500/25"
								>
									<FuzzyText
										text="CORRUPTED"
										fontSize={10}
										color="rgba(248,113,113,0.7)"
										baseIntensity={0.32}
										hoverIntensity={0.68}
										enableHover={true}
										fuzzRange={12}
										fps={25}
										direction="vertical"
										transitionDuration={0}
										clickEffect={false}
										glitchMode={true}
										glitchInterval={([730, 980, 840])[i - 2] ?? 850}
										glitchDuration={([270, 350, 210])[i - 2] ?? 280}
									/>
								</span>
							{/if}
						</div>

						<!-- Title -->
						<div class="mb-1.5">
							{#if track.locked}
								<FuzzyText
									text={track.title}
									fontSize={i === 0 ? 26 : 20}
									baseIntensity={0.52}
									hoverIntensity={0.95}
									enableHover={true}
									fuzzRange={52}
									fps={45}
									direction="horizontal"
									transitionDuration={0}
									clickEffect={true}
									glitchMode={true}
									glitchInterval={([520, 780, 610])[i - 2] ?? 650}
									glitchDuration={([500, 370, 560])[i - 2] ?? 460}
								/>
							{:else}
								<h3 class="jersey-15-regular text-white leading-tight {i === 0 ? 'text-2xl' : 'text-xl'}">
									{track.title}
								</h3>
							{/if}
						</div>

						<!-- Subtitle -->
						{#if track.locked}
							<p
								class="locked-subtitle jersey-15-regular text-sm leading-relaxed text-white/18"
								style="filter: blur(0.5px);"
							>
								{(track.subtitle.split('—')[0] ?? track.subtitle).trim()}
							</p>
						{:else}
							<p class="jersey-15-regular text-sm leading-relaxed text-white/55">
								{i === 0 ? track.subtitle : (track.subtitle.split('—')[0] ?? track.subtitle).trim()}
							</p>
						{/if}

						<!-- Skills chips -->
						<div class="flex flex-wrap gap-1.5 mt-3 flex-1 content-start">
							{#each (i === 0 ? track.skills : track.skills.slice(0, i === 1 ? 5 : 3)) as skill, si}
								<span
									class="{track.locked ? 'locked-chip ' : ''}jersey-15-regular text-[10px] tracking-wide px-2 py-0.5 rounded-full border {track.locked
										? 'bg-white/3 border-white/8 text-white/20'
										: 'bg-white/5 border-white/12 text-white/55 hover:border-orange-400/30 hover:text-white/75 transition-all duration-150'}"
									style={track.locked ? 'filter: blur(0.8px);' : ''}
								>
									{track.locked ? skill.replace(/[aeiou]/gi, (c) => Math.random() > 0.5 ? '?' : c) : skill}
								</span>
							{/each}
						</div>

						<!-- Footer -->
						{#if !track.locked}
							<div class="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
								<div class="jersey-15-regular text-sm space-x-3">
									<span class="text-white/35">{track.lessonCount} lessons</span>
									<span class="text-orange-400/55">{track.totalXp} XP</span>
								</div>
								{#if track.courses[0]}
									<a
										href="/courses/{track.courses[0].id}"
										class="jersey-15-regular inline-flex items-center gap-1.5 bg-orange-400 hover:bg-orange-300 text-black px-4 py-1.5 rounded-lg text-sm transition-all duration-100 hover:scale-105 active:scale-95"
										style="box-shadow: 2px 2px 0 #c2410c;"
										onmouseenter={(e) => (e.currentTarget.style.boxShadow = '1px 1px 0 #c2410c')}
										onmouseleave={(e) => (e.currentTarget.style.boxShadow = '2px 2px 0 #c2410c')}
										onmousedown={(e) => (e.currentTarget.style.boxShadow = 'none')}
										onmouseup={(e) => (e.currentTarget.style.boxShadow = '1px 1px 0 #c2410c')}
										aria-label="Open {track.title}"
									>
										Start <ArrowRight size={13} />
									</a>
								{/if}
							</div>
						{:else}
							<div class="mt-4 pt-3 border-t border-red-500/10">
								<FuzzyText
									text="— ACCESS DENIED —"
									fontSize={10}
									baseIntensity={0.38}
									hoverIntensity={0.75}
									enableHover={true}
									fuzzRange={18}
									fps={30}
									direction="horizontal"
									transitionDuration={0}
									clickEffect={false}
									glitchMode={true}
									glitchInterval={([850, 620, 1050])[i - 2] ?? 800}
									glitchDuration={([320, 480, 280])[i - 2] ?? 370}
								/>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		<!-- See full roadmap button -->
		<div class="mt-10 flex justify-center">
			<a
				href="/courses"
				class="jersey-15-regular group relative inline-flex items-center gap-3 border border-white/10 hover:border-white/25 px-8 py-3.5 text-xl text-white/50 hover:text-white/80 transition-all duration-200 rounded-xl backdrop-blur-sm overflow-hidden"
			>
				<div
					class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
				/>
				<span class="relative">See full roadmap</span>
				<ArrowRight
					size={18}
					class="relative transition-transform duration-200 group-hover:translate-x-1"
				/>
			</a>
		</div>
	</div>
</section>

<!-- last section should be having a lanyard effect -->

<style>
	/* variant-a: right-dominant + diagonal */
	@keyframes brutal-glitch-a {
		0%, 86%, 100% { transform: translateY(0); filter: none; }
		87% { transform: translate(9px, -3px) skewX(-5deg); filter: brightness(1.8) hue-rotate(50deg) saturate(3.5); }
		88% { transform: translate(-5px, 2px) skewX(3deg); filter: brightness(0.35) hue-rotate(-35deg); }
		89% { transform: translate(12px, -1px) skewX(-4deg); filter: brightness(2.2) hue-rotate(-20deg) saturate(5); }
		90% { transform: translate(-8px, 4px) skewX(2deg); filter: brightness(0.25) hue-rotate(60deg); }
		91% { transform: translate(6px, -2px); filter: brightness(1.6) saturate(2.5); }
		92% { transform: translate(-3px, 1px) skewX(-1deg); filter: brightness(0.55); }
		93% { transform: translateY(0); filter: none; }
	}

	/* variant-b: left-dominant + vertical mix */
	@keyframes brutal-glitch-b {
		0%, 87%, 100% { transform: translateY(0); filter: none; }
		88% { transform: translate(-11px, 3px) skewX(7deg); filter: brightness(1.9) hue-rotate(-55deg) saturate(4); }
		89% { transform: translate(5px, -6px) skewX(-3deg); filter: brightness(0.3) hue-rotate(40deg); }
		90% { transform: translate(-13px, 2px) skewX(6deg); filter: brightness(2.4) hue-rotate(70deg) saturate(6); }
		91% { transform: translate(7px, -4px) skewX(-4deg); filter: brightness(0.2); }
		92% { transform: translate(-5px, 5px) skewX(2deg); filter: brightness(1.5) hue-rotate(-25deg); }
		93% { transform: translate(3px, -2px); filter: brightness(0.65) saturate(1.8); }
		94% { transform: translateY(0); filter: none; }
	}

	/* variant-c: vertical-dominant + Y-axis slam */
	@keyframes brutal-glitch-c {
		0%, 88%, 100% { transform: translateY(0); filter: none; }
		89% { transform: translate(3px, -10px) skewX(-3deg); filter: brightness(2) hue-rotate(80deg) saturate(4.5); }
		90% { transform: translate(-2px, 12px) skewX(2deg); filter: brightness(0.28) hue-rotate(-45deg); }
		91% { transform: translate(5px, -7px) skewX(-5deg); filter: brightness(2.5) saturate(6) hue-rotate(25deg); }
		92% { transform: translate(-4px, 8px) skewX(4deg); filter: brightness(0.35) hue-rotate(55deg); }
		93% { transform: translate(1px, -4px); filter: brightness(1.7); }
		94% { transform: translateY(0); filter: none; }
	}

	/* variant-d: full chaos, max magnitude */
	@keyframes brutal-glitch-d {
		0%, 85%, 100% { transform: translateY(0); filter: none; }
		86% { transform: translate(-12px, 7px) skewX(8deg); filter: brightness(2.2) hue-rotate(100deg) saturate(7); }
		87% { transform: translate(14px, -9px) skewX(-7deg); filter: brightness(0.18) hue-rotate(-90deg); }
		88% { transform: translate(-9px, 11px) skewX(5deg); filter: brightness(2.8) saturate(8) hue-rotate(50deg); }
		89% { transform: translate(11px, -7px) skewX(-6deg); filter: brightness(0.12); }
		90% { transform: translate(-6px, 5px) skewX(4deg); filter: brightness(2) hue-rotate(-70deg) saturate(4); }
		91% { transform: translate(7px, -4px) skewX(-3deg); filter: brightness(0.45) hue-rotate(40deg); }
		92% { transform: translate(-4px, 6px); filter: brightness(1.4); }
		93% { transform: translate(5px, -3px); filter: brightness(0.6) saturate(2.5); }
		94% { transform: translateY(0); filter: none; }
	}

	.bento-glow {
		background: radial-gradient(
			300px circle at var(--mx, 50%) var(--my, 50%),
			rgba(251, 146, 60, 0.09),
			transparent 70%
		);
		opacity: 0;
		transition: opacity 0.35s;
	}

	.bento-card:hover .bento-glow {
		opacity: 1;
	}
</style>
