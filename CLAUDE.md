# Out of Tutorial Hell

Gamified coding course web app for complete beginners who want to learn to code but don't know where to start.

## Project Goal

Kill tutorial hell. Most beginners watch tutorials, feel like they learn, then can't build anything. This app fixes that by making learning active, gamified, and project-driven.

## Target Audience

- Zero coding experience
- Frustrated tutorial-watchers who can't build things yet
- People who want to learn but feel overwhelmed

## Stack

### Frontend
- **Framework**: SvelteKit 2 + Svelte 5
- **Runtime/Package Manager**: Bun
- **Types**: JSDoc (no TypeScript files, uses jsconfig.json)
- **Styling**: TBD

### Backend
- **Framework**: NestJS (`backend/`)
- **ORM**: Prisma 7 (with `@prisma/adapter-pg` driver adapter — required in v7)
- **Database**: Supabase (PostgreSQL)

### Prisma 7 quirks
- `schema.prisma` datasource block has **only** `provider` — no `url`/`directUrl`
- `prisma.config.ts` holds the DB URL for migrations (use `DIRECT_URL` = non-pooled)
- `PrismaClient` takes `{ adapter: new PrismaPg({ connectionString }) }` at runtime
- Generated client lives in `backend/generated/prisma/`; import as `../../generated/prisma/client.js` (nodenext requires `.js` extension)
- Run `bunx prisma generate` after any schema change

### Supabase env vars (`backend/.env`)
- `DATABASE_URL` — pooled URL (port 6543, `?pgbouncer=true`) — used by the app at runtime
- `DIRECT_URL` — non-pooled URL (port 5432) — used by Prisma Migrate

## Course Roadmap

### Course 1: Web Development (current focus)
- HTML fundamentals
- CSS fundamentals
- JavaScript fundamentals
- Building real projects

### Future Courses (planned)
- Python
- More TBD

## Gamification System (design intent)

- XP / levels for completing lessons
- Streaks for daily practice
- Badges / achievements
- Progress tracking per course
- Challenges / mini-projects that unlock after theory lessons

## Key Principles

- Every lesson ends with something the user built, not just watched
- No fluff — short focused lessons
- Interactive code challenges in-browser
- Encourage building over consuming

## File Structure

```
src/
  routes/       # SvelteKit pages
  lib/          # Shared components, utils, stores
    assets/     # Static assets (favicon, etc)
```

## Dev Commands

### Frontend (root)
```bash
bun run dev        # SvelteKit dev server (localhost:5173), proxies /api → :3001
bun run build
bun run check
```

### Backend (`backend/`)
```bash
bun run start:dev              # NestJS dev server (localhost:3001)
bunx prisma generate           # regenerate client after schema changes
bunx prisma migrate dev        # run migrations (needs DIRECT_URL set)
bunx prisma studio             # GUI for the database
```
