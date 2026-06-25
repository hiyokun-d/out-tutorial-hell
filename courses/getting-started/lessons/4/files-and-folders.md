---
id: "files-and-folders"
title: "Files and Folders"
type: "THEORY"
xpReward: 10
module: "Your First Page"
---

# Files and Folders

Every project you build lives in a folder on your computer. Getting organized from day one saves hours of confusion later.

## A basic web project structure

```
my-project/
├── index.html      ← the main page
├── style.css       ← all your styles
└── script.js       ← JavaScript (you'll add this later)
```

Always create a dedicated folder for each project. Never scatter files across your Desktop.

## Naming rules that matter

These aren't just style preferences — breaking them causes real bugs:

- **Lowercase only** — `index.html` not `Index.HTML`
- **Hyphens for spaces** — `my-project` not `my project` (spaces break URLs)
- **No special characters** — letters, numbers, and hyphens only
- **Descriptive names** — `about.html` not `page2.html`

## File extensions

The extension (the part after the dot) tells the computer and VS Code what kind of file it is:

| Extension | Type |
|-----------|------|
| `.html` | Web page structure |
| `.css` | Styles |
| `.js` | JavaScript |
| `.json` | Data and config |
| `.md` | Markdown text |

## `index.html` is always the homepage

When a browser opens a folder on a web server, it automatically looks for `index.html`. This is why the front page of almost every website is called `index.html`.

## Create your first project now

1. Create a folder on your computer called `my-first-project`
2. Open VS Code
3. Go to **File → Open Folder** and select that folder
4. In the Explorer panel, click the **New File** icon and create `index.html`

You're ready. The sandbox is now available on the right — use it to experiment with HTML as you go through the next lessons.
