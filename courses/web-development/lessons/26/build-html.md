---
id: "build-html"
title: "Build It: HTML Structure"
type: "THEORY"
xpReward: 15
module: "Portfolio Project"
sandbox: false
---

# Build It: HTML Structure

Open VS Code. Open your `my-portfolio` folder. Open `index.html`. Write this code — customise anything in brackets.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Your Name] — Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- NAVIGATION -->
  <nav id="navbar">
    <span class="logo">[Your Name]</span>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button id="dark-toggle" aria-label="Toggle dark mode">🌙</button>
  </nav>

  <!-- HERO -->
  <section id="hero">
    <div class="hero-content">
      <p class="eyebrow">Hi, I'm</p>
      <h1>[Your Name]</h1>
      <p class="tagline">[Your tagline]</p>
      <a href="#projects" class="btn">See My Projects</a>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <div class="container">
      <h2>About Me</h2>
      <p>
        [Your about paragraph — 2–3 sentences about who you are, 
        what you're learning, and why. Be honest, it reads better.]
      </p>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="projects">
    <div class="container">
      <h2>Projects</h2>
      <div class="card-grid">

        <div class="card">
          <div class="card-tag">HTML</div>
          <h3>Page Skeleton</h3>
          <p>A fully structured HTML page built with semantic elements — nav, header, main, section, footer.</p>
        </div>

        <div class="card">
          <div class="card-tag">HTML · CSS</div>
          <h3>Styled Portfolio</h3>
          <p>Added a full CSS stylesheet: flexbox layout, colour variables, responsive design.</p>
        </div>

        <div class="card">
          <div class="card-tag">HTML · CSS · JS</div>
          <h3>Interactive Portfolio</h3>
          <p>This site — dark mode toggle, form validation, and JavaScript DOM manipulation.</p>
        </div>

      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact">
    <div class="container">
      <h2>Contact</h2>
      <p>Have a question or want to work together? Send me a message.</p>

      <form id="contact-form">
        <label for="c-name">Name</label>
        <input type="text" id="c-name" placeholder="Your name" required>

        <label for="c-email">Email</label>
        <input type="email" id="c-email" placeholder="you@example.com" required>

        <label for="c-message">Message</label>
        <textarea id="c-message" rows="5" placeholder="What would you like to say?"></textarea>

        <button type="submit">Send Message</button>
      </form>

      <p id="form-success">Thanks! I'll get back to you soon.</p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p>Built by [Your Name] · [Year]</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

## What to customise

- Every `[Your Name]` → your actual name
- `[Your tagline]` → from lesson 25
- `[Your about paragraph]` → from lesson 25
- Project descriptions → describe what you actually built
- Footer year → this year

## Check your work

Save the file (`Cmd+S` / `Ctrl+S`). If Live Server is running, the browser auto-refreshes. You should see:
- Unstyled but structured content — a nav with links, a hero section, project cards, a form, and a footer
- All sections present and linked: clicking "About" in the nav jumps to the About section (HTML anchor links work before CSS)

If the page is blank or shows an error, check:
- `index.html` is in the `my-portfolio` folder
- You didn't accidentally delete a closing tag — use VS Code's HTML formatter (Shift+Alt+F) to spot issues

Next: `style.css`.
