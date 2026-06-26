---
id: "css-variables"
title: "CSS Variables"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# CSS Variables

CSS variables (officially "custom properties") let you define a value once and reuse it everywhere. Change it in one place — every element that uses it updates automatically.

## Defining and using variables

```css
:root {
  --primary: #1a1a2e;
  --accent:  #e63946;
  --text:    #333;
  --gap:     1.5rem;
}
```

`:root` is the document's root element — variables defined there are available everywhere in your stylesheet.

Use a variable with `var()`:

```css
nav      { background: var(--primary); }
button   { background: var(--accent); }
body     { color: var(--text); }
.cards   { gap: var(--gap); }
```

## Why bother?

Without variables:
```css
nav    { background: #1a1a2e; }
footer { background: #1a1a2e; }
.card  { border-color: #1a1a2e; }
/* Want to change the dark colour? Edit every line. */
```

With variables:
```css
:root { --primary: #1a1a2e; }

nav    { background: var(--primary); }
footer { background: var(--primary); }
.card  { border-color: var(--primary); }
/* Want to change? Edit one line. */
```

## Fallback values

```css
color: var(--text-color, #333);
/* If --text-color isn't defined, use #333 */
```

## Dark mode in one swap

```css
:root {
  --bg:   #ffffff;
  --text: #1a1a2e;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg:   #1a1a2e;
    --text: #f1faee;
  }
}

body { background: var(--bg); color: var(--text); }
```

The browser detects the user's OS preference and switches automatically. Two variable overrides. Every element updates.

## Portfolio variable system

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary:   #1a1a2e;
      --accent:    #e63946;
      --bg:        #f8f9fa;
      --card-bg:   #ffffff;
      --text:      #1a1a2e;
      --text-muted:#666;
      --radius:    12px;
      --gap:       1.5rem;
      --max-w:     1100px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }

    nav {
      background: var(--primary);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav a, nav strong { color: white; text-decoration: none; }
    nav ul { display: flex; gap: var(--gap); list-style: none; }

    .hero {
      text-align: center;
      padding: 6rem 2rem;
    }
    .hero h1 { font-size: 3rem; font-weight: 800; }
    .hero span { color: var(--accent); }
    .hero p { color: var(--text-muted); max-width: 50ch; margin: 1rem auto; }

    .btn {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 0.75rem 2rem;
      border-radius: var(--radius);
      text-decoration: none;
      font-weight: 700;
      margin-top: 1rem;
    }

    .cards {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap);
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    .card {
      flex: 1 1 260px;
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 1.5rem;
      border: 1px solid #eee;
    }

    .card h3 { margin-bottom: 0.5rem; }
    .card p  { color: var(--text-muted); font-size: 0.9rem; }
  </style>
</head>
<body>
  <nav>
    <strong>Alex</strong>
    <ul>
      <li><a href="#">About</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <section class="hero">
    <h1>Hi, I'm <span>Alex</span></h1>
    <p>I build things for the web. HTML, CSS, JavaScript — and a bit of C.</p>
    <a href="#" class="btn">See My Work</a>
  </section>

  <div class="cards">
    <div class="card"><h3>Project 1</h3><p>A responsive portfolio built from scratch.</p></div>
    <div class="card"><h3>Project 2</h3><p>A JavaScript quiz app.</p></div>
    <div class="card"><h3>Project 3</h3><p>More coming soon.</p></div>
  </div>
</body>
</html>
```

This is the CSS variable system your portfolio will actually use. Change `--accent` from `#e63946` to `#0077ff` and watch every button and highlight colour swap at once.
