---
id: "build-javascript"
title: "Build It: JavaScript Features"
type: "THEORY"
xpReward: 20
module: "Portfolio Project"
sandbox: false
---

# Build It: JavaScript Features

Open `script.js`. Copy this code. Then read through it — every line is something you learned in the JavaScript module.

```javascript
// ==============================
// DARK MODE TOGGLE
// ==============================

const darkToggle = document.getElementById("dark-toggle");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Update button icon to match current mode
  const isDark = document.body.classList.contains("dark");
  darkToggle.textContent = isDark ? "☀️" : "🌙";
});

// ==============================
// CONTACT FORM
// ==============================

const form    = document.getElementById("contact-form");
const success = document.getElementById("form-success");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name    = document.getElementById("c-name").value.trim();
  const email   = document.getElementById("c-email").value.trim();
  const message = document.getElementById("c-message").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  // Show success message, hide form
  form.style.display    = "none";
  success.style.display = "block";

  console.log("Form submitted:", { name, email, message });
});

// ==============================
// SMOOTH SCROLL — ACTIVE NAV LINK
// ==============================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));
```

Now add the `.active` style to your `style.css` so the highlight shows:

```css
.nav-links a.active {
  color: white;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

## What each part does

**Dark mode toggle** — listens for a click on the moon/sun button. Toggles the `dark` class on `<body>`. CSS variables in `body.dark` automatically flip the colour scheme. The button icon swaps between 🌙 and ☀️ based on which mode is active.

**Contact form** — prevents the default page reload. Reads and trims the input values. Validates name and email (stops early with `return` if invalid). On success: hides the form, shows the success message, logs to console.

**Active nav link** — uses `IntersectionObserver` to watch each section. When a section is 50% visible, it adds the `active` class to the matching nav link and removes it from the others. This is how sites highlight the current section as you scroll.

## Check your work

Save `script.js`. In the browser:
1. Click the moon button — page should go dark. Click again — back to light.
2. Click a nav link — should scroll smoothly to that section. The nav link should be underlined.
3. Fill out the form and click Send — success message should appear.
4. Try submitting with an empty name — should see an alert.

If dark mode doesn't work: check that `body.dark` in your CSS has the variable overrides, and that the `id` on the button matches `document.getElementById("dark-toggle")`.

If the form doesn't respond: open DevTools (F12) → Console tab → look for any red errors. The most common issue is a typo in an `id` — `c-name` vs `cname`.

Next: final polish.
