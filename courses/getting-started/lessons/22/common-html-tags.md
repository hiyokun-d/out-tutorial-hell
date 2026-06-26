---
id: "common-html-tags"
title: "Common HTML Tags"
type: "THEORY"
xpReward: 15
module: "HTML — The Web's Structure"
sandbox_language: "html"
---

# Common HTML Tags

You know the skeleton. Now learn the tags you'll use on almost every page.

## Links — `<a>`

```html
<a href="https://example.com">Click here</a>
<a href="https://example.com" target="_blank">Opens in new tab</a>
```

`href` (hypertext reference) is the destination. The text between the tags is what the user clicks.

`target="_blank"` opens the link in a new tab. Without it, the browser navigates the current tab.

## Images — `<img>`

```html
<img src="photo.jpg" alt="A description of the photo">
<img src="https://picsum.photos/300/200" alt="Random photo">
```

`src` is the image URL or file path. `alt` is a text description — used by screen readers for accessibility and shown if the image fails to load.

`<img>` is self-closing — no closing tag.

## Lists

**Unordered list** (bullet points):

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

**Ordered list** (numbered):

```html
<ol>
  <li>Install VS Code</li>
  <li>Open the terminal</li>
  <li>Write your first program</li>
</ol>
```

`<li>` means list item. Always goes inside `<ul>` or `<ol>`.

## Containers — `<div>` and `<span>`

`<div>` is a **block-level** container — takes up the full width, starts a new line:

```html
<div>
  <h2>Section One</h2>
  <p>This paragraph is inside a div.</p>
</div>
```

`<span>` is an **inline** container — sits inside text without breaking the flow:

```html
<p>My favourite language is <span>JavaScript</span>.</p>
```

By themselves, `<div>` and `<span>` have no visual appearance. They're used to group elements so CSS and JavaScript can target them.

## Emphasis — `<strong>` and `<em>`

```html
<p>This is <strong>very important</strong>.</p>
<p>This is <em>emphasised</em> text.</p>
```

`<strong>` renders as bold. `<em>` renders as italic. But more importantly, they have **semantic meaning** — screen readers read `<strong>` with emphasis. Use them for meaning, not just visual style.

## Attributes

Tags can have **attributes** that provide extra information:

```html
<tag attribute="value">content</tag>
```

Common attributes:
- `href` — link destination (for `<a>`)
- `src` — source file (for `<img>`, `<script>`)
- `alt` — alternative text (for `<img>`)
- `id` — unique identifier on the page
- `class` — one or more class names (used to apply CSS)
- `target` — where to open a link

## A fuller example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Things I Like</title>
  </head>
  <body>
    <h1>Things I Like</h1>

    <h2>Languages I'm Learning</h2>
    <ul>
      <li>C — <em>close to the metal</em></li>
      <li>JavaScript — <em>runs in the browser</em></li>
      <li>HTML — <em>structures the web</em></li>
    </ul>

    <h2>Useful Links</h2>
    <p>
      Check out <a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a>
      — the best reference for HTML, CSS, and JavaScript.
    </p>

    <img src="https://picsum.photos/400/200" alt="A random placeholder image">
  </body>
</html>
```

Try this in the sandbox. Then modify it — add your own lists, links, and text. Experiment with nesting `<strong>` inside list items, or adding multiple images.

The best way to learn HTML is to break it and fix it.
