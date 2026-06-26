---
id: "variables-js"
title: "Variables in JavaScript"
type: "THEORY"
xpReward: 15
module: "JavaScript — Dynamic Typing"
sandbox_language: "javascript"
---

# Variables in JavaScript

Variables in JavaScript work on the same principle as C: a named location in memory that holds a value. But the rules around them are very different.

## Declaring variables

JavaScript has three keywords for variables:

```javascript
let name = "Alex";      // can be reassigned
const age = 25;         // cannot be reassigned
var old = "avoid me";   // old syntax, has quirks — avoid
```

The rule of thumb: **use `const` by default, use `let` if you need to reassign.** Never use `var`.

Compare to C:
```c
int age = 25;          // C: type required
const int MAX = 100;   // C: const also exists
```

```javascript
const age = 25;        // JS: no type keyword, same const idea
let max = 100;         // JS: let allows reassignment
```

## No type declaration

In C you write the type, and the compiler allocates the right amount of memory:

```c
int score = 95;     // 4 bytes, integer interpretation
float price = 9.99; // 4 bytes, float interpretation
```

In JavaScript, you write the value and JavaScript figures out the type:

```javascript
let score = 95;     // JavaScript sees a whole number → number
let price = 9.99;   // JavaScript sees a decimal → still number (JS has one number type)
let name = "Alex";  // JavaScript sees quotes → string
let active = true;  // JavaScript sees true/false → boolean
```

The type is determined by the **value**, not by what you declare.

## The `typeof` operator

You can ask JavaScript what type a variable currently holds:

```javascript
let score = 95;
console.log(typeof score);    // "number"

let name = "Alex";
console.log(typeof name);     // "string"

let active = true;
console.log(typeof active);   // "boolean"
```

Run this in the sandbox. Change the values. Watch what `typeof` returns.

## `const` vs `let`

```javascript
const pi = 3.14159;
pi = 3;               // TypeError: Assignment to constant variable.

let count = 0;
count = count + 1;    // fine — let allows reassignment
count++;              // same thing, shorthand
```

When you know a value shouldn't change, use `const`. The error it throws if you try to change it is a feature — it's protecting you.

## JavaScript has fewer numeric types than C

In C, you choose `int`, `float`, `double`, `long`, `short` depending on what you need.

In JavaScript, there's just **`number`** for all numeric values:

```javascript
let a = 42;         // integer-like number
let b = 3.14;       // decimal number
let c = -100;       // negative number

console.log(typeof a); // "number" — all the same
console.log(typeof b); // "number"
console.log(typeof c); // "number"
```

Convenient — but it means you can't specify precision. JavaScript uses 64-bit floating point for everything, which is why you get:

```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
```

The same floating-point imprecision you saw in C, but you have less control over it.

## Undefined and null

JavaScript has two "nothing" values that C doesn't:

```javascript
let x;              // declared but not assigned — value is undefined
console.log(x);     // undefined

let y = null;       // explicitly "no value"
console.log(y);     // null
```

`undefined` means "this variable exists but has no value."
`null` means "this variable intentionally holds nothing."

In C, an uninitialised variable contains garbage bytes. JavaScript is safer — `undefined` is a real value you can detect and handle.
