---
id: "build-css"
title: "Build It: CSS Styling"
type: "THEORY"
xpReward: 20
module: "Portfolio Project"
sandbox: false
---

# Build It: CSS Styling

Open `style.css`. Copy everything below. Then read through each section and adjust the values to match your chosen colour scheme.

```css
/* ==============================
   VARIABLES & RESET
   ============================== */

:root {
  --primary:    #1a1a2e;
  --accent:     #e63946;
  --bg:         #f8f9fa;
  --card-bg:    #ffffff;
  --text:       #1a1a2e;
  --text-muted: #666;
  --radius:     12px;
  --max-w:      1100px;
}

body.dark {
  --bg:         #0d0d1a;
  --card-bg:    #1a1a2e;
  --text:       #f1faee;
  --text-muted: #aab;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  transition: background 0.3s, color 0.3s;
}

img { max-width: 100%; height: auto; }

/* ==============================
   TYPOGRAPHY
   ============================== */

h1 { font-size: clamp(2rem, 6vw, 4rem); font-weight: 800; line-height: 1.1; }
h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; }
h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
p  { max-width: 65ch; color: var(--text-muted); }

/* ==============================
   LAYOUT UTILITIES
   ============================== */

.container {
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 1.5rem;
}

section { padding: 5rem 0; }

/* ==============================
   NAV
   ============================== */

#navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  z-index: 100;
}

.logo {
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.nav-links a:hover { color: white; }

#dark-toggle {
  background: none;
  border: 2px solid rgba(255,255,255,0.4);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: border-color 0.2s;
}
#dark-toggle:hover { border-color: white; }

/* ==============================
   HERO
   ============================== */

#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  background: var(--primary);
  color: white;
}

.hero-content { max-width: 700px; }

.eyebrow {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.7);
  margin: 1rem auto 2rem;
  max-width: 50ch;
}

.btn {
  display: inline-block;
  background: var(--accent);
  color: white;
  padding: 0.85rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

/* ==============================
   ABOUT
   ============================== */

#about { background: var(--bg); }
#about p { font-size: 1.1rem; line-height: 1.8; }

/* ==============================
   PROJECTS
   ============================== */

#projects { background: var(--bg); }

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  flex: 1 1 280px;
  background: var(--card-bg);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: var(--radius);
  padding: 1.75rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.card-tag {
  display: inline-block;
  background: var(--accent);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.card p { font-size: 0.95rem; color: var(--text-muted); }

/* ==============================
   CONTACT
   ============================== */

#contact { background: var(--card-bg); }

#contact > .container > p { margin-bottom: 2rem; }

#contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
}

#contact-form label {
  font-weight: 600;
  font-size: 0.9rem;
}

#contact-form input,
#contact-form textarea {
  padding: 0.65rem 1rem;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  transition: border-color 0.2s;
}

#contact-form input:focus,
#contact-form textarea:focus {
  outline: none;
  border-color: var(--accent);
}

#contact-form button {
  align-self: flex-start;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

#contact-form button:hover { background: var(--accent); }

#form-success {
  display: none;
  color: #2e7d32;
  font-weight: 700;
  margin-top: 1rem;
}

/* ==============================
   FOOTER
   ============================== */

footer {
  background: var(--primary);
  color: rgba(255,255,255,0.5);
  text-align: center;
  padding: 2rem;
  font-size: 0.9rem;
}

/* ==============================
   RESPONSIVE
   ============================== */

@media (max-width: 640px) {
  #navbar {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .nav-links {
    gap: 1rem;
    font-size: 0.9rem;
  }

  #hero { padding: 8rem 1.5rem 4rem; }

  .card-grid { flex-direction: column; }

  .card { flex: none; }
}
```

## Check your work

Save. The browser should refresh. You should see:
- Fixed dark navbar across the top
- A full-height dark hero section with your name and tagline
- Styled project cards with tags and hover effects
- A clean contact form
- Dark footer

If something looks off, check for a missing `}` in CSS — one unclosed bracket can break everything below it. VS Code highlights mismatches.

## Adjusting your colours

Change `--primary` and `--accent` in `:root` to match your chosen scheme. Every element using those variables updates instantly.

Next: `script.js`.
