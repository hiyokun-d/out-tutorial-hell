---
id: "five-state-model"
title: "The Five-State Process Model"
type: "INTERACTIVE"
xpReward: 20
module: "Foundations"
widget: "StateMachine"
---

# The Five-State Process Model

Your laptop has hundreds of processes and a few CPU cores. Most processes are not running most of the time. The OS tracks where each one stands using a small set of states.

## The five states

- **New** — being created. Not allowed to run yet.
- **Ready** — could run right now. Waiting for a turn on the CPU.
- **Running** — on the CPU.
- **Blocked** — waiting for something outside the CPU: a disk read, a key press, a network packet.
- **Exit** — finished. The OS is cleaning up.

## The difference that matters

**Ready means willing and able.** Give it the CPU and it gets work done.

**Blocked means waiting on the world.** Give it the CPU and it has nothing to do. It can't continue until its event arrives.

Two transitions take a process off the CPU, and they are not the same:

- **Timeout** — the timer interrupt fires and the OS takes the CPU back. The process still has work, so it goes to **Ready**. Still runnable.
- **Event wait** — the process asked for something slow. It goes to **Blocked**. Not runnable until the event occurs.

## Try it

Press **Step** to walk the loaded sequence, or fire events with the buttons. Then try the moves that feel reasonable but aren't: dispatch a Blocked process, or time out a Ready one. The widget tells you why each one is impossible.

```widget
{
  "title": "Process states",
  "mode": "events",
  "width": 360,
  "height": 240,
  "start": "new",
  "initialInput": "admit dispatch timeout dispatch wait occurs dispatch release",
  "events": [
    { "id": "admit", "label": "admit" },
    { "id": "dispatch", "label": "dispatch" },
    { "id": "timeout", "label": "timeout" },
    { "id": "wait", "label": "event wait" },
    { "id": "occurs", "label": "event occurs" },
    { "id": "release", "label": "release" }
  ],
  "nodes": [
    { "id": "new", "label": "New", "x": 70, "y": 40, "note": "New: the OS is setting the process up — memory, a process ID, a control block. It can't run yet." },
    { "id": "ready", "label": "Ready", "x": 95, "y": 125, "note": "Ready: willing and able. It has everything it needs except the CPU." },
    { "id": "running", "label": "Running", "x": 265, "y": 125, "note": "Running: on the CPU right now. On one core, only one process can be here at a time." },
    { "id": "blocked", "label": "Blocked", "x": 180, "y": 205, "note": "Blocked: waiting on the world. Even an idle CPU can't help it until its event occurs." },
    { "id": "exit", "label": "Exit", "x": 305, "y": 40, "note": "Exit: finished or killed. The OS keeps its exit status briefly, then frees everything." }
  ],
  "edges": [
    { "from": "new", "to": "ready", "symbol": "admit" },
    { "from": "ready", "to": "running", "symbol": "dispatch", "bend": -22, "note": "Dispatch: the scheduler picked this process and handed it the CPU." },
    { "from": "running", "to": "ready", "symbol": "timeout", "bend": -22, "note": "Timeout: the timer interrupt fired and the OS took the CPU back. The process still wants to run, so it goes to Ready. Still runnable." },
    { "from": "running", "to": "blocked", "symbol": "wait", "label": "wait", "note": "Event wait: the process asked for something slow, like reading a file. It gives up the CPU and can't run until the answer comes back." },
    { "from": "blocked", "to": "ready", "symbol": "occurs", "label": "occurs", "note": "Event occurs: the data arrived. The process goes to Ready, not straight to Running. It still has to wait its turn." },
    { "from": "running", "to": "exit", "symbol": "release", "note": "Release: the process finished, or was killed." }
  ],
  "stuck": {
    "new:dispatch": "A New process hasn't been admitted. The OS won't schedule something it hasn't finished setting up. Admit it first.",
    "ready:timeout": "Timeout only happens to the process holding the CPU. Ready means waiting for a turn, not using one.",
    "ready:wait": "Only a Running process can ask for I/O and block. A Ready process isn't executing, so it can't ask for anything.",
    "ready:occurs": "A Ready process isn't waiting on an event. It's waiting on the CPU.",
    "blocked:dispatch": "Blocked means waiting on the world. Handing it the CPU is pointless: it has nothing to do until its event occurs.",
    "blocked:timeout": "A Blocked process isn't on the CPU, so there's no time slice to run out.",
    "running:occurs": "Event occurs only moves a Blocked process. This one is running. It isn't waiting on anything.",
    "running:dispatch": "It's already on the CPU. Dispatch picks a Ready process."
  }
}
```

## Build it

Write a sequence that visits **Blocked twice** and ends in **Exit**. Type it into the box, load it, and step through. If the widget stops you, read the reason, fix that one event, and run it again.

> **Draft.** Full notes pending.
