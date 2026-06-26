---
id: "structs"
title: "Structs — Grouping Data Together"
type: "THEORY"
xpReward: 15
module: "C — The Foundation"
sandbox_language: "c"
---

# Structs — Grouping Data Together

You know how to store a number in `int`, text in a `char` array, decimals in `float`. But what about a **person** — who has a name, an age, and a score?

You'd need three separate variables for each person. For ten people, that's thirty variables — all disconnected. This is the problem structs solve.

## Defining a struct

A struct groups related variables together into one named type:

```c
struct Person {
    char name[50];
    int age;
    float score;
};
```

This defines a new type called `struct Person`. It has three **members**: a name (up to 49 characters + null terminator), an age, and a score.

## Creating and using a struct

```c
#include <stdio.h>

struct Person {
    char name[50];
    int age;
    float score;
};

int main() {
    struct Person player;
    player.age = 25;
    player.score = 92.5;

    // Strings need strcpy — you can't assign with = after declaration
    // For now, let's just use the name from a literal in printf directly

    printf("Age: %d\n", player.age);
    printf("Score: %.1f\n", player.score);

    return 0;
}
```

Members are accessed with `.` (the dot operator). `player.age` reads the `age` field of the `player` struct.

## Initialising a struct at declaration

```c
#include <stdio.h>
#include <string.h>

struct Player {
    char name[50];
    int level;
    int score;
};

int main() {
    struct Player p1;
    strcpy(p1.name, "Alex");
    p1.level = 5;
    p1.score = 1200;

    struct Player p2;
    strcpy(p2.name, "Sam");
    p2.level = 3;
    p2.score = 800;

    printf("%s — Level %d — Score: %d\n", p1.name, p1.level, p1.score);
    printf("%s — Level %d — Score: %d\n", p2.name, p2.level, p2.score);

    return 0;
}
```

Two players, each with their own bundled data. No scattered variables.

## Arrays of structs

Combine structs with arrays and you have a true data record system:

```c
#include <stdio.h>
#include <string.h>

struct Student {
    char name[50];
    int grade;
};

int main() {
    struct Student class[3];

    strcpy(class[0].name, "Alice");  class[0].grade = 92;
    strcpy(class[1].name, "Bob");    class[1].grade = 78;
    strcpy(class[2].name, "Carol");  class[2].grade = 85;

    for (int i = 0; i < 3; i++) {
        printf("%s: %d\n", class[i].name, class[i].grade);
    }

    return 0;
}
```

An array of `struct Student` — three students, each with their own name and grade, stored and accessed cleanly.

## Passing structs to functions

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

float distance(struct Point a, struct Point b) {
    int dx = a.x - b.x;
    int dy = a.y - b.y;
    return (float)(dx * dx + dy * dy); // simplified — distance squared
}

int main() {
    struct Point p1 = {0, 0};
    struct Point p2 = {3, 4};

    printf("Distance squared: %.0f\n", distance(p1, p2)); // 25
    return 0;
}
```

Structs pass to functions just like any other type.

## This is what objects are

If you've ever seen Python, JavaScript, or Java, you've seen objects:

```python
# Python
player = {"name": "Alex", "level": 5, "score": 1200}
print(player["name"])
```

```javascript
// JavaScript
const player = { name: "Alex", level: 5, score: 1200 };
console.log(player.name);
```

Same idea as a struct. A collection of named fields that belong together.

In object-oriented languages (Java, C++, Python, JavaScript), "objects" are structs with functions attached to them — called **methods**. The `.` operator is identical. The mental model is the same.

C's struct is the raw version. Every other language's objects are structs plus additional features.

## The pattern: everything relates to something

Real programs don't deal with isolated numbers. They deal with **entities** — users, products, orders, game characters, sensor readings — each with multiple properties that belong together.

Struct (or object, or record, depending on the language) is how you model that. It's one of the most important patterns in all of software development: group related data together, give the group a name, pass it around as a unit.

You now have the complete toolkit.
