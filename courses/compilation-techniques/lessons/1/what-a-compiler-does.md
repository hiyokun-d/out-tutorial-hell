---
id: "what-a-compiler-does"
title: "What a Compiler Actually Does"
type: "THEORY"
xpReward: 10
module: "Front End"
---

# What a Compiler Actually Does

A compiler is a program that reads text and writes a different program. That's the whole job. The text happens to be code, and the output happens to be something a machine can run.

It doesn't do this in one heroic leap. It runs a pipeline, and each stage hands a cleaner structure to the next.

## The four stages

**1. Lexical analysis — the lexer**
Reads raw characters and groups them into **tokens**. `count = count + 1;` becomes: identifier, equals, identifier, plus, number, semicolon. Whitespace and comments get thrown away here.

**2. Syntax analysis — the parser**
Takes the flat list of tokens and checks they're arranged legally. If they are, it builds a **parse tree** that shows the shape: this is an assignment, its right side is an addition. If they aren't, you get a syntax error.

**3. Semantic analysis**
The tree is grammatically fine, but does it *mean* anything? Is `count` declared? Are you adding a number to a function? Type errors and undefined names get caught here.

**4. Code generation**
Walks the checked tree and emits the target — machine code, bytecode, or even another language.

## Why the lexer comes first

The parser can't reason about `c`, `o`, `u`, `n`, `t` one character at a time. It needs to see "an identifier." Every stage after the lexer depends on tokens existing, so if tokenizing is wrong, everything downstream is wrong too.

And here's the useful part: most tokens follow simple patterns. "A letter, then any letters or digits." "One or more digits." That's exactly what **regular expressions** describe. So your first real step toward a compiler isn't a parser. It's a regex.

That's what you'll write next.

> **Draft.** Full notes pending.
