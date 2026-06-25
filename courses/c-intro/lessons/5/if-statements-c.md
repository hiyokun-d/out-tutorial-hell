---
id: "if-statements-c"
title: "If statements in C"
type: "THEORY"
xpReward: 15
module: "Control Flow"
---

# If statements in C

C uses `if`, `else if`, and `else` for decisions.

```c
int score = 80;

if (score >= 70) {
    printf("Passed\n");
} else {
    printf("Retry\n");
}
```

The condition goes inside parentheses. The code for each branch goes inside braces.

C does not require indentation, but you should still use it. Indentation makes the program readable.
