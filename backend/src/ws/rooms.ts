import type { WSContext } from "hono/ws";

type WsMessage =
  | { type: "score_update"; matchId: number; homeScore: number; awayScore: number; minute: number }
  | { type: "match_event"; matchId: number; eventType: string; minute: number; playerName: string; teamId: number }
  | { type: "status_change"; matchId: number; status: string }
  | { type: "live_update"; matches: unknown[] };

// Map of room name → set of WebSocket connections
const rooms = new Map<string, Set<WSContext>>();

export function joinRoom(room: string, ws: WSContext): void {
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room)!.add(ws);
}

export function leaveRoom(room: string, ws: WSContext): void {
  rooms.get(room)?.delete(ws);
  if (rooms.get(room)?.size === 0) {
    rooms.delete(room);
  }
}

export function leaveAllRooms(ws: WSContext): void {
  for (const [room, clients] of rooms) {
    clients.delete(ws);
    if (clients.size === 0) rooms.delete(room);
  }
}

export function broadcast(room: string, message: WsMessage): void {
  const clients = rooms.get(room);
  if (!clients) return;
  const payload = JSON.stringify(message);
  for (const ws of clients) {
    try {
      ws.send(payload);
    } catch {
      clients.delete(ws);
    }
  }
}

export function broadcastToAll(rooms_list: string[], message: WsMessage): void {
  for (const room of rooms_list) {
    broadcast(room, message);
  }
}
