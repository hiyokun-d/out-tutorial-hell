---
id: "variables-memory-c"
title: "Variables and Memory"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Variables and Memory

You've seen variables. Now let's understand what they actually are at the hardware level — because understanding this will change how you think about every language you use.

## A variable is a named location in memory

When you write:

```c
int age = 25;
```

Three things happen:
1. The OS reserves **4 bytes** of RAM for you
2. The value `25` is stored in those bytes (in binary)
3. The name `age` is associated with the address of those bytes — so you can reference it by name instead of by number

That's it. A variable is just a named address into RAM.

## Declaring and assigning

In C, you must **declare** a variable before you use it. The declaration tells the compiler the type and name:

```c
int score;       // declared but not yet assigned — value is undefined (garbage)
score = 100;     // assigned

int total = 0;   // declared and assigned in one line (initialised)
```

Always initialise your variables. Reading from an uninitialised variable in C gives you whatever bytes happened to be in that memory location — "garbage" that leads to unpredictable behaviour.

## Updating a variable

A variable's value can change. That's the whole point:

```c
#include <stdio.h>

int main() {
    int count = 0;
    printf("count = %d\n", count);

    count = count + 1;  // read the current value, add 1, store it back
    printf("count = %d\n", count);

    count = count + 1;
    printf("count = %d\n", count);

    return 0;
}
```

`count = count + 1` is not a mathematical equation claiming count equals count plus one. It's an **assignment**: calculate the right side, then store the result in the left side.

Run it. Then try `count += 1` (shorthand for the same thing) and `count++` (even shorter).

## The address operator

C lets you see the actual memory address of a variable using `&`:

```c
#include <stdio.h>

int main() {
    int score = 95;
    printf("Value:   %d\n", score);
    printf("Address: %p\n", (void*)&score);
    return 0;
}
```

The address will look something like `0x7ffd5abc1234` — a hexadecimal number representing a location in RAM. Every time you run the program, it'll be a different address (the OS allocates memory dynamically).

You don't need to work with addresses directly yet. But seeing them helps you understand: a variable isn't a container that exists in some abstract space. It's a specific location in your computer's physical memory, right now, while the program runs.

## Type limits: what happens when you go too far?

```c
#include <stdio.h>

int main() {
    int max = 2147483647;  // largest possible int
    printf("max     = %d\n", max);
    printf("max + 1 = %d\n", max + 1);  // what happens?
    return 0;
}
```

Run it. You'll see a negative number. This is called **integer overflow** — you ran out of bits and the value wrapped around.

This is not a C quirk. This is a fundamental property of how integers are stored in binary. JavaScript doesn't crash when you overflow (it silently switches to floating-point). Python silently upgrades to a bigger integer type. C doesn't help you at all — it's your responsibility to know your limits.

Understanding this is why learning C first matters. Every language has limits. Only C makes you confront them directly.

## Constants

Sometimes a value should never change. Use `const`:

```c
const int MAX_LIVES = 3;
const float PI = 3.14159;
```

Trying to reassign a `const` variable will cause a compile error. This is intentional — it prevents accidental changes to values that should stay fixed.

Convention: constants use `ALL_CAPS_SNAKE_CASE`.
