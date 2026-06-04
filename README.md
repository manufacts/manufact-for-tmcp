[![Deploy to mcp-use](https://cdn.mcp-use.com/deploy.svg)](https://mcp-use.com/deploy/start?repository-url=https%3A%2F%2Fgithub.com%2Fmanufacts%2Fmcp-detect-tmcp&branch=main&project-name=mcp-detect-tmcp&port=3000&build-command=npm+run+build&start-command=npm+start&runtime=node&base-image=node%3A20)

<div align="center">

# tmcp MCP Apps example

**Reference server for the [tmcp deploy guide](https://mcp-use.com/blog/mcp-app-with-tmcp)** — same `echo` + `greet_widget` example used in our [seven-framework comparison](https://mcp-use.com/blog/deploying-seven-mcp-frameworks).

Built with [`tmcp`](https://github.com/tmcp/tmcp) — schema-agnostic, protocol-level MCP Apps wiring (no widget DSL).

**Live demo:** [`fast-wave-zubi2.run.mcp-use.com/mcp`](https://fast-wave-zubi2.run.mcp-use.com/mcp)

</div>

---

## Deploy to Manufact Cloud

Click the badge above, or open the [one-click deploy flow](https://mcp-use.com/deploy/start?repository-url=https%3A%2F%2Fgithub.com%2Fmanufacts%2Fmcp-detect-tmcp&branch=main&project-name=mcp-detect-tmcp&port=3000&build-command=npm+run+build&start-command=npm+start&runtime=node&base-image=node%3A20). Sign in, connect GitHub, and Manufact clones this repo into your account and deploys it.

If you deploy manually from the dashboard instead:

| Setting | Value |
| --- | --- |
| **Port** | `3000` |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |

Manufact detects `tmcp` and labels the repo accordingly.

---

## What's in this repo

- An `echo` tool (text-only)
- A `greet_widget` tool with manual `_meta.ui.resourceUri` and matching HTML resource
- Streamable HTTP at `/mcp` via tmcp's `HttpTransport`

---

## Getting started

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000/mcp`.

---

## Project layout

```
src/
  index.ts    # tmcp server, HTTP transport, tools, and greet view HTML
```

See the [deploy guide](https://mcp-use.com/blog/mcp-app-with-tmcp) for the full reference server walkthrough.
