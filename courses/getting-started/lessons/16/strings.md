---
id: "strings"
title: "Strings — Text is Just an Array"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Strings — Text is Just an Array

Text is the most common type of data in real programs. Names, messages, file paths, URLs — all strings. Most languages give you a `string` type that just works. C doesn't. C makes you see what a string actually is.

And once you see it, you understand why every other language made the choices it did.

## A string in C is an array of characters

```c
#include <stdio.h>

int main() {
    char name[] = "Alice";
    printf("Hello, %s!\n", name);
    return 0;
}
```

`char name[]` is an array of `char` values. The `[]` without a number lets C count the characters automatically.

`%s` in `printf` prints a string (an array of chars).

## The null terminator

Here's what `"Alice"` actually looks like in memory:

```
'A'  'l'  'i'  'c'  'e'  '\0'
 65  108  105   99  101    0
```

Six bytes, not five. The last character is `'\0'` — the **null terminator**, a byte with value 0. It signals where the string ends.

C functions that work with strings (like `printf`) read characters one by one until they hit `'\0'`. Without it, they'd keep reading into whatever memory comes after — reading garbage indefinitely.

This is why in C, `char name[5] = "Alice"` is wrong — there's no room for the null terminator. Always allocate one extra byte, or let C count for you with `char name[]`.

## String length

```c
#include <stdio.h>
#include <string.h>  // needed for strlen

int main() {
    char language[] = "C";
    char word[] = "programming";

    printf("Length of \"%s\": %zu\n", language, strlen(language));  // 1
    printf("Length of \"%s\": %zu\n", word, strlen(word));          // 11

    return 0;
}
```

`strlen` (from `string.h`) counts characters until it hits `'\0'`. It returns the number of visible characters — not counting the null terminator.

## Accessing individual characters

Because a string is an array, you can access characters by index:

```c
#include <stdio.h>

int main() {
    char word[] = "Hello";

    printf("First letter: %c\n", word[0]);  // H
    printf("Third letter: %c\n", word[2]);  // l
    printf("Last letter:  %c\n", word[4]);  // o

    // Loop over each character
    for (int i = 0; word[i] != '\0'; i++) {
        printf("%c ", word[i]);
    }
    printf("\n");

    return 0;
}
```

The loop condition `word[i] != '\0'` is a common pattern — keep going until you hit the null terminator. This is exactly how `strlen` itself works.

## Strings are not like numbers

You cannot compare strings with `==` in C:

```c
char a[] = "hello";
char b[] = "hello";

if (a == b) { ... }  // WRONG — compares memory addresses, not contents
```

You need `strcmp` from `string.h`:

```c
#include <string.h>

if (strcmp(a, b) == 0) {
    printf("They are equal\n");
}
```

`strcmp` returns 0 if strings are equal, negative if a < b, positive if a > b.

This surprises beginners. In JavaScript and Python, `"hello" == "hello"` just works. Those languages hide the complexity — they're doing a character-by-character comparison behind the scenes. C makes you do it explicitly, which is why you can see it.

## What other languages give you

In Python: `name = "Alice"` — a string object with `.len()`, `==` comparison, slicing, concatenation with `+`.

In JavaScript: `let name = "Alice"` — same idea.

They all store text as a sequence of characters under the hood. The null terminator might be different, the memory layout varies, but the fundamental concept — text is a sequence of character values — is the same everywhere.

C just makes you see the raw truth.
