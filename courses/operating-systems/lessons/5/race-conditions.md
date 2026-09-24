---
id: "race-conditions"
title: "Race Conditions and Mutexes"
type: "INTERACTIVE"
xpReward: 25
module: "Threads"
widget: "Stepper"
---

# Race Conditions and Mutexes

**Read this before you write threaded code.** Threads share variables, which is why they're useful. It's also why a program that passes every test can still give the wrong answer one run in a thousand.

## The line that looks safe

```c
counter++;
```

It looks like one step. The CPU does it in three:

1. **Load** `counter` from memory into a register.
2. **Add** 1 to the register.
3. **Store** the register back to memory.

A thread can be switched out between any two of those steps. If another thread touches `counter` during that gap, one of the updates is lost.

## Play first

`counter` starts at 5. Two threads each run `counter++` once, so the answer should be 7. Step through one unlucky ordering, then the fixed version.

```widget
{
  "title": "Two threads, one counter",
  "steps": [
    {
      "title": "Start",
      "body": "`counter` is 5 in memory. Each thread has its own registers — that's per-thread state, not shared.",
      "cellsTitle": "Memory and registers",
      "cells": [
        { "label": "counter", "value": 5, "note": "shared" },
        { "label": "T1 register", "value": "—" },
        { "label": "T2 register", "value": "—" }
      ]
    },
    {
      "title": "T1: load",
      "body": "T1 copies `counter` into its register.",
      "cells": [
        { "label": "counter", "value": 5, "note": "shared" },
        { "label": "T1 register", "value": 5 },
        { "label": "T2 register", "value": "—" }
      ]
    },
    {
      "title": "Switch! T2: load",
      "tags": [{ "label": "danger", "value": "T1 is mid-update", "tone": "bad" }],
      "body": "The scheduler switches to T2 before T1 stores. T2 loads `counter` — still 5, because T1's new value only exists in T1's register.",
      "cells": [
        { "label": "counter", "value": 5, "note": "shared" },
        { "label": "T1 register", "value": 5 },
        { "label": "T2 register", "value": 5 }
      ]
    },
    {
      "title": "T2: add, store",
      "body": "T2 adds 1 and stores 6.",
      "cells": [
        { "label": "counter", "value": 6, "note": "shared" },
        { "label": "T1 register", "value": 5 },
        { "label": "T2 register", "value": 6 }
      ]
    },
    {
      "title": "T1: add, store",
      "body": "T1 resumes where it left off. Its register still says 5. It adds 1 and stores 6 — over the top of T2's 6.",
      "cells": [
        { "label": "counter", "value": 6, "note": "shared" },
        { "label": "T1 register", "value": 6 },
        { "label": "T2 register", "value": 6 }
      ],
      "callout": "Two increments, final value 6. One update was lost. Nothing crashed and nothing printed an error.",
      "calloutTone": "bad"
    },
    {
      "title": "Fix: T1 locks the mutex",
      "tags": [{ "label": "lock", "value": "held by T1", "tone": "accent" }],
      "body": "Start again from 5. This time both threads wrap the update in `pthread_mutex_lock` / `pthread_mutex_unlock`. T1 gets the lock first and loads.",
      "cells": [
        { "label": "counter", "value": 5, "note": "shared" },
        { "label": "lock", "value": "T1" },
        { "label": "T1 register", "value": 5 },
        { "label": "T2 register", "value": "—" }
      ]
    },
    {
      "title": "Switch! T2 tries to lock",
      "tags": [{ "label": "T2", "value": "blocked", "tone": "bad" }],
      "body": "The same unlucky switch happens. But T2's first step is `lock`, and the lock is taken. T2 **blocks**. It never gets to load the stale 5.",
      "cells": [
        { "label": "counter", "value": 5, "note": "shared" },
        { "label": "lock", "value": "T1" },
        { "label": "T1 register", "value": 5 },
        { "label": "T2 register", "value": "waiting" }
      ]
    },
    {
      "title": "T1: add, store, unlock",
      "body": "T1 finishes all three steps and releases the lock.",
      "cells": [
        { "label": "counter", "value": 6, "note": "shared" },
        { "label": "lock", "value": "free" },
        { "label": "T1 register", "value": 6 },
        { "label": "T2 register", "value": "waiting" }
      ]
    },
    {
      "title": "T2: lock, load, add, store, unlock",
      "body": "T2 wakes, takes the lock and loads the **current** value, 6.",
      "cells": [
        { "label": "counter", "value": 7, "note": "shared" },
        { "label": "lock", "value": "free" },
        { "label": "T1 register", "value": 6 },
        { "label": "T2 register", "value": 7 }
      ],
      "callout": "7. The mutex didn't stop the switch — it stopped the other thread from entering the gap.",
      "calloutTone": "ok"
    }
  ]
}
```

## What you just saw, named

A **race condition** is a bug where the result depends on the exact order in which threads happen to run. Most orders give 7. A few give 6. Your tests probably run the lucky ones.

The lines that touch shared data are a **critical section**. The fix is **mutual exclusion**: at most one thread inside the critical section at a time. A **mutex** is a lock that enforces it:

```c
#include <pthread.h>

int counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *work(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);    // wait here if someone else holds it
        counter++;                    // critical section
        pthread_mutex_unlock(&lock);  // let the next thread in
    }
    return NULL;
}
```

`lock` either takes the mutex or blocks until it's free. `unlock` releases it and lets one waiting thread continue.

## Rules that keep you out of trouble

- **Every access** to the shared variable goes through the lock, reads included. One unlocked read is enough for a race.
- **Keep the critical section short.** Anything inside it runs one thread at a time, so a slow critical section throws away your parallelism.
- **Always unlock**, including on early `return` paths.
- **Two locks? Always take them in the same order.** If thread 1 holds A and waits for B while thread 2 holds B and waits for A, both wait forever. That's a **deadlock**.

## Build it

Open the **Sandbox**. It runs real C, pthreads included.

1. Paste the code above, add a `main` that starts two threads running `work`, joins both, and prints `counter`. You should get 200000.
2. Delete the `lock` and `unlock` lines and run it several times. If you ever see less than 200000, you've caught a lost update. The sandbox machine may run your threads on a single core and hide the race. That's the lesson: "it worked when I ran it" proves nothing.
3. Put the lock back. Explain in one sentence why the result can't be lower now.
