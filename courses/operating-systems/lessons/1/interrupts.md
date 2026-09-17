---
id: "interrupts"
title: "Interrupts"
type: "THEORY"
xpReward: 15
module: "Foundations"
figure: "interrupt-cycle.svg"
---

# Interrupts

Your CPU does one boring thing forever: **fetch** the next instruction, **decode** it, **execute** it, repeat. Left alone, it would never notice a key press, a packet arriving, or a program stuck in an infinite loop.

Interrupts are how the outside world taps it on the shoulder.

## What happens on an interrupt

At the end of each instruction cycle, the CPU checks whether an interrupt signal is waiting. The diagram at the top of this lesson shows the full path. If a signal is waiting:

1. **Save state.** The program counter and registers get pushed somewhere safe, so the interrupted program can pick up exactly where it stopped.
2. **Look up the vector table.** Every interrupt has a number. The CPU uses it as an index into a table of addresses.
3. **Run the handler.** It jumps to that address — a short routine that deals with the event.
4. **Restore state.** Registers and program counter come back. The original program continues, never knowing it was paused.

## The four types

- **Program** — your code did something illegal: divide by zero, touch memory it doesn't own.
- **Timer** — a hardware clock fires at a fixed interval.
- **I/O** — a device finished a job or has data ready.
- **Hardware failure** — power dropping, memory parity error.

## When an interrupt interrupts a handler

Two strategies. **Disable interrupts** while a handler runs, so new ones wait in line — simple, but an urgent event can sit ignored. Or assign **priorities**: a higher-priority interrupt can preempt a lower-priority handler, which resumes afterwards.

## Why the timer matters most

Without a timer interrupt, a program only gives up the CPU when it chooses to. One greedy loop freezes everything. With a timer, the OS gets control back every few milliseconds no matter what — and can hand the CPU to someone else. That's **preemptive multitasking**. Every OS you use depends on it.

> **Draft.** Full notes pending.
