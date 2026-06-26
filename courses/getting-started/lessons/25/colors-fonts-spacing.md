---
id: "colors-fonts-spacing"
title: "Colors, Fonts, and Spacing"
type: "THEORY"
xpReward: 15
module: "CSS — Make It Look Good"
sandbox_language: "html"
---

# Colors, Fonts, and Spacing

The three properties you'll change most often in any stylesheet. Understanding them well means you can control the visual feel of a page completely.

## Colors

CSS has multiple ways to specify colour:

**Named colours** — 140 built-in names:

```css
color: red;
color: navy;
color: tomato;
color: cornflowerblue;
```

**Hex codes** — precise 6-digit values:

```css
color: #ff0000;   /* red */
color: #0a0a23;   /* dark navy */
color: #e8e8e8;   /* light gray */
```

A hex code is `#RRGGBB` — two digits each for red, green, blue (00–ff = 0–255). `#000000` is black, `#ffffff` is white.

**RGB** — explicit red, green, blue values:

```css
color: rgb(255, 0, 0);       /* red */
color: rgb(10, 10, 35);      /* dark navy */
color: rgba(0, 0, 0, 0.5);   /* black at 50% opacity */
```

`rgba` adds an **alpha** channel (opacity) — 0 is invisible, 1 is fully opaque.

**Key properties:**

```css
color: #333;                  /* text colour */
background-color: #f5f5f5;   /* background colour */
border-color: #ccc;           /* border colour */
```

## Fonts

**Font family:**

```css
font-family: sans-serif;
font-family: 'Georgia', serif;
font-family: 'Courier New', monospace;
font-family: 'Arial', 'Helvetica', sans-serif; /* fallback chain */
```

The browser uses the first font it has installed. If it doesn't have it, it tries the next. Always end with a generic: `serif`, `sans-serif`, or `monospace`.

**Font size:**

```css
font-size: 16px;    /* pixels — absolute */
font-size: 1rem;    /* relative to root (html) font size — usually 16px */
font-size: 1.5rem;  /* 1.5× the root size — 24px if root is 16px */
```

Prefer `rem` for font sizes — it respects the user's browser preferences and scales properly.

**Font weight:**

```css
font-weight: normal;    /* same as 400 */
font-weight: bold;      /* same as 700 */
font-weight: 300;       /* light */
font-weight: 800;       /* extra bold */
```

**Font style:**

```css
font-style: normal;
font-style: italic;
```

**Line height:**

```css
line-height: 1.6;   /* 1.6× the font size — comfortable for reading */
```

## Spacing

You already know margin and padding from the box model. Here's the full shorthand:

```css
/* All four sides — top, right, bottom, left (clockwise from top) */
margin: 1rem 2rem 1rem 2rem;

/* Shorthand: top/bottom and left/right */
margin: 1rem 2rem;  /* 1rem top+bottom, 2rem left+right */

/* Shorthand: all four sides equal */
margin: 1rem;

/* Individual sides */
margin-top: 0.5rem;
margin-bottom: 1rem;
padding-left: 1.5rem;
```

Same pattern for `padding`.

**Width and max-width:**

```css
width: 300px;       /* always exactly 300px */
max-width: 600px;   /* grows up to 600px, then stops */
```

For readable text, use `max-width` on containers:

```css
p {
    max-width: 65ch;  /* 65 characters wide — optimal reading width */
}
```

## A complete example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Style Demo</title>
    <style>
      * {
        box-sizing: border-box; /* makes sizing more intuitive */
        margin: 0;
        padding: 0;
      }
      body {
        font-family: 'Segoe UI', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        background-color: #f0f2f5;
        color: #1a1a1a;
        padding: 2rem;
      }
      h1 {
        font-size: 2rem;
        font-weight: 800;
        color: #0d0d2b;
        margin-bottom: 0.5rem;
      }
      p {
        max-width: 60ch;
        color: #444;
        margin-bottom: 1rem;
      }
      .tag {
        display: inline-block;
        background-color: #e0e7ff;
        color: #3730a3;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        margin-right: 0.3rem;
      }
    </style>
  </head>
  <body>
    <h1>Learning to Code</h1>
    <p>From C to JavaScript to HTML — building real understanding from the ground up.</p>
    <span class="tag">C</span>
    <span class="tag">JavaScript</span>
    <span class="tag">HTML</span>
    <span class="tag">CSS</span>
  </body>
</html>
```

Try this. Then experiment: change the `background-color`, try different `font-family` values, adjust `padding` on `.tag`. Small changes, immediate feedback.
