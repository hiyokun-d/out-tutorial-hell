---
id: "your-first-html"
title: "Your First HTML"
type: "PRACTICE"
xpReward: 20
---

# Your First HTML

HTML is made of **tags**. A tag is a word wrapped in angle brackets:

```html
<h1>Hello World</h1>
```

`<h1>` opens the tag. `</h1>` closes it. Whatever sits between them shows up on the page.

## Every webpage has this skeleton

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

| Part | What it does |
|------|-------------|
| `<!DOCTYPE html>` | Tells the browser "this is HTML" |
| `<html>` | The whole page lives inside here |
| `<head>` | Page info (not visible to the user) |
| `<title>` | Text shown in the browser tab |
| `<body>` | Everything the user actually sees |

Try writing the skeleton in the editor. Change the title and the h1 to something personal.
