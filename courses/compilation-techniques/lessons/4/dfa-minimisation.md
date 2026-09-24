---
id: "dfa-minimisation"
title: "Shrinking a DFA: Minimisation"
type: "INTERACTIVE"
xpReward: 25
module: "Front End"
widget: "DfaMinimizer"
---

# Shrinking a DFA

The DFA you get from a construction method works, but it's often bigger than it needs to be. Two states can behave exactly the same on every possible input and still be separate states. A lexer built from that DFA carries a bigger table than it needs, and a hand-drawn diagram carries clutter.

Minimisation finds those duplicates and merges them. The result is the smallest DFA that accepts exactly the same strings. For any regular language there is only one smallest DFA, apart from the state names.

## Play first

The widget holds a five-state DFA for `(a|b)*abb`, the kind of result a construction method can give you. Press **Next** one round at a time and watch the **Blocks** board. When a block splits, the states that leave it slide into their new column. Their tint in the diagram changes to match.

Then press **Table** and step through again. It's the same computation drawn another way. On the last step you get the original and the minimised machine side by side. Feed both the same strings.

```widget
{
  "title": "Minimise by splitting"
}
```

## What you just did, named

Two states are **equivalent** if no input string can tell them apart. From either one, every string leads to accept in both cases or to reject in both cases. Equivalent states can be merged.

It's hard to prove two states are equivalent directly, because there are infinitely many strings to try. So the algorithm works the other way round. It starts by assuming everything is equivalent, then looks for evidence against each assumption. This is **partition refinement**:

1. **Round 0.** Split the states into two blocks: accepting and non-accepting. These can never merge, because the empty string already tells them apart.
2. **Each round.** For every state, write down which block it lands in on each symbol. States in the same block that land in *different* blocks get split.
3. **Stop** when a round splits nothing. That's the **fixed point**. Each remaining block becomes one state.

## Worked example

States A–E, accepting state E, alphabet `{a, b}`.

**Round 0:** `{A, B, C, D}` and `{E}`.

**Round 1:** check where `b` goes. A→C, B→D, C→C all stay in the big block. D→E lands in `{E}`. D behaves differently, so it splits off: `{A, B, C}`, `{D}`, `{E}`.

**Round 2:** on `b`, B→D, which is now a block of its own. A→C and C→C stay in `{A, B, C}`. B splits: `{A, C}`, `{B}`, `{D}`, `{E}`.

**Round 3:** A and C both go to B on `a` and to C on `b`. Every string gives them the same result. Nothing splits. Done: **5 states become 4**, with A and C merged.

## The table view

The table-filling algorithm computes the same thing pair by pair. Each cell is a pair of states. A cell gets marked in the round that first tells the pair apart:

- Round 0 marks every pair with one accepting state and one non-accepting state.
- Round *k* marks a pair when some symbol takes the two states to a pair that is already marked.

The cells still empty at the end are the equivalent pairs. They are exactly the pairs that share a block on the board. The two views are one algorithm drawn two ways. That's why the widget can switch between them at any round.

## Two things that trip people up

**Splitting is based on the *current* blocks, not the final ones.** In round 1, B→D looked fine, because D was still in the big block. B only split in round 2, after D had split off. That's why this takes several rounds instead of one.

**Remove unreachable states first.** A state you can never reach from the start doesn't change which strings are accepted, but it can survive in its own block. Delete unreachable states before you start splitting.

## Build it

On paper, minimise this DFA. States P, Q, R, S, start P, accepting S:

| state | on 0 | on 1 |
| --- | --- | --- |
| P | Q | R |
| Q | Q | S |
| R | Q | R |
| S | Q | R |

Write down the blocks after every round and stop at the fixed point. You should find that exactly two states merge. Name them, and give the string that tells apart the two states that split last.
