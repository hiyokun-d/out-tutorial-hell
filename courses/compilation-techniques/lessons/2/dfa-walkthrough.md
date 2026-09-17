---
id: "dfa-walkthrough"
title: "Walking a DFA for (a|b)*abb"
type: "INTERACTIVE"
xpReward: 20
module: "Front End"
widget: "StateMachine"
---

# Walking a DFA for (a|b)*abb

A regex is a description. A lexer can't run a description. It turns the regex into a **DFA** — a deterministic finite automaton — and runs that instead.

A DFA is a handful of states and arrows. It reads your input one symbol at a time. For every symbol there is exactly one arrow to follow. When the input runs out, check where you landed: an **accepting state** (double circle) means match. Anything else means no match.

The pattern here is `(a|b)*abb`: any mix of `a` and `b`, as long as it ends in `abb`.

## States are memory

Each state remembers **how much of `abb` you've matched so far**. Nothing else.

- **0** — nothing useful yet
- **1** — the last symbol was `a`
- **2** — the input ends in `ab`
- **3** — the input ends in `abb`

## Try it

Load `aabb` and press **Step** until the input runs out. Then try `abab`, `abbb` and `babb`. Before each step, say out loud which state comes next. Then check.

```widget
{
  "title": "DFA for (a|b)*abb",
  "mode": "chars",
  "width": 360,
  "height": 230,
  "start": "0",
  "initialInput": "aabb",
  "acceptText": "Match — this string is in (a|b)*abb.",
  "rejectText": "No match.",
  "nodes": [
    { "id": "0", "label": "0", "x": 60, "y": 130, "note": "State 0 remembers nothing useful. A b here can't be the start of abb, so the machine stays put." },
    { "id": "1", "label": "1", "x": 150, "y": 130, "note": "State 1 remembers: the last symbol was a. That a might be the start of abb." },
    { "id": "2", "label": "2", "x": 235, "y": 130, "note": "State 2 remembers: the input ends in ab. One more b completes the pattern." },
    { "id": "3", "label": "3", "x": 318, "y": 130, "accept": true, "note": "State 3 remembers: the input ends in abb. If the input stops here, it matches." }
  ],
  "edges": [
    { "from": "0", "to": "0", "symbol": "b", "loop": "top" },
    { "from": "0", "to": "1", "symbol": "a" },
    { "from": "1", "to": "1", "symbol": "a", "loop": "top", "note": "Another a: stay in 1. This is not a failure. The newest a could be the real start of abb, so the machine keeps it and forgets the older one." },
    { "from": "1", "to": "2", "symbol": "b" },
    { "from": "2", "to": "1", "symbol": "a", "bend": -30, "note": "You had ab, then an a. The ab is dead, but this a could start a fresh abb — so back to 1, not 0." },
    { "from": "2", "to": "3", "symbol": "b" },
    { "from": "3", "to": "1", "symbol": "a", "bend": -70, "note": "A match, then an a. The match is gone, but this a could start the next abb. Back to 1." },
    { "from": "3", "to": "0", "symbol": "b", "bend": 110, "note": "abb then b: the input now ends in bb, which can't be the start of abb. Back to 0." }
  ]
}
```

## The one people get wrong

Look at the loop on state **1**. When you're in 1 and read another `a`, it feels like the pattern broke — you wanted a `b`. It didn't break. In `aabb`, the first `a` is junk and the second `a` is the real start. The DFA doesn't need to know which one will win. It stays in 1 and bets on the newest `a`.

## Build it

Write an input of at least six symbols that **ends in state 2**. Predict the path on paper, then load it and check. If you land somewhere else, step through again and find the arrow you guessed wrong.

> **Draft.** Full notes pending.
