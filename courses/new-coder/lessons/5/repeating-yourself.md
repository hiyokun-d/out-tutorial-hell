---
id: "loops"
title: "Repeating yourself"
type: "PRACTICE"
xpReward: 25
---

# Repeating yourself

Imagine you want to print the numbers 1 through 100. You wouldn't write 100 lines of `console.log()`. You'd use a **loop**.

## The for loop

```javascript
for (let i = 1; i <= 5; i++) {
  console.log(i)
}
```

This prints:
```
1
2
3
4
5
```

## Breaking it down

```javascript
for (let i = 1; i <= 5; i++)
       ↑          ↑       ↑
    start      stop     step
```

- `let i = 1` — start at 1
- `i <= 5` — keep going while i is 5 or less
- `i++` — add 1 to i after each loop (short for `i = i + 1`)

The code inside `{ }` runs once for each value of `i`.

## Your turn

Write a `for` loop that prints the numbers 1 through 5, one per line.
