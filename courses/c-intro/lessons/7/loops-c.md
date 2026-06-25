---
id: "loops-c"
title: "For loops in C"
type: "THEORY"
xpReward: 15
module: "Control Flow"
---

# For loops in C

A `for` loop repeats code a known number of times.

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

The loop has three parts:

- `int i = 1` starts the counter
- `i <= 5` decides whether to keep looping
- `i++` increases the counter after each run

This looks dense at first, but the pattern becomes familiar quickly.
