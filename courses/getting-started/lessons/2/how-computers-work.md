---
id: "how-computers-work"
title: "How Computers Actually Work"
type: "THEORY"
xpReward: 5
module: "Before You Code"
sandbox: false
---

# How Computers Actually Work

You don't need a computer science degree to program. But understanding what's physically happening when your code runs will make you dramatically better at writing it.

## The three main components

**CPU — Central Processing Unit**

The brain. Does math and logic. Reads an instruction, executes it, moves to the next. Modern CPUs do billions of these per second. The CPU itself has no idea what you're building — it just executes instructions one at a time, extremely fast.

**RAM — Random Access Memory**

Short-term memory. When a program runs, it gets loaded into RAM so the CPU can access it quickly. RAM is fast but temporary — turn the power off and it's gone.

Everything your program works with while it runs lives in RAM: your variables, your data, your current state.

**Storage — SSD or Hard Drive**

Long-term memory. Slow compared to RAM, but permanent. Your source code files, your saved data, your operating system — all on storage.

When you run a program, the OS copies it from storage into RAM, then hands it to the CPU.

## Memory is just a long list of boxes

Imagine RAM as a street of numbered houses. Each house holds exactly one byte (8 bits). The house number is called an **address**.

When your program creates a variable like:

```c
int age = 25;
```

The operating system finds 4 empty houses (an `int` is 4 bytes), puts the number `25` in there using binary, and hands your program the address of the first house. That address is what `age` refers to.

## Everything is binary

Computers store everything as binary — sequences of 0s and 1s (called bits). A single bit is either 0 or 1. Eight bits = one byte.

Why binary? Because electronic circuits are either on or off. There's no "half on." So computers work in base-2 (binary) instead of base-10 (decimal).

You don't need to do binary math. But understanding that every number, letter, colour, and image is ultimately stored as 0s and 1s explains:

- Why there are data types (how many bytes to use? how to interpret those bytes?)
- Why there are memory limits (you only have so many houses on the RAM street)
- Why choosing the right data type matters for precision

## Why this matters for programming

When you write `int score = 100;` in C, you're doing three things:
1. Telling the computer to reserve **4 bytes** of RAM
2. Telling it to interpret those bytes as a **whole number**
3. Giving those bytes the label `score` so you can reference them

When you write `float score = 100.5;` instead, you're reserving the same 4 bytes, but telling the computer to interpret them as a **floating-point number** (a decimal).

Same bytes. Different meaning. That's what **data types** are — instructions for interpretation.

This is the foundation that everything else in this course builds on. Keep it in mind.
