---
id: "system-usability-scale"
title: "Scoring Usability: the System Usability Scale"
type: "INTERACTIVE"
xpReward: 25
module: "Usability"
widget: "SusCalculator"
---

# Scoring Usability: the System Usability Scale

Unit tests tell you whether the code does what you meant. They can't tell you whether a person can actually use it. For that you need people, and a way to turn their opinions into a number you can compare between versions.

The **System Usability Scale (SUS)** is the most widely used way to do that. It's ten statements, answered from 1 to 5, and it takes a user about two minutes after they've tried your product.

## Play first

Fill the form in as if you'd just used an app you dislike. Watch each answer's **contribution** change, and notice that answering 5 doesn't always add the most.

Then press **Straight-line the form (all 5s)**. Before you look at the score, predict it.

```widget
{
  "title": "Score a SUS form"
}
```

## What you just did, named

The ten items **alternate** between two kinds of wording:

- **Odd items (1, 3, 5, 7, 9) are positive**: *"I thought the system was easy to use."* Agreeing is good.
- **Even items (2, 4, 6, 8, 10) are negative**: *"I found the system very cumbersome to use."* Agreeing is bad.

So the two kinds are scored in opposite directions, and each item ends up worth 0 to 4:

- **Odd item:** contribution = answer − 1
- **Even item:** contribution = 5 − answer

Add the ten contributions for a raw total from 0 to 40, then **multiply by 2.5**:

> SUS score = (sum of the ten contributions) × 2.5

The ×2.5 applies to the whole total. If one item is left blank there is no SUS score. Scaling nine answers and guessing the tenth gives a number, but it isn't SUS.

## The score is not a percentage

A SUS score runs from 0 to 100, but **72 does not mean 72%** of anything. It isn't 72% satisfied or 72% usable. It's a position on a scale.

To read it, compare it with other products. Across hundreds of studies, the **average SUS score is about 68**. Above 68 is better than average, below it worse. Sauro and Lewis turned the spread into letter grades: roughly 80.8 or above is an A, 68 sits in the middle of the C range, and anything under about 51.7 is an F. The widget prints the grade next to the score.

## Why straight-lining gives 50

All 5s means five positive items contribute 4 each (20) and five negative items contribute 0 each. 20 × 2.5 = **50**, not 100.

That's the alternating wording working as intended. A person who agrees with everything without reading has said the system is easy to use *and* unnecessarily complex *and* cumbersome. Those answers cancel out. A 50 made of all-identical answers is a sign to check that respondent's form, and possibly discard it.

## Worked example

One user answers: `4, 2, 5, 1, 4, 2, 5, 2, 4, 1`

| item | answer | wording | contribution |
| --- | --- | --- | --- |
| 1 | 4 | positive | 4 − 1 = 3 |
| 2 | 2 | negative | 5 − 2 = 3 |
| 3 | 5 | positive | 4 |
| 4 | 1 | negative | 4 |
| 5 | 4 | positive | 3 |
| 6 | 2 | negative | 3 |
| 7 | 5 | positive | 4 |
| 8 | 2 | negative | 3 |
| 9 | 4 | positive | 3 |
| 10 | 1 | negative | 4 |

Sum = 34. 34 × 2.5 = **85**. Well above 68: an A+ on the Sauro–Lewis scale.

## Using it properly

- Give SUS **right after** the user finishes real tasks with the product, not before and not a week later.
- Keep the wording and the order. Rewording or reordering items breaks comparisons with the 68 benchmark.
- **Average the scores across users**, not the answers. Score each form first, then take the mean.
- Around **5–10 users** is enough to spot a bad product. Comparing two good versions reliably takes more.

## Build it

1. Enter the worked example in the widget and confirm 85.
2. Find answers that score exactly **68**. You're looking for a raw total of 27.2, which is impossible, so find the two scores closest to it, and explain why SUS scores always go in steps of 2.5.
3. A colleague reports "our app scored 60%, so 40% of users were unhappy". Write two sentences correcting both mistakes.
