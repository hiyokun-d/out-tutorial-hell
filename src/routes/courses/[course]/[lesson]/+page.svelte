<script>
	import TheoryLesson from '$lib/components/TheoryLesson.svelte';
	import ChallengeEditor from '$lib/components/ChallengeEditor.svelte';
	import WalkthroughLesson from '$lib/components/WalkthroughLesson.svelte';

	let { data } = $props();
	const { course, lesson, prev, next, config } = data;
</script>

{#if lesson.type === 'WALKTHROUGH'}
	<WalkthroughLesson {lesson} {course} {prev} {next} {config} courseSlug={course.id} lessonId={lesson.id} />
{:else if lesson.challenge}
	<ChallengeEditor {lesson} {course} {prev} {next} {config} courseSlug={course.id} lessonId={lesson.id} />
{:else}
	<TheoryLesson {lesson} {course} {prev} {next} courseSlug={course.id} lessonId={lesson.id} />
{/if}
