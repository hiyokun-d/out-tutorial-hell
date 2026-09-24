---
id: "direct-re-to-dfa"
title: "From Regex Straight to DFA (followpos)"
type: "INTERACTIVE"
xpReward: 25
module: "Front End"
widget: "FollowposBuilder"
---

# From Regex Straight to DFA

Last lesson you walked a DFA someone else built. Here you build one yourself, directly from a regular expression, with no NFA in between.

A lexer needs a DFA for every token pattern: identifiers, numbers, keywords. You write the pattern as a regex. Something has to turn it into a machine that reads one character at a time and never backtracks. This lesson shows the method.

## Play first

The widget starts with `(a|b)*abb`: any mix of `a`s and `b`s that ends in `abb`. Press **Next** and follow each stage. Don't try to memorise the rules yet. Watch three things:

1. The tree gets a `#` bolted on the end.
2. Every node gets three facts written next to it, from the bottom up.
3. Arcs appear under the leaves. Count how many arcs the `|` node adds.

At the end, test your DFA in the machine below the steps. Then type your own regex, like `a*b|b` or `(ab)*`, and press **Build**.

```widget
{
  "regex": "(a|b)*abb"
}
```

## What you just did, named

Each symbol in the regex is a **position**. In `(a|b)*abb#` there are six: `a`=1, `b`=2, `a`=3, `b`=4, `b`=5, `#`=6. A DFA state in this method is a **set of positions**: "the next character I read could be the one at any of these places in the pattern".

For every node in the tree you computed:

- **nullable** — can this piece match the empty string?
- **firstpos** — which positions can match the *first* character of a string matched by this piece?
- **lastpos** — which positions can match the *last* character?

Then one more fact per position:

- **followpos(i)** — the positions that can come straight after position `i`.

## The rules

Leaves are simple. A symbol at position `i` isn't nullable, and firstpos = lastpos = `{i}`.

| node | nullable | firstpos |
| --- | --- | --- |
| `A \| B` | either is nullable | firstpos(A) ∪ firstpos(B) |
| `A · B` | both are nullable | firstpos(A), plus firstpos(B) if A is nullable |
| `A*` | always | firstpos(A) |

lastpos mirrors firstpos. For `A · B`, it's lastpos(B), plus lastpos(A) if B is nullable.

Only **two** rules create followpos:

1. **Concatenation `A · B`**: every position in lastpos(A) is followed by every position in firstpos(B). B comes after A.
2. **Star `A*`**: every position in lastpos(A*) is followed by every position in firstpos(A*). One pass ends and the next begins.

`|` is not on the list. **Alternation adds no followpos.** `a|b` means *one or the other*. Nothing in `a` is ever followed by something in `b`. The widget draws the `|` node dashed and adds zero arcs. Pay attention to that step: including `|` edges is the most common mistake in this construction.

## Worked example: two states

The start state is firstpos(root). For `(a|b)*abb#` that's `{1,2,3}`. Call it **A**.

From A, read `a`. The positions in A that hold `a` are 1 and 3. Union their followpos:

- followpos(1) = `{1,2,3}`
- followpos(3) = `{4}`

`{1,2,3} ∪ {4}` = `{1,2,3,4}`. That's new, so it's state **B**.

From A, read `b`. Only position 2 holds `b`. followpos(2) = `{1,2,3}`, which is A itself. So the `b` arrow loops back to A.

Keep going until no new sets appear. Any set that contains 6, the `#` position, is accepting. For this regex that's `{1,2,3,6}`, reached right after reading `abb`.

## Why the `#`?

Without it, there's no position that means "matched the whole pattern", so you couldn't tell which sets are accepting. `#` gives the end of the pattern a position number, and followpos carries it into the right states.

## The other route: Thompson's construction

Some courses go regex → NFA → DFA instead. Thompson's construction builds an NFA piece by piece. For concatenation `RS` it keeps R and S as separate machines and joins R's accept state to S's start state with an **ε-move**:

```
→○──R──→○──ε──→○──S──→○
```

The subset construction then turns that NFA into a DFA. The direct method you just used skips the NFA. followpos records the same "what can come next" information without any ε-moves.

## Build it

1. Build `(ab)*`. Before you press Next, predict on paper how many DFA states you'll get. Check.
2. Build `a*b|b`. Find the step where the `|` node is processed and confirm it adds no arcs. Then explain in one sentence why `b` alone is still accepted.
3. Write a regex for "strings of `a`s and `b`s containing `aa`". Build it, then test `baab` (should accept) and `abab` (should reject). If either one fails, your regex is wrong. The construction isn't.
