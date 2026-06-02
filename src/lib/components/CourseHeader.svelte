<script>
	/** @type {{ course: { icon: string, title: string, description: string } }} */
	let { course } = $props();
</script>

<header>
	<span class="icon">{course.icon}</span>
	<div>
		<h1>{course.title}</h1>
		<p>{course.description}</p>
	</div>
</header>

<style>
	header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		margin: 1.5rem 0 2rem;
	}

	.icon {
		font-size: 3rem;
		line-height: 1;
	}

	h1 {
		margin: 0 0 0.25rem;
	}

	p {
		margin: 0;
		color: #555;
	}
</style>
