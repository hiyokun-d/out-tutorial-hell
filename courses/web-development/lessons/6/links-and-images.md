---
id: "links-and-images"
title: "Links & Images"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# Links & Images

Links and images are what make the web the web. Links connect pages. Images make pages visual. Both are simple elements with a few important details to get right.

## Links — `<a>`

```html
<a href="https://example.com">Visit Example</a>
```

- `href` (hypertext reference) — where to go
- The text between the tags — what the user clicks

**Open in new tab:**
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Opens in new tab
</a>
```

`target="_blank"` opens a new tab. Always pair it with `rel="noopener noreferrer"` — a security measure that prevents the linked page from accessing your page via `window.opener`.

**Link to a section on the same page:**
```html
<a href="#about">Go to About section</a>

<!-- ...further down the page... -->
<section id="about">
  <h2>About</h2>
</section>
```

The `#about` href jumps to the element with `id="about"`. This is called an **anchor link** and you'll use it in your portfolio for smooth navigation.

**Link to another page in your project:**
```html
<a href="about.html">About page</a>
<a href="projects/index.html">Projects</a>
```

No full URL needed — just the file path relative to the current file.

## Images — `<img>`

```html
<img src="photo.jpg" alt="A description of the photo">
```

- `src` — the image file path or URL
- `alt` — alternative text: shown if the image fails to load, read by screen readers

**`alt` is not optional.** An empty `alt=""` tells screen readers to skip the image (fine for decorative images). A missing `alt` is an accessibility error.

**Images from the web:**
```html
<img src="https://picsum.photos/400/300" alt="Random placeholder image">
```

**Control size with CSS, not HTML attributes:**
```html
<!-- Avoid width/height attributes for layout -->
<img src="photo.jpg" alt="Photo" width="300" height="200">

<!-- Better: set size in CSS -->
<img src="photo.jpg" alt="Photo" class="hero-image">
```

Exception: always include `width` and `height` attributes that match the actual image dimensions — browsers use them to reserve space before the image loads, preventing layout shift.

## File paths

Understanding paths is essential:

```
my-portfolio/
  index.html
  images/
    photo.jpg
  pages/
    about.html
```

From `index.html`:
```html
<img src="images/photo.jpg" alt="My photo">   <!-- ✓ -->
<img src="photo.jpg" alt="My photo">           <!-- ✗ wrong path -->
```

From `pages/about.html`:
```html
<img src="../images/photo.jpg" alt="My photo"> <!-- ✓ go up one level first -->
```

`../` means "go up one directory level." A common source of broken images.

## Try it

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Links & Images</title>
</head>
<body>
  <h1>My Favourite Resources</h1>

  <p>I use <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>
  as my main reference for HTML, CSS, and JavaScript.</p>

  <img src="https://picsum.photos/600/300" alt="A random placeholder image">

  <p><a href="#bottom">Jump to the bottom</a></p>

  <p>Lots of content here...</p>
  <p>More content...</p>

  <p id="bottom">You made it to the bottom.</p>
  <a href="#">Back to top</a>
</body>
</html>
```

`href="#"` links to the top of the page. Try the anchor links — they'll be essential for your portfolio navigation.
