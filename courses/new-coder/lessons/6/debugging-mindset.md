---
id: "debugging-mindset"
title: "Debugging mindset"
type: "THEORY"
xpReward: 15
module: "Control Flow"
---

# Debugging mindset

Debugging is the skill of finding out why the program you wrote is different from the program you meant to write.

A useful debugging loop is:

1. Read the error message.
2. Reproduce the problem.
3. Make one small change.
4. Run the code again.

Do not change five things at once. If the program starts working, you will not know which change fixed it.

## Read from top to bottom

Most beginner bugs are caused by code running in a different order than expected.

```javascript
let score = 0;
console.log(score);
score = score + 10;
```

This prints `0`, not `10`, because `console.log(score)` runs before the score changes.

## Say what you expect

Before running code, ask: what should each line do?

If reality differs from your expectation, you found the place to inspect.
