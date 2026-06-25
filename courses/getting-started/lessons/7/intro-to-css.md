---
id: "intro-to-css"
title: "Introduction to CSS"
type: "THEORY"
xpReward: 15
module: "Making It Look Good"
---

# Introduction to CSS

HTML builds the skeleton. CSS makes it look like something worth using.

CSS stands for **Cascading Style Sheets**. It controls every visual detail: colors, fonts, spacing, borders, rounded corners, layout.

## How a CSS rule is written

A rule has a **selector** (what to target) and one or more **declarations** (what to change):

```css
selector {
  property: value;
  property: value;
}
```

Example:

```css
h1 {
  color: #333;
  font-size: 2rem;
}

p {
  color: gray;
  line-height: 1.6;
}
```

This targets all `<h1>` tags and makes them dark gray and larger.

## Connecting CSS to HTML

Add a `<link>` tag inside your `<head>`:

```html
<head>
  <title>My Page</title>
  <link rel="stylesheet" href="style.css">
</head>
```

Every rule in `style.css` now applies to that HTML page. Save both files, refresh the browser.

## The three selectors you'll use most

| Selector | Targets | Example |
|----------|---------|---------|
| `h1` | All `<h1>` elements | `h1 { color: red; }` |
| `.classname` | All elements with that class | `.card { padding: 1rem; }` |
| `#id` | One specific element | `#header { background: black; }` |

Classes (`.name`) are the most flexible. You'll use them constantly.

## Properties that matter most right now

| Property | What it controls |
|----------|-----------------|
| `color` | Text color |
| `background-color` | Background fill |
| `font-size` | Text size (use `rem` units) |
| `font-weight` | `bold` or `normal` |
| `padding` | Space *inside* the element |
| `margin` | Space *outside* the element |
| `border` | A line around the element |
| `border-radius` | Rounded corners |
| `width` / `height` | Element size |

## Try it in the sandbox

Paste this into the sandbox and change the values:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        background: #f0f0f0;
        padding: 2rem;
      }
      h1 {
        color: #6a0dad;
      }
      p {
        color: #555;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <h1>Styled Heading</h1>
    <p>Looking better already.</p>
  </body>
</html>
```

Change the colors. Add `border-radius` to something. Try `font-weight: bold` on the paragraph. Every change teaches you something.
