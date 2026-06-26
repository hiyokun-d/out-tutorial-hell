---
id: "dev-environment"
title: "Your Dev Environment"
type: "THEORY"
xpReward: 5
module: "Before You Code"
sandbox: false
---

# Your Dev Environment

Before you can write code, you need somewhere to write it. This is called your **development environment**. Setting it up now means you'll have everything ready by the time you start building real projects.

## Step 1: Download VS Code

VS Code (Visual Studio Code) is a free code editor made by Microsoft. It's used by beginners and senior engineers at top companies alike. It's what you'll write all your code in.

**Download it now:** [code.visualstudio.com](https://code.visualstudio.com)

Click the big blue download button. Install it like any other app.

When you open it, you'll see a dark editor window. That's your workspace. Everything you build will start here.

What VS Code gives you that a plain text editor doesn't:
- **Syntax highlighting** — different colours for different parts of code so it's easier to read
- **Auto-completion** — suggests what you're typing before you finish
- **Error underlining** — catches obvious mistakes as you type
- **Built-in terminal** — run commands without leaving the editor (press `` Ctrl+` `` or `` Cmd+` ``)
- **Extensions** — add features for any language or tool you use

## Step 2: Learn the terminal

The terminal (also called command line or shell) is a text interface to your computer. Instead of clicking icons, you type commands.

Why use it? Because programming tools — compilers, package managers, servers — are designed to run from the terminal. You'll use it every day.

**Open the terminal:**
- **macOS**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win`, type "Windows Terminal" or "PowerShell", press Enter
- **Linux**: Usually `Ctrl + Alt + T`

**The commands you need right now:**

```bash
pwd            # Where am I? (print working directory)
ls             # What's in here? (list files)
cd folder      # Go into a folder
cd ..          # Go up one level
mkdir name     # Create a new folder
```

Open the terminal and try `pwd`. It shows you the path to your current location. Then try `ls` to see what's there. These two commands answer "where am I and what's here?" — the two questions you'll ask constantly.

## Step 3: The browser console

Your browser is also a development tool. Press `F12` (or `Cmd+Option+I` on Mac) on any webpage to open the browser's developer tools.

The **Console** tab lets you run JavaScript directly. The **Elements** tab shows you the HTML of any page. You'll use both constantly when building websites.

## For this course

The C lessons in this course all run in the built-in sandbox — you don't need to install a C compiler or configure anything. Just write code, hit Run, see what happens.

When you get to **Web Development** (the next course), you'll set up a proper local project in VS Code and code files on your actual computer. That's when the setup you did here really kicks in.

For now: VS Code is installed, you know the basic terminal commands, you know how to open the browser console. That's everything you need to start.
