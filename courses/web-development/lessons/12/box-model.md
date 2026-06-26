---
id: "box-model"
title: "The Box Model"
type: "THEORY"
xpReward: 10
module: "CSS — Style"
sandbox_language: "html"
---

# The Box Model

Every element in HTML is a rectangular box. The box has four layers. Understanding them is the difference between fighting layout bugs and fixing them in 10 seconds.

## The four layers

```
┌─────────────────────────────────────┐
│              MARGIN                 │  ← space outside the border (pushes other elements away)
│  ┌───────────────────────────────┐  │
│  │           BORDER              │  │  ← the visible edge
│  │  ┌─────────────────────────┐  │  │
│  │  │         PADDING         │  │  │  ← space between content and border
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │      CONTENT      │  │  │  │  ← text, image, child elements
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

```css
.card {
  margin: 1rem;          /* space outside */
  border: 2px solid #ddd; /* the outline */
  padding: 1.5rem;       /* space inside */
  width: 300px;          /* width of the content area */
}
```

## The width trap

By default, `width` sets the **content** width only. Padding and border are added on top:

```css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
}
/* Actual rendered width: 200 + 20 + 20 + 2 + 2 = 244px */
```

This surprises everyone. Fix it with `box-sizing: border-box`:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

With `border-box`, `width: 200px` means the **total** width including padding and border. Padding is subtracted from the content area. This is how every web developer wants it to work, and why this rule goes at the top of every stylesheet.

## Margin shorthand

```css
/* All four sides */
margin: 1rem;

/* Top/bottom, Left/right */
margin: 1rem 2rem;

/* Top, Right, Bottom, Left (clockwise) */
margin: 1rem 2rem 0.5rem 2rem;

/* Individual sides */
margin-top: 1rem;
margin-right: 0;
margin-bottom: 2rem;
margin-left: 0;

/* Auto — centres block elements horizontally */
margin: 0 auto;
```

`margin: 0 auto` centres a block element inside its container (requires a set `width`). You'll use this constantly.

## Padding works the same way

Same shorthand syntax as margin, just inward instead of outward.

## Borders

```css
border: 1px solid #ddd;
border: 2px dashed red;
border: 4px dotted blue;

border-top: 2px solid var(--accent);  /* only the top side */
border-radius: 8px;   /* rounded corners */
border-radius: 50%;   /* perfect circle (if width = height) */
```

## See it live

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    body { font-family: sans-serif; padding: 2rem; background: #f0f0f0; }

    .box {
      width: 300px;
      padding: 1.5rem;
      margin: 1rem auto;
      border: 2px solid #333;
      border-radius: 12px;
      background: white;
    }

    .box-sm { padding: 0.5rem; }
    .box-lg { padding: 3rem; }
  </style>
</head>
<body>
  <div class="box">Default padding (1.5rem)</div>
  <div class="box box-sm">Small padding (0.5rem)</div>
  <div class="box box-lg">Large padding (3rem)</div>
</body>
</html>
```

Notice how padding changes the feel without changing the width (because of `box-sizing: border-box`). This is the box model working correctly.

Always put `box-sizing: border-box` at the top of your stylesheet. Consider it a mandatory rule.
