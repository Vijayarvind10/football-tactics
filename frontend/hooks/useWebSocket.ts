"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { WsMessage } from "@/types/match";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ??
  "wss://glistening-smile-production-6954.up.railway.app/ws";
const MAX_RECONNECT_DELAY = 30_000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(1000);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("connected");
      reconnectDelay.current = 1000;
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        setLastMessage(msg);
      } catch {}
    };

    ws.onclose = () => {
      setStatus("disconnected");
      const delay = reconnectDelay.current;
      reconnectDelay.current = Math.min(delay * 2, MAX_RECONNECT_DELAY);
      setTimeout(connect, delay);
    };

    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send, lastMessage, status };
}
