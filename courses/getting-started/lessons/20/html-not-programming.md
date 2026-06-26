---
id: "html-not-programming"
title: "HTML is Not a Programming Language"
type: "THEORY"
xpReward: 10
module: "HTML — The Web's Structure"
sandbox: false
---

# HTML is Not a Programming Language

Before you write a single HTML tag, you need to understand what HTML actually is — and, just as importantly, what it isn't.

## HTML is markup, not code

HTML stands for **HyperText Markup Language**. The key word is **markup**.

You are not telling the computer to compute anything. There are no variables. No conditions. No loops. No functions. HTML has none of these things.

What HTML does is **describe structure and meaning**. You wrap content in tags to say what kind of thing it is:

- This is a heading
- This is a paragraph
- This is a link
- This is an image

The browser reads your HTML and renders it visually on screen. It decides how headings look, how links are styled, how paragraphs flow. You're describing, not computing.

## A brief history

HTML was invented by **Tim Berners-Lee** in 1991. He was a physicist at CERN who wanted to share documents between researchers. He built a system where documents could link to each other using **hyperlinks** — hence HyperText.

The first browser and web server ran in 1991. By 1993, browsers appeared that could display images. By 1995, JavaScript was added to make pages interactive. By 1996, CSS arrived to style them.

The web we have today — interactive, styled, dynamic — is HTML + CSS + JavaScript working together:

| Language | Role |
|----------|------|
| HTML | Structure and content |
| CSS | Appearance and layout |
| JavaScript | Behaviour and interactivity |

They're three separate languages, each doing one job. This is good design: separation of concerns. You've already learned JavaScript. HTML is the foundation that JavaScript and CSS operate on.

## The browser is the runtime

In C, you compiled to a binary that the OS ran. In JavaScript, the browser's JS engine was the runtime.

For HTML, the browser itself is the runtime. It reads the HTML file top to bottom and builds the **DOM** — Document Object Model — an internal tree of all the elements on the page.

As it builds the DOM, it renders each element to screen using default styles (which is why an `<h1>` is big and bold without any CSS — the browser has built-in styles for semantic elements).

## Why learn HTML after C and JavaScript?

Because now you understand what's underneath it. When you learned variables in C, you understood they were addresses in memory. When you learned JavaScript, you understood the engine executing your code.

HTML is the simplest of the three layers. It has no execution model, no types, no complexity. After what you've learned, you'll find it refreshingly straightforward.

The web runs on HTML. Every page you've ever visited is built on top of it. Understanding it isn't optional — it's the language of the web.
