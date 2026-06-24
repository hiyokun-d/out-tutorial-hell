<script></script>

<svelte:head><title>Out of Tutorial Hell · Learn to code by building</title></svelte:head>

<main>
	<section class="hero">
		<div class="badge">⚡ Built for beginners who are done watching</div>
		<h1>Stop watching.<br />Start building.</h1>
		<p class="tagline">
			Most courses teach you to copy-paste. This one teaches you to actually code —
			through short lessons, real challenges, and instant feedback.
		</p>
		<div class="hero-actions">
			<a href="/courses" class="btn-primary">Start learning free →</a>
		</div>
	</section>

	<section class="how">
		<h2>How it works</h2>
		<div class="steps">
			<div class="step">
				<span class="step-num">01</span>
				<h3>Read a short lesson</h3>
				<p>No 3-hour videos. Each concept fits in 5 minutes.</p>
			</div>
			<div class="step">
				<span class="step-num">02</span>
				<h3>Solve a real challenge</h3>
				<p>Write actual code in the browser. Tests check your work instantly.</p>
			</div>
			<div class="step">
				<span class="step-num">03</span>
				<h3>Earn XP &amp; level up</h3>
				<p>Every lesson you complete builds your streak and earns XP.</p>
			</div>
		</div>
	</section>

	<section class="courses-preview">
		<h2>Start with Web Development</h2>
		<p class="section-sub">HTML → CSS → JavaScript. Build real websites from day one.</p>
		<a href="/courses" class="btn-outline">Browse all courses →</a>
	</section>

	<section class="difference">
		<div class="col">
			<h3 class="red">Tutorial hell</h3>
			<ul>
				<li>Watch someone else code</li>
				<li>Feel like you understand</li>
				<li>Try to build something — blank</li>
				<li>Watch more tutorials</li>
			</ul>
		</div>
		<div class="vs">vs</div>
		<div class="col">
			<h3 class="green">Out of Tutorial Hell</h3>
			<ul>
				<li>Read a clear, short concept</li>
				<li>Write code yourself, instantly</li>
				<li>Get feedback in real time</li>
				<li>Build actual projects</li>
			</ul>
		</div>
	</section>

	<section class="cta">
		<h2>Ready to actually learn?</h2>
		<a href="/courses" class="btn-primary">Start now, it's free →</a>
	</section>
</main>

<style>
	main {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 2rem 5rem;
	}

	/* ── Hero ── */
	.hero {
		text-align: center;
		padding: 5rem 1rem 4rem;
	}

	.badge {
		display: inline-block;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--accent);
		background: var(--accent-muted);
		border: 1px solid rgba(99, 102, 241, 0.25);
		border-radius: 999px;
		padding: 0.3rem 0.9rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: clamp(2.2rem, 6vw, 3.5rem);
		font-weight: 900;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--text);
		margin: 0 0 1.25rem;
	}

	.tagline {
		max-width: 520px;
		margin: 0 auto 2.25rem;
		color: var(--text-muted);
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* ── How it works ── */
	.how {
		padding: 4rem 0;
		border-top: 1px solid var(--border);
	}

	.how h2,
	.courses-preview h2,
	.cta h2 {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text);
		margin: 0 0 1.75rem;
		letter-spacing: -0.02em;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1.25rem;
	}

	.step {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.step-num {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--accent);
		letter-spacing: 0.1em;
	}

	.step h3 {
		margin: 0.5rem 0 0.4rem;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text);
	}

	.step p {
		margin: 0;
		font-size: 0.88rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	/* ── Courses preview ── */
	.courses-preview {
		padding: 3rem 0;
		border-top: 1px solid var(--border);
	}

	.section-sub {
		color: var(--text-muted);
		font-size: 0.95rem;
		margin: -1rem 0 1.5rem;
	}

	/* ── Difference section ── */
	.difference {
		padding: 3rem 0;
		border-top: 1px solid var(--border);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 2rem;
		align-items: start;
	}

	.vs {
		color: var(--text-dim);
		font-size: 1.1rem;
		font-weight: 700;
		padding-top: 2.5rem;
	}

	.col h3 {
		margin: 0 0 1rem;
		font-size: 1rem;
		font-weight: 800;
	}

	.red { color: var(--error); }
	.green { color: var(--success); }

	.col ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.col li {
		font-size: 0.9rem;
		color: var(--text-muted);
		padding-left: 1rem;
		position: relative;
	}

	.col li::before {
		content: '×';
		position: absolute;
		left: 0;
		color: var(--error);
	}

	.green ~ ul li::before,
	.col:last-of-type li::before {
		content: '✓';
		color: var(--success);
	}

	/* ── CTA ── */
	.cta {
		padding: 4rem 0 0;
		border-top: 1px solid var(--border);
		text-align: center;
	}

	/* ── Buttons ── */
	.btn-primary {
		display: inline-block;
		text-decoration: none;
		background: var(--accent);
		color: #fff;
		font-size: 0.95rem;
		font-weight: 700;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: background 0.15s;
	}

	.btn-primary:hover { background: var(--accent-hover); }

.btn-outline {
		display: inline-block;
		text-decoration: none;
		color: var(--accent);
		border: 1px solid var(--accent);
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.6rem 1.2rem;
		border-radius: 8px;
		transition: background 0.15s;
	}

	.btn-outline:hover {
		background: var(--accent-muted);
	}
</style>
