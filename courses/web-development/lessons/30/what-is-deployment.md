---
id: "what-is-deployment"
title: "What is Deployment?"
type: "THEORY"
xpReward: 5
module: "Deploy"
sandbox: false
---

# What is Deployment?

Right now, your portfolio exists only on your computer. If you send someone a link to your folder, they see nothing — because your files aren't on the internet. Deployment puts them there.

## How websites work

When you type a URL in a browser, it sends a request to a **server** — a computer that's always on, connected to the internet, and set up to respond. The server sends back your HTML, CSS, and JavaScript files. The browser receives them and renders your page.

Your laptop is not a server. You have to copy your files to a machine that is.

## What a hosting service does

A hosting service runs the servers for you. You give them your files; they put them on a server with an internet address. Anyone who visits that address gets your files.

For a simple site like yours (HTML + CSS + JS, no backend), this is called **static hosting**. There's no server-side code to run — the host just serves your files exactly as they are.

## Options for static hosting

| Service | How | Account needed? | Time |
|---------|-----|-----------------|------|
| Netlify Drop | Drag a folder | No | 30 seconds |
| GitHub Pages | Push code to GitHub | Yes (free) | ~5 min setup |
| Vercel | Connect a repo | Yes (free) | ~5 min setup |

For your first deployment, you'll use **Netlify Drop** — no account, no command line, no configuration. Drag your folder, get a URL.

## What you end up with

A URL that looks like `random-name-123.netlify.app`. It's real. Anyone can visit it. It works on any device, anywhere in the world.

That URL is what you'll share with friends, put in job applications, post on LinkedIn, or send to anyone who asks "what have you been working on?"

Next lesson: deploy.
