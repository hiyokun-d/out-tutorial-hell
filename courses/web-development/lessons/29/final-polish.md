---
id: "final-polish"
title: "Final Polish & Test"
type: "THEORY"
xpReward: 10
module: "Portfolio Project"
sandbox: false
---

# Final Polish & Test

Before you deploy, do a full review. This checklist keeps you from shipping something embarrassing.

## Content review

Read every word out loud. Fix anything that sounds wrong.

- [ ] Your name is spelled correctly everywhere
- [ ] The tagline is something you'd actually say
- [ ] The About section sounds like you, not a template
- [ ] Project descriptions say what you actually built
- [ ] No placeholder text remains (`[Your Name]`, `Description here.`, etc.)
- [ ] The footer year is correct

## Functionality

- [ ] Dark mode toggle works (light → dark → light)
- [ ] Nav links scroll to the correct sections
- [ ] Active nav highlight works on scroll
- [ ] Submitting the form with empty fields shows alerts
- [ ] Submitting the form correctly shows success message
- [ ] No red errors in DevTools Console (F12 → Console)

## Appearance

- [ ] The hero is readable — text has enough contrast against the background
- [ ] Cards look good in light mode and dark mode
- [ ] The contact form fields are styled (not unstyled browser defaults)
- [ ] The page doesn't overflow horizontally on any section

## Mobile test

Open DevTools (F12), click the device toggle icon (phone/tablet icon in the toolbar), and test at 375px wide (iPhone SE size) and 768px wide (iPad size):

- [ ] The nav doesn't overflow (links wrap or compress)
- [ ] The hero text fits and isn't tiny
- [ ] Cards stack vertically on mobile
- [ ] The form is full-width and usable

## Performance check (optional but good habit)

In DevTools → Lighthouse tab → run a report. Aim for:
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+

If Accessibility is low, the most common fix is adding `alt` attributes to any images, `label` elements for every input, and enough colour contrast between text and background.

## Last tweaks

A few small things that make a big difference:

**Smooth font loading** — add this to the top of `style.css` to use a clean Google Font:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
```
Then change `font-family` in `body` to `'Inter', system-ui, sans-serif`.

**A favicon** — the little icon in the browser tab. The quickest option: go to any emoji favicon generator site, pick an emoji that represents you, download the `.ico` file, drop it in your `my-portfolio` folder, and add to `index.html`:
```html
<link rel="icon" href="favicon.ico">
```

**Social meta tags** — these control what appears when your URL is shared on Discord, Twitter, LinkedIn:
```html
<meta property="og:title" content="[Your Name] — Portfolio">
<meta property="og:description" content="[Your tagline]">
```

Once you're happy with it, the site is ready to deploy. Next lesson: what deployment actually means.
