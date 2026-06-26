---
id: "text-and-headings"
title: "Text & Headings"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# Text & Headings

Text is the foundation of every webpage. HTML has specific elements for every kind of text — and the choice of element carries meaning, not just visual style.

## Headings

HTML has six heading levels:

```html
<h1>Page Title — the main heading</h1>
<h2>Section heading</h2>
<h3>Sub-section heading</h3>
<h4>Smaller heading</h4>
<h5>Rarely used</h5>
<h6>Very rarely used</h6>
```

Rules:
- **One `<h1>` per page** — it's the main title, like the cover of a book
- **Use headings in order** — don't jump from `h1` to `h4`
- **Use headings for structure, not for visual size** — if you want big text, use CSS

Search engines use headings to understand what a page is about. Screen readers use them to navigate. Correct heading structure matters for SEO and accessibility.

## Paragraphs

```html
<p>This is a paragraph. The browser wraps the text automatically based on the available width.</p>

<p>This is a second paragraph. Notice the space between paragraphs — the browser adds that by default.</p>
```

Pressing Enter in your HTML doesn't create a new paragraph. You must use a new `<p>` tag.

## Emphasis

```html
<p>This is <strong>very important</strong> and should not be ignored.</p>
<p>This is <em>emphasised</em> — said with stress.</p>
```

- `<strong>` — bold, means the content is important
- `<em>` — italic, means the content is emphasised

Don't use these just to make text bold or italic for decoration — that's CSS's job. Use them when the content genuinely is important or emphasised.

## Inline vs block elements

`<p>`, `<h1>` through `<h6>` are **block elements** — they take up the full width available and start on a new line.

`<strong>` and `<em>` are **inline elements** — they sit inside text without breaking the flow.

This distinction matters when you start laying out pages with CSS.

## Other text elements

```html
<p>The formula is: <code>E = mc²</code></p>

<blockquote>
  "The best way to get started is to quit talking and begin doing."
</blockquote>

<p>Press <kbd>Ctrl+S</kbd> to save.</p>

<p>The price was <del>$50</del> now $30.</p>

<p>Version <mark>2.0</mark> is now available.</p>
```

Each has semantic meaning. Use the right element for the right content — it helps search engines, screen readers, and future maintainers understand your HTML.

## Line breaks

Avoid `<br>` for spacing between sections. Use separate `<p>` tags or CSS margin instead. `<br>` is for cases where a line break is part of the content:

```html
<p>
  123 Main Street<br>
  Cityville, CA 90210
</p>
```

## Try it

Build a small article in the sandbox:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Article</title>
</head>
<body>
  <h1>Why I'm Learning to Code</h1>

  <p>I decided to learn programming because <strong>I want to build things</strong> that actually work in the real world.</p>

  <h2>Where I Started</h2>
  <p>I started with <em>Getting Started</em>, which taught me C and the fundamentals of how programs actually work.</p>

  <h2>Where I'm Going</h2>
  <p>Now I'm learning web development — HTML, CSS, and JavaScript — so I can build and deploy real websites.</p>
</body>
</html>
```

Change the content to be actually about you.
