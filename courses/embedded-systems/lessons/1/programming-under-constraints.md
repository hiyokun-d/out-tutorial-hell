---
id: "programming-under-constraints"
title: "Programming Under Constraints"
type: "THEORY"
xpReward: 15
module: "Foundations"
---

# Programming Under Constraints

Everything you've written so far ran on a machine with an operating system, gigabytes of memory, and a screen to print errors on. Embedded code gets none of that.

## What you lose

**No OS.** Nobody loads your program, schedules it, or cleans up after it. Your code *is* the only thing running.

**Tiny, fixed RAM.** A few kilobytes is normal. There's no swap and no "just allocate more." Run out and the chip misbehaves — silently.

**No visibility.** No console, no stack trace. When it breaks, you find out because an LED didn't blink. You'll debug with blinking pins, a serial port, or a hardware debugger.

**It must not stop.** A thermostat can't exit. If `main` returns, there's nothing to return *to*.

## Cross-compilation

You don't compile on the chip — it's far too small. You compile on your laptop with a **cross-compiler** that produces machine code for a different CPU, then flash that binary onto the device.

## The super-loop

The simplest structure that meets all of that:

```c
int main(void) {
    setup_hardware();

    while (1) {
        read_sensors();
        update_state();
        drive_outputs();
    }
}
```

Set things up once, then loop forever doing the same three jobs. No threads, no scheduler, nothing hidden. You can reason about every line.

This is the right place to start. It's also the first thing you'll replace. The loop can only notice a button press when it happens to reach `read_sensors()` — if something else is slow, events get missed. Once you learn interrupts, the hardware will tell you when something happens instead of you checking over and over.

> **Draft.** Full notes pending.
