---
id: "how-browsers-render"
title: "How Browsers Render Pages"
type: "THEORY"
xpReward: 5
module: "How the Web Works"
sandbox: false
---

# How Browsers Render Pages

Understanding what happens between "you type a URL" and "the page appears" makes you a better developer. Bugs make sense. Performance decisions make sense. Everything is less mysterious.

## Step 1: Request

You type `example.com` and press Enter. Your browser sends an HTTP request to a server. The server responds with an HTML file.

## Step 2: Parsing HTML → DOM

The browser reads the HTML top to bottom. As it encounters elements, it builds a tree structure in memory called the **DOM** (Document Object Model).

```html
<html>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>
```

Becomes a tree:
```
html
└── body
    ├── h1 "Hello"
    └── p "World"
```

The DOM is what JavaScript can read and modify. When you use JS to change a page without reloading — adding a notification, updating a counter, showing a menu — you're changing the DOM.

## Step 3: Parsing CSS → CSSOM

When the browser finds a `<link>` to a CSS file (or a `<style>` tag), it parses the CSS and builds the **CSSOM** (CSS Object Model) — a similar tree of style rules.

## Step 4: Render tree

The browser combines the DOM and CSSOM into a **render tree** — only elements that are actually visible (no `display: none` elements). Each node in the render tree has its computed styles attached.

## Step 5: Layout

The browser calculates the exact position and size of every element on screen. This is called **layout** (or reflow). Changing an element's size or position triggers a layout recalculation.

## Step 6: Paint

The browser draws the pixels to screen. Text, backgrounds, borders, images — all painted in the right order.

## Why this matters for you

**Scripts block rendering.** If you put a `<script>` tag in `<head>` without `defer`, the browser stops parsing HTML to download and run the script. That's why you'll see `defer` on script tags — it tells the browser "run this after HTML is parsed."

```html
<!-- Blocks rendering — don't do this -->
<script src="app.js"></script>

<!-- Runs after DOM is ready — do this -->
<script src="app.js" defer></script>
```

**CSS also blocks rendering.** The browser won't paint until it has the CSS. Put your `<link>` in `<head>` so CSS loads first.

**The order of your HTML is the order of the DOM.** Elements that appear first in HTML appear first in the DOM — and usually first visually. This is why HTML structure matters for both appearance and accessibility.

## The cascade

CSS stands for **Cascading** Style Sheets. "Cascading" means: when multiple rules apply to the same element, they're resolved by specificity and order.

More specific wins:
```css
p { color: gray; }         /* less specific */
.intro p { color: black; } /* more specific — wins */
```

Later rule wins if same specificity:
```css
p { color: gray; }
p { color: black; } /* same specificity, later — wins */
```

Understanding the cascade explains why your styles sometimes don't apply. You're not fighting the browser — you're just losing a specificity battle.

## You now know how the web works

When you write HTML, you're building the DOM. When you write CSS, you're styling the render tree. When you write JavaScript, you're manipulating the DOM at runtime. These three activities map directly to these three browser steps.

Every web developer works within this model, whether they know it or not. Now you know it.
