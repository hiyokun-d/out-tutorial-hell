---
id: "responsive-design"
title: "Responsive Design"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# Responsive Design

More than half of web traffic comes from phones. A site that looks great on desktop but breaks on mobile is an unfinished site. Responsive design means your page adapts to any screen size.

## The viewport meta tag

You saw this in the template — it's non-negotiable for mobile:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without it, mobile browsers zoom out to show a desktop-sized layout. With it, they use the actual device width.

## Media queries

A media query applies CSS only when a condition is true — usually when the screen is a certain width:

```css
/* Applies at all sizes */
.card { font-size: 1rem; }

/* Applies only when screen is 768px or narrower */
@media (max-width: 768px) {
  .card { font-size: 0.9rem; }
}
```

Common breakpoints:
```css
@media (max-width: 480px)  { /* phones */ }
@media (max-width: 768px)  { /* tablets and small laptops */ }
@media (max-width: 1024px) { /* laptops */ }
```

## Mobile-first approach

Write base styles for mobile. Then add media queries for larger screens:

```css
/* Mobile: single column, small text */
.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet and up: multi-column */
@media (min-width: 600px) {
  .cards {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* Desktop: fixed card width */
@media (min-width: 900px) {
  .cards {
    gap: 1.5rem;
  }
  .card {
    flex: 0 1 300px; /* max 300px wide */
  }
}
```

Mobile-first is better than desktop-first — start simple, add complexity. CSS rules that add are easier to manage than rules that override.

## Fluid widths and max-width

Instead of fixed pixel widths that break on small screens:

```css
/* Breaks on narrow screens */
.container { width: 960px; }

/* Fluid: takes full width up to 960px */
.container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
```

This pattern — `width: 100%; max-width: Xpx; margin: 0 auto;` — is the standard way to centre and constrain page content.

## Responsive images

```css
img {
  max-width: 100%;
  height: auto;
}
```

This two-line rule prevents images from overflowing their container on small screens. Always include it.

## A responsive page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Portfolio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { font-family: sans-serif; color: #1a1a2e; }

    img { max-width: 100%; height: auto; }

    .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

    nav {
      background: #1a1a2e;
      padding: 1rem 0;
    }
    nav .container { display: flex; justify-content: space-between; align-items: center; }
    nav a { color: white; text-decoration: none; font-weight: 600; margin-left: 1.5rem; }
    .logo { color: white; font-size: 1.2rem; font-weight: 800; }

    .hero { padding: 5rem 0; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }

    /* Mobile: stack nav links, smaller hero */
    @media (max-width: 600px) {
      .hero h1 { font-size: 1.8rem; }
      nav .container { flex-direction: column; gap: 1rem; }
    }

    .cards { display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 3rem 0; }
    .card {
      flex: 1 1 250px;
      background: white;
      border: 1px solid #eee;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <span class="logo">Alex</span>
      <div>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <h1>Building the web, one line at a time.</h1>
    </div>
  </section>

  <div class="container">
    <div class="cards">
      <div class="card"><h3>Project 1</h3><p>A responsive landing page.</p></div>
      <div class="card"><h3>Project 2</h3><p>A JavaScript weather app.</p></div>
      <div class="card"><h3>Project 3</h3><p>More coming soon.</p></div>
    </div>
  </div>
</body>
</html>
```

Try resizing the sandbox preview. The cards wrap to single column on small screens, the nav stacks. This is the responsive pattern your portfolio will use.
