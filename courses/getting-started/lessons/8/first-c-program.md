---
id: "first-c-program"
title: "Your First C Program"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Your First C Program

Every programming journey has a Hello World. This is yours — but we're going to understand every line, not just copy it.

## The program

```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
```

Run it in the sandbox. You should see `Hello, world!` in the output.

Now let's take it apart.

## Line by line

### `#include <stdio.h>`

Before your program can use built-in functions like `printf`, it needs to know they exist. `#include` tells the compiler to load a **header file** — a file that describes available functions.

`stdio.h` stands for **standard input/output**. It gives you `printf` (print formatted output) and `scanf` (read input), among others.

Think of it as importing a toolbox before you use the tools.

### `int main() {`

Every C program must have a `main` function. Execution starts here, always.

- `int` — this function will return a whole number (an integer)
- `main` — the function's name (this one is special — it's where the program starts)
- `()` — this function takes no parameters
- `{` — the body of the function begins here

### `printf("Hello, world!\n");`

`printf` stands for **print formatted**. It prints text to the terminal.

- The text goes inside double quotes
- `\n` is a **newline character** — it moves the cursor to the next line (like pressing Enter)
- The semicolon `;` ends the statement — **every statement in C ends with a semicolon**

### `return 0;`

This ends the `main` function and returns `0` to the operating system.

By convention, `0` means "success" — the program finished without errors. Any other number indicates an error. The OS (and tools like build scripts) can check this value.

### `}`

Closes the `main` function body. Every `{` must have a matching `}`.

## Try it in the sandbox

Try changing the text inside `printf`. Add a second `printf` line. See what happens.

```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    printf("I am learning C.\n");
    return 0;
}
```

Notice: each `printf` goes on its own line with its own semicolon. You can have as many as you want. They run in order, top to bottom.

## What just happened?

When you hit Run in the sandbox, your C code was sent to a compiler (GCC). The compiler translated it into machine code. Then the machine code was executed and the output came back.

That whole cycle — **write → compile → run** — is what happens every time you run a C program. The compiler is strict. If you forget a semicolon or misspell `printf`, it will refuse to compile and tell you why.

This strictness is not punishment. It's the compiler protecting you from yourself.

## Common mistakes to try deliberately

Try these to see what errors look like:

1. Remove the semicolon after `printf(...)` and see the compiler error
2. Change `printf` to `Printf` (capital P) — C is case-sensitive
3. Remove `return 0;` — some compilers warn, some don't. But it's good practice to include it.

Getting comfortable reading error messages is a key skill. Every error message is a hint.
