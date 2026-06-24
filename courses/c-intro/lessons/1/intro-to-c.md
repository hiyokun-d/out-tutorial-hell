---
id: "intro-to-c"
title: "What is C?"
type: "THEORY"
xpReward: 15
---

# What is C?

C is one of the oldest programming languages still in active use — created in 1972 — and it's still everywhere. The Linux kernel is C. SQLite is C. Python itself is written in C. If something needs to be fast and close to the hardware, it's probably C.

## Why learn C?

Most beginners skip C and go straight to Python or JavaScript. That's fine — but C teaches you something those languages hide: **how computers actually work**.

- Memory is not automatic. You ask for it, you free it.
- There's no garbage collector watching over you.
- When you print something, you know *exactly* what's happening.

## The anatomy of a C program

```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
```

Every C program has these parts:

**`#include <stdio.h>`** — imports the standard input/output library. Without this, `printf` doesn't exist.

**`int main()`** — the entry point. Every C program starts here. The `int` means it returns a number (0 = success).

**`printf(...)`** — prints to the terminal. The `\n` is a newline character — it moves the cursor to the next line.

**`return 0;`** — tells the OS the program finished cleanly. Any non-zero return = error.

## Variables in C

C is **statically typed** — you must declare what type a variable is before you use it.

```c
int age = 25;
float price = 9.99;
char letter = 'A';
```

| Type | What it holds | Example |
|------|--------------|---------|
| `int` | Whole numbers | `42`, `-7` |
| `float` | Decimal numbers | `3.14` |
| `double` | More precise decimals | `3.14159265` |
| `char` | A single character | `'A'` |

## Printing variables

`printf` uses **format specifiers** — placeholders that get replaced with variable values:

```c
int score = 100;
printf("Score: %d\n", score);   // %d = integer
printf("Pi: %.2f\n", 3.14159); // %.2f = float with 2 decimal places
printf("Grade: %c\n", 'A');    // %c = char
```

| Specifier | Type |
|-----------|------|
| `%d` | `int` |
| `%f` | `float` / `double` |
| `%c` | `char` |
| `%s` | string (char array) |

## Semicolons matter

Every statement in C ends with a `;`. Forget it and the compiler will refuse to run your code. This is one of C's strictest rules — it leaves nothing ambiguous.

## The compiler

Unlike JavaScript (which runs in a browser) or Python (which interprets line by line), C code is **compiled** — transformed into machine code before it runs. That's why C programs are fast: by the time they execute, they're already machine instructions.

In this course, your code is compiled and run in the cloud via the Piston sandbox — you don't need to install anything.
