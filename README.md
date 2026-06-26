# Out of Tutorial Hell

A gamified, project-driven coding course platform for complete beginners. No passive watching — every lesson ends with something you built.

## Why this exists

Most beginners get stuck in tutorial hell: they watch videos, feel like they're learning, then can't build anything on their own. This app breaks that loop with short focused lessons, real in-browser coding challenges, and XP + streaks to keep momentum.

## Courses

| Course | What you build |
|--------|---------------|
| Getting Started | Programming fundamentals — C |
| Web Development | Websites with HTML, CSS, and JavaScript |

More courses planned: Python, and beyond.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | SvelteKit 2 + Svelte 5, Bun, Tailwind v4 |
| Backend | NestJS, Prisma 7, Supabase (PostgreSQL) |
| Types | JSDoc — no `.ts` files |

## Running locally

**Prerequisites:** [Bun](https://bun.sh), Node 20+

### Frontend

```bash
bun install
bun run dev        # → http://localhost:5173
```

### Backend (optional — needed for auth and progress sync)

```bash
cd backend
cp .env.example .env    # fill in Supabase URLs
bun install
bun run start:dev       # → http://localhost:3001
```

The frontend proxies `/api` to `:3001`, so you can run either separately.

## Contributing

The best way to contribute is to **add or improve a course** — no coding required, just Markdown and JSON files.

To contribute code:

1. Fork the repo
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Open a PR against `main`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete course-creation guide and [docs.md](docs.md) for the full reference (all config options, test types, feature flags).

## Adding a course

Courses live in `courses/`. Each course is a folder with:

```
courses/
  my-course/
    meta.json          ← course title, description, author
    config.json        ← optional feature flags
    lessons/
      1/               ← folder number = lesson order
        lesson.md      ← theory or practice lesson
        challenge.json ← optional coding challenge
      2/
        lesson.md
```

No code changes needed. The app picks up new courses automatically. Full walkthrough in [CONTRIBUTING.md](CONTRIBUTING.md).

## Project structure

```
src/
  routes/          SvelteKit pages
  lib/
    components/    UI components
    courses.js     Course loader (reads courses/ folder)
    checker.js     In-browser test runner
    utils/         Progress, notes, tracer, walkthrough
courses/           All course content lives here
backend/           NestJS API
```
