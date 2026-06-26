---
id: "conditions-c"
title: "Conditions in C"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Conditions in C

Programs that do the same thing every time aren't very useful. Conditions let your program make decisions — run one block of code if something is true, a different block if it's false.

## The if statement

```c
#include <stdio.h>

int main() {
    int score = 85;

    if (score >= 90) {
        printf("Grade: A\n");
    } else if (score >= 80) {
        printf("Grade: B\n");
    } else if (score >= 70) {
        printf("Grade: C\n");
    } else {
        printf("Grade: F\n");
    }

    return 0;
}
```

Change `score` and run it again. Notice: only one branch executes, no matter what.

The conditions are checked **top to bottom**. The first one that's true runs — everything else is skipped.

## Comparison operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | equal to | `score == 100` |
| `!=` | not equal to | `lives != 0` |
| `<` | less than | `age < 18` |
| `>` | greater than | `price > 0` |
| `<=` | less than or equal | `speed <= 120` |
| `>=` | greater than or equal | `score >= 60` |

**Critical:** `==` tests equality. `=` assigns a value. This confusion causes real bugs:

```c
if (score = 90) { ... }  // assigns 90 to score, always true — BUG
if (score == 90) { ... } // tests if score equals 90 — correct
```

The compiler may warn you. Always use `==` for comparison.

## Boolean logic: combining conditions

C doesn't have a `bool` type in its most basic form (though `stdbool.h` adds one). Conditions evaluate to integers: `0` is false, any non-zero value is true.

You can combine conditions:

```c
int age = 20;
int hasId = 1;  // 1 = true, 0 = false

if (age >= 18 && hasId) {
    printf("Allowed\n");
}

if (age < 18 || !hasId) {
    printf("Not allowed\n");
}
```

| Operator | Meaning | True when |
|----------|---------|-----------|
| `&&` | AND | both sides are true |
| `\|\|` | OR | at least one side is true |
| `!` | NOT | the condition is false |

## The switch statement

When you're comparing one variable against many possible values, `switch` is cleaner than a long chain of `if/else if`:

```c
#include <stdio.h>

int main() {
    int day = 3;

    switch (day) {
        case 1: printf("Monday\n");    break;
        case 2: printf("Tuesday\n");   break;
        case 3: printf("Wednesday\n"); break;
        case 4: printf("Thursday\n");  break;
        case 5: printf("Friday\n");    break;
        default: printf("Weekend\n");  break;
    }

    return 0;
}
```

The `break` at the end of each case is required — without it, execution **falls through** to the next case (sometimes intentional, usually a bug).

## Types matter in comparisons

C won't silently convert types during comparison in ways that lose precision. Watch out for comparing integers and floats:

```c
float x = 0.1 + 0.2;
if (x == 0.3) {
    printf("Equal\n");    // probably won't print!
}
```

`0.1 + 0.2` in floating-point is `0.30000000000000004...` — not exactly `0.3`. Never compare floats with `==`. Instead, check if they're close enough:

```c
float diff = x - 0.3;
if (diff < 0.0001 && diff > -0.0001) {
    printf("Close enough\n");
}
```

This isn't a C problem — it's a floating-point problem. JavaScript, Python, and every other language using floating-point arithmetic has the same issue. C just doesn't hide it from you.
