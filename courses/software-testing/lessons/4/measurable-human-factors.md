---
id: "measurable-human-factors"
title: "Five Things You Can Measure About Usability"
type: "THEORY"
xpReward: 15
module: "Usability"
---

# Five Things You Can Measure About Usability

"Users found it confusing" isn't a test result. You can't write it into a bug report, compare it with last month, or tell whether your fix worked. To test usability the way you test code, you need numbers.

Usability breaks down into five factors, and each one can be measured. SUS, from the last lesson, is one way to measure the fifth.

## 1. Time to learn

**How long until a new user can do a typical task?**

Measure it: give first-time users a task list and a stopwatch. Time each task. Or count how many attempts it takes before a user completes the task without help.

A photo app where new users need 20 minutes to find the crop tool has a learning problem, however fast experts are.

## 2. Speed of performance

**Once they've learned it, how fast can they get things done?**

Measure it: time *experienced* users on benchmark tasks. Count clicks, taps or keystrokes per task.

This often pulls against time to learn. Keyboard shortcuts and dense screens make experts fast and newcomers lost. Decide which users you're designing for.

## 3. Rate of errors

**How many mistakes do users make, and how bad are they?**

Measure it: count errors per task. Classify each one by severity: fixed at once, needed help, or lost data. Don't only count; also note *where* people go wrong, because the same error in the same place points to the design, not the person.

A banking app where 1 in 10 users sends money to the wrong account has a severe error rate, even if the average task time looks great.

## 4. Retention over time

**Do users still remember how, after a break?**

Measure it: bring the same users back after a week or a month with no practice. Re-run the tasks and compare time and errors with their first session.

This matters most for things people use rarely: tax software, the router admin page, a yearly report.

## 5. Subjective satisfaction

**Did they like using it?**

Measure it: a standard questionnaire after the tasks. **SUS** is the usual one. Satisfaction is the only factor here that asks for an opinion. The other four you observe.

It still counts. Users abandon software they dislike, even when the numbers say they can use it.

## Worked example: turning a complaint into a test

Complaint: *"The new checkout is confusing."*

Split it into factors, and write a pass/fail target for each:

| factor | test | target |
| --- | --- | --- |
| time to learn | 8 first-time users complete a purchase | median under 3 min |
| speed | repeat users complete a purchase | median under 60 s |
| errors | count wrong-address and wrong-quantity orders | fewer than 1 in 20 |
| retention | same 8 users, one week later | no slower than session 1 |
| satisfaction | SUS after session 1 | above 68 |

Run it on the old checkout and the new one. Now "confusing" has become five numbers. Each one can improve or get worse, and you can tell which.

## Trade-offs are the point

You can't maximise all five. Common tensions:

- **Learnability vs speed:** guided wizards help beginners and slow down experts.
- **Speed vs errors:** removing confirmation dialogs speeds people up and lets more mistakes through.
- **Satisfaction vs everything:** users sometimes prefer the design they measurably perform worse on, because it *feels* faster.

Deciding which factor matters most for **your** users is a design decision. Measuring all five is how you find out what that decision cost.

## Build it

Pick an app you use and one task in it, for example "send a photo to a friend". Write a five-row table like the one above:

1. One concrete test per factor.
2. A numeric target for each.
3. Mark which **two** factors you'd sacrifice first if they conflicted, and say why in one line each.

If a target can't be checked with a stopwatch, a counter or a questionnaire, rewrite it until it can.
