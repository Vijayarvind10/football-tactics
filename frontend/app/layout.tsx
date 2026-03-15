import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Nav } from "@/components/shared/Nav";
import { TacticsChat } from "@/components/ai/TacticsChat";

export const metadata: Metadata = {
  title: "Tactics — Football Analysis",
  description: "Real-time football tactics analysis and formation visualizer for the Top 5 European leagues",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          <Nav />
          <main style={{ minHeight: "calc(100vh - 56px)" }}>
            {children}
          </main>
          <TacticsChat />
        </QueryProvider>
      </body>
    </html>
  );
}
