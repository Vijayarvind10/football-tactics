"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Live" },
  { href: "/leagues", label: "Leagues" },
  { href: "/compare", label: "Compare" },
  { href: "/players", label: "Players" },
  { href: "/admin", label: "Admin" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-strong)",
        height: "56px",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "32px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Link href="/" style={{ color: "var(--accent)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em", textDecoration: "none" }}>
        Tactics
      </Link>
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn("nav-link")}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
              background: pathname === link.href ? "var(--surface-2)" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
