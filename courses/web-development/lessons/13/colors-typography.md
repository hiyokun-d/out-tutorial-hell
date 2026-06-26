---
id: "colors-typography"
title: "Colors & Typography"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# Colors & Typography

Two things that transform a page from ugly to professional: the right colours and the right typography. Both are controlled entirely by CSS.

## Colors

**Named colors** — 140 built-in names:
```css
color: tomato;
color: steelblue;
color: cornflowerblue;
```

**Hex codes** — precise 6-digit values:
```css
color: #1a1a2e;  /* dark navy */
color: #e63946;  /* vivid red */
color: #f1faee;  /* near white */
color: #ffffff;  /* white */
color: #000000;  /* black */
```

Format: `#RRGGBB` where each pair is 00–FF (0–255). Hex is the most common format in web design.

**RGB and RGBA:**
```css
color: rgb(26, 26, 46);
color: rgba(26, 26, 46, 0.5);   /* 50% transparent */
background: rgba(0, 0, 0, 0.8); /* dark overlay */
```

The `a` in `rgba` is opacity: 0 = invisible, 1 = fully opaque.

**The properties:**
```css
color: #333;                 /* text colour */
background-color: #f5f5f5;  /* background fill */
border-color: #ddd;          /* border colour */
```

## Font family

```css
body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

code {
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}
```

The browser tries each font in order. The last value (`sans-serif`, `serif`, `monospace`) is a fallback category — always include it.

**Using Google Fonts (free):**
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
```
```css
body { font-family: 'Inter', sans-serif; }
```

## Font size

```css
html { font-size: 16px; }  /* the root size — 1rem = 16px */

body  { font-size: 1rem; }     /* 16px */
h1    { font-size: 2.5rem; }   /* 40px */
h2    { font-size: 1.75rem; }  /* 28px */
small { font-size: 0.875rem; } /* 14px */
```

Use `rem` for font sizes. It respects user browser preferences and scales consistently.

## Font weight

```css
font-weight: 400;  /* normal */
font-weight: 600;  /* semi-bold */
font-weight: 700;  /* bold */
font-weight: 800;  /* extra-bold */
```

## Line height

```css
body { line-height: 1.6; }     /* comfortable for body text */
h1   { line-height: 1.1; }     /* tighter for large headings */
```

`line-height: 1.6` means 1.6× the font size. No unit — unitless values are inherited correctly.

## Text properties

```css
text-align: left | center | right | justify;
text-transform: uppercase | lowercase | capitalize;
text-decoration: none | underline | line-through;
letter-spacing: 0.05em;   /* slight spacing between letters */
max-width: 65ch;          /* ideal reading line length (65 characters) */
```

`max-width: 65ch` on body text containers is one of the highest-impact readability improvements you can make.

## A typography system

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: #1a1a2e;
      background: #fafafa;
      padding: 3rem 2rem;
    }

    h1 { font-size: 2.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.5rem; }
    p  { max-width: 65ch; color: #444; margin-bottom: 1rem; }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #e63946;
    }
  </style>
</head>
<body>
  <p class="eyebrow">Portfolio</p>
  <h1>Hi, I'm Alex</h1>
  <p>I build things for the web. Currently learning HTML, CSS, and JavaScript.</p>

  <h2>About Me</h2>
  <p>I started with C to understand how programming really works, then moved into web development to build things people can actually use.</p>
</body>
</html>
```

Notice: the `eyebrow` class creates the small label above the heading — a common design pattern in portfolios and landing pages.
