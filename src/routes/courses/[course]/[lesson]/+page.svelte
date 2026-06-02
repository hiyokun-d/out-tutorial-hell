<script>
	import TheoryLesson from '$lib/components/TheoryLesson.svelte';
	import ChallengeEditor from '$lib/components/ChallengeEditor.svelte';

	let { data } = $props();
	const { course, lesson, prev, next, config } = data;
</script>

{#if lesson.challenge}
	<ChallengeEditor {lesson} {course} {prev} {next} {config} />
{:else}
	<TheoryLesson {lesson} {course} {prev} {next} />
{/if}
