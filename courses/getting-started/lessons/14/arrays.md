---
id: "arrays"
title: "Arrays — Storing Many Values"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Arrays — Storing Many Values

So far every variable has held one value. But programs deal with collections constantly — a list of scores, a set of user names, a sequence of temperatures. That's what arrays are for.

And the loop + array combination is the single most fundamental pattern in all of programming.

## What is an array?

An array stores multiple values of the same type in consecutive memory locations.

```c
int scores[5] = {90, 85, 72, 96, 61};
```

- `int` — the type of each element
- `scores` — the name
- `[5]` — five elements
- `{90, 85, 72, 96, 61}` — the initial values

In memory, these five integers sit next to each other — 4 bytes each, 20 bytes total. The name `scores` refers to the address of the first one.

## Accessing elements

Elements are accessed by **index**, starting at 0:

```c
#include <stdio.h>

int main() {
    int scores[5] = {90, 85, 72, 96, 61};

    printf("First:  %d\n", scores[0]); // 90
    printf("Third:  %d\n", scores[2]); // 72
    printf("Last:   %d\n", scores[4]); // 61

    return 0;
}
```

Arrays start at index 0 in C — and in JavaScript, Python, Go, Java, Rust, and almost every other language. This is universal.

`scores[5]` doesn't exist. Accessing it is **out of bounds** — C won't stop you, but it reads garbage memory. In other languages this crashes immediately with a clear error. C just silently reads whatever bytes happen to be there.

## Iterating with a for loop

The loop counter is the array index. This pairing is so common it's practically one concept:

```c
#include <stdio.h>

int main() {
    int scores[5] = {90, 85, 72, 96, 61};

    for (int i = 0; i < 5; i++) {
        printf("scores[%d] = %d\n", i, scores[i]);
    }

    return 0;
}
```

`i` goes 0, 1, 2, 3, 4 — exactly the valid indices. The condition `i < 5` (not `i <= 5`) is deliberate.

## Common array patterns

These patterns appear constantly across every language and problem type:

**Sum all elements:**
```c
int total = 0;
for (int i = 0; i < 5; i++) {
    total += scores[i];
}
printf("Total: %d\n", total);
```

**Find the maximum:**
```c
int max = scores[0];  // start with the first as the current max
for (int i = 1; i < 5; i++) {
    if (scores[i] > max) {
        max = scores[i];
    }
}
printf("Max: %d\n", max);
```

**Count elements matching a condition:**
```c
int count = 0;
for (int i = 0; i < 5; i++) {
    if (scores[i] >= 90) {
        count++;
    }
}
printf("Scores >= 90: %d\n", count);
```

**Calculate average:**
```c
int total = 0;
for (int i = 0; i < 5; i++) {
    total += scores[i];
}
float average = (float)total / 5;
printf("Average: %.1f\n", average);
```

Run each of these in the sandbox. These four patterns — sum, max, count, average — solve an enormous range of real problems.

## The length problem

C doesn't know how many elements an array has unless you track it yourself. `scores` is just a memory address — the length `5` is not stored anywhere.

```c
int scores[5] = {90, 85, 72, 96, 61};
int length = sizeof(scores) / sizeof(scores[0]); // 20 / 4 = 5
```

This divides the total size of the array by the size of one element. It works, but it's verbose. Modern languages (JavaScript, Python, Go) solve this by storing the length automatically. C makes you manage it — another example of C showing you what other languages are doing for you.

## Arrays in every language

Every language has the array-or-collection concept. The syntax changes, the idea doesn't:

| Language | Array syntax | Index from |
|----------|-------------|-----------|
| C | `int arr[5]` | 0 |
| JavaScript | `let arr = [1,2,3]` | 0 |
| Python | `arr = [1, 2, 3]` | 0 |
| Go | `arr := [5]int{...}` | 0 |
| Java | `int[] arr = {1,2,3}` | 0 |

They all start at 0. The loop+array pattern is identical in every one of them. Learn it once, use it everywhere.
