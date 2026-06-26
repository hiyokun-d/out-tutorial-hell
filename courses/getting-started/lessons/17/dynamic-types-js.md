---
id: "dynamic-types-js"
title: "Dynamic Types — Power and Danger"
type: "THEORY"
xpReward: 15
module: "JavaScript — Dynamic Typing"
sandbox_language: "javascript"
---

# Dynamic Types — Power and Danger

This is the lesson where everything clicks. You've seen static typing in C. Now you'll see dynamic typing in action — and understand why the difference matters in practice.

## Variables can change type

In C, this is a compile error:

```c
int score = 95;
score = "excellent";  // ERROR: incompatible types
```

In JavaScript, this is perfectly fine:

```javascript
let score = 95;
console.log(typeof score); // "number"

score = "excellent";
console.log(typeof score); // "string"

score = true;
console.log(typeof score); // "boolean"
```

Run this. Same variable, three different types. JavaScript doesn't care.

## Type coercion — automatic conversion

JavaScript doesn't just allow types to change — it **automatically converts types** when you mix them in operations. This is called **type coercion**.

```javascript
console.log("5" + 3);    // "53"  — number 3 gets converted to string, then concatenated
console.log("5" - 3);    // 2     — string "5" gets converted to number, then subtracted
console.log("5" * "3");  // 15    — both strings converted to numbers
console.log(true + 1);   // 2     — true is converted to 1
console.log(false + 1);  // 1     — false is converted to 0
```

Run each line. The results are real. Try to predict before you see the output.

Notice: `+` with a string means concatenation (gluing strings together). `-` always means subtraction, which forces conversion to number. This inconsistency is a famous JavaScript quirk.

## `==` vs `===` — the equality trap

JavaScript has two equality operators:

```javascript
console.log(5 == "5");    // true  — JavaScript converts types before comparing
console.log(5 === "5");   // false — no conversion, strict type check

console.log(0 == false);  // true  — 0 and false are both "falsy"
console.log(0 === false); // false — different types

console.log(null == undefined);  // true  — special case
console.log(null === undefined); // false — different types
```

**Always use `===`** (triple equals). The `==` version coerces types silently, causing bugs that are extremely hard to track down.

In C, there is only one `==` — it compares values of the same type. There's no coercion. JavaScript added `==` for convenience and `===` to provide the C-style strict comparison.

## Falsy values

In C, `0` is false and any non-zero value is true.

JavaScript expands this. These values are all **falsy** (they behave as false in conditions):

```javascript
if (0)         { /* doesn't run */ }
if ("")        { /* doesn't run */ }  // empty string
if (null)      { /* doesn't run */ }
if (undefined) { /* doesn't run */ }
if (NaN)       { /* doesn't run */ }  // "Not a Number"
if (false)     { /* doesn't run */ }
```

Everything else is **truthy** — including `"0"` (a string containing zero), `[]` (empty array), and `{}` (empty object). This surprises beginners:

```javascript
if ("0") { console.log("this runs!"); } // "0" is truthy — it's a non-empty string
```

## `NaN` — Not a Number

When you do something mathematically nonsensical, JavaScript returns `NaN`:

```javascript
console.log("hello" - 5);  // NaN
console.log(0 / 0);        // NaN
console.log(parseInt("abc")); // NaN
```

The dangerous part: `NaN` is contagious. Any arithmetic involving `NaN` returns `NaN`. And `NaN !== NaN` — it's the only value not equal to itself:

```javascript
let x = NaN;
console.log(x === x); // false — use isNaN(x) to check
```

## C vs JavaScript: a direct comparison

| Feature | C | JavaScript |
|---------|---|-----------|
| Type declaration | Required | Not needed |
| Change variable type | Not allowed | Allowed |
| Type coercion | No (compile error) | Yes (automatic) |
| Strict equality | Only `==` (always strict) | `===` |
| Floating-point type | `float`, `double` | `number` (always float64) |
| Undefined variable | Garbage value | `undefined` |
| Type mismatch error | Compile time (before running) | Runtime (while running, or silent) |

The key insight: C catches type problems before your program runs. JavaScript lets them through — they become runtime errors or silent bugs.

Neither approach is objectively better. C's strictness is essential for systems that can't afford silent errors. JavaScript's flexibility makes it faster to write and suited to the forgiving world of web development. Knowing both gives you the judgment to understand why the code you write behaves the way it does.
