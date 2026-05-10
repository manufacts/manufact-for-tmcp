import * as http from "node:http";
import { McpServer } from "tmcp";
import { ZodJsonSchemaAdapter } from "@tmcp/adapter-zod";

const server = new McpServer(
  { name: "mcp-detect-tmcp", version: "0.1.0", description: "tmcp fixture" },
  {
    adapter: new ZodJsonSchemaAdapter(),
    capabilities: { tools: {} },
  },
);

const port = Number(process.env.PORT ?? "3000");

http
  .createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const bodyText = Buffer.concat(chunks).toString("utf8");
    if (req.url === "/mcp" && req.method === "POST") {
      let id: unknown = null;
      try {
        const parsed = JSON.parse(bodyText) as { id?: unknown };
        id = parsed?.id ?? null;
      } catch {
        // ignore parse errors
      }
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            serverInfo: { name: "mcp-detect-tmcp", version: "0.1.0" },
          },
        }),
      );
      return;
    }
    res.statusCode = 404;
    res.end();
  })
  .listen(port, "0.0.0.0", () => {
    console.log(
      `[mcp-detect-tmcp] sdk=${server.constructor.name} listening on :${port}/mcp`,
    );
  });
