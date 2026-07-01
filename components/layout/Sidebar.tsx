"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  Target,
  Trophy,
  User,
  Grid3X3,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/training", label: "Trilha SDR", icon: BookOpen },
  { href: "/dashboard/simulation", label: "Simulações", icon: Zap },
  { href: "/dashboard/missions", label: "Missões", icon: Target },
  { href: "/dashboard/ranking", label: "Ranking", icon: Trophy },
  { href: "/dashboard/modules", label: "Módulos", icon: Grid3X3 },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: "var(--bg-card)",
      borderRight: "1px solid var(--border)",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
      zIndex: 40,
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: "none", marginBottom: "32px", padding: "0 8px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "var(--green-kiwi)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "15px",
          fontWeight: "800",
          color: "#000",
          flexShrink: 0,
        }}>S</div>
        <span style={{
          fontSize: "18px",
          fontWeight: "800",
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}>Soldi</span>
      </Link>

      {/* SDR Module Section */}
      <p className="section-title">Módulo SDR</p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "auto" }}>
        {navItems.slice(0, 6).map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${isActive ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <Icon className="nav-icon" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Coming soon modules */}
      <div style={{ marginTop: "24px", marginBottom: "8px" }}>
        <p className="section-title">Em breve</p>
        {["Closers", "Gestores", "Playbook"].map((name) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              color: "var(--text-muted)",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "not-allowed",
            }}
          >
            <div style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: "1px solid var(--border)",
              flexShrink: 0,
            }} />
            {name}
            <span style={{
              marginLeft: "auto",
              fontSize: "9px",
              padding: "2px 5px",
              background: "var(--bg-elevated)",
              borderRadius: "4px",
              color: "var(--text-muted)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>Em breve</span>
          </div>
        ))}
      </div>

      {/* Profile link at bottom */}
      <div className="divider" style={{ marginBottom: "12px" }} />
      {navItems.slice(-1).map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`nav-link ${isActive ? "active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <Icon className="nav-icon" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
