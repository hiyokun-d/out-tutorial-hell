---
id: "functions-js"
title: "Functions in JavaScript"
type: "THEORY"
xpReward: 15
module: "JavaScript — Dynamic Typing"
sandbox_language: "javascript"
---

# Functions in JavaScript

Functions in JavaScript are the same idea as C: name a block of code, call it when you need it. But the rules are more flexible — and that flexibility comes with trade-offs.

## Defining a function

```javascript
function add(a, b) {
    return a + b;
}

console.log(add(3, 4));   // 7
console.log(add(10, 20)); // 30
```

Compare to C:

```c
int add(int a, int b) {
    return a + b;
}
```

What's missing in the JavaScript version:
- No return type (`int` removed)
- No parameter types (`int a, int b` → just `a, b`)

JavaScript doesn't check any of this. `add("hello", "world")` returns `"helloworld"` — no error, it just concatenates strings because `+` with strings is concatenation.

## The danger of no type checking

```javascript
function square(n) {
    return n * n;
}

console.log(square(5));        // 25 — correct
console.log(square("5"));      // "55" — "5" * "5" is actually 25... but
console.log(square("hello"));  // NaN — "hello" * "hello" makes no sense
```

In C, calling `square` with a string would be a compile error. In JavaScript, it silently runs and might return something surprising.

This is why understanding types is critical even in a dynamically typed language. JavaScript won't stop you — you have to think about it yourself.

## Arrow functions — modern shorthand

```javascript
// Traditional
function multiply(a, b) {
    return a * b;
}

// Arrow function — same thing
const multiply = (a, b) => a * b;

// Multi-line arrow function
const greet = (name) => {
    const message = "Hello, " + name + "!";
    return message;
};
```

Arrow functions are a shorter syntax introduced in 2015. For simple one-liners, the `return` is implicit — the expression after `=>` is automatically returned.

You'll see both `function` and arrow syntax in real code. They work the same way for basic use (there are subtle differences that matter later, but not now).

## Default parameters

JavaScript lets you set default values for parameters:

```javascript
function greet(name = "stranger") {
    return "Hello, " + name + "!";
}

console.log(greet("Alex"));   // "Hello, Alex!"
console.log(greet());          // "Hello, stranger!"
```

In C, you can't do this — every parameter must be passed. JavaScript's flexibility makes this easy.

## Functions are values

This is something C doesn't have (at least not easily): in JavaScript, functions are **first-class values**. You can store them in variables, pass them as arguments, and return them from other functions.

```javascript
function runTwice(fn) {
    fn();
    fn();
}

function sayHi() {
    console.log("Hi!");
}

runTwice(sayHi); // prints "Hi!" twice
```

You passed a function as an argument to another function. This is called a **callback**. It's used everywhere in JavaScript — event handlers, timers, array methods like `.map()` and `.filter()`.

Don't worry about mastering this now. Just know that functions in JavaScript are more flexible than in C — they're objects, not just named code blocks.

## Scope works the same way

Like in C, variables declared inside a function are local to that function:

```javascript
function calculate() {
    let result = 42;
    return result;
}

// console.log(result); // ReferenceError — result doesn't exist here
```

Same principle, same protection. This is a universal programming concept, not specific to any language.

## Try it

In the sandbox, write a function `celsiusToFahrenheit` that takes a temperature in Celsius and returns it in Fahrenheit. Then call it a few times with different values.

Formula: `(celsius * 9/5) + 32`

You wrote this same function in C earlier. Notice how much less you have to type.
