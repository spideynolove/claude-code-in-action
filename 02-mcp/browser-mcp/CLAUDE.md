# Browser Automation — dev-browser

Browser tasks use **dev-browser** (CLI, not MCP). Scripts run in a sandboxed QuickJS WASM runtime.

## Quick Start

```bash
# Connect to running Chrome on port 9222 (recommended — uses your real session/cookies)
dev-browser --connect <<'EOF'
const page = await browser.getPage("main");
await page.goto("https://example.com");
console.log(await page.title());
EOF

# Or headless (fresh Chromium)
dev-browser --headless <<'EOF'
const page = await browser.getPage("main");
await page.goto("https://example.com");
EOF
```

## Key API

```javascript
// Page management
const page = await browser.getPage("name");   // Get/create named page
const tabs  = await browser.listPages();       // [{id, url, title, name}]
await browser.closePage("name");

// Navigation & interaction (full Playwright API)
await page.goto("https://example.com");
await page.click("button.submit");
await page.fill("input#q", "search text");
await page.press("input#q", "Enter");

// Content extraction
const text  = await page.textContent("h1");
const html  = await page.innerHTML(".content");
const data  = await page.evaluate(() => document.title);

// AI-friendly snapshot (use this for finding selectors)
const snap  = await page.snapshotForAI();
console.log(snap.full);

// Screenshot
const buf   = await page.screenshot();
const path  = await saveScreenshot(buf, "screenshot.png");

// Wait
await page.waitForSelector(".loaded");
await page.waitForTimeout(1000);
```

## Real Browser (CDP) vs Headless

| Mode | Command | When to use |
|------|---------|-------------|
| Connect | `dev-browser --connect` | Logged-in sites, Cloudflare, social media |
| Headless | `dev-browser --headless` | Fresh sessions, CI, scraping public sites |

Start Chrome with CDP: `chromium --remote-debugging-port=9222 --user-data-dir=$HOME/snap/chromium/current`

## Why dev-browser over MCP

- Scripts run in QuickJS WASM sandbox — no selector guessing errors
- AI runs real JS logic, not JSON tool calls → fewer turns, lower cost
- Benchmarks: 3m53s vs 4m31s for Playwright MCP, at 40% lower token cost
