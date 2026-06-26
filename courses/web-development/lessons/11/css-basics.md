---
id: "css-basics"
title: "CSS Basics"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# CSS Basics

HTML is the skeleton. CSS is everything that makes it look like something. Colour, size, spacing, layout, animations — all CSS.

## The syntax

Every CSS rule has the same shape:

```css
selector {
  property: value;
  property: value;
}
```

- **Selector** — what to style
- **Property** — what to change
- **Value** — what to set it to

## How to add CSS to HTML

**Option 1: External stylesheet (always use this for real projects)**

Create `style.css`. Link it in `<head>`:

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

**Option 2: `<style>` tag (fine for sandboxes and demos)**

```html
<head>
  <style>
    h1 { color: navy; }
  </style>
</head>
```

**Option 3: Inline style (avoid except for quick debugging)**

```html
<h1 style="color: red;">This is red</h1>
```

## Selectors

**Element selector** — targets all elements of that type:
```css
p { color: #444; }
h1 { font-size: 2.5rem; }
```

**Class selector** — targets elements with that class:
```css
.highlight { background-color: yellow; }
.btn { padding: 0.75rem 1.5rem; border-radius: 8px; }
```

```html
<p class="highlight">This is highlighted.</p>
<button class="btn">Click me</button>
```

Classes start with `.` in CSS. One element can have multiple classes: `class="btn primary large"`.

**ID selector** — targets one specific element:
```css
#hero { min-height: 100vh; }
```

```html
<section id="hero">...</section>
```

IDs start with `#`. Each ID should appear once per page. Use classes for styling (reusable), IDs for anchors and JavaScript targets.

**Descendant selector** — targets elements inside other elements:
```css
nav a { color: white; text-decoration: none; }
.card p { font-size: 0.9rem; }
```

## A first styled page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Styled Page</title>
  <style>
    body {
      font-family: sans-serif;
      background-color: #f5f5f5;
      color: #333;
      padding: 2rem;
    }

    h1 {
      color: #1a1a2e;
    }

    .card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .tag {
      display: inline-block;
      background-color: #e8f4fd;
      color: #1a6ebd;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>My Skills</h1>

  <div class="card">
    <h2>Languages</h2>
    <span class="tag">C</span>
    <span class="tag">HTML</span>
    <span class="tag">CSS</span>
    <span class="tag">JavaScript</span>
  </div>

  <div class="card">
    <h2>Tools</h2>
    <span class="tag">VS Code</span>
    <span class="tag">Git</span>
  </div>
</body>
</html>
```

Paste and try changing colours, padding, and border-radius. CSS is learned by experimentation.
