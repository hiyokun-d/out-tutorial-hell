---
id: "variables"
title: "Storing values"
type: "PRACTICE"
xpReward: 20
---

# Storing values

Programs need to remember things. A name, a score, a price. To store a value, you use a **variable**.

## Declaring a variable

```javascript
let name = "Alice"
```

- `let` tells JavaScript you're creating a new variable
- `name` is what you're calling it — you choose this
- `= "Alice"` sets its value

## Using a variable

Once stored, you can use the variable anywhere:

```javascript
let name = "Alice"
console.log(name)  // prints: Alice
```

## Template literals

To mix text and a variable in one print, use backticks `` ` `` and `${}`:

```javascript
let name = "Alice"
console.log(`My name is ${name}`)  // prints: My name is Alice
```

The `${name}` part gets replaced with the value of the variable.

## Your turn

Create a variable called `name` with your own name, then print: `My name is [your name]`
