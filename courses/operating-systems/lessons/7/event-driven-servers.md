---
id: "event-driven-servers"
title: "Threads vs Event Loops: How Servers Wait"
type: "INTERACTIVE"
xpReward: 25
module: "Threads"
widget: "ServerArchitectures"
---

# Threads vs Event Loops: How Servers Wait

A server spends most of its life **waiting**: for a request to arrive, for the disk, for a database on another machine. How it organises that waiting decides how it holds up when a hundred requests arrive at once.

There are three classic designs. Each serves the same requests. Where they differ is what the CPU does while a request waits.

## Play first

One CPU core. A burst of requests arrives at the same moment. Each needs one unit of CPU work.

1. Drag **Requests in the burst** from 2 up to 8. Watch the red `switch` slices in the top track multiply.
2. Tick **Request 2 has to read from disk**. Watch the middle track.
3. Press **Prev** to replay the run tick by tick.

```widget
{
  "title": "One core, one burst, three servers"
}
```

## What you just saw, named

### Thread per request

Every request gets its own thread. The code reads top to bottom: read the request, query the database, send the reply. When a thread waits on I/O, it blocks, and the scheduler runs another one.

- **Good at:** simple code. A slow request only holds up itself.
- **Killed by:** overhead. Every switch between threads costs time: saving registers, running the scheduler, refilling caches that the other thread emptied. More threads competing means more switches and colder caches, so the cost of each switch grows too. Each thread also needs its own stack, often a megabyte or more. At 8 requests the widget spends a big part of the core on switching alone.

### Single-threaded loop, blocking calls

One thread takes requests one at a time and finishes each before starting the next.

- **Good at:** no switches, no locks, almost no memory. When nothing blocks, it's the fastest of the three.
- **Killed by:** one blocking call. When request 2 reads from disk, the only thread waits, and **every** other request waits behind it. The core sits idle the whole time. Tick the box and watch the red "stalled" span.

### Event loop + finite-state machines

Still one thread, but it never waits. When a request needs the disk, the server **starts** the read with a non-blocking call and moves on to the next request. When the data is ready, the OS puts an event in a queue. The loop picks it up and finishes that request later.

Each request is now a small **finite-state machine**: *parsing → waiting for disk → sending reply → done*. The server remembers which state every request is in.

- **Good at:** one thread that is never blocked. Stays flat under load, no locks.
- **Killed by:** difficulty. Code that used to read top to bottom is now split across callbacks and state variables that you keep track of yourself.

## Worked example: the numbers at 4 requests

With 4 requests, one of them reading from disk for 3 units:

- **Threads** finished at about 5.1. There's a little switching overhead, but the read didn't hold anyone up.
- **Single loop** finished at 7. It had 4 units of work, plus 3 stalled on the disk.
- **Event loop** finished at 5. It had 4 units of work, plus a short idle gap at the end waiting for the read to come back.

Drag the slider to 8 with the box still ticked. The loop is still stalled for 3 units, but threads fall behind even the loop: at that load, switching costs more than the stall does. Every design has a load where it stops being the right choice.

## This is Android's main thread too

An Android app's main thread is an event loop. It takes one event at a time — a tap, a redraw, a lifecycle callback — and handles each one to completion. So everything in the single-loop column applies to it. One blocking call on the main thread and every tap waits behind it. If that goes on for about five seconds, Android shows the **App isn't responding (ANR)** dialog. Slow work goes to a background thread, or to a non-blocking API that reports back through an event.

## Where you've met these

- Classic Apache with one process or thread per connection: **thread per request**.
- Node.js, nginx and Redis: **event loop**.
- A shell script that `curl`s five URLs one after another: **single blocking loop**.

## Build it

For each case, pick a design and give the one line from its verdict that decided it:

1. A chat server holding 50,000 mostly idle connections.
2. An internal tool with 3 users that runs slow reports.
3. A mobile app's main thread that has to fetch a profile picture.

Then set the widget to your own scenario for case 1 (maximum load) and check whether your pick finishes first.
