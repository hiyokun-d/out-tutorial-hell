---
id: "the-dom"
title: "The DOM"
type: "THEORY"
xpReward: 10
module: "JavaScript — Interactivity"
sandbox_language: "html"
---

# The DOM

When a browser loads HTML, it builds a tree of objects representing every element. This tree is the **DOM** — Document Object Model. JavaScript can read, change, add, and remove any node in that tree. That's how web pages become dynamic.

## Selecting elements

**By ID** — fastest, returns one element:
```javascript
const title = document.getElementById("hero");
const btn   = document.getElementById("submit-btn");
```

**By CSS selector** — most flexible, returns first match:
```javascript
const heading = document.querySelector("h1");
const card    = document.querySelector(".card");
const hero    = document.querySelector("#hero");
const navLink = document.querySelector("nav a");
```

**By CSS selector — all matches:**
```javascript
const allCards = document.querySelectorAll(".card");
const allLinks = document.querySelectorAll("nav a");
```

`querySelectorAll` returns a NodeList. Loop through it with `forEach`:
```javascript
document.querySelectorAll(".card").forEach(card => {
  console.log(card.textContent);
});
```

## Reading element info

```javascript
const h1 = document.querySelector("h1");

h1.textContent    // the plain text inside the element
h1.innerHTML      // the raw HTML inside (including tags)
h1.id             // the id attribute
h1.className      // the class attribute as a string
```

## Navigating the tree

```javascript
const nav = document.querySelector("nav");

nav.children          // all child elements
nav.firstElementChild // first child element
nav.lastElementChild  // last child element
nav.parentElement     // the element's parent
```

## A live example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    #output { background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-top: 1rem; font-family: monospace; }
  </style>
</head>
<body>
  <h1 id="page-title">My Portfolio</h1>

  <div class="card"><h3>Project 1</h3><p>A responsive website.</p></div>
  <div class="card"><h3>Project 2</h3><p>A JavaScript quiz.</p></div>
  <div class="card"><h3>Project 3</h3><p>Coming soon.</p></div>

  <div id="output">Running...</div>

  <script>
    const output = document.getElementById("output");
    const results = [];

    // Select by ID
    const title = document.getElementById("page-title");
    results.push("Title text: " + title.textContent);

    // Select all cards
    const cards = document.querySelectorAll(".card");
    results.push("Number of cards: " + cards.length);

    // Loop and read content
    cards.forEach((card, i) => {
      const heading = card.querySelector("h3");
      results.push("Card " + (i + 1) + ": " + heading.textContent);
    });

    output.innerHTML = results.join("<br>");
  </script>
</body>
</html>
```

Run this and read the output. Every line in `#output` comes from JavaScript reading the DOM — the same DOM your HTML built.
