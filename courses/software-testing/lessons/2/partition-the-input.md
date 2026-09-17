---
id: "partition-the-input"
title: "Partition the Input, Then Test the Edges"
type: "INTERACTIVE"
xpReward: 20
module: "Principles"
widget: "Stepper"
---

# Partition the Input, Then Test the Edges

You can't test every input. So you need a rule for picking a few that stand in for all the rest. Here are two rules, and why you need both.

**Equivalence partitioning (EP)** splits the inputs into groups the code should treat the same way. Then you test one value from each group. If `18` works, `19` probably does too.

**Boundary value analysis (BVA)** tests where the groups meet: the edge value, one below it, and one above it. That's where programmers type `>` when they meant `>=`.

## The field

A sign-up form takes an age. Valid ages are **12 to 24, inclusive**. Everything else gets rejected.

Step through it. On the step that runs the tests against buggy code, stop and decide whether you'd have caught the bug before you press Next.

```widget
{
  "title": "Age field: valid 12–24",
  "steps": [
    {
      "title": "The rule",
      "body": "Accept an age from **12 to 24**. Both ends count: 12 is valid and 24 is valid.\n\nBefore you pick any test values, find the groups of inputs the code should treat the same way."
    },
    {
      "title": "Find the partitions",
      "tags": [
        { "label": "below", "value": "< 12 invalid", "tone": "bad" },
        { "label": "inside", "value": "12–24 valid", "tone": "ok" },
        { "label": "above", "value": "> 24 invalid", "tone": "bad" }
      ],
      "body": "Three groups. Every age falls into exactly one of them, and the code should give the same answer for every value inside a group."
    },
    {
      "title": "EP: one value per partition",
      "body": "Pick a value from the middle of each group.",
      "cellsTitle": "Planned tests",
      "cells": [
        { "label": "Test A", "value": "10", "note": "expect reject" },
        { "label": "Test B", "value": "18", "note": "expect accept" },
        { "label": "Test C", "value": "27", "note": "expect reject" }
      ]
    },
    {
      "title": "Run EP against buggy code",
      "body": "Here's the code under test:\n\n`if (age > 12 && age <= 24) accept();`\n\nThe first comparison should be `>=`. Run the three EP tests.",
      "cellsTitle": "What the code actually did",
      "cells": [
        { "label": "Test A", "value": "10", "note": "rejected ✓" },
        { "label": "Test B", "value": "18", "note": "accepted ✓" },
        { "label": "Test C", "value": "27", "note": "rejected ✓" }
      ],
      "callout": "Three for three. The bug is still there. A 12-year-old gets rejected, and EP never tried 12. It never tried 24 either. Those are the two values most likely to be coded with > instead of >=.",
      "calloutTone": "bad"
    },
    {
      "title": "BVA: test each edge",
      "body": "For each boundary, test the edge itself, one below, and one above.",
      "cellsTitle": "Planned tests",
      "cells": [
        { "label": "11", "value": "reject" },
        { "label": "12", "value": "accept" },
        { "label": "13", "value": "accept" },
        { "label": "23", "value": "accept" },
        { "label": "24", "value": "accept" },
        { "label": "25", "value": "reject" }
      ]
    },
    {
      "title": "Run BVA against the same code",
      "body": "Same code: `age > 12 && age <= 24`.",
      "cellsTitle": "What the code actually did (highlighted = differs from the plan)",
      "cells": [
        { "label": "11", "value": "reject", "note": "✓" },
        { "label": "12", "value": "reject", "note": "✗ expected accept" },
        { "label": "13", "value": "accept", "note": "✓" },
        { "label": "23", "value": "accept", "note": "✓" },
        { "label": "24", "value": "accept", "note": "✓" },
        { "label": "25", "value": "reject", "note": "✓" }
      ],
      "callout": "Test 12 fails. Found it: > where the code needed >=.",
      "calloutTone": "ok"
    },
    {
      "title": "Why you need both",
      "body": "EP tells you **which groups exist**. Without it you don't know where the edges are. BVA tests **where the groups meet**, and that's where off-by-one bugs live.\n\nEP alone passed buggy code. BVA alone works here, but only because EP found the edges first. Do EP to find the edges, then BVA to test them."
    }
  ]
}
```

## Build it

A discount applies to orders of **$50 to $200, inclusive**. On paper, write the partitions, your three EP values, and your six BVA values. Then write one buggy `if` that your EP tests would pass and one of your BVA tests would catch.

> **Draft.** Full notes pending.
