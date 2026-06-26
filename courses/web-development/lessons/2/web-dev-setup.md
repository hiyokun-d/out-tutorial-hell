---
id: "web-dev-setup"
title: "Your Web Dev Setup"
type: "THEORY"
xpReward: 5
module: "How the Web Works"
sandbox: false
---

# Your Web Dev Setup

You already have VS Code installed from the Getting Started course. Now we're setting it up properly for web development — the extensions and folder structure you'll use for every project.

## Install the Live Server extension

Live Server is the most important extension for web development. It runs a local web server that auto-refreshes your browser every time you save a file. No more manually refreshing.

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) to open Extensions
3. Search for **"Live Server"** by Ritwick Dey
4. Click **Install**

That's it. You now have a local development server.

## Create your project folder

Every project is a folder. Create one for this course:

1. Create a folder somewhere easy to find — Desktop, Documents, wherever you keep things
2. Name it `my-portfolio` (no spaces — use hyphens in folder and file names)
3. In VS Code, go to **File → Open Folder** and open it
4. VS Code will show the empty folder in the sidebar on the left

## Your first files

Inside `my-portfolio`, create two files:

- `index.html` — the main page (browsers look for `index.html` by default)
- `style.css` — your styles

To create a file in VS Code: hover over the folder name in the sidebar, click the "New File" icon, type the name.

## Run with Live Server

Right-click on `index.html` in the sidebar and choose **"Open with Live Server"**. A browser window opens automatically at `http://127.0.0.1:5500`. This is your local site.

Edit `index.html`, save, and watch the browser refresh instantly.

## The browser DevTools

Press `F12` on any page (or `Cmd+Option+I` on Mac) to open DevTools. You'll use these constantly:

- **Elements tab**: inspect the HTML and CSS of any element
- **Console tab**: see JavaScript errors and run JS directly
- **Network tab**: see every file the browser requested

Right-click any element on a webpage and choose **"Inspect"** to jump straight to that element in the Elements tab. This is how you learn from existing websites.

## File naming rules

Web files have rules:
- **Lowercase only** — `style.css` not `Style.CSS`
- **No spaces** — use `-` or `_` instead: `my-page.html`
- **The main file is always `index.html`** — servers serve this file when you visit a folder URL

Break these rules and links break, images don't load, and pages don't serve correctly.

## You're set up

VS Code, Live Server, a project folder, and browser DevTools. This is the full local web development environment. Professional developers use exactly this setup (with more tools added over time, but the core stays the same).

The next lesson is the last setup lesson. After that, you're writing code.
