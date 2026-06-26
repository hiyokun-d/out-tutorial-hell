---
id: "forms"
title: "Forms"
type: "THEORY"
xpReward: 10
module: "HTML — Structure"
sandbox_language: "html"
---

# Forms

Forms are how users send data to you — contact messages, search queries, login credentials, orders. Your portfolio will have a contact form. This lesson covers everything you need to build one.

## Basic form structure

```html
<form>
  <label for="name">Name</label>
  <input type="text" id="name" name="name" placeholder="Your name">

  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com">

  <label for="message">Message</label>
  <textarea id="message" name="message" placeholder="Your message here..."></textarea>

  <button type="submit">Send Message</button>
</form>
```

## `<label>` — always use it

`<label for="name">` connects to `<input id="name">`. When the user clicks the label, the input gets focused. Screen readers read the label when the input is focused.

**Never skip labels.** Placeholder text is not a label — it disappears when the user starts typing.

## `<input>` types

The `type` attribute tells the browser what kind of data to expect. The browser validates and adapts accordingly:

```html
<input type="text">     <!-- single-line text -->
<input type="email">    <!-- validates email format -->
<input type="password"> <!-- hides characters -->
<input type="number">   <!-- numeric keyboard on mobile -->
<input type="tel">      <!-- phone keyboard on mobile -->
<input type="url">      <!-- validates URL format -->
<input type="checkbox"> <!-- on/off toggle -->
<input type="radio">    <!-- select one from a group -->
<input type="date">     <!-- date picker -->
<input type="file">     <!-- file upload -->
```

Use the correct `type`. On mobile, `type="email"` shows the @ keyboard. `type="number"` shows the numeric pad. These details improve the user experience for free.

## `<textarea>` — multi-line text

```html
<textarea id="message" name="message" rows="5" placeholder="Your message..."></textarea>
```

Unlike `<input>`, `<textarea>` has opening and closing tags. `rows` suggests the initial visible height.

## Required fields

```html
<input type="email" required>
<input type="text" minlength="2" maxlength="50">
<input type="number" min="0" max="100">
```

`required` prevents form submission if the field is empty. `minlength`, `maxlength`, `min`, `max` add constraints. The browser shows validation messages automatically — no JavaScript needed for basic validation.

## A complete contact form

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form</title>
</head>
<body>
  <section id="contact">
    <h2>Get in Touch</h2>
    <form id="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" required>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="What's on your mind?" required></textarea>
      </div>

      <button type="submit">Send Message</button>
    </form>
  </section>
</body>
</html>
```

Try submitting with empty fields — the browser validates automatically. Later, you'll use JavaScript to handle the actual submission and show a success message.

## `<button>` types

```html
<button type="submit">Submit the form</button>
<button type="button">Does nothing unless JS handles it</button>
<button type="reset">Clears all form fields</button>
```

Inside a `<form>`, a `<button>` with no `type` defaults to `submit`. Always be explicit.
