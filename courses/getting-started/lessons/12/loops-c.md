---
id: "loops-c"
title: "Loops in C"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Loops in C

Loops let you run the same block of code multiple times. They are one of the fundamental tools of programming — alongside conditions and functions, they're how all complex programs are built.

## The `for` loop

Use `for` when you know how many times you want to repeat:

```c
#include <stdio.h>

int main() {
    for (int i = 0; i < 5; i++) {
        printf("Step %d\n", i);
    }
    return 0;
}
```

The three parts inside `for (...)`:
1. `int i = 0` — initialise a counter, runs once before the loop
2. `i < 5` — condition checked before each iteration; loop stops when false
3. `i++` — runs after each iteration (shorthand for `i = i + 1`)

Output: 0, 1, 2, 3, 4. Notice the loop runs while `i < 5`, so it stops at 4.

## The `while` loop

Use `while` when you don't know how many times in advance — you repeat until a condition changes:

```c
#include <stdio.h>

int main() {
    int lives = 3;

    while (lives > 0) {
        printf("Lives remaining: %d\n", lives);
        lives--;  // subtract 1 (shorthand for lives = lives - 1)
    }

    printf("Game over\n");
    return 0;
}
```

The loop keeps running as long as `lives > 0`. When `lives` reaches 0, the condition is false and the loop exits.

## The infinite loop — the most important mistake to know

A loop that never stops is called an **infinite loop**. It will freeze your program.

```c
// DANGER — this never ends
while (1) {
    printf("forever\n");
}
```

```c
// DANGER — counter never changes
int i = 0;
while (i < 5) {
    printf("%d\n", i);
    // forgot i++ — i stays 0 forever
}
```

Before writing any loop, always check:
1. Does the condition eventually become false?
2. Is something inside the loop changing the variables that affect the condition?

## Arrays — the first data structure

An array stores multiple values of the same type in consecutive memory locations:

```c
#include <stdio.h>

int main() {
    int scores[5] = {90, 85, 72, 96, 61};

    for (int i = 0; i < 5; i++) {
        printf("scores[%d] = %d\n", i, scores[i]);
    }

    return 0;
}
```

- `int scores[5]` — an array of 5 integers
- `scores[0]` is the first element (arrays start at 0 in C, and most languages)
- `scores[4]` is the fifth (last) element
- Accessing `scores[5]` is **out of bounds** — undefined behaviour, potential crash

Arrays and loops are natural partners: the loop counter is the array index.

## `break` and `continue`

`break` exits the loop immediately:

```c
for (int i = 0; i < 100; i++) {
    if (i == 5) break;  // stop at 5, no matter what the loop condition says
    printf("%d\n", i);
}
```

`continue` skips the rest of the current iteration and moves to the next:

```c
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;  // skip even numbers
    printf("%d\n", i);          // only prints odd numbers
}
```

`%` is the modulo operator — it returns the remainder after division. `i % 2 == 0` means i is divisible by 2 (even).

## Try it yourself

In the sandbox, write a loop that prints the multiplication table for 7 (7×1 through 7×10). You'll need `printf` with two values and some arithmetic.

```c
#include <stdio.h>

int main() {
    for (int i = 1; i <= 10; i++) {
        printf("7 x %d = %d\n", i, 7 * i);
    }
    return 0;
}
```

Simple. Consistent. This is what loops are for: the same structure applied to changing data.
