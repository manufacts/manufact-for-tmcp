import * as http from "node:http";
import { McpServer } from "tmcp";
import { ZodJsonSchemaAdapter } from "@tmcp/adapter-zod";
import { HttpTransport } from "@tmcp/transport-http";
import { createRequestListener } from "@remix-run/node-fetch-server";
import { z } from "zod";

const FIXTURE_NAME = "mcp-detect-tmcp";
const VIEW_URI = `ui://${FIXTURE_NAME}/greet.html`;
const RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";

// Self-contained MCP Apps view (text/html;profile=mcp-app). The widget loads
// the ext-apps app-bridge from esm.sh and renders the latest tool result.
const VIEW_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Greet</title>
  <style>
    :root { color-scheme: light dark; }
    body { font:16px/1.4 system-ui, sans-serif; padding: 24px; margin: 0; }
    h1 { margin: 0 0 8px; }
    .meta { color: #666; font-size: 13px; margin-top: 12px; }
  </style>
</head>
<body>
  <h1 id="greeting">Greeting view loaded.</h1>
  <p id="hint" class="meta">Call the <code>greet_widget</code> tool to populate this view.</p>
  <script type="module">
    import { App } from "https://esm.sh/@modelcontextprotocol/ext-apps@1";
    const app = new App({ name: "${FIXTURE_NAME}-greet", version: "0.1.0" });
    app.ontoolresult = (result) => {
      const text = (result?.content ?? []).find((c) => c.type === "text")?.text;
      const struct = result?.structuredContent;
      const heading = document.getElementById("greeting");
      const hint = document.getElementById("hint");
      if (text) heading.textContent = text;
      if (struct && struct.name) hint.textContent = "props.name = " + struct.name;
    };
    app.connect();
  </script>
</body>
</html>`;

const server = new McpServer(
  {
    name: FIXTURE_NAME,
    version: "0.1.0",
    description: "Smoke-test fixture for tmcp framework detection (MCP Apps).",
  },
  {
    adapter: new ZodJsonSchemaAdapter(),
    capabilities: { tools: { listChanged: true }, resources: { listChanged: true } },
  },
);

// MCP Apps protocol: register the View resource at a stable URI, then point
// the tool's _meta.ui.resourceUri at it. (tmcp has no native widget DSL —
// this is the recommended manual wiring per the MCP Apps spec.)
server.resource(
  {
    name: "Greet view",
    description: "MCP Apps view for the greet_widget tool.",
    uri: VIEW_URI,
    mimeType: RESOURCE_MIME_TYPE,
  },
  async (uri) => ({
    contents: [{ uri, mimeType: RESOURCE_MIME_TYPE, text: VIEW_HTML }],
  }),
);

server.tool(
  {
    name: "echo",
    title: "Echo",
    description: "Echo the input back as text.",
    schema: z.object({ text: z.string().describe("Text to echo") }),
  },
  async ({ text }) => ({ content: [{ type: "text", text }] }),
);

server.tool(
  {
    name: "greet_widget",
    title: "Greet (widget)",
    description: "Greet someone and render an MCP App view.",
    schema: z.object({ name: z.string().describe("Name to greet") }),
    outputSchema: z.object({ name: z.string() }),
    _meta: {
      ui: { resourceUri: VIEW_URI },
      "ui/resourceUri": VIEW_URI,
    },
  },
  async ({ name }) => ({
    content: [{ type: "text", text: `Hello, ${name}!` }],
    structuredContent: { name },
  }),
);

const transport = new HttpTransport(server, { path: "/mcp" });

const port = Number(process.env.PORT ?? "3000");

http
  .createServer(
    createRequestListener(async (req) => {
      const response = await transport.respond(req);
      return response ?? new Response(null, { status: 404 });
    }),
  )
  .listen(port, "0.0.0.0", () => {
    console.log(`[${FIXTURE_NAME}] listening on :${port}/mcp`);
  });
