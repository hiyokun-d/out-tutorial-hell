---
id: "what-a-thread-is"
title: "What a Thread Is"
type: "THEORY"
xpReward: 15
module: "Threads"
---

# What a Thread Is

You already know a **process**: a running program with its own memory, its own open files and its own ID. The five-state model tracked one of those.

A process owns two separate things, and it's easy to miss that they are separate:

1. **Resources.** Memory holding the code, global variables and heap. Open files. Network sockets.
2. **Execution.** Where it is in the code right now: the program counter, the CPU register values, and a stack of function calls in progress.

A **thread** is the second one on its own: one path of execution. A process has at least one thread. It can have many, and they all share the first one.

## What threads share, and what they don't

| shared by every thread in the process | owned by each thread |
| --- | --- |
| code | program counter |
| global variables | CPU registers |
| heap (`malloc`'d memory) | stack (local variables, return addresses) |
| open files, sockets | thread state: running, ready, blocked |

The left column is the reason threads exist. Two threads can hand each other data by writing to the same variable, with no copying and no pipes. The left column also causes the bugs you'll meet two lessons from now. Two threads writing the same variable at the same time is how programs get corrupted.

## Why not use more processes?

You could split the work into several processes instead. It costs more:

- **Creating** a process copies or maps a whole address space. Creating a thread only needs a new stack and a register set.
- **Switching** between processes means switching address spaces, which throws away cached address translations. Switching between two threads of one process keeps the address space.
- **Sharing** between processes needs the OS: pipes, sockets, shared-memory calls. Threads already share memory.

## Worked example: a word processor

Picture one program doing three jobs at once:

- **Thread 1** reads your key presses and redraws the page.
- **Thread 2** checks spelling in the background.
- **Thread 3** saves a backup to disk every minute.

All three work on the same document in memory. When the backup thread waits for the disk, it's **blocked**. The typing thread keeps running, so the screen doesn't freeze while the file is written.

Try the one-thread version. Every minute, typing stops until the save finishes. That's the difference in one sentence: a thread lets one part of a program wait without making the rest wait.

## Android's main thread

Every Android app starts with one thread, the **main thread**, also called the UI thread. It draws the screen and delivers every tap. It also calls your lifecycle methods, like `onCreate` and `onResume`.

The rule: **never block the main thread.** No network calls, no big file reads, no long loops. If the main thread doesn't respond to input for about five seconds, Android shows **"App isn't responding"** (an **ANR**) and offers to close your app. Slow work goes on a background thread, and the result goes back to the main thread to be displayed. It's the word-processor example with a deadline.

## Not every "thread" is the same thing

A thread is a path of execution. That's all the word means here. Some systems also have **lightweight processes (LWPs)**. On Solaris, for example, an LWP is a kernel-scheduled carrier that user threads get *mapped onto*. That's a different thing from a thread, and the next lesson shows why the difference matters.

## Build it

Pick an app you use every day: a music player, a chat app or a browser. Write down:

1. Two jobs it must do **at the same time** that could each be a thread.
2. What those two threads **share** from the left column of the table.
3. Which one would freeze the app if it ran on the main thread, and why.

If your answer to 3 is "neither", pick jobs that wait on something: the network, the disk or a timer.
