# Browser Automation — dev-browser

Replaced the custom MCP server with [dev-browser](https://github.com/SawyerHood/dev-browser) — a sandboxed JavaScript CLI for browser automation. Runs faster, costs less, and doesn't hallucinate CSS selectors.

---

## Why the Switch

| | Old browser-mcp | dev-browser |
|---|---|---|
| Transport | MCP over stdio | Bash CLI |
| Execution | Claude guesses selectors via JSON tools | Claude writes real JS in QuickJS sandbox |
| Error mode | Wrong element clicked silently | Explicit JS error with stack trace |
| Speed | 4m31s avg | 3m53s avg |
| Token cost | Higher (tool call overhead) | ~40% lower |
| Setup | CDP + MCP server + node_modules | `npm install -g dev-browser` |

---

## Setup

```bash
# 1. Install (one time)
npm install -g dev-browser
dev-browser install   # installs Playwright + Chromium

# 2. For real-browser mode: launch Chrome with CDP
chromium --remote-debugging-port=9222 --user-data-dir=$HOME/snap/chromium/current
```

---

## Usage

Claude calls `dev-browser` directly via Bash. See `CLAUDE.md` for the full API.

```bash
# Navigate and extract text
dev-browser --connect <<'EOF'
const page = await browser.getPage("main");
await page.goto("https://example.com");
const snap = await page.snapshotForAI();
console.log(snap.full);
EOF

# Fill a form and submit
dev-browser --connect <<'EOF'
const page = await browser.getPage("main");
await page.fill("input[name=q]", "claude code");
await page.press("input[name=q]", "Enter");
await page.waitForSelector(".results");
console.log(await page.textContent("h1"));
EOF
```

---

## Permissions

Add to `.claude/settings.json` to avoid approval prompts:

```json
{
  "permissions": {
    "allow": ["Bash(dev-browser *)"]
  }
}
```

---

## Installation Note (Ubuntu 22.04 / glibc < 2.39)

The default binary requires glibc 2.39. Fix by using the musl variant:

```bash
VERSION=0.2.3
BIN_DIR=$(npm root -g)/dev-browser/bin

curl -L "https://github.com/SawyerHood/dev-browser/releases/download/v${VERSION}/dev-browser-linux-musl-x64" \
  -o "$BIN_DIR/dev-browser-linux-musl-x64"
chmod +x "$BIN_DIR/dev-browser-linux-musl-x64"

# Fix the global symlink to point at musl binary
NODE_BIN=$(dirname $(which node))
ln -sf "$BIN_DIR/dev-browser-linux-musl-x64" "$NODE_BIN/dev-browser"
```
