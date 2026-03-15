import { Server as McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";

const CDP_URL = process.env.CDP_URL || "http://localhost:9222";

let browser = null;
let activeTabIndex = 0;

async function getBrowser() {
  if (browser?.isConnected()) return browser;
  browser = await chromium.connectOverCDP(CDP_URL);
  return browser;
}

async function getPage(tabIndex) {
  const b = await getBrowser();
  const ctx = b.contexts()[0] || await b.newContext();
  const pages = ctx.pages();
  const idx = tabIndex ?? activeTabIndex;
  if (idx < 0 || idx >= pages.length) throw new Error(`Tab ${idx} not found (${pages.length} open)`);
  return pages[idx];
}

const TAB_PARAM = { tab: { type: "number", description: "Tab index (default: active tab)" } };

const server = new McpServer(
  { name: "browser-mcp", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "navigate",
      description: "Go to a URL in the real browser",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string" }, ...TAB_PARAM },
        required: ["url"]
      }
    },
    {
      name: "get_text",
      description: "Get visible text content of the current page (lean, no markup)",
      inputSchema: { type: "object", properties: { ...TAB_PARAM } }
    },
    {
      name: "get_html",
      description: "Get innerHTML of a CSS selector",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector" },
          ...TAB_PARAM
        },
        required: ["selector"]
      }
    },
    {
      name: "click",
      description: "Click an element by CSS selector or x/y coordinates",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string" },
          x: { type: "number", description: "X coordinate (use with screenshot metadata)" },
          y: { type: "number", description: "Y coordinate (use with screenshot metadata)" },
          ...TAB_PARAM
        }
      }
    },
    {
      name: "type",
      description: "Type text into an element",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string" },
          text: { type: "string" },
          submit: { type: "boolean", description: "Press Enter after typing" },
          ...TAB_PARAM
        },
        required: ["selector", "text"]
      }
    },
    {
      name: "evaluate",
      description: "Run JavaScript in the page and return the result",
      inputSchema: {
        type: "object",
        properties: { script: { type: "string" }, ...TAB_PARAM },
        required: ["script"]
      }
    },
    {
      name: "snapshot",
      description: "Get page accessibility tree with roles, names, values, and states",
      inputSchema: { type: "object", properties: { ...TAB_PARAM } }
    },
    {
      name: "screenshot",
      description: "Take a screenshot and return file path with viewport dimensions",
      inputSchema: {
        type: "object",
        properties: { path: { type: "string", default: "/tmp/screenshot.png" }, ...TAB_PARAM }
      }
    },
    {
      name: "wait",
      description: "Wait for a CSS selector or text to appear on the page",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector to wait for" },
          text: { type: "string", description: "Text to wait for" },
          timeout: { type: "number", default: 10000 },
          ...TAB_PARAM
        }
      }
    },
    {
      name: "list_tabs",
      description: "List all open browser tabs with index, URL, and title",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "new_tab",
      description: "Open a new browser tab, optionally navigating to a URL",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string", description: "URL to navigate to" } }
      }
    },
    {
      name: "switch_tab",
      description: "Switch the active tab by index",
      inputSchema: {
        type: "object",
        properties: { tab: { type: "number" } },
        required: ["tab"]
      }
    },
    {
      name: "load_all",
      description: "Repeatedly click a selector until it disappears (for infinite scroll / load-more buttons)",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "Element to click repeatedly" },
          timeout: { type: "number", default: 60000, description: "Max duration in ms (cap: 300s)" },
          interval: { type: "number", default: 1000, description: "Delay between clicks in ms" },
          ...TAB_PARAM
        },
        required: ["selector"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  try {
    if (name === "list_tabs") {
      const b = await getBrowser();
      const ctx = b.contexts()[0];
      const pages = ctx ? ctx.pages() : [];
      const tabs = pages.map((pg, i) => ({
        index: i,
        url: pg.url(),
        title: "",
        active: i === activeTabIndex
      }));
      for (let i = 0; i < tabs.length; i++) {
        try { tabs[i].title = await pages[i].title(); } catch {}
      }
      return { content: [{ type: "text", text: JSON.stringify(tabs, null, 2) }] };
    }

    if (name === "new_tab") {
      const b = await getBrowser();
      const ctx = b.contexts()[0] || await b.newContext();
      const pg = await ctx.newPage();
      activeTabIndex = ctx.pages().length - 1;
      if (args.url) await pg.goto(args.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      return { content: [{ type: "text", text: `New tab ${activeTabIndex}: ${pg.url()}` }] };
    }

    if (name === "switch_tab") {
      const p = await getPage(args.tab);
      activeTabIndex = args.tab;
      await p.bringToFront();
      return { content: [{ type: "text", text: `Switched to tab ${args.tab}: ${p.url()}` }] };
    }

    const p = await getPage(args.tab);

    if (name === "navigate") {
      await p.goto(args.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      return { content: [{ type: "text", text: `Navigated to: ${p.url()}` }] };
    }

    if (name === "get_text") {
      const text = await p.evaluate(() => {
        const skip = ["script", "style", "noscript", "nav", "header", "footer"];
        const body = document.body.cloneNode(true);
        body.querySelectorAll(skip.join(",")).forEach(el => el.remove());
        return body.innerText.replace(/\n{3,}/g, "\n\n").trim().slice(0, 500000);
      });
      return { content: [{ type: "text", text }] };
    }

    if (name === "get_html") {
      const el = await p.$(args.selector);
      if (!el) return { content: [{ type: "text", text: `Selector not found: ${args.selector}` }] };
      const html = await el.innerHTML();
      return { content: [{ type: "text", text: html.slice(0, 10000) }] };
    }

    if (name === "click") {
      if (args.x != null && args.y != null) {
        await p.mouse.click(args.x, args.y);
      } else if (args.selector) {
        await p.click(args.selector, { timeout: 10000 });
      } else {
        throw new Error("Provide either selector or x/y coordinates");
      }
      await p.waitForTimeout(500);
      const target = args.selector || `(${args.x}, ${args.y})`;
      return { content: [{ type: "text", text: `Clicked: ${target}` }] };
    }

    if (name === "type") {
      try {
        await p.fill(args.selector, args.text);
      } catch {
        const cdp = await p.context().newCDPSession(p);
        await p.click(args.selector, { timeout: 5000 });
        await cdp.send("Input.insertText", { text: args.text });
        await cdp.detach();
      }
      if (args.submit) await p.press(args.selector, "Enter");
      return { content: [{ type: "text", text: `Typed into ${args.selector}` }] };
    }

    if (name === "evaluate") {
      const result = await p.evaluate(new Function(`return (${args.script})()`));
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2).slice(0, 500000) }] };
    }

    if (name === "snapshot") {
      let tree = await p.accessibility.snapshot();
      if (tree) {
        const text = `URL: ${p.url()}\nTitle: ${await p.title()}\n\nAccessibility Tree:\n${JSON.stringify(tree, null, 2).slice(0, 50000)}`;
        return { content: [{ type: "text", text }] };
      }
      const data = await p.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll("input, textarea, select, button, a[href]"))
          .slice(0, 30)
          .map(el => {
            const tag = el.tagName.toLowerCase();
            const label = el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.innerText?.trim() || el.name || "";
            const id = el.id ? `#${el.id}` : "";
            const cls = el.className ? `.${el.className.split(" ")[0]}` : "";
            return `${tag}${id}${cls}: "${label.slice(0, 50)}"`;
          });
        return { title: document.title, url: location.href, elements: inputs };
      });
      const text = `URL: ${data.url}\nTitle: ${data.title}\n\nInteractive elements:\n${data.elements.join("\n")}`;
      return { content: [{ type: "text", text }] };
    }

    if (name === "screenshot") {
      const path = args.path || "/tmp/screenshot.png";
      await p.screenshot({ path, fullPage: false });
      const viewport = p.viewportSize();
      const dpr = await p.evaluate(() => window.devicePixelRatio);
      const meta = { path, width: viewport?.width, height: viewport?.height, dpr };
      return { content: [{ type: "text", text: `Screenshot saved: ${path}\n${JSON.stringify(meta)}` }] };
    }

    if (name === "wait") {
      const timeout = args.timeout || 10000;
      if (args.selector) await p.waitForSelector(args.selector, { timeout });
      else if (args.text) await p.waitForFunction(
        t => document.body.innerText.includes(t), args.text, { timeout }
      );
      return { content: [{ type: "text", text: "Done waiting" }] };
    }

    if (name === "load_all") {
      const timeout = Math.min(args.timeout || 60000, 300000);
      const interval = args.interval || 1000;
      const start = Date.now();
      let clicks = 0;
      while (Date.now() - start < timeout) {
        const el = await p.$(args.selector);
        if (!el) break;
        try {
          await el.click({ timeout: 5000 });
          clicks++;
        } catch { break; }
        await p.waitForTimeout(interval);
      }
      return { content: [{ type: "text", text: `Clicked "${args.selector}" ${clicks} times` }] };
    }

    return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };

  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
