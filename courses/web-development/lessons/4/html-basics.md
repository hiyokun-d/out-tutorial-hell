---
id: "html-basics"
title: "HTML Basics"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# HTML Basics

Every web page starts as a text file with a `.html` extension. The browser reads it top to bottom and draws what it finds. Let's build the skeleton every page needs.

## The required template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>This is my first web page.</p>
  </body>
</html>
```

Paste this in the sandbox. You'll see it render on the right.

## Every line explained

`<!DOCTYPE html>` — tells the browser this is HTML5. Always the first line, no exceptions.

`<html lang="en">` — the root element wrapping everything. `lang="en"` tells screen readers and search engines the language.

`<head>` — invisible metadata about the page. Never displayed to the user directly.

`<meta charset="UTF-8">` — use UTF-8 encoding so all characters (including emoji and non-English letters) display correctly.

`<meta name="viewport" content="width=device-width, initial-scale=1.0">` — makes your page respond correctly on mobile devices. Without this, phones zoom out to show a desktop-sized page. Always include it.

`<title>My Page</title>` — text shown in the browser tab. Also what search engines display as the link title.

`<body>` — everything visible goes here.

## Tags, elements, attributes

A **tag** is the `<name>` syntax. An **element** is the full opening tag + content + closing tag:

```html
<p>This is a paragraph element.</p>
```

An **attribute** adds extra information to a tag:

```html
<html lang="en">
      ^^^^^^^^^^^  attribute: name="value"
```

Some elements are **self-closing** — they have no content and no closing tag:

```html
<meta charset="UTF-8">
<br>
<img src="photo.jpg" alt="A photo">
```

## Nesting

Elements can contain other elements. The rule: close the inner element before closing the outer one.

```html
<!-- Correct -->
<p>This is <strong>important</strong> text.</p>

<!-- Wrong — strong closes after p -->
<p>This is <strong>important</p></strong>
```

The browser may try to recover from bad nesting, but don't rely on it. Bad nesting causes layout bugs that are hard to track down.

## The head vs the body

Everything in `<head>` is for the browser and search engines — not for users. Everything in `<body>` is what people see.

Think of `<head>` as the label on a package and `<body>` as the contents inside.

## Try it

In the sandbox:
1. Change the `<title>` text — watch the tab update
2. Change the `<h1>` to your name
3. Add another `<p>` below the first one

This is your base template. You'll start every HTML file with exactly this structure.
