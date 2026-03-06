import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright";

const CDP_URL = process.env.CDP_URL || "http://localhost:9222";

let browser = null;
let page = null;

async function getPage() {
  if (page && !page.isClosed()) return page;
  browser = await chromium.connectOverCDP(CDP_URL);
  const contexts = browser.contexts();
  const ctx = contexts[0] || await browser.newContext();
  const pages = ctx.pages();
  page = pages[0] || await ctx.newPage();
  return page;
}

const server = new Server(
  { name: "real-browser", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "navigate",
      description: "Go to a URL in the real browser",
      inputSchema: {
        type: "object",
        properties: { url: { type: "string" } },
        required: ["url"]
      }
    },
    {
      name: "get_text",
      description: "Get visible text content of the current page (lean, no markup)",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_html",
      description: "Get innerHTML of a CSS selector",
      inputSchema: {
        type: "object",
        properties: {
          selector: { type: "string", description: "CSS selector" }
        },
        required: ["selector"]
      }
    },
    {
      name: "click",
      description: "Click an element by CSS selector",
      inputSchema: {
        type: "object",
        properties: { selector: { type: "string" } },
        required: ["selector"]
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
          submit: { type: "boolean", description: "Press Enter after typing" }
        },
        required: ["selector", "text"]
      }
    },
    {
      name: "evaluate",
      description: "Run JavaScript in the page and return the result",
      inputSchema: {
        type: "object",
        properties: { script: { type: "string" } },
        required: ["script"]
      }
    },
    {
      name: "snapshot",
      description: "Get page title, URL, and a compact summary of interactive elements",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "screenshot",
      description: "Take a screenshot and save to a file",
      inputSchema: {
        type: "object",
        properties: { path: { type: "string", default: "/tmp/screenshot.png" } }
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
          timeout: { type: "number", default: 10000 }
        }
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;

  try {
    const p = await getPage();

    if (name === "navigate") {
      await p.goto(args.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      return { content: [{ type: "text", text: `Navigated to: ${p.url()}` }] };
    }

    if (name === "get_text") {
      const text = await p.evaluate(() => {
        const skip = ["script", "style", "noscript", "nav", "header", "footer"];
        const body = document.body.cloneNode(true);
        body.querySelectorAll(skip.join(",")).forEach(el => el.remove());
        return body.innerText.replace(/\n{3,}/g, "\n\n").trim().slice(0, 15000);
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
      await p.click(args.selector, { timeout: 10000 });
      await p.waitForTimeout(500);
      return { content: [{ type: "text", text: `Clicked: ${args.selector}` }] };
    }

    if (name === "type") {
      await p.fill(args.selector, args.text);
      if (args.submit) await p.press(args.selector, "Enter");
      return { content: [{ type: "text", text: `Typed into ${args.selector}` }] };
    }

    if (name === "evaluate") {
      const result = await p.evaluate(new Function(`return (${args.script})()`));
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2).slice(0, 10000) }] };
    }

    if (name === "snapshot") {
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
      return { content: [{ type: "text", text: `Screenshot saved: ${path}` }] };
    }

    if (name === "wait") {
      const timeout = args.timeout || 10000;
      if (args.selector) await p.waitForSelector(args.selector, { timeout });
      else if (args.text) await p.waitForFunction(
        t => document.body.innerText.includes(t), args.text, { timeout }
      );
      return { content: [{ type: "text", text: "Done waiting" }] };
    }

    return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };

  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
