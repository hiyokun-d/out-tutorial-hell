---
id: "first-web-page"
title: "Your First Web Page"
type: "THEORY"
xpReward: 15
module: "HTML — The Web's Structure"
sandbox_language: "html"
---

# Your First Web Page

Every web page starts from the same template. Let's build it, understand every line, and then start making it your own.

## The template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>This is my first web page.</p>
  </body>
</html>
```

Paste this into the sandbox. You'll see the page render on the right.

## Line by line

### `<!DOCTYPE html>`

Tells the browser: this is an HTML5 document. Not a tag — a declaration. It must be the very first line of every HTML file.

Without it, browsers enter "quirks mode" and may render things incorrectly. Always include it.

### `<html lang="en">`

The root element. Every other element is inside this one. `lang="en"` tells browsers and assistive technologies that the page is in English — helpful for screen readers and search engines.

### `<head>` — invisible metadata

The `<head>` section is not visible on the page. It contains information **about** the page:

- `<meta charset="UTF-8">` — tells the browser to use UTF-8 encoding, which supports all Unicode characters (including emojis and non-English letters)
- `<title>My First Page</title>` — appears in the browser tab, not on the page itself

### `<body>` — what users see

Everything visible on the page goes inside `<body>`. This is where you write your content.

## Tags and elements

An **element** consists of an opening tag, content, and a closing tag:

```html
<h1>Hello, world!</h1>
```

- `<h1>` — opening tag
- `Hello, world!` — content
- `</h1>` — closing tag (note the `/`)

Some elements have no content and no closing tag — these are **self-closing elements**:

```html
<meta charset="UTF-8">
<br>
<img src="photo.jpg" alt="A photo">
```

## Headings

HTML has six heading levels:

```html
<h1>Biggest Heading</h1>
<h2>Second Level</h2>
<h3>Third Level</h3>
<h4>Fourth Level</h4>
<h5>Fifth Level</h5>
<h6>Smallest Heading</h6>
```

Use headings to express hierarchy, not for visual size. `<h1>` should be the main title of the page — one per page, ideally. Sub-sections use `<h2>`, sub-sub-sections use `<h3>`, and so on.

## Paragraphs

```html
<p>This is a paragraph. It holds a block of text.</p>
<p>This is another paragraph. Each one gets its own block with space between.</p>
```

The browser wraps text automatically. You don't use line breaks to create paragraphs — you use `<p>` tags.

## Nesting rules

Elements can be nested inside each other:

```html
<body>
  <h1>My Page</h1>
  <p>This is a <strong>very important</strong> message.</p>
</body>
```

Rules:
1. Elements must be properly closed before their parent closes
2. Opening and closing tags must match

Wrong:
```html
<p>Hello <strong>world</p></strong>  <!-- wrong — strong closes after p -->
```

Right:
```html
<p>Hello <strong>world</strong></p>  <!-- correct nesting -->
```

## Try it

In the sandbox, modify the template:
1. Change the `<title>` text
2. Change the `<h1>` to your name
3. Add a second `<h2>` with a subtitle
4. Add two or three `<p>` tags with some text about yourself

The sandbox renders the result live as you type.
