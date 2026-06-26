---
id: "events"
title: "Events"
type: "THEORY"
xpReward: 10
module: "JavaScript — Interactivity"
sandbox_language: "html"
---

# Events

The page starts static. Events are how JavaScript responds to user actions — clicks, key presses, scrolls, mouse movements. `addEventListener` is the function that wires them up.

## addEventListener

```javascript
element.addEventListener("eventType", function() {
  // runs when the event happens
});
```

The second argument is a **callback** — a function that runs later, when the event fires.

## Click events

```javascript
const btn = document.querySelector("#submit");

btn.addEventListener("click", function() {
  console.log("Button clicked!");
});
```

Or with an arrow function (shorter syntax, same effect):

```javascript
btn.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

## The event object

The callback receives an event object with info about what happened:

```javascript
btn.addEventListener("click", (event) => {
  console.log("Clicked element:", event.target);
  console.log("Mouse X:", event.clientX);
});

document.addEventListener("keydown", (event) => {
  console.log("Key pressed:", event.key);
});
```

## Common event types

```javascript
// Mouse
"click"       // single click
"dblclick"    // double click
"mouseover"   // mouse enters element
"mouseout"    // mouse leaves element

// Keyboard
"keydown"     // key pressed
"keyup"       // key released

// Form
"submit"      // form submitted
"change"      // input value changed
"input"       // input value being typed (live)
"focus"       // element gains focus
"blur"        // element loses focus

// Page
"load"        // page fully loaded
"scroll"      // user scrolls
```

## Toggle menu example

The classic mobile hamburger menu — click a button, show/hide the nav:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; }

    nav {
      background: #1a1a2e;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo { color: white; font-weight: 700; }

    .menu-btn {
      background: none;
      border: 2px solid white;
      color: white;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      border-radius: 4px;
    }

    .nav-links {
      list-style: none;
      display: none;         /* hidden by default */
      flex-direction: column;
      gap: 0.5rem;
      background: #1a1a2e;
      padding: 1rem 2rem;
    }
    .nav-links.open {
      display: flex;         /* shown when .open is present */
    }
    .nav-links a { color: white; text-decoration: none; }

    main { padding: 3rem 2rem; }
  </style>
</head>
<body>
  <nav>
    <span class="logo">Alex</span>
    <button class="menu-btn" id="menu-toggle">Menu</button>
  </nav>

  <ul class="nav-links" id="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

  <main>
    <h1>Click "Menu" to toggle navigation.</h1>
    <p>This is how mobile menus work — one event listener, one class toggle, CSS handles the rest.</p>
  </main>

  <script>
    const toggleBtn  = document.getElementById("menu-toggle");
    const navLinks   = document.getElementById("nav-links");

    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  </script>
</body>
</html>
```

Four lines of JavaScript. The rest is CSS. This is the pattern — JavaScript adds/removes a class, CSS handles what that class looks like.
