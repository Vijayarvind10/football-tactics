import { createNodeWebSocket } from "@hono/node-ws";
import type { Hono } from "hono";
import { joinRoom, leaveRoom, leaveAllRooms, broadcast } from "./rooms";

export function setupWebSocket(app: Hono) {
  const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

  app.get(
    "/ws",
    upgradeWebSocket(() => ({
      onOpen(_event, ws) {
        console.log("WebSocket connected");
      },
      onMessage(event, ws) {
        try {
          const msg = JSON.parse(event.data.toString());
          if (msg.type === "join" && msg.room) {
            joinRoom(msg.room, ws);
          } else if (msg.type === "leave" && msg.room) {
            leaveRoom(msg.room, ws);
          } else if (msg.type === "join_match" && msg.matchId) {
            joinRoom(`match:${msg.matchId}`, ws);
          } else if (msg.type === "join_global") {
            joinRoom("global:live", ws);
          }
        } catch {
          // ignore malformed messages
        }
      },
      onClose(_event, ws) {
        leaveAllRooms(ws);
      },
      onError(_event, ws) {
        leaveAllRooms(ws);
      },
    }))
  );

  return injectWebSocket;
}
