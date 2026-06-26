---
id: "lists"
title: "Lists"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# Lists

Lists are everywhere in web design — navigation menus, feature lists, step-by-step instructions, skill tags. HTML has three kinds.

## Unordered list — `<ul>`

Use when order doesn't matter:

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

Renders as bullet points by default. CSS can change that — navigation menus are `<ul>` lists with bullets removed.

## Ordered list — `<ol>`

Use when order matters:

```html
<ol>
  <li>Create the HTML file</li>
  <li>Add your content</li>
  <li>Link your CSS</li>
  <li>Open with Live Server</li>
</ol>
```

Renders with numbers by default (1, 2, 3...). CSS can change to letters, Roman numerals, or custom counters.

## Description list — `<dl>`

For term-definition pairs:

```html
<dl>
  <dt>HTML</dt>
  <dd>The structure of a web page — elements, content, and their meaning.</dd>

  <dt>CSS</dt>
  <dd>The appearance of a web page — colours, fonts, layout, and spacing.</dd>

  <dt>JavaScript</dt>
  <dd>The behaviour of a web page — interactivity, data fetching, and DOM updates.</dd>
</dl>
```

Less common than `<ul>` and `<ol>`, but semantically correct for glossaries, FAQs, and key-value content.

## Nesting lists

Lists can contain other lists:

```html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Databases</li>
    </ul>
  </li>
</ul>
```

Indent nested lists for readability. The browser handles the visual indentation automatically.

## Why lists matter more than you think

Navigation menus are lists. Skills sections on portfolios are lists. Footer link columns are lists. Blog post tag lists are lists. Even breadcrumbs are lists.

Using the right list element means screen readers announce "list of 5 items" and users know what to expect. It also gives you semantic structure that CSS can style reliably.

Don't use `<br>` or separate `<p>` tags for items that are conceptually a list. Use a list.

## Your portfolio skills section

```html
<section id="skills">
  <h2>Skills</h2>
  <ul class="skills-list">
    <li>HTML & CSS</li>
    <li>JavaScript</li>
    <li>C Programming</li>
    <li>Problem Solving</li>
    <li>Git & GitHub</li>
  </ul>
</section>
```

Later you'll style `.skills-list` to display as a horizontal row of tags instead of vertical bullets. The HTML stays the same — only the CSS changes. That's the power of separating structure from appearance.
