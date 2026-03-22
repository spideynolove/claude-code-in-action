# Lightpanda — Headless Browser Without the MCP Layer

## What It Is

Lightpanda is a headless browser written in **Zig** (~107MB binary) that executes JavaScript and renders pages — without Chrome, without Electron, without MCP overhead. It's a pure CLI tool.

```bash
~/.local/bin/lightpanda fetch --dump https://example.com > /tmp/out.html
```

That's it. No server, no WebSocket, no MCP config, no mcporter.

---

## The Debate: Does It Replace Playwright?

**Short answer:** No. Different jobs.

| | lightpanda | browser-mcp (CDP) | playwright (mcporter) |
|---|---|---|---|
| Architecture | Pure CLI | MCP → CDP → real browser | MCP → mcporter → headless Chromium |
| JS execution | ✅ Full | ✅ Full | ✅ Full |
| Click / interact | ❌ | ✅ | ✅ |
| Screenshots | ❌ | ✅ | ✅ |
| Logged-in sessions | ❌ | ✅ (your real browser) | ❌ |
| Cloudflare bypass | ✅ passes | ✅ (real browser) | ❌ blocked |
| MCP overhead in Claude Code | None | mcporter | mcporter |
| Memory | Minimal | Full Chromium | Full Chromium |
| Speed (cold start) | ~1–5s | instant (reuses tab) | 3–8s |
| Use case | Read content | Read + interact (logged in) | Read + interact (automation) |

---

## Real Benchmark Results (tested 2026-03-21)

| URL | Output size | Time | JS rendered? | Notes |
|-----|------------|------|-------------|-------|
| example.com | 529 B | 1.1s | n/a | trivial HTML |
| news.ycombinator.com | 34 KB | 1.5s | minimal | correct content |
| github.com/lightpanda-io/browser | 418 KB | 3.7s | ✅ | full page title |
| anthropic.com (React SPA) | 850 KB | 5.1s | ✅ | correct `<title>` |
| docs.anthropic.com (Mintlify) | 770 KB | ~3s | ✅ | 46 "Claude Code" matches |
| reddit.com (Cloudflare) | 667 KB | ~4s | ✅ | not blocked |

Key finding: lightpanda **does run JavaScript**. It rendered React SPAs, Mintlify docs, and GitHub — not just static HTML.

---

## When Claude Code Actually Needs This

Claude Code's built-in `WebFetch` tool does plain HTTP — no JS execution. For SPA-rendered content, `WebFetch` returns a near-empty shell.

```
Need to read a web page?
├── Static HTML / simple docs → WebFetch (zero overhead, built-in)
├── JS-rendered content, no login needed → lightpanda fetch --dump
└── Need to click / fill forms / screenshot / use logged-in session → playwright or browser-mcp
```

Lightpanda fills the gap between `WebFetch` (fast, no JS) and `playwright` (full automation, heavy).

---

## Commands

```bash
# Basic fetch — dump rendered HTML to stdout
~/.local/bin/lightpanda fetch --dump https://example.com

# Always save to /tmp — never let raw HTML flood Claude's context
~/.local/bin/lightpanda fetch --dump https://example.com > /tmp/out.html

# Check JS rendered correctly
grep -o '<title>[^<]*</title>' /tmp/out.html

# With verbose logging (useful for debugging failed fetches)
~/.local/bin/lightpanda fetch --dump --log_level info https://example.com

# Respect robots.txt
~/.local/bin/lightpanda fetch --dump --obey_robots https://example.com

# CDP server mode (Playwright can connect to it as a backend)
~/.local/bin/lightpanda serve --host 127.0.0.1 --port 9222
```

---

## CDP Server Mode — The Interesting Edge

Lightpanda exposes a Chrome DevTools Protocol endpoint. Playwright can connect to it:

```js
const browser = await chromium.connectOverCDP('ws://127.0.0.1:9222');
```

This lets you use Playwright's full API (click, type, screenshot) with lightpanda as the engine instead of Chromium. You get lower memory usage while keeping automation capability. This is its real long-term competitive position — not replacing Playwright's API, but replacing the Chromium runtime underneath it.

---

## Is It Hype?

For Claude Code's primary use pattern (read a web page, extract content): **no, it's well-suited**.

For replacing Playwright as a UI testing framework: **yes, partly hype** — it can't interact with pages, can't take screenshots, and has no equivalent of Playwright's Test runner.

The honest niche: **content fetching where `WebFetch` fails because of JavaScript** and you don't need interaction. That's a real gap, and lightpanda fills it cleanly without any infrastructure.

---

## Installation

No npm, no brew, no package manager — download the prebuilt binary directly:

```bash
mkdir -p ~/.local/bin
curl -L https://github.com/lightpanda-io/browser/releases/latest/download/lightpanda-x86_64-linux \
  -o ~/.local/bin/lightpanda
chmod +x ~/.local/bin/lightpanda
lightpanda --version
```

> **Platform note:** The above is for Linux x86_64 (the path used in this project). For other platforms check the [releases page](https://github.com/lightpanda-io/browser/releases).

Copy the skill to `~/.claude`:

```bash
mkdir -p ~/.claude/skills/lightpanda
cp .claude/skills/lightpanda/SKILL.md ~/.claude/skills/lightpanda/SKILL.md
```

No MCP config, no mcporter registration — the skill is the only Claude Code setup needed.

---

## Where It Lives

```
Binary:       ~/.local/bin/lightpanda
Skill:        ~/.claude/skills/lightpanda/SKILL.md
Source:       https://github.com/lightpanda-io/browser
Language:     Zig
```

No npm install, no MCP config, no mcporter registration. It just works.
