---
id: "data-types-c"
title: "Data Types — Why They Matter"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Data Types — Why They Matter

Data types are the single most important concept in understanding how computers store and manipulate information. C forces you to think about them. Most other languages hide them. After this lesson, you'll never look at a variable the same way.

## The fundamental question

When you tell the computer "store the number 42," the computer asks: **in how many bytes, and in what format?**

The number 42 stored as a 1-byte integer is completely different bytes than 42.0 stored as a 4-byte floating-point number — even though they represent the same quantity. The computer doesn't know which you mean unless you tell it.

That's what a **data type** is: the instruction that tells the computer how much memory to use and how to interpret the bits inside it.

## The basic C types

### `int` — whole numbers

```c
int score = 95;
int temperature = -12;
int year = 2024;
```

- Uses **4 bytes** (32 bits)
- Can store whole numbers from −2,147,483,648 to 2,147,483,647
- Cannot store decimals — `int x = 3.7;` stores `3`, dropping the `.7`

### `float` — decimal numbers (single precision)

```c
float price = 19.99;
float pi = 3.14159;
```

- Uses **4 bytes** (same as int, but interpreted differently)
- Can store decimals, but with limited precision (~7 significant digits)
- Suffix `f` is sometimes used: `float pi = 3.14159f;`

### `double` — decimal numbers (double precision)

```c
double precise = 3.14159265358979;
```

- Uses **8 bytes**
- More precise than float (~15 significant digits)
- Default for decimal arithmetic in C — prefer `double` over `float` unless you have a reason

### `char` — a single character

```c
char grade = 'A';
char initial = 'J';
```

- Uses **1 byte**
- Stores a single character using its **ASCII** code — `'A'` is actually stored as the number 65
- Single quotes for characters, double quotes for strings (important distinction)

## Seeing the size

C has a built-in operator called `sizeof` that returns how many bytes a type uses:

```c
#include <stdio.h>

int main() {
    printf("int:    %zu bytes\n", sizeof(int));
    printf("float:  %zu bytes\n", sizeof(float));
    printf("double: %zu bytes\n", sizeof(double));
    printf("char:   %zu bytes\n", sizeof(char));
    return 0;
}
```

Run this in the sandbox. You'll see the actual byte counts on the machine running your code.

## Why types are strict in C

C will not silently convert types in ways that might lose data. If you do this:

```c
int score = 95.7;
```

The compiler will warn you (or an implicit conversion will drop the `.7`). If you assign the wrong type on purpose, you get a warning or an error. The compiler is protecting you.

This strictness has a purpose: in a system language like C, losing the decimal part of a number or overflowing an integer can crash a machine, corrupt a database, or worse. The type system is your first line of defence.

## Printf format specifiers

To print different types, you use different format specifiers in `printf`:

```c
#include <stdio.h>

int main() {
    int age = 25;
    float height = 1.75;
    char initial = 'A';

    printf("Age: %d\n", age);        // %d for int
    printf("Height: %.2f\n", height); // %f for float, .2 = 2 decimal places
    printf("Initial: %c\n", initial); // %c for char
    return 0;
}
```

The format specifier tells `printf` how to interpret and display the value. Getting them wrong (`%d` for a `float`) produces garbage output or crashes — because the bytes get misread.

This is exactly what a data type is: instructions for reading bytes correctly.
