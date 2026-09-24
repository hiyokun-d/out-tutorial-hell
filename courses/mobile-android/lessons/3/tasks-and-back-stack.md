---
id: "tasks-and-back-stack"
title: "Tasks and the Back Stack"
type: "INTERACTIVE"
xpReward: 25
module: "Navigation"
widget: "ActivityStack"
---

# Tasks and the Back Stack

Last lesson followed one Activity through its lifecycle. Real apps have several screens, and the interesting bugs happen when control passes **between** them. Android decides which callbacks fire and in what order. It's not always the order you'd guess.

## Play first

You're in Activity **A**. Use the buttons:

1. Press **Start B**. Follow the right-hand timeline slowly. Find the moment **B.onResume** fires, then find **A.onStop**. Which comes first?
2. Press **Back**. Watch what happens to B, the object, not just the screen.
3. Tap **+1** a few times, then press **Rotate**. What happened to your count? Tick the save box and try again.
4. Press **Home**, then **Return to app**.

```widget
{
  "title": "Back stack and lifecycle"
}
```

## What you just saw, named

A **task** is the stack of Activities the user has moved through to do one job. The **back stack** is that stack. The top Activity is on screen.

- **Starting** an Activity **pushes** it onto the stack.
- **Back** **pops** the top Activity and **destroys** it. You can't come back to that object, only to a new one.
- **Home** sends the whole task to the background. Nothing is popped or destroyed. Return, and the same stack is there, top Activity included.

## The order that surprises everyone

When A starts B, the callbacks interleave:

```
A.onPause
B.onCreate
B.onStart
B.onResume
A.onStop        ← only now
```

A isn't stopped before B appears. It's **paused**, it stays **visible** while B builds and draws its first frame, and only then is it stopped. The widget shades that gap: *"A is still visible here."*

Two practical consequences:

- **`onPause` must be fast.** B can't come to the front until A's `onPause` returns. Slow work there makes every screen change feel slow.
- **Don't wait for `onStop` to save something B needs.** When B's `onCreate` runs, A hasn't reached `onStop` yet. Save in `onPause`, or better, keep shared data somewhere that isn't an Activity.

## Rotation destroys your Activity

Rotating the screen is a **configuration change**. By default, Android handles it by **destroying the Activity and creating a new one**:

```
A#1.onPause → A#1.onStop → A#1.onDestroy
A#2.onCreate → A#2.onStart → A#2.onResume
```

`A#2` is a different object. Anything stored only in `A#1`'s fields, like your tap count, is gone. It's the classic beginner bug: the form is empty after the phone turns sideways.

Two fixes:

- **`onSaveInstanceState(bundle)`**: write small values into a Bundle. You get it back in the new instance's `onCreate`.
- **A `ViewModel`**: an object Android keeps alive across the recreation, meant for screen state.

## Worked example: count the callbacks

From a fresh start (A only), the user does: Start B → Rotate → Back.

1. **Start B:** A.onPause, B.onCreate, B.onStart, B.onResume, A.onStop. That's 5.
2. **Rotate (B on top):** B#1 pause, stop, destroy, then B#2 create, start, resume. That's 6.
3. **Back:** B#2.onPause, A.onRestart, A.onStart, A.onResume, B#2.onStop, B#2.onDestroy. That's 6.

That's 17 callbacks, and **A was never recreated**. Rotation only rebuilt the Activity on screen. A was stopped in the background, so it went through `onRestart`, not `onCreate`.

## The main thread, and why ANR happens

Every one of those callbacks runs on the app's **main thread**, the same thread that draws the UI and handles touches. It handles one thing at a time. If your `onResume` downloads a file, nothing gets drawn and no tap gets handled until the download ends.

If the main thread doesn't respond to input for about **five seconds**, Android shows **"App isn't responding"** (**ANR**) and offers the user a button to close your app. The rule:

- **No network, no large file or database reads, no long loops on the main thread.**
- Do slow work on a background thread or in a coroutine, then post the result back to the main thread to update the screen.

## Build it

Predict first, then check with the widget:

1. From A only: Start B, Start C, Home, Return to app, Back. Write the full callback list for the **last** action.
2. Which Activities are `onStop`ped but still on the stack after step 1's "Start C"?
3. With the save box unticked, tap to 3, Rotate, tap twice, Rotate. What's the count? Now tick the box and repeat.
