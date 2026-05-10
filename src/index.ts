import * as http from "node:http";
import { McpServer } from "tmcp";
import { ZodJsonSchemaAdapter } from "@tmcp/adapter-zod";
import { HttpTransport } from "@tmcp/transport-http";
import { createRequestListener } from "@remix-run/node-fetch-server";
import { z } from "zod";

const server = new McpServer(
  {
    name: "mcp-detect-tmcp",
    version: "0.1.0",
    description: "Smoke-test fixture for tmcp framework detection.",
  },
  {
    adapter: new ZodJsonSchemaAdapter(),
    capabilities: { tools: { listChanged: true } },
  },
);

server.tool(
  {
    name: "echo",
    description: "Echo the input back as text.",
    schema: z.object({ text: z.string().describe("Text to echo") }),
  },
  async ({ text }) => ({ content: [{ type: "text", text }] }),
);

server.tool(
  {
    name: "greet_widget",
    description:
      "Greet someone and return an HTML widget rendered by the MCP client.",
    schema: z.object({ name: z.string().describe("Name to greet") }),
  },
  async ({ name }) => ({
    content: [
      { type: "text", text: `Hello, ${name}!` },
      {
        type: "resource",
        resource: {
          uri: `ui://greet/${encodeURIComponent(name)}`,
          mimeType: "text/html",
          text: `<!doctype html><html><body style="font:16px/1.4 system-ui;padding:24px"><h1 style="margin:0 0 8px">Hello, ${name}!</h1><p style="color:#555">Greeting widget served by mcp-detect-tmcp.</p></body></html>`,
        },
      },
    ],
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
    console.log(`[mcp-detect-tmcp] listening on :${port}/mcp`);
  });
