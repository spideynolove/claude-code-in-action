# Real Browser MCP — Control Your Actual Browser with Claude

## What We Built

A lightweight MCP server that connects Claude to **your real running browser** via Chrome DevTools Protocol (CDP). Unlike the default `playwright` MCP which launches a fresh headless browser, this connects to your existing Chromium session — with all your cookies, logins, and human fingerprint intact.

---

## Why This Matters

| | Default Playwright MCP | Real Browser MCP |
|---|---|---|
| Browser | Fresh headless instance | Your real Chromium |
| Cookies/Sessions | None | All your logged-in accounts |
| Cloudflare / Bot detection | Blocked | Passes (real browser) |
| Token cost | High (full accessibility tree) | Lean (text only, ~15K max) |
| mcporter compatible | ✅ | ✅ |

---

## How It Works

```
Claude → mcporter → browser-mcp MCP → CDP (ws://localhost:9222) → Your Chromium
```

**CDP (Chrome DevTools Protocol)** is built into every Chromium browser. It exposes a WebSocket API that lets any program navigate, click, read DOM, and run JavaScript — the same thing Playwright, Puppeteer, and Selenium all use under the hood. Stagehand and BrowserBase are just this + cloud hosting + a price tag.

---

## Setup

### 1. Launch Chromium with CDP enabled

```bash
# For snap Chromium (use snap-writable path to avoid data-dir error)
chromium --remote-debugging-port=9222 --user-data-dir=$HOME/snap/chromium/current

# For apt/deb Chromium or Chrome
chromium-browser --remote-debugging-port=9222 --user-data-dir=$HOME/.config/chromium-cdp
google-chrome --remote-debugging-port=9222 --user-data-dir=$HOME/.config/chrome-cdp
```

You'll see this line confirming CDP is active (the error logs above it are harmless snap warnings):
```
DevTools listening on ws://127.0.0.1:9222/devtools/browser/...
```

### 2. Install dependencies

```bash
cd /home/hung/Public/gits/claude-code-in-action/02-mcp
npm install
```

### 3. Add to mcporter

Edit `~/.mcporter/mcporter.json`:

```json
{
  "mcpServers": {
    "browser-mcp": {
      "command": "/home/hung/.nvm/versions/node/v22.22.0/bin/node",
      "args": ["/home/hung/Public/gits/claude-code-in-action/02-mcp/index.js"],
      "env": { "CDP_URL": "http://localhost:9222" }
    }
  }
}
```

---

## Available Tools

```bash
# Navigate to a URL
npx mcporter call browser-mcp.navigate url:"https://example.com"

# Get lean visible text (strips nav/header/footer, max 15K chars)
npx mcporter call browser-mcp.get_text

# Get compact snapshot: URL, title, interactive elements with CSS selectors
npx mcporter call browser-mcp.snapshot

# Get innerHTML of a specific element
npx mcporter call browser-mcp.get_html selector:"#main-content"

# Click an element
npx mcporter call browser-mcp.click selector:"button.submit"

# Type into a field (add submit:true to press Enter)
npx mcporter call browser-mcp.type selector:"input#search" text:"hello world"
npx mcporter call browser-mcp.type selector:"input#search" text:"hello world" submit:true

# Run arbitrary JavaScript and return result
npx mcporter call browser-mcp.evaluate script:"() => document.title"

# Wait for an element or text to appear
npx mcporter call browser-mcp.wait selector:".results-loaded" timeout:10000
npx mcporter call browser-mcp.wait text:"Welcome back" timeout:10000

# Take a screenshot
npx mcporter call browser-mcp.screenshot path:"/tmp/page.png"
```

---

## Real World Workflows

### Scrape a Cloudflare-protected site
1. Open Chromium manually, solve any CAPTCHA once
2. Claude connects to the same session — Cloudflare sees a real human browser

### Scrape a course (like we did with Skilljar)
```bash
npx mcporter call browser-mcp.navigate url:"https://course-site.com/lesson/1"
npx mcporter call browser-mcp.get_text
# Repeat for each lesson URL
```

### Post to X / social media
```bash
npx mcporter call browser-mcp.navigate url:"https://x.com/compose/tweet"
npx mcporter call browser-mcp.click selector:"[data-testid=tweetTextarea_0]"
npx mcporter call browser-mcp.type selector:"[data-testid=tweetTextarea_0]" text:"Hello world"
npx mcporter call browser-mcp.click selector:"[data-testid=tweetButton]"
```

### Login flow (for sites not already logged in)
```bash
npx mcporter call browser-mcp.navigate url:"https://site.com/login"
npx mcporter call browser-mcp.snapshot        # find input selectors
npx mcporter call browser-mcp.type selector:"input[name=email]" text:"you@email.com"
npx mcporter call browser-mcp.type selector:"input[name=password]" text:"yourpassword" submit:true
npx mcporter call browser-mcp.wait text:"Dashboard" timeout:10000
```

### Extract structured data
```bash
npx mcporter call browser-mcp.evaluate \
  script:"() => Array.from(document.querySelectorAll('table tr')).map(r => r.innerText).join('\n')"
```

---

## Tips & Tricks

### Token efficiency
- Use `get_text` over `snapshot` when you just need content — it strips noise and caps at 15K chars
- Use `snapshot` when you need to find selectors for clicking/typing
- Use `evaluate` for precise extraction — you control exactly what's returned

### Selector finding
- Run `snapshot` first to see interactive elements with their CSS selectors/IDs
- Prefer `#id` selectors over class selectors (more stable)
- For dynamic sites, use `wait` before `get_text` to ensure content has loaded

### Cloudflare & bot detection
- Always launch Chromium with your real `--user-data-dir` so cookies persist
- Navigate to the site once manually and solve any challenge — Claude inherits your clearance
- Avoid moving too fast: add `wait time:1000` between actions on sensitive sites

### Snap Chromium quirks
- Use `$HOME/snap/chromium/current` as `--user-data-dir` (snap sandboxes `/home/hung/.config`)
- The mount namespace warnings in the terminal are harmless — ignore them
- CDP still works even if the data-dir warning appears

### Persistent sessions
- Keep Chromium running in the background on port 9222
- The MCP reconnects automatically on each call — no need to restart anything
- If the page/tab is closed, the server opens a new one automatically

### Parallel scraping
- Open multiple tabs manually in your Chromium
- The MCP currently uses the first tab — use `evaluate` with `window.open()` for multi-tab work
- For high-volume scraping, loop calls in a shell script

---

## Architecture

```
index.js (MCP Server, stdio transport)
  ├── ListTools handler → returns 9 tool definitions
  ├── CallTool handler → routes to Playwright CDP calls
  └── getPage() → connects to ws://localhost:9222, reuses existing tab

Playwright connectOverCDP("http://localhost:9222")
  └── Uses existing browser context + cookies (no new browser launched)
```

The key line in `index.js`:
```js
browser = await chromium.connectOverCDP(CDP_URL);  // connects to YOUR browser
const ctx = contexts[0];                            // uses YOUR existing session
const page = pages[0];                              // uses YOUR active tab
```

---

## What We Scraped With This Approach

- **Anthropic Skilljar course** (`claude-code-in-action`): signed up, enrolled, and extracted all 21 lessons in ~2 minutes vs. an afternoon of manual copying
- Content saved to `../00-materials/`
- The same workflow works for any course platform, data site, or web app
