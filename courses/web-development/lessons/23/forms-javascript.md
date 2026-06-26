---
id: "forms-javascript"
title: "Forms with JavaScript"
type: "THEORY"
xpReward: 10
module: "JavaScript — Interactivity"
sandbox_language: "html"
---

# Forms with JavaScript

Forms collect user input. JavaScript reads that input, validates it, and decides what to do with it — without sending the user to a new page.

## Reading input values

```javascript
const nameInput  = document.querySelector("#name");
const emailInput = document.querySelector("#email");

console.log(nameInput.value);   // the text the user typed
console.log(emailInput.value);
```

`.value` gives you whatever is currently in the input field as a string.

## The submit event

```javascript
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();  // stops the page from reloading
  
  const name = document.querySelector("#name").value;
  console.log("Submitted name:", name);
});
```

`event.preventDefault()` is essential. Without it, the form submission reloads the page and you lose everything. Always call it first.

## Validation

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name  = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (name === "") {
    alert("Please enter your name.");
    return; // stop here — don't continue
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }

  // All good — do something
  console.log("Form valid. Name:", name, "Email:", email);
});
```

`.trim()` removes whitespace from both ends — catches people who hit space instead of typing.

## Live input feedback

```javascript
const nameInput  = document.querySelector("#name");
const nameOutput = document.querySelector("#name-preview");

nameInput.addEventListener("input", () => {
  nameOutput.textContent = nameInput.value || "Your name will appear here";
});
```

The `input` event fires on every keystroke. Great for live previews or character counts.

## A contact form

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; padding: 2rem; background: #f5f5f5; }

    form {
      max-width: 500px;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #eee;
    }

    h2 { margin-bottom: 1.5rem; }

    label { display: block; font-weight: 600; margin-bottom: 0.35rem; }

    input, textarea {
      width: 100%;
      padding: 0.6rem 0.8rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    input:focus, textarea:focus { outline: 2px solid #1a1a2e; border-color: transparent; }

    button {
      background: #1a1a2e;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
    }

    #success {
      display: none;
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    #preview {
      font-style: italic;
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <form id="contact-form">
    <h2>Contact Me</h2>

    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Your name" required>
    <p id="preview">Your name will appear here as you type</p>

    <label for="email">Email</label>
    <input type="email" id="email" placeholder="you@example.com" required>

    <label for="message">Message</label>
    <textarea id="message" rows="4" placeholder="What would you like to say?"></textarea>

    <button type="submit">Send Message</button>
  </form>

  <div id="success">
    Message received! I'll get back to you soon.
  </div>

  <script>
    const nameInput = document.getElementById("name");
    const preview   = document.getElementById("preview");

    // Live preview of name
    nameInput.addEventListener("input", () => {
      preview.textContent = nameInput.value || "Your name will appear here as you type";
    });

    // Form submission
    const form    = document.getElementById("contact-form");
    const success = document.getElementById("success");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name    = document.getElementById("name").value.trim();
      const email   = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email) {
        alert("Please fill in your name and email.");
        return;
      }

      // Show success message
      form.style.display  = "none";
      success.style.display = "block";
      console.log("Contact form submitted:", { name, email, message });
    });
  </script>
</body>
</html>
```

This is the exact contact form pattern you'll add to your portfolio. Type your name — watch the preview update live. Fill everything in and click Send.
