---
id: "debugging-embedded"
title: "Debugging When There's No Screen"
type: "THEORY"
xpReward: 20
module: "Working with Hardware"
---

# Debugging When There's No Screen

On a laptop, when something breaks you print a value or open a debugger. On a microcontroller there's no terminal and no screen, and sometimes the bug only happens at full speed. Embedded debugging comes down to finding a way to see inside the chip without changing the behaviour you're trying to see.

The tools, from cheapest to most powerful:

## 1. Blink an LED or toggle a pin

The oldest tool. Turn a pin on when the code reaches a point, and off when it leaves.

- Costs almost nothing: one register write, a few nanoseconds.
- With an **oscilloscope** or **logic analyser** on that pin, you can measure exactly *how long* something takes and *how often* it happens. Toggle a pin on entry and exit of an interrupt handler, and the scope shows its duration.

It's the most honest timing tool you have, because it barely changes the timing it measures.

## 2. Print over a serial port (UART)

Send text out of a serial pin to your computer.

```c
printf("adc=%u state=%d\r\n", adc_value, state);
```

It's easy and readable, but **printing is slow**. At 115200 baud, a 20-character line takes about 1.7 ms. Inside a fast loop or an interrupt handler, that delay can hide a timing bug or cause a new one. If the bug disappears when you add prints, suspect timing.

Never `printf` inside an interrupt handler. Set a flag or copy the value, and print it from the main loop.

## 3. A hardware debugger (JTAG / SWD)

A small probe connects your computer to the chip's debug port. With it you can:

- **Breakpoints**: halt the CPU at a line and inspect every variable and register.
- **Step** through code line by line.
- **Watchpoints**: halt when a *memory address* is written. This is how you catch "who is overwriting this variable?"
- **Read peripheral registers** live, to see whether that pin really is configured as an output.

The catch is that halting the CPU doesn't halt the world. A motor keeps spinning, a timer keeps counting, and a communication partner times out. Breakpoints are for logic bugs, not timing bugs.

## 4. The watchdog and the fault handler

A **watchdog timer** resets the chip if your code stops "petting" it, which catches infinite loops in the field. When a board keeps rebooting, check whether the watchdog is the cause. Many chips have a status register that records the reason for the last reset.

A **hard fault** is the CPU refusing to continue: a bad memory access, or a divide by zero on some cores. Put a breakpoint in the fault handler. The saved registers tell you the instruction that failed.

## Worked example: the loop that never sees the button

```c
int pressed = 0;

void button_isr(void) {     // runs when the button interrupt fires
    pressed = 1;
}

int main(void) {
    setup_button_interrupt();
    while (!pressed) { }    // wait for the button
    led_on();
}
```

Symptom: you press the button, the interrupt fires (toggle a pin in it and the scope proves it), and the LED never lights.

Diagnosis: with optimisation on, the compiler sees that nothing inside `while (!pressed)` changes `pressed`. It reads the variable **once**, keeps it in a register and loops forever on that copy. The compiler doesn't know the interrupt handler writes it.

Fix: tell the compiler the value can change outside the normal flow of code:

```c
volatile int pressed = 0;
```

`volatile` forces a fresh read from memory every time. **Any variable shared between an interrupt handler and the main code needs it.**

How you'd find it: the pin toggle proves the handler runs. Then pause the debugger in the loop, look at the disassembly, and see that there's no load instruction inside the loop.

## A method, not a bag of tricks

1. **Reproduce** it reliably. A bug you can't trigger, you can't confirm fixed.
2. **Pick the tool by the bug.** Timing bug: pin toggles and a scope. Logic bug: breakpoints. Memory corruption: watchpoints.
3. **Change one thing, then observe.**
4. When "impossible" things happen, read the chip's **errata**.

## Build it

This code is meant to count button presses. The count sometimes jumps by 2 per press, and sometimes stays at 0 forever:

```c
int presses = 0;
void button_isr(void) { presses++; }
int main(void) {
    setup_button_interrupt();
    while (presses < 3) { }
    led_on();
}
```

1. Find the bug that makes it stay at 0 forever, and fix it.
2. The jump-by-2 is a hardware effect, not a code bug. Name it. Hint: a mechanical switch doesn't close cleanly.
3. Which tool from this lesson would you use to *prove* your answer to 2, and what would you expect to see?
