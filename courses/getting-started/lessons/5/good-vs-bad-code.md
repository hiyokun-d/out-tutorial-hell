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

```javascript
// Bad
let x = 86400;
let d = x * 7;

// Good
let secondsPerDay = 86400;
let secondsPerWeek = secondsPerDay * 7;
```

`x` and `d` tell you nothing. `secondsPerDay` and `secondsPerWeek` are self-documenting. The good version doesn't need a comment to explain itself.

### Doing too many things at once

```javascript
// Bad — one blob of code that does everything
function processOrder(order) {
    // validate the order
    if (!order.items || order.items.length === 0) { throw new Error("Empty order"); }
    if (!order.customer) { throw new Error("No customer"); }
    // calculate total
    let total = 0;
    for (let item of order.items) { total += item.price * item.quantity; }
    // apply discount
    if (order.customer.isPremium) { total *= 0.9; }
    // save to database
    db.save({ ...order, total });
}

// Good — each step is a named function
function processOrder(order) {
    validate(order);
    const total = calculateTotal(order);
    db.save({ ...order, total });
}
```

The second version reads like English. You don't need to scroll through 20 lines to understand the flow.

### Repeating yourself (violating DRY)

DRY stands for **Don't Repeat Yourself**. If you write the same logic in three places and need to change it, you have to change it in three places — and you'll probably miss one.

```javascript
// Bad — same logic duplicated
if (user.role === 'admin') {
    if (user.age >= 18) { showContent(); }
}
if (user.role === 'editor') {
    if (user.age >= 18) { showContent(); }
}

// Good — single source of truth
function isAdult(user) {
    return user.age >= 18;
}

if (user.role === 'admin' && isAdult(user)) { showContent(); }
if (user.role === 'editor' && isAdult(user)) { showContent(); }
```

### Magic numbers

```javascript
// Bad
if (user.score > 9000) { grantAccess(); }

// Good
const ADMIN_SCORE_THRESHOLD = 9000;
if (user.score > ADMIN_SCORE_THRESHOLD) { grantAccess(); }
```

Where did `9000` come from? What does it mean? The constant makes the intent clear.

## The three rules

1. **Names should say what something is.** If you need a comment to explain a variable name, the name is bad.

2. **Each function should do one thing.** If you're tempted to name it `validateAndSaveAndNotify`, split it.

3. **Don't repeat logic.** If you copy-paste code, you almost certainly need a function.

## You won't get it right the first time

No one does. Write the code that works. Then go back and ask: could someone who has never seen this read it and understand it?

That revision process — cleaning up code after it works — is called **refactoring**. It's a normal, expected part of professional development, not a sign you did it wrong the first time.

Code is written for humans first. The machine will run anything you give it. Your future self and your teammates are the real audience.
