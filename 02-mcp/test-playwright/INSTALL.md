# Playwright MCP — Install & Verify

One-time setup. Follow exactly to avoid version mismatch errors.

## 1. Install MCP globally

```bash
npm install -g @playwright/mcp@latest
```

Verify binary:

```bash
ls /home/hung/.nvm/versions/node/v22.22.0/bin/playwright-mcp
```

## 2. Install Chromium — from inside the MCP package

> ⚠️ Do NOT run `npx playwright install chromium` globally — it installs browsers for a different playwright version than the MCP package uses.

```bash
cd /home/hung/.nvm/versions/node/v22.22.0/lib/node_modules/@playwright/mcp
./node_modules/.bin/playwright install chromium
```

This installs both the full Chromium (headed) and headless shell — both are needed.

Verify:

```bash
ls ~/.cache/ms-playwright/ | grep chromium
# Expected: chromium-XXXX (full) AND chromium_headless_shell-XXXX (headless)
```

## 3. Register in mcporter

Add to `/home/hung/.mcporter/mcporter.json` under `mcpServers`:

```json
"playwright": {
  "command": "/home/hung/.nvm/versions/node/v22.22.0/bin/playwright-mcp",
  "args": [
    "--browser", "chromium",
    "--user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  ]
}
```

> No `--headless` — browser opens visibly by default, correct for UI testing.
> Add `--headless` back only when you explicitly want background scraping with no window.
> `--user-agent` is required — CloudFront/CDN sites 403 default headless fingerprints.
> Use the global binary path, NOT `npx @playwright/mcp@latest` — version mismatch = browser not found.

## 4. Verify

```bash
npx mcporter list playwright | tail -3
# Expected: "22 tools · Xms · STDIO ..."
```

```bash
npx mcporter call playwright.browser_navigate url:"https://example.com"
# Expected: snapshot with title "Example Domain" and a real browser window opens
```

## After Upgrading `@playwright/mcp`

Re-run step 2 — browser binaries are version-specific.
