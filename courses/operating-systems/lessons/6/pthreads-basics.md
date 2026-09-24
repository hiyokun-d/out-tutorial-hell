---
id: "pthreads-basics"
title: "pthreads: Create, Join, Exit"
type: "THEORY"
xpReward: 20
module: "Threads"
---

# pthreads: Create, Join, Exit

**pthreads** (POSIX threads) is the standard C API for threads on Linux and macOS. Everything you need to start fits in three calls: create a thread, wait for it, end it.

> **Before you write anything real with threads,** read [Race Conditions and Mutexes](/courses/operating-systems/race-conditions). The examples here avoid shared writes on purpose. Real programs rarely can.

## `pthread_create`: start a thread

```c
int pthread_create(pthread_t *id,          // filled in with the new thread's ID
                   const pthread_attr_t *attr,  // NULL = default settings
                   void *(*fn)(void *),     // the function the thread runs
                   void *arg);              // passed to fn
```

The new thread starts running `fn(arg)` right away, in parallel with the thread that created it. The return value is `0` on success and an error number on failure. It does **not** set `errno`.

The thread function always has the same shape: it takes one `void *` and returns one `void *`. To pass it anything, pass a pointer and cast it back inside.

## `pthread_join`: wait for it to finish

```c
int pthread_join(pthread_t id, void **result);
```

`join` blocks until thread `id` finishes. If `result` isn't `NULL`, it receives the value the thread returned.

Join does one more job. A finished thread keeps its ID and return value around until someone collects them. Until then it's a **zombie thread**: dead, but still taking up space. `pthread_join` collects it.

That's the same pattern as processes. A child process that exits stays a **zombie process** until its parent calls `wait()`. **`pthread_join` is to threads what `wait()` is to processes.** Forget either one and the zombies pile up.

If you never need a thread's result, call `pthread_detach(id)` instead. A detached thread cleans itself up when it finishes, and you can't join it any more.

## `pthread_exit`: end the current thread

A thread ends when its function returns. `pthread_exit(value)` ends it from anywhere, even deep inside nested calls, with `value` as its result.

Watch out: `return` from `main` ends the **whole process**, and every other thread dies with it, finished or not. Join your threads before `main` returns.

## Worked example: sum an array in two halves

```c
#include <stdio.h>
#include <pthread.h>

#define N 8
int data[N] = {3, 1, 4, 1, 5, 9, 2, 6};

typedef struct { int from, to; long sum; } Job;

void *sum_range(void *arg) {
    Job *job = arg;                      // cast the void * back
    job->sum = 0;
    for (int i = job->from; i < job->to; i++) job->sum += data[i];
    return NULL;                         // result is in the struct
}

int main(void) {
    pthread_t a, b;
    Job left = {0, N / 2, 0}, right = {N / 2, N, 0};

    pthread_create(&a, NULL, sum_range, &left);
    pthread_create(&b, NULL, sum_range, &right);

    pthread_join(a, NULL);               // wait — and reap — both
    pthread_join(b, NULL);

    printf("%ld + %ld = %ld\n", left.sum, right.sum, left.sum + right.sum);
    return 0;
}
```

Output: `9 + 22 = 31`.

Why it's safe without a mutex: each thread writes only to **its own** `Job`. Both threads read `data`, but nobody writes it while they run. Shared reads are fine. Shared writes are what race.

And why the joins matter: without them, `main` could print before either thread has finished, or return and kill both mid-sum.

## Common mistakes

- **Passing `&i` from a loop.** Every thread gets a pointer to the *same* `i`, which keeps changing. Give each thread its own struct, as `Job` does above.
- **Returning a pointer to a local variable.** The thread's stack is gone after it returns. Return heap memory, or write into a struct the caller owns.
- **Checking `errno` after a pthread call.** pthread functions return the error code instead.

## Build it

Open the **Sandbox**. It runs C with pthreads.

1. Paste the worked example and run it. Confirm `31`.
2. Change it to **four** threads, each summing a quarter of the array. Use an array of `Job`s and a loop for both the creates and the joins.
3. Remove the join loop and run it a few times. Describe what you see, and use the word *zombie* or the phrase *killed by `main` returning* to explain it.
