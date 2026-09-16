# Out of Tutorial Hell

Gamified, no-login coding course web app for complete beginners.
Live: <https://outth.hiyokun.dev>

## The one rule

Every lesson ends with something the user built, not something they watched.
If a change makes the app more passive, it's the wrong change.

## Audience

Zero coding experience. Frustrated tutorial-watchers who still can't build
anything. People who feel overwhelmed and need a single obvious next step.

Write lesson prose for that person: second person, blunt, no jargon without
a definition, no "simply" or "just". Short paragraphs.

## Non-negotiables

Violating any of these means rework, so check before building:

- **No login, no accounts, no server-side user data.** The landing page
  promises this explicitly. Progress, XP, notes, streaks and lesson state
  live in localStorage only.
- **No original slide text from copyrighted course material.** All lesson
  prose is written from scratch.
- **Light and dark mode both work.** Every component, every widget.
- **No new dependencies without asking.** Bundle size matters for a site
  aimed at people on cheap laptops and phones.

## Stack

- **SvelteKit 2 + Svelte 5** (runes: `$state`, `$derived`, `$props`)
- **Bun** — runtime and package manager
- **JSDoc types only** — no `.ts` files, config in `jsconfig.json`
- **Icons**: `@lucide/svelte`
- **Styling**: CSS custom properties in a theme stylesheet. Dark base
  (`#060712` page, `#181a2d` surface), amber accent (`#ffb15f`,
  `#ff9f4a`), text `#fff7ed` / `#d8c8b8` / `#9f948d`, success `#69d19d`,
  error `#ff6f73`. Use the variables, never hardcode hex.

### Backend — VERIFY BEFORE USING

`backend/` contains a NestJS + Prisma 7 + Supabase setup. **It contradicts
the no-login promise above and may be abandoned.** Before writing anything
that touches it, confirm with the maintainer whether it is live, and what
it is for. Do not add user-data persistence to it.

If it is confirmed live, the Prisma 7 specifics are:

- `schema.prisma` datasource has only `provider` — no `url` / `directUrl`
- `prisma.config.ts` holds the migration URL (`DIRECT_URL`, non-pooled)
- `PrismaClient` takes `{ adapter: new PrismaPg({ connectionString }) }`
- Generated client at `backend/generated/prisma/`, imported as
  `../../generated/prisma/client.js` (nodenext requires the `.js`)
- `bunx prisma generate` after every schema change
- `.env`: `DATABASE_URL` pooled (6543, `?pgbouncer=true`) for runtime,
  `DIRECT_URL` non-pooled (5432) for Migrate

## Course content system

**This is what most tasks touch. Read this section before editing content.**

### Layout

```
courses/
  <slug>/
    meta.json                 # required
    config.json               # optional — language + feature flags
    lessons/
      1/
        <lesson-name>.md      # required
        challenge.json        # optional — makes it a coding challenge
      2/
        ...
```

Vite picks courses up via `import.meta.glob`. Adding a folder is enough —
no registration, no code change.

### meta.json

```json
{
 "title": "Compilation Techniques",
 "description": "One sentence, second person, says what they'll build.",
 "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED",
 "order": 3,
 "icon": "cpu",
 "language": "JavaScript",
 "author": { "name": "hiyo" }
}
```

**`icon` is NOT free-form.** `CONTRIBUTING.md` says emoji; that is wrong.
Real courses use lucide names, and `ICON_MAP` is hardcoded in BOTH
`CourseCard.svelte` and `CourseHeader.svelte`. Anything not in the map
silently falls back to `Terminal` — no error, just a wrong icon.
**To add an icon: extend both maps, keep them in sync, and verify the
export name exists in the installed `@lucide/svelte` version.**

### Lesson frontmatter

```markdown
---
id: 'interrupts'
title: 'Interrupts — how the CPU gets told something happened'
type: 'THEORY'
xpReward: 15
module: 'Foundations'
---
```

`id` must be unique within the course. `module` groups lessons on the
course page. `xpReward` is typically 10–15 for theory, more for challenges.

### Challenges

A `challenge.json` next to the lesson turns it into a coding exercise.
`src/lib/checker.js` runs HTML, CSS and JavaScript **in the browser**;
other languages are sent to **Wandbox**.

**Consequences of that split — do not design around them being false:**

- No filesystem, no network, no hardware, no Android SDK
- C works for algorithms; `fork()`, signals, timers and syscalls do not
- Only use test `check` types that `checker.js` actually implements.
  Read it — don't trust the table in CONTRIBUTING.md.

### Shipped courses

| order | slug            | lessons | XP  |
| ----- | --------------- | ------- | --- |
| 1     | getting-started | 18      | 230 |
| 2     | web-development | 35      | 550 |

The landing page teases Python, React and Backend as what's next. **Any
new course outside that line needs a positioning decision first** — a
separate advanced track, or updated teasers. Don't just add it.

## Gamification

XP and levels per lesson, daily streaks, badges, per-course progress,
challenges unlocking after theory. All localStorage.

## File structure

```
courses/              # all course content — see above
src/
  routes/             # SvelteKit pages
  lib/
    components/       # CourseCard, CourseHeader, LessonRenderer, ...
    widgets/          # interactive lesson components
    courses.js        # glob loader + course resolution
    checker.js        # challenge test runner
    assets/           # favicon, backgrounds
backend/              # NestJS — see VERIFY note above
```

## Commands

```bash
bun run dev      # localhost:5173, proxies /api -> :3001
bun run build
bun run check    # svelte-check; must pass before any commit
```

## Working agreements

- Run `bun run check` and `bun run build` before declaring anything done.
- Report anything changed that wasn't asked for.
- When docs and shipped code disagree, **the shipped code wins** — then
  fix the docs. (`icon` is the live example.)
- Prefer editing an existing course over adding a new one.
- Ask before: adding a dependency, adding a lesson `type`, changing the
  localStorage schema, touching `backend/`.

## Open questions

- Is `backend/` live, or dead? Nothing else should be built on it until
  this is answered.
- Does the markdown renderer allow raw HTML/SVG, or sanitize it? This
  decides whether lessons can carry inline diagrams.
- No test suite exists. Is one wanted?

## Course assets

Assets live **inside the course folder**, co-located with the content they
belong to. A course is self-contained: delete the folder, nothing dangles.

```
courses/
  <slug>/
    meta.json
    assets/
      cover.svg           # course card + header art
      <figure-name>.svg   # per-lesson diagrams
    lessons/
      1/
        interrupts.md
```

Reference them from frontmatter and markdown by filename only — the
loader resolves the path:

```markdown
---
id: 'interrupts'
title: 'Interrupts'
type: 'THEORY'
figure: 'interrupt-cycle.svg'
---
```

### Wiring required (none of this exists yet — build it)

1. Add optional `cover` to `meta.json` (filename, not a path).
2. In `courses.js`, glob the assets alongside the existing content globs:

```js
const assets = import.meta.glob('/courses/**/assets/*.{svg,png,webp}', {
 eager: true,
 query: '?url',
 import: 'default'
});
```

Non-JS assets outside `src/` need `query: '?url'` to get a hashed,
build-safe URL. A bare glob returns the module, not a usable src. 3. Resolve `cover` to its URL when building the course object, and expose
a helper for lesson figures. 4. Render in `CourseCard` and `CourseHeader`, **with a graceful fallback
to the lucide icon when `cover` is absent.** The two shipped courses
have no cover and must keep rendering correctly.

### Asset rules

- **SVG by default.** Small, scales, themeable, no licensing risk, diffs
  readable in git. Raster only for photographs, which this project has
  none of.
- **No downloaded or stock images.** Everything is generated original
  work. No logos, no trademarked marks, no lecture-slide figures.
- **Dark mode is mandatory here too.** A cover with baked-in light colors
  will look broken against the dark shell. Author covers directly in the
  project palette (`#0b0d1c`→`#181a2d` background, `#ffb15f` accent), or
  use `currentColor` and CSS variables so the asset inherits the theme.
- **Cover format**: 400×225 (16:9), `viewBox="0 0 400 225"`, rounded
  corners `rx="18"`, transparent outside the rect.
- **Figures**: full-width, `viewBox="0 0 680 H"`. 680 matches the content
  column so text renders 1:1 — don't shrink the viewBox to hug content,
  center the content inside 680 instead.
- **Every asset needs `role="img"` with `<title>` and `<desc>`.** These
  carry real teaching content; a screen reader user gets nothing from an
  unlabelled diagram.
- **Budget**: keep each SVG under ~15KB. If a diagram needs more, it is
  too complex — split it into two.
- Subject matter follows the course: draw the _mechanism_, not decoration.
  A cover for Operating Systems shows a fetch-execute cycle interrupted;
  it does not show a generic laptop.

## Interactive lessons

`type: "INTERACTIVE"` sits alongside `THEORY` and `CHALLENGE`. The lesson
is still a `.md` file; a `widget` key names a component that renders
inside it.

```markdown
---
id: 'subset-construction'
title: 'Turning an NFA into a DFA'
type: 'INTERACTIVE'
xpReward: 20
module: 'Front End'
widget: 'SubsetConstruction'
---
```

The widget lives at `src/lib/widgets/SubsetConstruction.svelte` and is
resolved by `LessonRenderer` through a registry glob — not a hardcoded
import list, so adding a widget is adding a file.

### Build shared primitives, not per-course systems

Every course gets its own _visual language_, but all of them compose the
same four primitives. This is the difference between a thing that ships
and five half-finished bespoke engines.

- **`<Stepper>`** — ordered stages, one panel at a time, position dots,
  wraps at the end. This is also how cycles are shown; never draw a ring.
- **`<StateMachine>`** — nodes and edges, highlights the active state,
  accepts an input string and walks it symbol by symbol.
- **`<MemoryView>`** — labelled cells or registers whose values change
  per step, with changed cells briefly emphasised.
- **`<Timeline>`** — horizontal axis, events, annotations, scrubber.

Courses compose and style these. Compilation Techniques uses
`StateMachine` for DFA walks; Operating Systems uses `Timeline` +
`MemoryView` for interrupt save/restore; Software Testing uses `Stepper`
for partition-by-partition test derivation. Same parts, different
assembly.

**If a course needs a fifth primitive, add it to the shared set.** Do not
add a one-off component inside a course folder.

### Widget rules

- **State via Svelte 5 runes** (`$state`, `$derived`). No stores for
  local widget state.
- **Deterministic and resettable.** Every widget has a visible reset that
  returns it to its initial state. A learner who breaks it must be able
  to start over without reloading.
- **No hidden correctness.** If a widget shows a wrong answer, it says
  why — inline, next to the control, not in a console.
- **Validate input before acting.** Empty or invalid input shows an
  inline error and stops; it never silently advances.
- **Animation is opt-out**: wrap in
  `@media (prefers-reduced-motion: no-preference)`. Animate `transform`
  and `opacity` only. Keep loops under 2s.
- **Keyboard operable.** Every control reachable by Tab, activated by
  Enter or Space. A stepper's Next must be a real `<button>`.
- **No network.** Widgets are self-contained; they never fetch.

## Mobile

**Responsive is a requirement, not a nice-to-have.** A meaningful share of
"I watched 47 tutorials and still can't build anything" is reading on a
phone. **Test every change at 360px width before calling it done.**

### Layout

- **Nothing side-by-side below 768px.** Editor-and-preview, diagram-and-
  caption, lesson-and-sidebar all stack vertically.
- **Touch targets ≥ 44×44px** with ≥ 8px between them.
- **No hover-only affordances.** Anything revealed on hover must also be
  reachable by tap or be visible by default. Tooltips that only appear on
  hover are invisible on a phone.
- **No horizontal page scroll, ever.** Wide content — tables, code
  blocks, diagrams — scrolls inside its own `overflow-x: auto` container.
- **Avoid `position: fixed` with inputs on screen.** The mobile keyboard
  resizes the viewport and fixed elements end up covering the field the
  user is typing into.

### SVG and figures

`width="100%"` plus a `viewBox` scales correctly by default. The failure
mode is text: a 680px-wide figure squeezed to 360px renders 12px labels
at ~6px. **If a diagram has more than about six text labels, author a
narrower variant or split it**, rather than letting it shrink into
illegibility.

### Code challenges — the hard case

The in-browser editor is where mobile hurts most: no Tab key, aggressive
autocorrect, and half the screen lost to the keyboard.

- Disable autocapitalize, autocorrect and spellcheck on code inputs
- Provide an on-screen row for the characters a phone keyboard buries:
  `{ } [ ] ( ) < > ; : " ' / \ | = _ $ Tab`
- Keep starter code short — a learner should not have to scroll
  horizontally to read the line they are editing
- Results and error messages appear **below** the editor, in flow, so
  they are not hidden behind the keyboard
- If a challenge is genuinely unreasonable on a phone, say so in the
  lesson rather than letting the learner fail silently

### Widgets on mobile

Widgets get the same 360px test. Drag interactions need a tap or button
alternative — a scrubber must also have Prev and Next buttons. Sliders
are fine; hover-to-reveal is not.
