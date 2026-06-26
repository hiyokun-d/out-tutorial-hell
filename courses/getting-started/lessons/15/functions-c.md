---
id: "functions-c"
title: "Functions in C"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Functions in C

Functions let you name a block of code so you can run it whenever you need it. They are the single most powerful tool for keeping code organised — and C's version of them teaches you something every other language hides.

## The problem without functions

Imagine you need to calculate the area of a rectangle in 10 different places in your program. Without functions, you'd write `width * height` ten times. Find a bug? Fix it ten times. Add rounding? Change it ten times.

Functions solve this: write the logic once, name it, use it anywhere.

## Defining a function in C

```c
int add(int a, int b) {
    return a + b;
}
```

Breaking this down:

- `int` — the **return type**: this function returns an integer
- `add` — the function name
- `(int a, int b)` — **parameters**: two integer inputs, each with a declared type
- `return a + b;` — computes and returns the result

Notice: in C, **every parameter and the return value must have a declared type**. The compiler enforces this.

## Calling a function

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 4);
    printf("3 + 4 = %d\n", result);
    printf("10 + 20 = %d\n", add(10, 20));
    return 0;
}
```

`add` is defined before `main` so the compiler knows about it. You can also use a **function prototype** (declaration before `main`, definition after) — more advanced, but common in real C code.

## Return types matter

In C, the return type is part of the contract. The compiler checks it:

```c
int multiply(int a, int b) {
    return a * b;      // correct — returns an int
}

int broken(int a, int b) {
    return "hello";    // ERROR — can't return a string from an int function
}
```

This type enforcement at the function level catches a whole class of bugs at compile time. If a function promises to return an integer, the compiler verifies that it does.

## `void` — functions that return nothing

Not every function needs to produce a value. Some just do something:

```c
#include <stdio.h>

void printLine(char* text) {
    printf("%s\n", text);
}

int main() {
    printLine("Hello, world!");
    printLine("Second line");
    return 0;
}
```

`void` means "returns nothing." Trying to use a `void` function's result (like `int x = printLine("hi")`) causes a compile error.

## Local variables and scope

Variables declared inside a function exist only inside that function:

```c
int square(int n) {
    int result = n * n;  // result exists only inside square
    return result;
}

int main() {
    int x = square(5);
    // result is not accessible here — it doesn't exist outside square
    printf("%d\n", x);  // prints 25
    return 0;
}
```

This is called **scope**. It protects functions from accidentally interfering with each other's data. In large programs with thousands of variables, scope is what prevents chaos.

## One function, one job

This is the most important rule:

```c
// Bad — does two unrelated things
void validateAndPrintUser(User u) { ... }

// Good — each does one clear thing
int isValidUser(User u) { ... }
void printUser(User u) { ... }
```

Small functions with clear names compose naturally. They're easy to test, easy to reuse, and easy to read.

## Putting it together

```c
#include <stdio.h>

int celsiusToFahrenheit(int c) {
    return c * 9 / 5 + 32;
}

int main() {
    int temps[5] = {0, 20, 37, 100, -40};

    for (int i = 0; i < 5; i++) {
        printf("%d°C = %d°F\n", temps[i], celsiusToFahrenheit(temps[i]));
    }

    return 0;
}
```

A function defined once, called five times in a loop, with no repeated logic. This is how real programs are structured — not one giant `main`, but many small, named, reusable pieces.
