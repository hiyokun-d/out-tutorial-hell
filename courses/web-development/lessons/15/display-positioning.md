---
id: "display-positioning"
title: "Display & Positioning"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# Display & Positioning

How elements stack, flow, and sit on the page is controlled by `display` and `position`. These two properties unlock layout.

## Display

The `display` property controls how an element participates in the page flow.

**`block`** — takes full width, starts on new line:
```css
div, p, h1, section, header, footer { display: block; }
```

**`inline`** — flows with text, no width/height:
```css
span, a, strong, em { display: inline; }
```

**`inline-block`** — flows with text but respects width/height:
```css
.tag { display: inline-block; padding: 0.25rem 0.75rem; }
```

**`none`** — removes element from flow, invisible:
```css
.hidden { display: none; }
```

**`flex`** and **`grid`** — layout containers (next two lessons).

## Hiding elements

```css
.hidden { display: none; }       /* removes from flow, no space taken */
.invisible { visibility: hidden; } /* invisible but space reserved */
.transparent { opacity: 0; }    /* invisible, space reserved, still clickable */
```

Use `display: none` to toggle UI elements with JavaScript (show/hide a menu).

## Position

Position controls where an element sits relative to its normal position or a parent.

**`static`** (default) — normal document flow. `top/right/bottom/left` have no effect.

**`relative`** — stays in normal flow, but you can offset it:
```css
.nudged {
  position: relative;
  top: 10px;    /* move down 10px from its normal position */
  left: 20px;   /* move right 20px */
}
```

The space it would normally occupy is still reserved.

**`absolute`** — removed from normal flow, positioned relative to the nearest ancestor with `position: relative` (or the page if none):
```css
.parent { position: relative; }

.badge {
  position: absolute;
  top: 0;
  right: 0;
}
```

Common use: a badge/dot on a card, an icon in a corner.

**`fixed`** — stays in place as the page scrolls. Positioned relative to the viewport:
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
```

Common use: sticky navigation bars.

**`sticky`** — stays in normal flow until you scroll past it, then sticks:
```css
.sidebar { position: sticky; top: 1rem; }
```

## z-index

When elements overlap, `z-index` controls which one appears on top. Higher = in front:

```css
.modal   { z-index: 1000; }
.overlay { z-index: 999; }
.navbar  { z-index: 100; }
```

`z-index` only works on positioned elements (`relative`, `absolute`, `fixed`, `sticky`).

## A sticky nav example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #1a1a2e;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      gap: 2rem;
      z-index: 100;
    }

    nav a { color: white; text-decoration: none; font-weight: 600; }

    main { margin-top: 4rem; padding: 2rem; }

    section { min-height: 100vh; padding: 4rem 2rem; border-bottom: 1px solid #eee; }
    section h2 { font-size: 2rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>

  <main>
    <section id="about"><h2>About</h2><p>Scroll down to see the fixed nav stay in place.</p></section>
    <section id="projects"><h2>Projects</h2></section>
    <section id="contact"><h2>Contact</h2></section>
  </main>
</body>
</html>
```

This is your portfolio's nav pattern. Scroll the preview — the nav stays fixed at the top.
