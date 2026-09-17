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
  _Fact check (2026-09):_ the app currently ships **dark only**. `theme.css`
  defines one palette on `:root`; the `.dark` block is an unused shadcn
  leftover and nothing toggles it. Build with theme variables so a light
  palette can be added in one place — never hardcode hex.
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

### Backend — removed

`backend/` (NestJS + Prisma + Supabase) was deleted in commit `30b6ba0`
("removing backend for now"). Nothing in `src/` calls it. Leftover:
`vite.config.js` still proxies `/api` → `:3001`, which points at nothing.
The only network call in the app is Wandbox (`src/lib/utils/piston.js`).
Do not reintroduce server-side user data.

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

**`icon` is NOT free-form.** Real courses use lucide names, and `ICON_MAP`
is hardcoded in BOTH `CourseCard.svelte` and `CourseHeader.svelte`. Anything
not in the map silently falls back to `Terminal` — no error, just a wrong
icon. Supported today: `globe terminal cpu compass braces flask-conical
circuit-board smartphone`. **To add an icon: extend both maps, keep them in
sync, and verify the export name exists in the installed `@lucide/svelte`
version** (`ls node_modules/@lucide/svelte/dist/icons`).

`cover` (optional) is a filename in the course's `assets/` folder. When
present, `CourseCard` shows the cover instead of the icon; `CourseHeader`
shows both.

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

`id` must be unique within the course, and it's the localStorage progress
key — renaming a shipped lesson's `id` orphans learners' progress. `module`
groups lessons on the course page. `xpReward` is typically 10–15 for
theory, 20 for interactive, more for challenges. Optional `figure` names an
asset shown at the top of the lesson.

Frontmatter is parsed by a tiny flat parser in `courses.js`: strings,
numbers, booleans only. No nested objects, no lists.

**Lesson page switch** (`src/routes/courses/[course]/[lesson]/+page.svelte`)
is a hardcoded if/else: `type === 'WALKTHROUGH'` → `WalkthroughLesson`
(no lesson uses it); a `.json` in the folder → `ChallengeEditor`;
everything else, including `INTERACTIVE`, → `TheoryLesson`. `type` values
in use: `THEORY`, `PRACTICE`, `INTERACTIVE`. There is no `CHALLENGE` type —
a challenge is defined by the `.json` file existing.

**Markdown renderer**: `marked` v18, no config, no sanitizer, output goes
through `{@html}` (`TheoryLesson.svelte`, `InstructionsPanel.svelte`). Raw
HTML/SVG in a `.md` renders. Content is repo-authored, so that's
acceptable. Still, put figures in `assets/`, not inline in markdown.

### Challenges

A `challenge.json` next to the lesson turns it into a coding exercise.
`src/lib/checker.js` runs HTML, CSS and JavaScript **in the browser**;
other languages are sent to **Wandbox**.

**Consequences of that split — do not design around them being false:**

- No filesystem, no network, no hardware, no Android SDK
- C works for algorithms; `fork()`, signals, timers and syscalls do not
- Only use test `check` types that `checker.js` actually implements.
  `CONTRIBUTING.md`'s tables were corrected against it in 2026-09, and
  `checker.js` is still the source of truth. Gotchas: `line` is
  **0-based**; counts use `count`, not `value`; `console-output-equals`
  compares the **first** line only.
- The starter code field is `starter`. `TaskBox` renders `instructions`
  as plain text, so markdown shows up literally.

### Shipped courses

| order | slug                   | lessons | XP  | state |
| ----- | ---------------------- | ------- | --- | ----- |
| 1     | getting-started        | 18      | 230 | live |
| 2     | web-development        | 35      | 550 | live |
| 3     | compilation-techniques | 2       | 30  | draft |
| 4     | operating-systems      | 2       | 35  | draft |
| 5     | software-testing       | 2       | 30  | draft |
| 6     | embedded-systems       | 2       | 35  | draft |
| 7     | mobile-android         | 2       | 30  | draft |

Each draft course has one THEORY + one INTERACTIVE lesson, ending in
`> **Draft.** Full notes pending.` Only `compilation-techniques` lesson 1
has a challenge.

The landing page teases Python, React and Backend as what's next. The five
draft courses are semester-5 CS material, outside that line. **Their
positioning (separate advanced track / updated teasers / gating) is an
open decision** — see Open questions. Until it's made, they show in the
plain `/courses` catalog and nowhere in `roadmap.js`.

## Gamification

XP and levels per lesson, daily streaks, badges, per-course progress,
challenges unlocking after theory. All localStorage.

## File structure

```
courses/              # all course content — see above
  <slug>/assets/      # cover.svg, figures (+ .narrow.svg variants)
src/
  routes/             # SvelteKit pages; [course]/[lesson]/+page.svelte switches lesson type
  lib/
    components/       # CourseCard, CourseHeader, TheoryLesson, ChallengeEditor,
                      # CourseArt (inline SVG), LessonWidget, SymbolBar, ...
    widgets/          # Stepper, StateMachine, MemoryView, Timeline + registry.js
    courses.js        # glob loader, asset resolution, widget-block parsing
    checker.js        # challenge test runner
    styles/theme.css  # theme variables, .art SVG classes, .widget controls
    assets/           # favicon, backgrounds (not course art)
```

## Commands

```bash
bun run dev      # localhost:5173, proxies /api -> :3001
bun run build
bun run check    # svelte-check; must pass before any commit
```

## Working agreements

- Run `bun run check` and `bun run build` before declaring anything done.
  **`check` does not pass on `main` today:** 89 errors / 26 warnings,
  pre-existing, mostly implicit-any in `checker.js`, `emmet.js` and
  `CodeEditor.svelte`. Until someone clears that, the bar is **no new
  errors or warnings compared with `main`**.
- Report anything changed that wasn't asked for.
- When docs and shipped code disagree, **the shipped code wins** — then
  fix the docs. (`icon` is the live example.)
- Prefer editing an existing course over adding a new one.
- Ask before: adding a dependency, adding a lesson `type`, changing the
  localStorage schema, touching `backend/`.

## Open questions

Answered (2026-09):

- ~~Is `backend/` live?~~ Removed in `30b6ba0`. The `/api` proxy is dead
  config.
- ~~Does the markdown renderer sanitize?~~ No. `marked` output goes
  straight to `{@html}`. Figures still go through `assets/` + `figure:`.

Still open:

- **Positioning of the five draft courses** (orders 3–7). Options on the
  table: a separate Advanced track, updated roadmap teasers, or gating
  behind the beginner courses. Undecided.
- No test suite exists. Is one wanted?
- Light mode: the rule says both modes must work, but no light palette or
  toggle exists. Build one, or relax the rule?

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

### How it works (built 2026-09)

- `courses.js` globs `/courses/*/assets/*.svg` with `query: '?raw'` and
  `/courses/*/assets/*.{png,webp}` with `query: '?url'`.
- **SVGs are rendered inline** (raw markup through `CourseArt.svelte`), not
  as `<img>`. An `<img>` SVG is a separate document and can't read the
  page's CSS variables, so it can't follow the theme.
- `getCourseAsset(courseId, filename)` resolves a filename to
  `{ svg, url }`. It throws if the file is missing, if the SVG contains
  `<script>`, `on…=` or `javascript:`, or if it lacks `role="img"` +
  `<title>` + `<desc>`.
- Course objects get `coverArt`. Lessons get `figureArt`, plus
  `figureArtNarrow` when `<name>.narrow.svg` exists; below 560px the narrow
  one is shown.
- Missing `cover` → `CourseCard`/`CourseHeader` fall back to the lucide icon.

### Theming inline SVG

Give every shape a class **and** a fallback presentation attribute:
`<rect class="f-surface s-accent" fill="#181a2d" stroke="#ffb15f">`. The file
looks right when opened on its own; inside `.art` the classes in
`theme.css` override it with theme variables. Fill classes: `f-bg f-surface
f-text f-muted f-dim f-accent f-accent2 f-ok f-err`. Stroke classes: `s-line s-text
s-dim s-accent s-ok s-err`.

**No `id`s in assets** (no gradients, markers, `url(#…)`). Many inline SVGs
share one page and duplicate ids collide silently. Draw arrowheads as
paths.

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
  center the content inside 680 instead. Phone variant:
  `<name>.narrow.svg`, `viewBox="0 0 340 H"`, stacked vertically.
- **Keep assets and widgets separate.** A figure is a static file; a widget
  is a Svelte component. Never put a `<script>` in an asset (the loader
  rejects it).
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

**How it's wired (built 2026-09):**

- `src/lib/widgets/registry.js` lazily globs `./*.svelte`. Every top-level
  file there is a widget, named by filename. Adding a widget is adding a
  file.
- Widget props live **in the lesson**, as JSON in exactly one fenced block
  tagged `widget`. The block's position is where the widget renders; prose
  before it is `content`, prose after it is `contentAfter`.
- `courses.js` → `parseWidget()` validates at load time. It throws if
  `widget` is missing or unknown, if there isn't exactly one block, or if
  the JSON is invalid.
- `TheoryLesson.svelte` renders `LessonWidget.svelte`, which awaits the
  registry loader.
- The primitives are directly usable as widgets (`widget: "StateMachine"`)
  because they're data-driven. A lesson only needs its own `.svelte` file
  when behaviour can't be expressed as props, and then that file composes
  primitives; it never reimplements one.

Prop shapes are JSDoc typedefs at the top of each primitive. Working
examples: `courses/*/lessons/2/*.md`.

### Build shared primitives, not per-course systems

Every course gets its own _visual language_, but all of them compose the
same four primitives. This is the difference between a thing that ships
and five half-finished bespoke engines.

- **`<Stepper>`** — ordered stages, one panel at a time, position dots.
  `wrap` loops at the end. A step can have `branches` (extra buttons that
  jump to a step id) and `next` (a step id, or `false` to end there). Prev
  walks back through history. Steps can embed `cells` → MemoryView. This is
  also how cycles are shown; never draw a ring.
- **`<StateMachine>`** — nodes and edges drawn in SVG, highlights the
  active state and last edge. `mode: "chars"` walks a string symbol by
  symbol (DFAs); `mode: "events"` walks space-separated event ids and adds
  a button per event. Shows remaining input. `stuck` maps `"state:symbol"`
  to an explanation of why a move is impossible. Node and edge `note`s
  explain the current state and the last move.
- **`<MemoryView>`** — labelled cells whose values change per step. Changed
  cells get emphasis. Pass `cells` + `previous` when composing it, or
  `frames` to use it standalone with its own Prev/Next/Reset.
- **`<Timeline>`** — HTML (not SVG, so labels stay legible at 360px):
  tracks, `spans`, point `events`, narrated `stops`. A range scrubber plus
  Prev/Next buttons, and a log of what has happened so far.

Shared control styles (`.widget`, `.w-btn`, `.w-input`, `.w-error`,
`.w-note`, `.w-sr`) live in `theme.css`. Buttons are 44px minimum.

Courses compose and style these. Shipped: Compilation Techniques and Operating Systems use
`StateMachine` (a DFA walk, the five-state process model). Software
Testing and Android use `Stepper` (EP→BVA derivation with `cells`, the
activity lifecycle with an `onRestart` loop). Embedded Systems uses
`Timeline` (super-loop vs interrupt). Same parts, different assembly.

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
  `{ } [ ] ( ) < > ; : " ' / \ | = _ $ Tab`. Built as
  `SymbolBar.svelte` (also `^ *` for regex work). It appears under 768px or
  on coarse pointers, and inserts through `EditorApi.insertText` /
  `indent()`. Its buttons don't take focus, so the keyboard stays up.
  `CodeEditor` sets autocapitalize/autocorrect/spellcheck off via
  `contentAttributes`.
- Keep starter code short — a learner should not have to scroll
  horizontally to read the line they are editing
- Results and error messages appear **below** the editor, in flow, so
  they are not hidden behind the keyboard. `ChallengeEditor` renders a
  `.mobile-results` block (Run + TestList) under `CodingPanel` at ≤920px,
  where the layout stacks.
- If a challenge is genuinely unreasonable on a phone, say so in the
  lesson rather than letting the learner fail silently

### Widgets on mobile

Widgets get the same 360px test. Drag interactions need a tap or button
alternative — a scrubber must also have Prev and Next buttons. Sliders
are fine; hover-to-reveal is not.
