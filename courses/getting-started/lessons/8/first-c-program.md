---
id: "first-c-program"
title: "Your First C Program"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Your First C Program

Here it is. The program every programmer writes first:

```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
```

Paste it into the sandbox and hit Run. You'll see `Hello, world!` appear in the output.

This is a lot for one screen. That's okay — you don't need to memorise any of it right now. Read it once, then we'll go line by line.

> The sandbox compiles and runs this for you. You're not missing a step. Just hit Run.

## Line by line

### `#include <stdio.h>`

Before your program can use built-in functions like `printf`, it needs to know they exist. `#include` loads a **header file** — a file that describes what functions are available.

`stdio.h` stands for **standard input/output**. It's the toolbox that gives you `printf`.

Think of it as: before you use a tool, you open the toolbox.

### `int main() {`

Every C program must have a `main` function. This is where execution starts — always.

- `int` — this function will give back a whole number when it finishes
- `main` — the special name that tells C "start here"
- `()` — no inputs needed
- `{` — the body of the function begins

### `printf("Hello, world!\n");`

`printf` (print formatted) sends text to the output.

- The text goes in double quotes
- `\n` is a **newline** — moves to the next line, like pressing Enter
- The semicolon `;` ends the statement — **every statement in C ends with one**

### `return 0;`

Ends the program and tells the operating system it finished successfully. By convention, `0` means "no errors." The OS can check this value.

### `}`

Closes the `main` function. Every `{` needs a matching `}`.

## Try it

Change the text inside `printf`. Add a second line. See what happens:

```c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    printf("I'm writing C.\n");
    return 0;
}
```

Each `printf` runs in order. Two `printf` calls → two lines of output.

## What just happened?

When you hit Run, the sandbox sent your code to a C compiler (GCC). The compiler read your code, checked it for errors, translated it into machine instructions, and ran it. The output came back.

That whole process — **write → compile → run** — happens every time. The compiler is strict: if you forget a semicolon or mistype `printf`, it refuses to compile and tells you exactly why.

This strictness is not punishment. It's the compiler catching problems before they become bugs you have to hunt down at runtime.

You just ran a real C program. The compiler found zero errors. That's a win — and it only gets clearer from here.
