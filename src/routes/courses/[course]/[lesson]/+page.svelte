<script>
	import TheoryLesson from '$lib/components/TheoryLesson.svelte';
	import ChallengeEditor from '$lib/components/ChallengeEditor.svelte';
	import WalkthroughLesson from '$lib/components/WalkthroughLesson.svelte';

	let { data } = $props();
	let course = $derived(data.course);
	let lesson = $derived(data.lesson);
	let prev = $derived(data.prev);
	let next = $derived(data.next);
	let config = $derived(data.config);
</script>

{#key lesson.id}
	{#if lesson.type === 'WALKTHROUGH'}
		<WalkthroughLesson {lesson} {course} {prev} {next} {config} courseSlug={course.id} lessonId={lesson.id} />
	{:else if lesson.challenge}
		<ChallengeEditor {lesson} {course} {prev} {next} {config} courseSlug={course.id} lessonId={lesson.id} />
	{:else}
		<TheoryLesson {lesson} {course} {prev} {next} {config} courseSlug={course.id} lessonId={lesson.id} />
	{/if}
{/key}
