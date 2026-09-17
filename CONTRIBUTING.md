# Contributing a Course

You don't need to know how to code to add a course here. Just create some files and open a pull request.

---

## Step 1 — Create your course folder

Inside the `courses/` folder at the root of this repo, create a folder for your course. Copy the `_template` folder as your starting point:

```
courses/
  your-course-name/      ← lowercase, hyphens instead of spaces
    meta.json
    config.json          ← optional (feature flags)
    assets/              ← optional: cover.svg + lesson figures
    lessons/
      1/                 ← folder number = lesson order
        lesson.md        ← one .md file per folder, any filename
        challenge.json   ← optional coding challenge
      2/
        lesson.md
      3/
        lesson.md
        challenge.json
```

The folder number inside `lessons/` controls lesson order — lesson `1/` comes first, `2/` second, and so on. The `.md` filename itself can be anything descriptive.

---

## Step 2 — Write meta.json

This describes your course. Copy and fill in:

```json
{
  "title": "Your Course Title",
  "description": "One sentence describing what learners will build or learn.",
  "difficulty": "BEGINNER",
  "order": 3,
  "icon": "terminal",
  "language": "Python",
  "author": {
    "name": "Your Name",
    "link": "https://your-link.com"
  }
}
```

| Field | What to put |
|-------|-------------|
| `title` | The display name of the course |
| `description` | One sentence. Focus on what they'll *build*, not what they'll *read*. |
| `difficulty` | `BEGINNER`, `INTERMEDIATE`, or `ADVANCED` |
| `order` | Where it appears in the course list (1 = first) |
| `icon` | A supported icon name: `globe`, `terminal`, `cpu`, `compass`, `braces`, `flask-conical`, `circuit-board`, `smartphone`. Anything else shows the `terminal` icon. |
| `cover` | Optional. Filename inside your course's `assets/` folder (e.g. `"cover.svg"`). Shown on the course card and course page; without it the icon is shown. See **Course art** below. |
| `language` | The language name shown on the course card (display only) |
| `author.name` | **Required.** Your name or handle — shown on the course card. |
| `author.link` | Optional. A URL (GitHub profile, website, etc.) — makes your name clickable. |

---

## Step 3 — Write your lessons

Each lesson is a `.md` file inside a numbered folder. Start from the template at `courses/_template/lessons/1/intro.md`.

### Lesson frontmatter

Every `.md` file must start with this header:

```markdown
---
id: "introduction"
title: "Introduction"
type: "THEORY"
xpReward: 10
---

Write your lesson content here using normal Markdown.

You can use **bold**, *italic*, `inline code`, and fenced code blocks.
```

| Field | What to put |
|-------|-------------|
| `id` | Slug for the lesson (lowercase, hyphens, no spaces) — used in the URL |
| `title` | Display name |
| `type` | `THEORY` for reading lessons, `PRACTICE` for lessons with a challenge, `INTERACTIVE` for lessons with a widget. It's a label — what actually turns a lesson into a coding challenge is a `.json` file in the folder |
| `xpReward` | Points the learner earns. Theory = 10–15, Interactive = 20, Practice = 20–30 |
| `module` | Optional. Groups lessons on the course page |
| `figure` | Optional. Filename in `assets/` shown at the top of the lesson. Add `name.narrow.svg` next to `name.svg` and phones get that instead |
| `widget` | Required when `type` is `INTERACTIVE`. See **Interactive lessons** below |

> **Note:** You don't set `order` in the frontmatter — the folder number controls order automatically.

---

## Step 4 — Add a coding challenge (optional)

To make a lesson a coding challenge, add a `.json` file in the same numbered folder (any filename ending in `.json`):

```
lessons/
  3/
    my-lesson.md      ← the explanation
    challenge.json    ← the coding challenge
```

### Challenge JSON template

```json
{
  "language": "html",
  "instructions": "Write a short sentence telling the learner exactly what to do.",
  "starter": "<!-- Replace this with the starting code the learner sees -->",
  "hints": [
    "First hint — shown one at a time.",
    "Second hint."
  ],
  "tests": [
    {
      "id": 1,
      "description": "Has an h1 tag",
      "check": "has-tag",
      "value": "h1"
    },
    {
      "id": 2,
      "description": "h1 says Hello",
      "check": "tag-text",
      "tag": "h1",
      "value": "Hello"
    }
  ]
}
```

| Field | What to put |
|-------|-------------|
| `language` | `html`, `css`, `javascript`, or any [supported language](#supported-languages). Overrides the course-level language for this lesson. |
| `instructions` | The task. One or two sentences max. Supports **Markdown**. |
| `starter` | The code that appears in the editor when the lesson loads. |
| `hints` | Optional array of hints shown one at a time. |
| `tests` | A list of checks. See below. |

### Test types

Only these `check` values exist — they're what `src/lib/checker.js` implements. **Line numbers are 0-based** (`"line": 0` is the first line).

#### HTML / CSS (runs in the browser)

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `has-doctype` | Page starts with `<!DOCTYPE html>` | — |
| `has-structure` | Page has `<html>`, `<head>`, `<body>` | — |
| `has-tag` | An element matches | `value`: CSS selector (e.g. `"h1"`) |
| `tag-text` | Element text matches exactly (whitespace-normalised) | `tag`: selector, `value` |
| `tag-text-contains` | Element text contains a string (case-insensitive) | `tag`: selector, `value` |
| `not-empty` | Element has text | `selector` (or `tag` / `value`) |
| `has-attribute` | Element has an attribute | `selector`, `attribute` |
| `attribute-value` | Attribute equals a value | `selector`, `attribute`, `value` |
| `attribute-contains` | Attribute contains a string | `selector`, `attribute`, `value` |
| `attribute-not-empty` | Attribute exists and isn't blank | `selector`, `attribute` |
| `child-of` | A matching element exists inside another | `parent`, `child` (selectors) |
| `tag-count` | Exactly N elements match | `selector` (or `value`), `count` |
| `min-count` | At least N elements match | `selector` (or `value`), `count` |
| `css-property` | Inline `style` property equals a value | `selector`, `property`, `value` |
| `code-contains` | Source includes a string (case-insensitive) | `value` |
| `code-not-contains` | Source doesn't include a string (case-insensitive) | `value` |

#### JavaScript console

Use these when `language` is `javascript` or `consoleOutput` is enabled.

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `console-no-error` | Nothing was thrown or logged as an error | — |
| `console-output-equals` | The **first** logged line equals a value | `value` |
| `console-output-contains` | Any logged line contains a string | `value` |
| `console-output-line` | A specific logged line equals a value | `line` (0-based), `value` |
| `console-output-count` | Number of logged lines | `count` |
| `code-contains` / `code-not-contains` | Source does / doesn't include a string | `value` |

`console.log(true)` logs the text `"true"`, so compare against strings.

#### Compiled languages (Wandbox)

Use these for C, Python, Go, Rust, Kotlin, etc.

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `exit-code-zero` | Program exits with code 0 | — |
| `stderr-empty` | Nothing written to stderr | — |
| `stdout-equals` | Full stdout matches (trailing whitespace ignored) | `value` |
| `stdout-contains` | stdout includes a string | `value` |
| `stdout-line` | A specific line matches exactly | `line` (0-based), `value` |
| `stdout-line-contains` | A specific line contains a string | `line` (0-based), `value` |
| `stdout-regex` | stdout matches a regex | `value`: pattern |
| `stdout-line-count` | Number of output lines | `count` |
| `code-contains` / `code-not-contains` | Source does / doesn't include a string (case-sensitive) | `value` |

Wandbox runs your code on a remote compiler: no filesystem, no network, no hardware. `fork()`, signals and timers won't behave.

### Supported languages

`html` · `css` · `javascript` run entirely in the browser.

Everything else routes through [Wandbox](https://wandbox.org): `c` · `cpp` · `python` · `rust` · `go` · `java` · `kotlin` · `swift` · `ruby` · `lua` · `perl` · `php` · `bash` · `haskell` · `erlang` · `ocaml` · `scala` · `nim` · `crystal` · `d` · `typescript` · `r` · `pascal` · `coffeescript`

---

## Interactive lessons (optional)

Set `type: "INTERACTIVE"` and `widget` to one of the shared widgets in `src/lib/widgets/`: `Stepper`, `StateMachine`, `MemoryView`, `Timeline`. Put the widget's props as JSON in **one** fenced block tagged `widget`. The widget renders exactly where that block sits:

````markdown
---
id: "my-lesson"
title: "My Lesson"
type: "INTERACTIVE"
xpReward: 20
widget: "Stepper"
---

Some prose.

```widget
{ "title": "Step through it", "steps": [{ "title": "First", "body": "Markdown **works** here." }] }
```

More prose.
````

Copy the props from an existing interactive lesson, such as `courses/software-testing/lessons/2/`. The prop types are documented at the top of each widget file. A bad widget name or invalid JSON fails loudly when the lesson loads.

Don't build a one-off component for your course. If none of the four widgets fit, open an issue proposing a new shared one.

## Course art (optional)

Put SVGs in `courses/<your-course>/assets/` and reference them by filename (`cover` in meta.json, `figure` in frontmatter).

- **Original work only.** No stock images, logos or figures traced from slides.
- `<svg role="img">` with a `<title>` and `<desc>` that explain the idea. The loader rejects SVGs without them, and SVGs containing `<script>` or `on…=` handlers.
- Covers: `viewBox="0 0 400 225"`, background `<rect rx="18">`. Figures: `viewBox="0 0 680 H"`.
- Theme colours: give shapes a class **and** a fallback colour, e.g. `<rect class="f-surface s-accent" fill="#181a2d" stroke="#ffb15f">`. Classes: `f-bg f-surface f-text f-muted f-dim f-accent f-accent2 f-ok f-err` (fill) and `s-line s-text s-dim s-accent s-ok s-err` (stroke).
- No `id`s (no gradients, markers or `url(#…)`). Several SVGs share one page, and duplicate ids break each other.
- Under ~15 KB. More than about six text labels? Also ship `name.narrow.svg` for phones.
- Optional motion: wrap parts in `<g class="seq-1">`, `<g class="seq-2">`… (up to 8) in the order the mechanism happens, and add `seq-key` to the moment that matters. Covers and figures then play step by step, and figures get a Play button.

---

## Step 5 — Open a pull request

1. Fork this repo
2. Add your files under `courses/your-course-name/`
3. Open a PR with the title: `Add course: Your Course Title`

No need to touch any other files. The app picks up new courses automatically.

---

## Tips for great lessons

- **Short lessons beat long ones.** If a lesson takes more than 5 minutes to read, split it.
- **End every PRACTICE lesson with something the learner built.** Not something they watched.
- **Use plain language.** Assume zero prior knowledge.
- **Challenges should be achievable in 1–5 minutes.** They build confidence.
- **Give 2–3 hints.** Learners get stuck. A hint is better than giving up.
- **Test for behavior, not exact text.** `tag-text-contains` beats `tag-text` for most cases.

---

## Need the full reference?

See [docs.md](docs.md) for the complete course-maker reference: all config options, feature flags, and detailed examples.
