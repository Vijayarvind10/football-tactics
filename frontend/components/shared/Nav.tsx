"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        background: "rgba(8, 8, 8, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
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
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            background: "linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            flexShrink: 0,
          }}
        >
          ⚽
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Tactics
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: "flex", gap: "2px", flex: 1 }}>
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "nav-link nav-link-active" : "nav-link"}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
