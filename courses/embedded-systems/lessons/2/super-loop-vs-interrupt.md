---
id: "super-loop-vs-interrupt"
title: "Super-Loop vs Interrupt: Who Sees the Button?"
type: "INTERACTIVE"
xpReward: 20
module: "Foundations"
widget: "Timeline"
---

# Super-Loop vs Interrupt: Who Sees the Button?

Last lesson said the super-loop is the right place to start and the first thing you'll replace. Here's why, over three seconds of real time.

Both programs run on the same chip, wired to the same button. They should turn on an LED when the button is pressed.

**Super-loop version:**

```c
while (1) {
    if (button_pressed()) led_on();
    delay(2000);   // blink timing
}
```

**Interrupt-driven version:**

```c
void on_button(void) {   // runs when the pin changes
    pressed = 1;
}

while (1) {
    if (pressed) { led_on(); pressed = 0; }
    do_other_work();
}
```

The first version **polls**: it checks the button only when the loop gets to that line. The second **listens**: the hardware calls `on_button` the moment the pin changes, whatever else is running.

## Watch both

Drag the slider or use **Prev** and **Next**. Keep an eye on the moment the button is pressed. Where is each program at that moment?

```widget
{
  "title": "Same button, two programs",
  "start": 0,
  "end": 3000,
  "unit": "ms",
  "ticks": [0, 1000, 2000, 3000],
  "tracks": [
    { "id": "button", "label": "Button" },
    { "id": "loop", "label": "Super-loop" },
    { "id": "irq", "label": "Interrupt-driven" }
  ],
  "spans": [
    { "track": "button", "from": 600, "to": 800, "label": "pressed", "tone": "accent" },
    { "track": "loop", "from": 100, "to": 2100, "label": "delay(2000)", "tone": "bad" },
    { "track": "loop", "from": 2200, "to": 3000, "label": "delay(2000)", "tone": "bad" },
    { "track": "irq", "from": 0, "to": 600, "label": "other work", "tone": "dim" },
    { "track": "irq", "from": 620, "to": 3000, "label": "other work", "tone": "dim" }
  ],
  "events": [
    { "track": "loop", "t": 0, "label": "reads button: up", "tone": "dim" },
    { "track": "irq", "t": 600, "label": "on_button() runs, LED on", "tone": "ok" },
    { "track": "loop", "t": 2100, "label": "reads button: up. The press is lost", "tone": "bad" }
  ],
  "stops": [
    { "t": 0, "caption": "Both programs start. The super-loop checks the button: not pressed." },
    { "t": 100, "caption": "The super-loop enters delay(2000). For the next two seconds it checks nothing." },
    { "t": 600, "caption": "The button goes down. The pin change fires on_button() right away, and the interrupt version turns the LED on.", "tone": "ok" },
    { "t": 800, "caption": "The button comes back up. The super-loop is still inside delay. It never looked.", "tone": "bad" },
    { "t": 2100, "caption": "The delay ends. The super-loop checks the button: up. As far as this program knows, nobody ever pressed anything.", "tone": "bad" },
    { "t": 3000, "caption": "Same chip, same button. One program reacted within milliseconds. The other lost the press completely. Blocking code doesn't just run slowly. It loses events." }
  ]
}
```

## Build it

Change one number in the super-loop so it can't miss a 200 ms press, and write down the cost. (Hint: how often does it check, and what else can that loop still do?) Then explain in two sentences why the interrupt version doesn't need that trade-off.

> **Draft.** Full notes pending.
