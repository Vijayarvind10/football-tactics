"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TacticsChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/tactics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json() as { response: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "52px", height: "52px", borderRadius: "50%",
          background: "var(--accent)", border: "none", cursor: "pointer",
          fontSize: "22px", boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
          zIndex: 100, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title="Tactics AI"
      >
        ⚽
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "88px", right: "24px",
          width: "360px", maxHeight: "520px",
          background: "var(--surface-2)", border: "1px solid var(--border-strong)",
          borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", zIndex: 100,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>Tactics AI</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ask about formations & tactics</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px" }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                Ask me anything about football tactics, formations, or team matchups.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%", padding: "10px 14px", borderRadius: "12px", fontSize: "13px", lineHeight: "1.5",
                  background: msg.role === "user" ? "var(--accent)" : "var(--surface-3)",
                  color: "var(--text-primary)",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
                  borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "12px",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "12px", background: "var(--surface-3)", color: "var(--text-muted)", fontSize: "13px" }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about tactics..."
              style={{
                flex: 1, background: "var(--surface-3)", border: "1px solid var(--border-strong)",
                borderRadius: "8px", padding: "8px 12px", color: "var(--text-primary)", fontSize: "13px",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--accent)", border: "none", borderRadius: "8px",
                padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
