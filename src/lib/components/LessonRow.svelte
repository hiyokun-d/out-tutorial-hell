<script>
	const typeLabel = { THEORY: 'Theory', CHALLENGE: 'Challenge', PROJECT: 'Project' };
	const typeColor = { THEORY: '#e0e7ff', CHALLENGE: '#fef3c7', PROJECT: '#d1fae5' };
	const typeText = { THEORY: '#4338ca', CHALLENGE: '#92400e', PROJECT: '#065f46' };

	/** @type {{ lesson: any, courseId: string }} */
	let { lesson, courseId } = $props();
</script>

<a href="/courses/{courseId}/{lesson.id}" class="lesson-row">
	<span class="lesson-num">{lesson.order}</span>
	<span class="lesson-title">{lesson.title}</span>
	<span class="badge" style="background:{typeColor[lesson.type]};color:{typeText[lesson.type]}">
		{typeLabel[lesson.type]}
	</span>
	<span class="xp">+{lesson.xpReward} XP</span>
</a>

<style>
	.lesson-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s;
	}

	.lesson-row:hover {
		border-color: #6366f1;
	}

	.lesson-num {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		color: #374151;
		flex-shrink: 0;
	}

	.lesson-title {
		flex: 1;
		font-weight: 500;
	}

	.badge {
		font-size: 0.7rem;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		font-weight: 600;
	}

	.xp {
		font-size: 0.8rem;
		color: #6b7280;
		font-weight: 600;
	}
</style>
