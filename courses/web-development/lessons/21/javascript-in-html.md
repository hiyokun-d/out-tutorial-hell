---
id: "javascript-in-html"
title: "JavaScript in HTML"
type: "THEORY"
xpReward: 10
module: "JavaScript — Interactivity"
sandbox_language: "html"
---

# JavaScript in HTML

HTML gives structure. CSS gives style. JavaScript gives behaviour — things that happen when the user interacts with the page. This lesson is about wiring JavaScript into your HTML.

## The script tag

Put JavaScript inside a `<script>` tag:

```html
<body>
  <h1>Hello</h1>

  <script>
    console.log("JavaScript is running");
  </script>
</body>
```

Put `<script>` at the **bottom of `<body>`**, just before `</body>`. The browser reads HTML top to bottom — if the script runs before the elements exist, it can't find them.

## External script files

For real projects, JavaScript lives in its own `.js` file:

```html
<body>
  <!-- page content -->

  <script src="script.js"></script>
</body>
```

```javascript
// script.js
console.log("Hello from script.js");
```

This keeps your files clean and separated by purpose: HTML for structure, CSS for style, JS for behaviour.

## The defer attribute

When loading a script in the `<head>`, use `defer` so it doesn't block page rendering:

```html
<head>
  <script src="script.js" defer></script>
</head>
```

`defer` tells the browser: download the script while parsing HTML, then run it after the HTML is fully loaded. You get the same result as putting the script at the bottom of `<body>`, but the script tag is in a more conventional place.

**Rule of thumb**: external scripts in `<head>` → use `defer`. Inline scripts in `<body>` at the bottom → no attribute needed.

## console.log — your first debugging tool

```javascript
console.log("Hello");
console.log(42);
console.log(2 + 2);
console.log("User count:", 1500);
```

`console.log` prints to the browser's developer tools console. To open it: F12 → Console tab (or right-click the page → Inspect → Console).

In this sandbox, console output appears in the preview panel.

## Variables and types — a quick reminder

JavaScript is dynamically typed (unlike C). The type is determined by the value, not declared upfront:

```javascript
let name = "Alex";      // string
let age  = 22;          // number
let active = true;      // boolean
let score  = null;      // no value yet

// You can reassign to a different type
let x = 42;
x = "now I'm a string"; // valid in JavaScript
```

`let` = a variable that can change. `const` = a variable that can't be reassigned (use this by default).

## A first script

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1 id="greeting">Loading...</h1>

  <script>
    const name = "Alex";
    const hour = new Date().getHours();

    let message;
    if (hour < 12) {
      message = "Good morning, " + name + "!";
    } else if (hour < 18) {
      message = "Good afternoon, " + name + "!";
    } else {
      message = "Good evening, " + name + "!";
    }

    document.getElementById("greeting").textContent = message;
  </script>
</body>
</html>
```

The `<h1>` starts as "Loading..." and immediately gets updated by JavaScript. This is the pattern behind every dynamic web page.

Notice: JavaScript uses the same logic patterns you learned in C — `if`, `else if`, `else` — but without the `{}` types and without `printf`. The logic is identical.
