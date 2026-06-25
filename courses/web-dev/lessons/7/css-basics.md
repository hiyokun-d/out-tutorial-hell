---
id: "css-basics"
title: "CSS basics"
type: "THEORY"
xpReward: 15
module: "Styling"
---

# CSS basics

HTML describes content. CSS describes how that content looks.

A CSS rule has a selector and declarations:

```css
h1 {
  color: blue;
  font-size: 32px;
}
```

The selector `h1` chooses the element. Each declaration changes one property.

You can write CSS inside a `<style>` tag in the page head:

```html
<style>
  p {
    color: green;
  }
</style>
```

Start with simple properties: `color`, `background`, `font-size`, `padding`, and `border`.
