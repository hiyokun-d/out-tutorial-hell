---
id: "c-to-javascript"
title: "From C to JavaScript: What Changes?"
type: "THEORY"
xpReward: 10
module: "JavaScript — Dynamic Typing"
sandbox: false
---

# From C to JavaScript: What Changes?

You've learned the fundamentals of programming through C. Now you're moving to JavaScript — and you already know more than you think.

## What stays the same

Every concept you learned in C exists in JavaScript:

| Concept | In C | In JavaScript |
|---------|------|---------------|
| Variables | `int score = 100;` | `let score = 100;` |
| Conditions | `if (score > 90) { }` | `if (score > 90) { }` |
| Loops | `for (int i = 0; i < 5; i++)` | `for (let i = 0; i < 5; i++)` |
| Functions | `int add(int a, int b)` | `function add(a, b)` |

The curly braces, the semicolons, the if/else/for/while — same structure, just slightly different rules.

## What changes?

### 1. No compiler

JavaScript runs directly in the browser (or in Node.js). There is no compilation step. You write code, it runs. This is called an **interpreted** language (though modern JS engines actually compile it at runtime — but you never see that).

This means: no compile-time error checking. Mistakes that C would catch at compile time will slip through in JavaScript until the program actually runs.

### 2. No type declarations

In C: `int score = 100;` — you must say it's an integer.

In JavaScript: `let score = 100;` — JavaScript figures out the type.

That's it. The `int`, `float`, `char`, `void` — all gone. JavaScript determines the type automatically from the value you assign.

### 3. Variables can change type

In C, a variable declared as `int` can only ever hold an integer. Always.

In JavaScript, a variable can hold any type, and you can change it at any time:

```javascript
let x = 42;         // x is a number
x = "hello";        // now x is a string — JavaScript doesn't complain
x = true;           // now x is a boolean — still no complaint
```

This is called **dynamic typing**. C is **statically typed** (types are fixed at compile time). JavaScript is **dynamically typed** (types are determined and can change at runtime).

### 4. Runs in the browser

The primary home of JavaScript is the web browser. Every website you visit is running JavaScript. That's why it was created: to make web pages interactive.

You don't need to install anything to run JavaScript — you already have a runtime in your browser.

## A brief history

JavaScript was created in **10 days in 1995** by Brendan Eich at Netscape. The name was marketing — it's not related to Java. It was designed to be simple and flexible for non-programmers to add interactivity to web pages.

Because of that origin, JavaScript has quirks — behaviours that seem inconsistent or surprising. You'll encounter them. They're a product of being designed in 10 days and never breaking backwards compatibility for 30 years.

Knowing C helps you understand which quirks are JavaScript-specific and which are universal programming concepts. You now have the context to tell the difference.

## What to focus on next

In the next lessons, you'll see exactly what dynamic typing looks like in practice — including why it's powerful and where it can quietly break things. You'll also see how functions in JavaScript differ from C (same idea, fewer rules).

By the end, you'll know the difference between static and dynamic typing not as a definition, but as lived experience. That's much more useful.
