---
id: "flexbox"
title: "Flexbox"
type: "THEORY"
xpReward: 15
module: "CSS — Style"
sandbox_language: "html"
---

# Flexbox

Flexbox is the most important layout tool in CSS. Before it, centering something vertically required hacks. With flexbox, it's one line. Learn this well — you'll use it on every project.

## How it works

Add `display: flex` to a **container** (parent element). Its direct children become **flex items** that you can arrange, align, and distribute.

```css
.container {
  display: flex;
}
```

That's the activation switch. Now everything inside lines up in a row by default.

## Direction

```css
flex-direction: row;            /* default: left to right */
flex-direction: row-reverse;    /* right to left */
flex-direction: column;         /* top to bottom */
flex-direction: column-reverse; /* bottom to top */
```

## Alignment — the two axes

Flexbox has two axes:
- **Main axis**: the direction flex items flow (row = horizontal, column = vertical)
- **Cross axis**: perpendicular to the main axis

**`justify-content`** — aligns items along the **main axis**:
```css
justify-content: flex-start;    /* default: items at start */
justify-content: flex-end;      /* items at end */
justify-content: center;        /* items centred */
justify-content: space-between; /* first and last at edges, even gaps between */
justify-content: space-around;  /* equal space around each item */
justify-content: space-evenly;  /* equal space between all items */
```

**`align-items`** — aligns items along the **cross axis**:
```css
align-items: stretch;     /* default: items fill cross axis */
align-items: flex-start;  /* items at top (in row direction) */
align-items: flex-end;    /* items at bottom */
align-items: center;      /* items vertically centred */
```

## The most useful flexbox pattern

**Centre something both horizontally and vertically:**
```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

This is how you build hero sections. Two lines that would have taken hacks before flexbox.

## Gap

```css
.nav {
  display: flex;
  gap: 2rem;       /* space between flex items */
}
```

`gap` replaces old margin-based spacing between flex items. Clean and simple.

## Flex items: grow and shrink

```css
.item { flex: 1; }    /* item grows to fill available space */
.item { flex: 0; }    /* item stays at its natural size */
```

Multiple items with `flex: 1` share the available space equally:
```css
.sidebar { flex: 1; }   /* takes 1 part */
.main    { flex: 3; }   /* takes 3 parts — 3× wider than sidebar */
```

## Wrapping

By default flex items stay in one line even if they overflow:
```css
flex-wrap: wrap;    /* items wrap to next line when needed */
flex-wrap: nowrap;  /* default — single line */
```

## Common patterns

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    /* Nav: items in a row, space between logo and links */
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #1a1a2e;
      color: white;
    }
    .nav-links { display: flex; gap: 1.5rem; list-style: none; }
    .nav-links a { color: white; text-decoration: none; }

    /* Hero: content centred in full-height section */
    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
    }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p  { font-size: 1.2rem; color: #555; max-width: 50ch; }

    /* Card row: equal-width cards with gap */
    .cards {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding: 3rem 2rem;
    }
    .card {
      flex: 1;
      min-width: 200px;
      background: white;
      border: 1px solid #eee;
      border-radius: 12px;
      padding: 1.5rem;
    }
  </style>
</head>
<body>
  <nav class="nav">
    <strong>Alex</strong>
    <ul class="nav-links">
      <li><a href="#">About</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <section class="hero">
    <h1>Hi, I'm Alex</h1>
    <p>I build things for the web. Check out my projects below.</p>
  </section>

  <div class="cards">
    <div class="card"><h3>Project One</h3><p>A web app built with HTML, CSS, and JavaScript.</p></div>
    <div class="card"><h3>Project Two</h3><p>Another project, coming soon.</p></div>
    <div class="card"><h3>Project Three</h3><p>More work on the way.</p></div>
  </div>
</body>
</html>
```

This is a portfolio layout using only flexbox. Study each `.nav`, `.hero`, and `.cards` rule and trace it back to the concepts above.
