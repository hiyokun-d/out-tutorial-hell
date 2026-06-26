---
id: "operators-expressions"
title: "Operators & Expressions"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Operators & Expressions

Before conditions and loops, you need one more building block: **operators**. They're how you compute things. And they're the same in essentially every programming language that exists.

## Arithmetic operators

```c
#include <stdio.h>

int main() {
    int a = 10;
    int b = 3;

    printf("a + b = %d\n", a + b);  // 13  addition
    printf("a - b = %d\n", a - b);  // 7   subtraction
    printf("a * b = %d\n", a * b);  // 30  multiplication
    printf("a / b = %d\n", a / b);  // 3   division (integer!)
    printf("a %% b = %d\n", a % b); // 1   modulo (remainder)

    return 0;
}
```

Run it. Notice `10 / 3 = 3`, not `3.333...`. When both operands are integers, C does **integer division** — it drops the decimal. This is not a bug; it's a deliberate feature used constantly in programming.

`%%` prints a literal `%` sign in `printf` — the `%` operator itself doesn't need escaping in your code.

## Integer division vs float division

```c
#include <stdio.h>

int main() {
    int a = 10, b = 3;

    printf("int division:   %d\n",   a / b);         // 3
    printf("float division: %.2f\n", (float)a / b);  // 3.33

    return 0;
}
```

`(float)a` is a **cast** — it temporarily converts `a` to a float before dividing. If either operand is a float, the result is a float. If both are ints, the result is always an int.

This matters. A lot. Forgetting it causes subtle bugs in any language.

## The modulo operator — more useful than it looks

`%` gives you the remainder after division. It's one of the most useful operators in programming:

```c
// Is a number even? Even numbers have remainder 0 when divided by 2
if (n % 2 == 0) { /* even */ }

// Wrap a value around a range (0 to 6 for days of the week)
int day = totalDays % 7;

// Get the last digit of a number
int lastDigit = number % 10;
```

Once you see modulo, you start seeing it everywhere.

## Compound assignment — shorthand for updating variables

These all do the same thing: read the current value, do something, store the result back:

```c
int x = 10;

x += 5;   // same as x = x + 5  → x is now 15
x -= 3;   // same as x = x - 3  → x is now 12
x *= 2;   // same as x = x * 2  → x is now 24
x /= 4;   // same as x = x / 4  → x is now 6
x %= 4;   // same as x = x % 4  → x is now 2
```

You'll use `+=` and `++` (increment by 1) constantly in loops.

## Operator precedence

When multiple operators appear in one expression, C evaluates them in a specific order — the same order you learned in maths:

1. `()` — parentheses first
2. `*`, `/`, `%` — multiplication, division, modulo
3. `+`, `-` — addition, subtraction

```c
int result = 2 + 3 * 4;    // 14, not 20 — multiplication first
int result2 = (2 + 3) * 4; // 20 — parentheses override
```

When in doubt, use parentheses. They make intent explicit and prevent bugs.

## This is universal

Every language has these exact operators:
- Python: `+`, `-`, `*`, `/`, `//` (integer div), `%`
- JavaScript: `+`, `-`, `*`, `/`, `%`
- Java, Go, Rust, C++: all the same

The symbols are identical across almost every language in common use today. What you learn here transfers directly.
