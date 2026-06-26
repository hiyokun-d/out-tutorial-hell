---
id: "deploy-netlify"
title: "Deploy with Netlify Drop"
type: "THEORY"
xpReward: 15
module: "Deploy"
sandbox: false
---

# Deploy with Netlify Drop

Netlify Drop is the fastest way to get a site live. No account. No signup. Just drag your folder.

## Before you deploy

Make sure your `my-portfolio` folder has exactly these files:

```
my-portfolio/
├── index.html    ← must be named exactly this
├── style.css
└── script.js
```

If you added a favicon, it's also in this folder. Nothing else is required.

## The steps

**1. Go to netlify.com/drop**

You'll see a large drop zone: "Drag and drop your site output folder here."

**2. Drag your entire `my-portfolio` folder** into that drop zone

Don't drag individual files — drag the whole folder. Netlify detects `index.html` automatically.

**3. Wait about 10 seconds**

You'll see a progress bar as Netlify uploads and deploys your files.

**4. Your site is live**

Netlify gives you a URL: something like `dreamy-coconut-4f8a12.netlify.app`. Click it. Your portfolio opens in a new tab — served from Netlify's servers, accessible to anyone in the world.

## Claim your site (optional)

If you want a tidier URL, click "Claim your site" on the Netlify page. You can create a free account and rename the site to `yourname.netlify.app`.

You can also set up a custom domain if you buy one (e.g. `yourname.com`), but that's optional and involves a small annual cost (~$10–15/year).

## Updating the site later

If you make changes to your files and want to update the live site:
1. Go to your site's Netlify dashboard (you'll need an account, or re-deploy)
2. Drag the updated folder again

The new version replaces the old one at the same URL.

If you want automatic updates every time you change files, that's what GitHub + Netlify integration does — but that's a future topic. For now, drag-and-drop works perfectly.

## Share the URL

Copy your Netlify URL. Send it to someone — a friend, a parent, anyone. Tell them what you built. That's the whole point.

This is the moment tutorial hell ends. You built something. It's live. It's yours.
