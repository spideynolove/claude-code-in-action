# Real Browser MCP — Getting Started

Control your actual Chromium browser with Claude. Unlike Playwright which launches a fresh headless browser, this connects to your real running session — with all your cookies, logins, and history intact.

---

## Prerequisites

- Node.js installed (`node --version` to verify)
- Chromium or Chrome installed
- This repo cloned: `/path/to/claude-code-in-action`
- mcporter installed: `npm install -g mcporter`

---

## Step 1 — Install dependencies

```bash
cd /path/to/claude-code-in-action/02-mcp/browser-mcp
npm install
```

---

## Step 2 — Register real-browser in mcporter

Edit `~/.mcporter/mcporter.json` (create it if it doesn't exist):

```json
{
  "mcpServers": {
    "real-browser": {
      "command": "node",
      "args": ["/path/to/claude-code-in-action/02-mcp/browser-mcp/index.js"],
      "env": { "CDP_URL": "http://localhost:9222" }
    }
  }
}
```

Replace `/path/to/claude-code-in-action` with your actual clone path.

---

## Step 3 — Launch Chromium with CDP enabled

Open a terminal and run one of these depending on your setup:

```bash
# Snap Chromium (Ubuntu)
chromium --remote-debugging-port=9222 --user-data-dir=$HOME/snap/chromium/current

# apt/deb Chromium
chromium-browser --remote-debugging-port=9222 --user-data-dir=$HOME/.config/chromium-cdp

# Google Chrome
google-chrome --remote-debugging-port=9222 --user-data-dir=$HOME/.config/chrome-cdp
```

You'll know it's working when you see in the terminal:
```
DevTools listening on ws://127.0.0.1:9222/devtools/browser/...
```

Keep this terminal open — Chromium must stay running.

---

## Step 4 — Log into any site you need

In the Chromium window that just opened, manually navigate to and log into any sites Claude will need to access (Facebook, Google, etc.). Your session is now live and Claude will inherit it.

---

## Step 5 — Verify the connection

```bash
npx mcporter call real-browser.navigate url:"https://example.com"
npx mcporter call real-browser.get_text
```

If you see the page content, everything is working.

---

## Available Tools

| Tool | What it does |
|------|-------------|
| `navigate` | Go to a URL |
| `get_text` | Get visible page text (stripped, max 15K chars) |
| `snapshot` | Get URL, title, and interactive elements with selectors |
| `get_html` | Get innerHTML of a specific element |
| `click` | Click an element by CSS selector |
| `type` | Type text into a field |
| `evaluate` | Run arbitrary JavaScript and return the result |
| `wait` | Wait for an element or text to appear |
| `screenshot` | Take a screenshot |

---

## Common Workflows

### Navigate and read a page
```bash
npx mcporter call real-browser.navigate url:"https://site.com"
npx mcporter call real-browser.get_text
```

### Find clickable elements on a page
```bash
npx mcporter call real-browser.snapshot
```

### Fill a form and submit
```bash
npx mcporter call real-browser.type selector:"input[name=email]" text:"you@email.com"
npx mcporter call real-browser.type selector:"input[name=password]" text:"yourpassword" submit:true
npx mcporter call real-browser.wait text:"Dashboard" timeout:10000
```

### Extract data with JavaScript
```bash
npx mcporter call real-browser.evaluate \
  script:"() => Array.from(document.querySelectorAll('h2')).map(h => h.innerText).join('\n')"
```

### Take a screenshot
```bash
npx mcporter call real-browser.screenshot path:"/tmp/page.png"
```

---

## Using with Claude

Once Chromium is running on port 9222, tell Claude:

> "Use real-browser to navigate to X and do Y"

Claude will call the tools via mcporter automatically. Because you're already logged in, it can access any site without needing credentials.

---

## Troubleshooting

**`Connection refused` on port 9222** — Chromium isn't running with CDP enabled. Re-run the launch command from Step 3.

**`--user-data-dir` error on snap** — Use `$HOME/snap/chromium/current` as the data dir, not `~/.config`.

**Page shows logged-out state** — You launched Chromium with a different `--user-data-dir` than your normal profile. Use the same dir you logged in with.

**mcporter not found** — Run `npm install -g mcporter` first.
