---
id: "how-the-web-works"
title: "How the Web Works"
type: "THEORY"
xpReward: 10
module: "Foundations"
sandbox: false
---

# How the Web Works

Every website you visit is just a collection of files sitting on a computer somewhere in the world.

## The request–response cycle

When you type a URL into your browser:

1. Your browser sends a **request** over the internet: *"Send me the files for this site"*
2. A **server** — a computer that runs 24/7 — receives the request
3. The server sends back **files** (HTML, CSS, images, etc.)
4. Your browser reads those files and renders the page

```
You → browser → internet → server
server → files → internet → browser → page appears
```

This whole process takes milliseconds. You never see it.

## The three languages every website uses

| Language | Job | What it controls |
|----------|-----|-----------------|
| **HTML** | Structure | Headings, paragraphs, links, images |
| **CSS** | Style | Colors, fonts, spacing, layout |
| **JavaScript** | Behavior | Clicks, animations, logic, data |

A good analogy: building a house.

- **HTML** is the walls, floors, and rooms — the structure
- **CSS** is the paint, furniture, and lighting — how it looks
- **JavaScript** is the plumbing and electricity — what makes it actually work

## Front-end vs. back-end

- **Front-end**: everything the user sees in the browser (HTML, CSS, JS)
- **Back-end**: the server, the database, the business logic behind the scenes

This course is front-end only. That's where every web developer starts, and it's more than enough to build real, working things.

## What the browser actually does

When your browser gets HTML from a server, it reads it from top to bottom and builds a visual page from the instructions. If the HTML says `<h1>Hello</h1>`, the browser renders a big bold heading that says "Hello."

You write the instructions. The browser follows them.
