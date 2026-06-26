---
id: "problem-decomposition"
title: "Break It Down: Problem Decomposition"
type: "THEORY"
xpReward: 10
module: "Think Like a Programmer"
sandbox: false
---

# Break It Down: Problem Decomposition

The hardest part of programming is not writing code. It's knowing what code to write.

Beginners often freeze when given a vague task — "build a login system" or "make the cart work." Experienced programmers don't freeze because they have one tool the beginners don't: **problem decomposition**.

## What is decomposition?

Decomposition means breaking a big problem into smaller problems until each piece is small enough that you know exactly how to solve it.

Big problem → medium problems → small problems → code.

## A concrete example

**Big problem:** Make a cup of tea.

That's too vague to act on. Let's break it down:

1. Fill the kettle with water
2. Boil the water
3. Put a teabag in a cup
4. Pour boiling water into the cup
5. Wait 3 minutes
6. Remove the teabag
7. Add milk if wanted

Now each step is small enough to do. Step 2 has sub-steps (plug in, switch on, wait for click). You keep breaking down until every step is a single, clear action.

That list of steps is called an **algorithm**.

## Algorithms

An algorithm is a precise, finite sequence of steps that solves a problem. Every program is ultimately an algorithm expressed in a programming language.

A good algorithm is:
- **Precise** — no ambiguity, no "do the thing"
- **Finite** — it must end
- **Correct** — it produces the right output for valid input

The algorithm for sorting a list of numbers exists independently of any programming language. You could implement it in C, JavaScript, Python, or even on paper. The language is just the medium.

## How programmers actually do this

When faced with a new problem, good programmers:

1. **Read the problem twice** — make sure you understand it before touching the keyboard
2. **Write out the steps in plain English** — before any code
3. **Find the edge cases** — what happens if the input is empty? Negative? A million items?
4. **Break each step further** — until every step maps to something you know how to write
5. **Code one step at a time** — not all at once

The biggest beginner mistake is jumping to code immediately. The second-biggest is trying to write everything at once.

## Practice this now

Here's a problem: Write an algorithm (in plain English, no code) for this task:

> Given a list of numbers, find the largest one.

Try it before reading on.

---

Here's one solution:

1. Start with the first number as the current largest
2. Look at the next number
3. If it's bigger than the current largest, it becomes the new current largest
4. Repeat step 2–3 for every remaining number
5. When done, the current largest is the answer

That's a real algorithm. You could implement it in any language right now. The code is just translating those steps.

Every complex program — every game, every database, every AI — is built from algorithms like this, stacked on top of each other. You get there one step at a time.
