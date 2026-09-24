---
id: "thread-models"
title: "User Threads, Kernel Threads, and Both"
type: "INTERACTIVE"
xpReward: 25
module: "Threads"
widget: "ThreadModels"
---

# User Threads, Kernel Threads, and Both

A thread needs somebody to schedule it. There are two candidates: a library inside your process, or the kernel. Which one you pick decides what happens when a thread waits on the disk.

## Play first

Same scenario in all three tabs: four threads, two CPU cores. At tick 2, thread **T2** calls `read()` and waits four ticks for the disk.

Start on the first tab and press **Next**. Watch T1, T3 and T4 at tick 2. Then switch tabs and watch the same moment again.

```widget
{
  "title": "Same four threads, three thread models"
}
```

## What you just saw, named

### User-level threads (many-to-one)

A **thread library** inside your process creates the threads, keeps their stacks and switches between them. The kernel doesn't know any of this. It sees one process with one thread.

- **Fast:** a switch is an ordinary function call inside your process. There's no system call.
- **Portable:** it runs on a kernel that has no thread support at all.
- **Fatal flaw 1:** when any thread makes a **blocking system call**, the kernel blocks the only thread it knows about. That's the whole process. T1, T3 and T4 froze even though they had work to do.
- **Fatal flaw 2:** the kernel schedules one thread onto one core. The second core sat idle for the entire run.

### Kernel-level threads (one-to-one)

Every thread you create is a real kernel thread. The kernel schedules each one separately.

- A blocking call blocks **only that thread**. The others keep running.
- Threads run **in parallel** on several cores.
- **Cost:** creating or switching threads goes through the kernel, and each thread takes kernel memory. Ten threads is fine. Ten thousand gets expensive.

Linux, Windows and macOS all use this model today.

### Hybrid (many-to-many)

The library maps many user threads onto a smaller pool of kernel threads. In the widget, four user threads shared two kernel threads, K1 and K2. When K2 blocked, the library moved T4 onto K1 so it could keep running.

- You get cheap user-level switching most of the time, **and** a block no longer freezes everyone.
- It's hard to build: the library and the kernel have to keep telling each other what's going on. Most systems tried it and went back to one-to-one.

On Solaris, the kernel threads in this middle layer were called **lightweight processes (LWPs)**. An LWP is not the same thing as your thread. It's the kernel-scheduled carrier your threads get mapped onto. Keep the two words apart.

## Worked example: count the damage

Use the ULT tab. From tick 2 to tick 6, three threads are frozen: T1, T3, T4. That's **3 threads × 4 ticks = 12 thread-ticks** lost, with no fault on their part. On top of that, core 2 idled for all **10** ticks, because the kernel only ever had one thread to give it.

Same scenario, KLT tab: **0** frozen, **0** idle.

The widget prints both numbers under each tab. It's the same workload every time. Only the model changes.

## Which one would you pick?

- A game engine running thousands of tiny tasks that never make system calls: **user-level** switching is cheap, and nothing blocks.
- A web server where every request waits on the network or the disk: **kernel-level**, so one slow request doesn't stall the rest.
- Anything where you're unsure: kernel-level. It's the default for a reason.

## Build it

Answer from the widget, not from memory:

1. In the ULT tab, what is core 2 doing at tick 4, and why can't the OS give it work?
2. In the hybrid tab, which thread gets remapped, from which kernel thread to which, and at what tick?
3. Change the story: T2's `read()` takes 8 ticks instead of 4. Work out the frozen thread-ticks for ULT. Is KLT still 0?
