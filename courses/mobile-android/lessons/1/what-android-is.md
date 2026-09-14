---
id: "what-android-is"
title: "What Android Actually Is"
type: "THEORY"
xpReward: 10
module: "Platform"
---

# What Android Actually Is

Android isn't one thing. It's a stack of layers, and your app sits on top of all of them. Know the layers and the weird parts of Android development start making sense.

## The four layers, bottom up

**1. Linux kernel**
The foundation. It talks to the hardware — CPU, memory, camera, Wi-Fi, battery — and handles processes, security, and drivers. Every app runs as its own isolated Linux process with its own user ID.

**2. Native libraries + Android Runtime (ART)**
Low-level libraries written in C and C++ handle graphics, media, databases, and web rendering. Next to them sits **ART**, which runs your app's compiled code. Each app gets its own runtime instance.

**3. Application framework**
The APIs you'll actually call. Activities, notifications, permissions, location, the view system. When you "write an Android app," this is mostly what you're writing against.

**4. System apps**
Phone, Contacts, Settings, the launcher. They use the same framework you do — no special back door.

## Why Kotlin replaced Java

Android started with Java. Google now recommends Kotlin first. Here's why:

- **Null safety.** In Java, any object can be `null` and crash your app at runtime. Kotlin makes you say which values may be null, and the compiler forces you to handle them.
- **Less ceremony.** A data class that takes 50 lines of Java getters and setters is one line of Kotlin.
- **Java interop.** Kotlin calls Java code and Java calls Kotlin. Every existing Android library still works. Nobody had to rewrite anything.
- **Coroutines.** Network calls and database reads can't block the screen. Coroutines let you write that async code top to bottom, like normal code, without callback pyramids.

You're not learning Kotlin because it's trendy. You're learning it because it removes whole categories of bugs.

> **Draft.** Full notes pending.
