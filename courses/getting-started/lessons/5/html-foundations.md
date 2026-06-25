---
id: "html-foundations"
title: "HTML Foundations"
type: "THEORY"
xpReward: 15
module: "Your First Page"
---

# HTML Foundations

HTML is the skeleton of every web page. It defines what content exists and how it's structured — not how it looks (that's CSS's job).

## Tags

HTML is built from **tags**. Most tags come in pairs:

```html
<tagname>content goes here</tagname>
```

The opening tag starts the element. The closing tag (with a `/`) ends it. The content sits between them.

## Every HTML page uses the same skeleton

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello!</h1>
    <p>This is my page.</p>
  </body>
</html>
```

What each part does:

| Part | Job |
|------|-----|
| `<!DOCTYPE html>` | Tells the browser this is HTML5 |
| `<html>` | Wraps the entire document |
| `<head>` | Invisible metadata — title, CSS links, etc. |
| `<body>` | Everything the user actually sees |

## The tags you'll use most

| Tag | What it does |
|-----|-------------|
| `<h1>` to `<h6>` | Headings — h1 is the biggest |
| `<p>` | A paragraph of text |
| `<a href="url">` | A clickable link |
| `<img src="url" alt="...">` | An image |
| `<ul>` | Unordered (bullet) list |
| `<ol>` | Ordered (numbered) list |
| `<li>` | A single item in a list |
| `<div>` | A generic container block |
| `<strong>` | Bold text |
| `<em>` | Italic text |

## Nesting

Tags live inside other tags. The rule: always close the inner tag before the outer one.

```html
<!-- Correct -->
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<!-- Wrong — li closes after ul -->
<ul>
  <li>First item
</ul>
</li>
```

## Try it now

Open the sandbox and paste this — then edit it, break it, and fix it:

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>My name is ___</h1>
    <p>I'm learning to code.</p>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </body>
</html>
```

Change the text. Add more tags. See what happens. That's how this clicks.
