---
id: "if-else"
title: "Making decisions"
type: "PRACTICE"
xpReward: 25
---

# Making decisions

Programs often need to make choices. Do one thing if something is true, something else if it's not.

That's what an `if` statement does.

## The if/else structure

```javascript
if (condition) {
  // runs if condition is true
} else {
  // runs if condition is false
}
```

## Example

```javascript
let age = 20

if (age >= 18) {
  console.log("adult")
} else {
  console.log("minor")
}
```

- `>=` means "greater than or equal to"
- Since `20 >= 18` is true, this prints: `adult`

## Comparison operators

| Operator | Meaning |
|----------|---------|
| `===` | equal to |
| `!==` | not equal to |
| `>` | greater than |
| `<` | less than |
| `>=` | greater than or equal to |
| `<=` | less than or equal to |

## Your turn

A variable `age` is set to `20`. Print `adult` if age is 18 or over, otherwise print `minor`.
