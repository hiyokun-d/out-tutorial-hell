---
id: "semantic-html"
title: "Semantic HTML"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# Semantic HTML

Every HTML element carries meaning — not just visual instructions, but information about what the content *is*. Semantic HTML means choosing elements based on meaning, not appearance.

## `<div>` is not enough

`<div>` is a container with no meaning. It's not wrong, but using it for everything leaves the browser, search engines, and screen readers with no idea what anything is.

```html
<!-- No semantic meaning — all divs -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
</div>
<div class="footer">...</div>
```

```html
<!-- Semantic — each element describes its purpose -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

Same visual result. Completely different meaning.

## The key semantic elements

**`<header>`** — introductory content for the page or a section. Usually contains the logo, site title, and navigation.

**`<nav>`** — a group of navigation links. Screen readers announce "navigation landmark" so users can jump to it.

**`<main>`** — the primary content of the page. There should be exactly one `<main>` per page.

**`<section>`** — a thematic grouping of content with its own heading. Use for distinct parts of a page (About, Skills, Projects).

**`<article>`** — self-contained content that could stand alone — a blog post, a news story, a project card.

**`<aside>`** — content tangentially related to the main content — a sidebar, a callout box.

**`<footer>`** — closing content for the page or section. Copyright, links, contact info.

## Your portfolio structure

This is what your portfolio HTML skeleton will look like:

```html
<body>
  <header>
    <nav>
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#projects">Projects</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h1>Your Name</h1>
      <p>I build things for the web.</p>
      <a href="#projects">See my work</a>
    </section>

    <section id="about">
      <h2>About</h2>
      <p>Your bio here.</p>
    </section>

    <section id="skills">
      <h2>Skills</h2>
    </section>

    <section id="projects">
      <h2>Projects</h2>
    </section>

    <section id="contact">
      <h2>Contact</h2>
    </section>
  </main>

  <footer>
    <p>Built by Your Name · 2025</p>
  </footer>
</body>
```

This structure is common enough that experienced developers can read it immediately. Browsers can navigate it. Search engines index it correctly.

## Why it matters

**Accessibility**: Screen reader users navigate by landmarks — header, main, nav, footer. Without semantic HTML, they're lost.

**SEO**: Search engines understand `<article>` and `<main>` content differently than `<div>` soup. Semantic structure helps your page rank.

**Maintainability**: HTML that says what it means is easier for you (and others) to work with six months later.

Semantic HTML costs nothing extra. Use it.
