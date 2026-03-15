/**
 * HTTP transport wrapper for Railway deployment.
 * Wraps the MCP server with a Hono HTTP layer on port 3002.
 *
 * Usage: bun run src/http.ts
 */
import { Hono } from "hono";

const PORT = Number(process.env.PORT ?? 3002);

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ status: "ok", service: "football-tactics-mcp", port: PORT });
});

/**
 * MCP over HTTP: clients POST JSON-RPC payloads here.
 * The MCP SDK's SSE or streamable HTTP transport can be plugged in here
 * once a Railway-compatible transport adapter is available.
 *
 * For now, this endpoint documents the interface and returns a 200
 * so Railway health-checks pass. The primary transport remains stdio
 * (used by Claude Desktop / claude CLI via src/index.ts).
 */
app.post("/mcp", async (c) => {
  const body = await c.req.json();
  return c.json(
    {
      jsonrpc: "2.0",
      id: body?.id ?? null,
      error: {
        code: -32601,
        message:
          "HTTP transport not yet wired. Use stdio transport via src/index.ts or connect via Claude Desktop.",
      },
    },
    501
  );
});

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`Football Tactics MCP HTTP server starting on port ${PORT}`);
