---
id: "changing-the-page"
title: "Changing the Page"
type: "THEORY"
xpReward: 10
module: "JavaScript — Interactivity"
sandbox_language: "html"
---

# Changing the Page

Selecting elements is half the job. The other half is actually changing them. Once you have an element reference, you can change its text, its classes, its styles — even remove it entirely.

## Text and HTML content

```javascript
const title = document.querySelector("h1");

title.textContent = "New heading text";    // plain text — safe
title.innerHTML   = "Hello <em>world</em>"; // parsed as HTML — use carefully
```

`textContent` is safer: it never parses HTML, so there's no risk of accidental injection. Use `innerHTML` only when you need to insert actual HTML markup.

## Attributes

```javascript
const link = document.querySelector("a");
const img  = document.querySelector("img");

link.href        = "https://example.com";
link.textContent = "Visit";
img.src          = "photo.jpg";
img.alt          = "A photo of the project";
```

Any HTML attribute maps to a property on the element object.

## Classes — the right way

Directly editing `element.className` is a string — clumsy. Use `classList` instead:

```javascript
const card = document.querySelector(".card");

card.classList.add("highlight");      // add a class
card.classList.remove("highlight");   // remove a class
card.classList.toggle("highlight");   // add if missing, remove if present
card.classList.contains("highlight"); // returns true or false
```

This is how you show/hide menus, mark items as selected, trigger CSS transitions, and switch themes.

## Inline styles

```javascript
const box = document.querySelector(".box");

box.style.color           = "red";
box.style.backgroundColor = "lightblue";   // camelCase, not kebab-case
box.style.display         = "none";        // hide element
box.style.display         = "";            // reset to stylesheet value
```

Prefer `classList` over inline styles — classes keep style logic in CSS where it belongs. Use inline styles for things that must be computed at runtime (e.g., a progress bar width).

## Creating and removing elements

```javascript
// Create
const newCard = document.createElement("div");
newCard.className   = "card";
newCard.textContent = "New project";

// Add to page
document.querySelector("#projects").appendChild(newCard);

// Remove
const oldCard = document.querySelector(".card");
oldCard.remove();
```

## A live demo

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 2rem; }

    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: background 0.3s;
    }
    .card.highlighted { background: #fff3cd; border-color: #f0a500; }
    .card.done { opacity: 0.4; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1 id="title">Projects</h1>

  <div class="card" id="card1"><h3>Project 1</h3><p>A responsive website.</p></div>
  <div class="card" id="card2"><h3>Project 2</h3><p>A quiz app.</p></div>

  <script>
    // Change heading text
    document.getElementById("title").textContent = "My Projects (Updated)";

    // Highlight first card
    document.getElementById("card1").classList.add("highlighted");

    // Mark second card as done
    document.getElementById("card2").classList.add("done");

    // Dynamically create a new card
    const newCard = document.createElement("div");
    newCard.className   = "card";
    newCard.innerHTML   = "<h3>Project 3</h3><p>Added by JavaScript.</p>";
    document.body.appendChild(newCard);
  </script>
</body>
</html>
```

Notice: the yellow highlight and the strikethrough come from CSS classes — JavaScript just adds and removes classes. The visual rules stay in CSS. This separation makes everything easier to maintain.
