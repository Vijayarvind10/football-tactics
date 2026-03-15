import { describe, it, expect } from "bun:test";
import { joinRoom, leaveRoom, leaveAllRooms, broadcast } from "./rooms";

describe("WebSocket rooms", () => {
  it("joins and leaves a room without error", () => {
    const fakeWs = { send: () => {} } as any;
    expect(() => {
      joinRoom("test:1", fakeWs);
      leaveRoom("test:1", fakeWs);
    }).not.toThrow();
  });

  it("broadcast does not throw when room is empty", () => {
    expect(() =>
      broadcast("empty:room", { type: "status_change", matchId: 1, status: "LIVE" })
    ).not.toThrow();
  });

  it("broadcast does not throw when room has clients", () => {
    const fakeWs = { send: () => {} } as any;
    joinRoom("match:99", fakeWs);
    expect(() =>
      broadcast("match:99", { type: "score_update", matchId: 99, homeScore: 1, awayScore: 0, minute: 45 })
    ).not.toThrow();
    leaveRoom("match:99", fakeWs);
  });

  it("leaveAllRooms clears all subscriptions without error", () => {
    const fakeWs = { send: () => {} } as any;
    joinRoom("room:a", fakeWs);
    joinRoom("room:b", fakeWs);
    expect(() => leaveAllRooms(fakeWs)).not.toThrow();
  });

  it("multiple clients can join the same room", () => {
    const ws1 = { send: () => {} } as any;
    const ws2 = { send: () => {} } as any;
    joinRoom("global:live", ws1);
    joinRoom("global:live", ws2);
    expect(() =>
      broadcast("global:live", { type: "live_update", matches: [] })
    ).not.toThrow();
    leaveAllRooms(ws1);
    leaveAllRooms(ws2);
  });
});
