---
id: "what-is-python"
title: "What is Python?"
type: "THEORY"
xpReward: 15
module: "Python Foundations"
---

# What is Python?

Python is one of the most popular programming languages in the world. It's used for everything — web apps, data science, AI, automation, and more. Best part: it reads almost like plain English.

## Your first Python program

```python
print("Hello, world!")
```

`print()` tells Python to output text to the screen. Whatever you put inside the parentheses (in quotes) gets displayed.

## Variables — storing information

A variable is a named box that holds a value. You create one with the `=` sign:

```python
name = "Alice"
age = 25
score = 98.5
```

Python figures out the type automatically:
- `"Alice"` → text (called a **string**)
- `25` → whole number (called an **int**)
- `98.5` → decimal number (called a **float**)

## Doing math

```python
x = 10
y = 3

print(x + y)   # 13
print(x - y)   # 7
print(x * y)   # 30
print(x / y)   # 3.333...
print(x ** y)  # 1000  (power: 10³)
```

## Printing variables

You can mix text and variables with an **f-string** (the `f` before the quote is what makes it magic):

```python
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old.")
```

Output: `My name is Alice and I am 25 years old.`

---

## Try the Step-Through sandbox

Open the **Sandbox** and click **▶ Step Through** — watch Python execute your code one line at a time. You'll see each variable appear as it gets created and change as it gets updated. This is how real programmers debug code.
