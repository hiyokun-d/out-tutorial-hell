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
  "icon": "🐍",
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
| `icon` | Any emoji |
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
| `type` | `THEORY` for reading lessons, `PRACTICE` for coding challenges |
| `xpReward` | Points the learner earns. Theory = 10–15, Practice = 20–30 |

> **Note:** You don't set `order` in the frontmatter — the folder number controls order automatically.

---

## Step 4 — Add a coding challenge (optional)

If your lesson is type `PRACTICE`, add a `.json` file in the same numbered folder (any filename ending in `.json`):

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

### Test types — HTML / CSS

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `has-tag` | Tag exists on the page | `value`: tag name (e.g. `"h1"`) |
| `not-empty` | Element is not empty | `selector`: CSS selector |
| `tag-text` | Tag contains exact text | `tag`: tag name, `value`: exact text |
| `tag-text-contains` | Tag contains partial text (case-insensitive) | `tag`: tag name, `value`: text to find |
| `has-attribute` | Element has an attribute | `selector`: CSS selector, `attribute`: attribute name |
| `attribute-not-empty` | Attribute exists and isn't blank | `selector`: CSS selector, `attribute`: attribute name |
| `attribute-value` | Attribute has an exact value | `selector`: CSS selector, `attribute`: name, `value`: expected value |
| `has-doctype` | Page has `<!DOCTYPE html>` | — |
| `has-structure` | Page has `<html>`, `<head>`, `<body>` | — |
| `code-contains` | Written code includes a string | `value`: the string |

### Test types — JavaScript console

Use these when `language` is `javascript` and `consoleOutput` is enabled.

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `console-no-error` | No errors thrown | — |
| `console-output-equals` | Full console output matches exactly | `value`: expected string |
| `console-output-contains` | Console output includes a string | `value`: string to find |
| `console-output-count` | Number of console.log calls | `value`: count (number) |
| `console-output-line` | Specific line of output matches | `line`: line number (1-based), `value`: expected string |

### Test types — compiled languages (Wandbox)

Use these for C, Python, Go, Rust, etc.

| `check` | What it does | Required fields |
|---------|-------------|-----------------|
| `exit-code-zero` | Program exits without error | — |
| `stdout-equals` | Full stdout matches exactly | `value`: expected output |
| `stdout-contains` | stdout includes a string | `value`: string |
| `stdout-line` | Specific line of stdout matches exactly | `line`: line number (1-based), `value`: expected string |
| `stdout-line-contains` | Specific line contains a string | `line`: line number (1-based), `value`: string |
| `stdout-regex` | stdout matches a regex | `value`: regex pattern |
| `stdout-line-count` | Number of output lines | `value`: count (number) |
| `code-contains` | Source code includes a string | `value`: string |
| `code-not-contains` | Source code does not include a string | `value`: string |

### Supported languages

`html` · `css` · `javascript` run entirely in the browser.

Everything else routes through [Wandbox](https://wandbox.org): `c` · `cpp` · `python` · `rust` · `go` · `java` · `kotlin` · `swift` · `ruby` · `lua` · `perl` · `php` · `bash` · `haskell` · `erlang` · `ocaml` · `scala` · `nim` · `crystal` · `d` · `typescript` · `r` · `pascal` · `coffeescript`

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
