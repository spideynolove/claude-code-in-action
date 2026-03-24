---
name: xia-claude-code-cookbook-token-efficiency
source: https://github.com/wasabeef/claude-code-cookbook
extracted: 2026-03-25
---

# Token Efficiency Mode — Xỉa from claude-code-cookbook

**Source**: wasabeef/claude-code-cookbook (local: 00-materials/claude-code-cookbook)
**Extracted**: 2026-03-25
**Gap filled**: A covered context compression at the tool-output level (18-context-engineering) but had no prompt-level protocol for compressing Claude's prose response style during long sessions.

## What this is

A symbol + abbreviation compression protocol that instructs Claude to compress its explanation style by 30–50% without changing code quality. Three compression levels (--uc/--mc/--lc), domain flags (--dev/--ops/--sec), a fixed symbol vocabulary, and an abbreviation table.

## Why it fills A's gap

Skills 18–22 teach context engineering at the observation/tool-output level. Token Efficiency Mode fills the complementary gap: response-style compression. Together they cover both sides of context management.

## The pattern

Activation phrase → Claude switches to symbol+abbreviation mode for all prose.
Symbol vocab: →⇒←⇄»∴∵ for logic; ✅❌⚠️🔄⏳🚨 for status; domain icons for technical domains.
Abbrev table: cfg/impl/arch/perf/ops/env/req/deps/val/auth/sec/err/opt/sev.

## How to apply here

Installed as `24-token-efficiency/SKILL.md`. Users invoke it by telling Claude "Token Efficiency Mode on" or "--uc mode" at the start of a long session.

## Original context

B used it as a slash command (`/token-efficient`) within a plugin. A adapts it as a SKILL.md reference that Claude loads when the skill is triggered by the description match.
