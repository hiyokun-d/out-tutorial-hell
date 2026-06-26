---
id: "console-debug-js"
title: "The Console — Your Debug Weapon"
type: "THEORY"
xpReward: 15
module: "JavaScript — Dynamic Typing"
sandbox_language: "javascript"
---

# The Console — Your Debug Weapon

In C, you used `printf` to print values and understand what your code was doing. In JavaScript, `console.log` is your equivalent — and it's far more powerful.

## console.log

```javascript
let score = 95;
let name = "Alex";
let active = true;

console.log(score);           // 95
console.log(name);            // Alex
console.log(active);          // true
console.log(score, name);     // 95 Alex — multiple values at once
console.log("Score:", score); // Score: 95 — label + value
```

`console.log` accepts any number of values and prints them all. Unlike C's `printf`, you don't need format specifiers — JavaScript converts values to strings automatically.

## Using typeof to debug types

When something behaves unexpectedly, check the type:

```javascript
let x = "5";
let y = 3;
let result = x + y;

console.log(result);          // "53" — not 8!
console.log(typeof x);        // "string"
console.log(typeof y);        // "number"
console.log(typeof result);   // "string"
```

If your math is giving you strings instead of numbers, `typeof` will tell you immediately. This is one of the most useful debugging techniques in JavaScript.

## Variants of console

```javascript
console.log("This is info");
console.warn("This is a warning");      // yellow in browser console
console.error("This is an error");      // red in browser console
console.table([{name: "Alex", age: 25}, {name: "Sam", age: 30}]); // renders a table
```

In the browser, `console.warn` and `console.error` get visual distinction — useful for marking different severity levels.

## Reading JavaScript error messages

Errors in JavaScript appear in the browser console (F12 → Console tab) or in this sandbox. Here's how to read them:

```
TypeError: Cannot read properties of undefined (reading 'name')
    at greetUser (script.js:5:17)
    at main (script.js:12:3)
```

Read it in order:
1. **Error type**: `TypeError` — you used something in the wrong way
2. **What happened**: tried to read `.name` on `undefined`
3. **Where**: `script.js`, line 5, column 17, inside `greetUser`
4. **Call stack**: the chain of functions that led here

The call stack tells you not just where the error happened, but how you got there. Start at the top and work your way down.

## The most common JavaScript errors

| Error | What it means | Common cause |
|-------|--------------|--------------|
| `TypeError: ... is not a function` | You called something that isn't a function | Typo in function name, or calling a variable |
| `TypeError: Cannot read properties of undefined` | You accessed a property of `undefined` | Variable not initialised, or wrong key name |
| `ReferenceError: x is not defined` | You used a variable that doesn't exist | Typo, or out of scope |
| `SyntaxError: Unexpected token` | Code doesn't parse — malformed syntax | Missing bracket, parenthesis, or quote |

When you see an error: don't panic, don't close the console. Read it. Find the line number. Add a `console.log` on the line above to see what your variables actually contain.

## The browser console

Open your browser, press `F12` (or `Cmd+Option+I` on Mac), and click "Console". You can type JavaScript directly here:

```javascript
let x = 10 + 5;
x  // press Enter — shows 15
typeof "hello"  // shows "string"
```

The browser console is a live JavaScript environment. Use it to test small ideas, check values, or try expressions before putting them in your code.

This is your most powerful learning tool. Use it constantly.

## Debugging strategy

When your code doesn't do what you expect:

1. `console.log` the value right before the problem
2. Check the type with `console.log(typeof x)`
3. Read the error message top-to-bottom if there is one
4. Make one change, test, repeat

Don't comment out large sections and guess. Don't stare at the code hoping the answer reveals itself. Print the values. The values will tell you the truth.
