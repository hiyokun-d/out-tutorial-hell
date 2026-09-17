---
id: "activity-lifecycle"
title: "The Activity Lifecycle, One Callback at a Time"
type: "INTERACTIVE"
xpReward: 20
module: "Platform"
widget: "Stepper"
---

# The Activity Lifecycle, One Callback at a Time

An **Activity** is one screen of your app. Android — not your code — decides when it's created, shown, hidden and destroyed. On each change, the system calls a method on your Activity. Those methods are the **lifecycle callbacks**.

Get them wrong and you get the classic Android bugs: a video keeps playing after the user leaves, a form loses what was typed when the phone rotates, a GPS listener drains the battery overnight.

## Three lifetimes

- **Entire lifetime** — `onCreate()` to `onDestroy()`. The Activity exists.
- **Visible lifetime** — `onStart()` to `onStop()`. The user can see it.
- **Foreground lifetime** — `onResume()` to `onPause()`. The user can see it and interact with it.

They nest. Foreground sits inside visible, and visible sits inside entire.

## Kill risk

When memory runs low, Android kills processes. It kills the ones the user is least likely to miss first. The more of your Activity the user can see and touch, the safer it is.

Step through it. When you reach `onPause()` and `onStop()`, try the buttons that bring the user back.

```widget
{
  "title": "Activity lifecycle",
  "steps": [
    {
      "id": "oncreate",
      "title": "onCreate()",
      "tags": [
        { "label": "Lifetime", "value": "entire begins", "tone": "accent" },
        { "label": "Visible", "value": "no" },
        { "label": "Kill risk", "value": "high", "tone": "bad" }
      ],
      "body": "Called once per Activity instance. Inflate the layout, find your views, restore anything saved in `savedInstanceState`. **Don't start animations or sensors here.** The user can't see anything yet."
    },
    {
      "id": "onstart",
      "title": "onStart()",
      "tags": [
        { "label": "Lifetime", "value": "visible begins", "tone": "accent" },
        { "label": "Visible", "value": "yes" },
        { "label": "Kill risk", "value": "medium" }
      ],
      "body": "The screen is becoming visible. Start things the user should *see* updating, like UI refreshes."
    },
    {
      "id": "onresume",
      "title": "onResume()",
      "tags": [
        { "label": "Lifetime", "value": "foreground begins", "tone": "accent" },
        { "label": "Interactive", "value": "yes" },
        { "label": "Kill risk", "value": "low", "tone": "ok" }
      ],
      "body": "The Activity is on top and about to take input. Start the camera, sensors, and anything that needs the user's attention."
    },
    {
      "id": "resumed",
      "title": "RESUMED — running",
      "tags": [
        { "label": "Lifetimes", "value": "entire + visible + foreground", "tone": "accent" },
        { "label": "Kill risk", "value": "lowest", "tone": "ok" }
      ],
      "body": "No callback here. This is the state between callbacks, where the user actually uses your app. Android kills a resumed foreground Activity only as a last resort."
    },
    {
      "id": "onpause",
      "title": "onPause()",
      "tags": [
        { "label": "Lifetime", "value": "foreground ends", "tone": "accent" },
        { "label": "Visible", "value": "maybe, partly" },
        { "label": "Kill risk", "value": "low", "tone": "ok" }
      ],
      "body": "Something took focus: a dialog, a split-screen app, the notification shade. Stop the camera and sensors. **Keep it fast.** The next screen can't appear until `onPause()` returns.",
      "branches": [{ "label": "User comes back → onResume()", "to": "onresume" }]
    },
    {
      "id": "onstop",
      "title": "onStop()",
      "tags": [
        { "label": "Lifetime", "value": "visible ends", "tone": "accent" },
        { "label": "Visible", "value": "no" },
        { "label": "Kill risk", "value": "high", "tone": "bad" }
      ],
      "body": "Fully hidden: the user went home or opened another app. Save work and release anything heavy. From here your process can be killed **without another callback**, so don't count on `onDestroy()` running.",
      "branches": [{ "label": "User returns → onRestart()", "to": "onrestart" }]
    },
    {
      "id": "ondestroy",
      "title": "onDestroy()",
      "tags": [
        { "label": "Lifetime", "value": "entire ends", "tone": "accent" },
        { "label": "Kill risk", "value": "highest — it's gone", "tone": "bad" }
      ],
      "body": "The Activity is finishing, or the system is recreating it (screen rotation does this). Final cleanup. A process kill after `onStop()` can skip this entirely.",
      "next": false
    },
    {
      "id": "onrestart",
      "title": "onRestart()",
      "tags": [
        { "label": "Lifetime", "value": "entire continues", "tone": "accent" },
        { "label": "Visible", "value": "about to be" },
        { "label": "Kill risk", "value": "high → dropping" }
      ],
      "body": "Only called when a **stopped** Activity comes back. The instance was never destroyed, so `onCreate()` doesn't run again. Next comes `onStart()`, and the cycle continues from there.",
      "next": "onstart"
    }
  ]
}
```

## Build it

A music-practice app plays a metronome click. For each of these, write which callback starts it and which stops it: the click sound, a microphone listener, and saving the current tempo. Then check each answer: does it stop when the user pulls down the notification shade, and when they go home?

> **Draft.** Full notes pending.
