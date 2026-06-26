---
id: "good-vs-bad-code"
title: "Good Code vs Bad Code"
type: "THEORY"
xpReward: 10
module: "Think Like a Programmer"
sandbox: false
---

# Good Code vs Bad Code

Code that works isn't necessarily good code. A car that starts but leaks oil, makes a grinding noise, and smells like burning is technically a working car — you wouldn't call it a good car.

The same applies to code. Working is the minimum requirement. Good code is also readable, maintainable, and honest about what it does.

## Why does code quality matter?

Because code gets read far more than it gets written.

You will read your own code six months from now and wonder what you were thinking. You'll work on teams where other people need to read your code. You'll inherit someone else's code and have to understand it.

If code is hard to read, everything costs more: debugging takes longer, adding features breaks things, and every change carries risk.

## What makes code bad?

### Bad names

```
x = 86400
d = x * 7
```

```
secondsPerDay = 86400
secondsPerWeek = secondsPerDay * 7
```

`x` and `d` tell you nothing. `secondsPerDay` and `secondsPerWeek` are self-documenting. The second version doesn't need a comment to explain itself.

### Doing too many things at once

```
function processOrder(order):
    validate the order data
    calculate the total price
    apply any discount
    save to database
    send confirmation email
```

```
function processOrder(order):
    validate(order)
    total = calculateTotal(order)
    save(order, total)
    sendConfirmation(order)
```

The second version reads like a summary. You understand the flow without scrolling through 50 lines of details.

### Repeating yourself (violating DRY)

DRY stands for **Don't Repeat Yourself**. If you write the same logic in three places and need to change it, you have to change it in three places — and you'll probably miss one.

```
if user.role is "admin":
    if user.age >= 18:
        showContent()

if user.role is "editor":
    if user.age >= 18:
        showContent()
```

```
function isAdult(user):
    return user.age >= 18

if user.role is "admin" and isAdult(user):
    showContent()

if user.role is "editor" and isAdult(user):
    showContent()
```

The age check is now written once. Change it in one place and it updates everywhere.

### Magic numbers

```
if user.score > 9000:
    grantAccess()
```

```
ADMIN_SCORE_THRESHOLD = 9000

if user.score > ADMIN_SCORE_THRESHOLD:
    grantAccess()
```

Where did `9000` come from? What does it mean? The named constant makes the intent clear — and gives you one place to change it if the threshold ever changes.

## The three rules

1. **Names should say what something is.** If you need a comment to explain a variable name, the name is bad.

2. **Each function should do one thing.** If you're tempted to name it `validateAndSaveAndNotify`, split it.

3. **Don't repeat logic.** If you copy-paste code, you almost certainly need a function.

## You won't get it right the first time

No one does. Write the code that works. Then go back and ask: could someone who has never seen this read it and understand it?

That revision process — cleaning up code after it works — is called **refactoring**. It's a normal, expected part of professional development, not a sign you did it wrong the first time.

Code is written for humans first. The machine will run anything you give it. Your future self and your teammates are the real audience.
