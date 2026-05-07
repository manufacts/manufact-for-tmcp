import { McpServer } from "tmcp";
import { ZodJsonSchemaAdapter } from "@tmcp/adapter-zod";
import { StdioTransport } from "@tmcp/transport-stdio";

const server = new McpServer(
  { name: "mcp-detect-tmcp", version: "0.1.0" },
  { adapter: new ZodJsonSchemaAdapter(), capabilities: { tools: {} } },
);

new StdioTransport(server).listen();
