---
id: "why-testing-fails"
title: "Why Testing Fails"
type: "THEORY"
xpReward: 10
module: "Principles"
---

# Why Testing Fails

You wrote some tests. They all pass. So your code works, right?

No. And if you believe that, testing will quietly let you down. Here are the traps, so you can stop walking into them.

## Tests show bugs exist — never that they don't

A failing test proves there's a bug. A passing test proves only that *this* input didn't trigger one. Green doesn't mean correct. It means "nothing found yet."

## You can't test everything

A function that takes two 32-bit integers has over 18 quintillion input combinations. You will not run them all. Testing is always a choice about *which* cases matter, so choose deliberately: boundaries, empty values, weird input.

## Bugs cluster

Defects aren't spread evenly. A small number of modules — usually the complex, rushed, or frequently changed ones — hold most of the bugs. Found one? Look nearby. There are more.

## The pesticide paradox

Run the same tests forever and they stop finding anything. Not because the code is clean, but because the bugs that survive are the ones your tests can't see. Keep adding new cases, especially after every bug you fix.

## "No bugs" isn't the goal

You can ship software that passes every test and is still useless — because it solves the wrong problem, or nobody can figure out how to use it. Zero defects in the wrong product is still the wrong product. That's the **absence-of-errors fallacy**.

## What to take from this

Testing isn't a checkbox that says "done." It's a search. Your job is to hunt for failures in the places they're most likely hiding, and keep changing how you hunt.

> **Draft.** Full notes pending.
