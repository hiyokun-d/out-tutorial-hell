---
id: "dev-environment"
title: "Your Dev Environment"
type: "THEORY"
xpReward: 5
module: "Before You Code"
sandbox: false
---

# Your Dev Environment

Before you can write code, you need somewhere to write it and a way to run it. This is called your **development environment**.

## The editor: VS Code

VS Code (Visual Studio Code) is a free text editor made by Microsoft. It's not the only option, but it's the most popular among beginners and professionals alike.

Download it at [code.visualstudio.com](https://code.visualstudio.com).

It's a text editor — like Notepad, but with features that make coding easier:
- Syntax highlighting (different colours for different parts of code)
- Auto-completion (suggests what you might be typing)
- Error underlining (catches common mistakes as you type)
- Built-in terminal (run commands without leaving the editor)

## The terminal

The terminal (also called command line or shell) is a text interface to your computer. Instead of clicking icons, you type commands.

Why use it? Because most programming tools — compilers, package managers, servers — are designed to be run from the terminal. Clicking isn't expressive enough; typing commands is.

**Open the terminal:**
- macOS: `Cmd + Space`, type "Terminal"
- Windows: Start menu → "Windows Terminal" or "PowerShell"
- Linux: Usually `Ctrl + Alt + T`

**Essential commands:**

```bash
pwd        # Print working directory — where am I?
ls         # List files in current directory
cd folder  # Change directory — move into a folder
cd ..      # Go up one level
mkdir name # Make a new directory
```

Practice these. You'll use them every day.

## The browser console

For JavaScript and HTML, you already have an environment: your browser.

Open it with `F12` (or right-click → Inspect → Console tab). You can run JavaScript here directly and see HTML/CSS instantly in the browser.

## What you'll need for this course

For the **C lessons**: The sandbox in this app will compile and run your C code — you don't need to set up a C compiler right now. (When you're ready to go further, you'll want `gcc` — it comes with Xcode on Mac or MinGW on Windows.)

For the **JavaScript lessons**: The sandbox runs it in the browser — no setup needed.

For the **HTML/CSS lessons**: The sandbox renders it live — no setup needed.

Your real-world setup will come naturally as you progress. For now, the goal is learning the concepts. The tools follow.
