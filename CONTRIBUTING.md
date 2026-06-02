# Contributing a Course

You don't need to know how to code to add a course here. Just create some files and open a pull request.

---

## Step 1 — Create your course folder

Inside the `courses/` folder at the root of this repo, create a new folder for your course:

```
courses/
  your-course-name/      ← use lowercase, hyphens instead of spaces
    meta.json
    lessons/
      01-first-lesson.md
      02-second-lesson.md
```

---

## Step 2 — Write meta.json

This describes your course. Copy this template:

```json
{
  "id": "your-course-name",
  "title": "Your Course Title",
  "description": "One sentence describing what learners will build or learn.",
  "difficulty": "BEGINNER",
  "order": 2,
  "icon": "🐍"
}
```

| Field | What to put |
|-------|-------------|
| `id` | Same as your folder name (lowercase, hyphens) |
| `title` | The display name of the course |
| `description` | One sentence. Focus on what they'll *build*, not what they'll *read*. |
| `difficulty` | `BEGINNER`, `INTERMEDIATE`, or `ADVANCED` |
| `order` | Where it appears in the course list (1 = first) |
| `icon` | Any emoji |

---

## Step 3 — Write your lessons

Each lesson is a `.md` (Markdown) file. Name them with a number prefix so they sort correctly:

```
01-introduction.md
02-first-concept.md
03-hands-on.md
```

### Every lesson starts with this header (copy and fill in):

```markdown
---
id: "introduction"
title: "Introduction"
order: 1
type: "THEORY"
xpReward: 10
---

Write your lesson content here using normal text.

You can use **bold**, *italic*, `inline code`, and code blocks.
```

| Field | What to put |
|-------|-------------|
| `id` | Slug for the lesson (lowercase, hyphens, no spaces) — must match the filename without the number prefix |
| `title` | Display name |
| `order` | The number at the start of the filename (1, 2, 3…) |
| `type` | `THEORY` for reading, `PRACTICE` for coding challenges |
| `xpReward` | Points the learner earns. Theory = 10–15, Practice = 20–30 |

---

## Step 4 — Add a coding challenge (optional)

If your lesson is type `PRACTICE`, create a matching `.json` file with the **same name**:

```
02-your-first-lesson.md     ← the explanation
02-your-first-lesson.json   ← the coding challenge
```

### Challenge JSON template:

```json
{
  "language": "html",
  "instructions": "Write a short sentence telling the learner exactly what to do.",
  "starter": "<!-- Replace this with the starting code the learner sees -->",
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
| `language` | `html`, `css`, or `javascript` |
| `instructions` | The task. One or two sentences max. |
| `starter` | The code that appears in the editor when the lesson loads. Use `\n` for line breaks. |
| `tests` | A list of checks. See below. |

### Test types

Each test has a `"check"` field that tells the system what to verify:

| `check` value | What it does | Required fields |
|---------------|-------------|-----------------|
| `has-tag` | Checks that an HTML tag exists on the page | `value`: tag name (e.g. `"h1"`, `"p"`, `"a"`) |
| `tag-text` | Checks that a tag contains exact text | `tag`: tag name, `value`: exact text |
| `tag-text-contains` | Checks that a tag contains partial text (case-insensitive) | `tag`: tag name, `value`: text to look for |
| `has-attribute` | Checks that an element has an attribute | `selector`: CSS selector, `attribute`: attribute name |
| `attribute-value` | Checks an attribute's exact value | `selector`: CSS selector, `attribute`: name, `value`: expected value |
| `code-contains` | Checks that the written code includes a string | `value`: the string to look for |

### Test example for a link challenge:

```json
"tests": [
  { "id": 1, "description": "Has an anchor tag", "check": "has-tag", "value": "a" },
  { "id": 2, "description": "Link has an href", "check": "has-attribute", "selector": "a", "attribute": "href" },
  { "id": 3, "description": "Link text says Click me", "check": "tag-text", "tag": "a", "value": "Click me" }
]
```

---

## Step 5 — Open a pull request

1. Fork this repo
2. Add your files
3. Open a PR with the title: `Add course: Your Course Title`

No need to touch any other files. The app picks up new courses automatically.

---

## Tips for great lessons

- **Short lessons beat long ones.** If a lesson takes more than 5 minutes to read, split it.
- **End every PRACTICE lesson with something the learner built.** Not something they watched.
- **Use plain language.** Assume zero prior knowledge.
- **Challenges should be achievable in 1–5 minutes.** They build confidence.
