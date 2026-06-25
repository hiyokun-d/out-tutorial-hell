---
id: "loops"
title: "Loops — Repeating Things"
type: "THEORY"
xpReward: 15
module: "Control Flow"
---

# Loops — Repeating Things

Instead of writing the same code ten times, you use a loop. Python has two kinds: `for` and `while`.

## The `for` loop

```python
for i in range(5):
    print(i)
```

Output:
```
0
1
2
3
4
```

`range(5)` generates the numbers 0, 1, 2, 3, 4. The loop runs once for each number, and `i` gets that number each time.

Want to start from 1? Use `range(1, 6)`:

```python
for i in range(1, 6):
    print(i)
```

Output: 1, 2, 3, 4, 5

## Looping over a list

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

Output:
```
apple
banana
cherry
```

## Building up a value in a loop

```python
total = 0

for i in range(1, 6):
    total = total + i
    print(f"After adding {i}: total = {total}")

print(f"Final total: {total}")
```

This is a classic pattern — start with 0, add something each iteration.

## The `while` loop

`while` keeps running as long as a condition is true:

```python
count = 0

while count < 5:
    print(count)
    count = count + 1
```

**Warning:** if `count` never reaches 5, the loop runs forever. Always make sure your `while` condition eventually becomes `False`.

---

## Try the Step-Through sandbox

Open the **Sandbox** and click **▶ Step Through**. Watch the loop variable `i` change on every iteration. Notice how the iteration badge in the step card counts how many times you've visited the same line.
