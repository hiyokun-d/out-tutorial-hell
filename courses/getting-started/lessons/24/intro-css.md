---
id: "intro-css"
title: "Intro to CSS"
type: "THEORY"
xpReward: 15
module: "CSS — Make It Look Good"
sandbox_language: "html"
---

# Intro to CSS

HTML gives your page structure. CSS gives it style. The two are deliberately separate — a principle called **separation of concerns** that you've seen before (functions doing one thing, data types having one purpose).

## The syntax

Every CSS rule follows the same pattern:

```css
selector {
    property: value;
    property: value;
}
```

- **Selector** — what to style (which HTML elements)
- **Property** — what aspect to change (colour, size, spacing...)
- **Value** — what to set it to

Example:

```css
h1 {
    color: navy;
    font-size: 2rem;
}
```

This targets every `<h1>` on the page and makes it navy and large.

## Three ways to add CSS

**1. Inline** — directly on the element (avoid except for quick testing):

```html
<h1 style="color: red;">Hello</h1>
```

**2. Style tag** — inside `<head>` (fine for small single-page examples):

```html
<head>
    <style>
        h1 { color: navy; }
        p  { font-size: 1.1rem; }
    </style>
</head>
```

**3. External file** — a separate `.css` file (the right way for real projects):

```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

In the sandbox, use the `<style>` tag inside `<head>`.

## Selectors

**Element selector** — targets all elements of that type:

```css
p { color: gray; }      /* all paragraphs */
h1 { font-size: 2rem; } /* all h1 headings */
```

**Class selector** — targets elements with a specific class attribute:

```css
.highlight { background-color: yellow; }
.btn { padding: 0.5rem 1rem; border-radius: 6px; }
```

```html
<p class="highlight">This is highlighted.</p>
<button class="btn">Click me</button>
```

Classes start with `.` in CSS. You can add multiple classes to one element: `class="btn primary"`.

**ID selector** — targets one specific element (use sparingly):

```css
#header { background-color: black; color: white; }
```

```html
<div id="header">My Header</div>
```

IDs start with `#` in CSS. Each ID should appear only once per page.

## The Box Model

Every element in HTML is a rectangular box. The box has four layers:

```
┌──────────────────────────────┐
│          MARGIN              │  ← space outside the border
│  ┌────────────────────────┐  │
│  │        BORDER          │  │  ← the visible edge
│  │  ┌──────────────────┐  │  │
│  │  │     PADDING      │  │  │  ← space inside the border
│  │  │  ┌────────────┐  │  │  │
│  │  │  │  CONTENT   │  │  │  │  ← the actual text/image
│  │  │  └────────────┘  │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

```css
.card {
    margin: 1rem;           /* space outside */
    border: 1px solid gray; /* the outline */
    padding: 1rem;          /* space inside */
    width: 300px;           /* width of the content */
}
```

Understanding the box model is essential for layout. When things aren't spaced the way you expect, you usually need to adjust padding or margin.

## A full example to try

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Styled Page</title>
    <style>
      body {
        font-family: sans-serif;
        padding: 2rem;
        background-color: #f5f5f5;
        color: #333;
      }
      h1 {
        color: #1a1a2e;
      }
      p {
        line-height: 1.7;
        max-width: 600px;
      }
      .highlight {
        background-color: #fff3cd;
        padding: 0.5rem 1rem;
        border-left: 4px solid orange;
      }
    </style>
  </head>
  <body>
    <h1>Hello, styled world!</h1>
    <p>This paragraph has comfortable line spacing and a maximum width for readability.</p>
    <p class="highlight">This paragraph has a highlight style applied via a class.</p>
  </body>
</html>
```

Paste this into the sandbox. Change colours, sizes, and spacing. CSS rewards experimentation — each change updates instantly in the preview.
