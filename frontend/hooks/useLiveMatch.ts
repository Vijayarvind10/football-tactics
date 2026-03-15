"use client";
import { useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { WsMessage } from "@/types/match";

export function useLiveMatch(matchId: number) {
  const { send, lastMessage, status } = useWebSocket();
  const [events, setEvents] = useState<WsMessage[]>([]);

  useEffect(() => {
    if (status === "connected") {
      send({ type: "join_match", matchId });
    }
    return () => {
      if (status === "connected") send({ type: "leave_match", matchId });
    };
  }, [status, matchId, send]);

  useEffect(() => {
    if (!lastMessage) return;
    if ("matchId" in lastMessage && lastMessage.matchId === matchId) {
      setEvents((prev) => [...prev.slice(-99), lastMessage]);
    }
  }, [lastMessage, matchId]);

  return { events, connectionStatus: status };
}
