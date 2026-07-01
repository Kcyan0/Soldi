"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLevelInfo } from "@/lib/utils/xp";
import { LogOut, Flame } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface TopBarProps {
  profile: {
    name: string | null;
    xp: number;
    level: number;
    streak_days: number;
  } | null;
  user: User;
}

export default function TopBar({ profile, user }: TopBarProps) {
  const router = useRouter();
  const supabase = createClient();
  const xp = profile?.xp ?? 0;
  const { current } = getLevelInfo(xp);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = profile?.name || user.email?.split("@")[0] || "Usuário";

  return (
    <header style={{
      height: "60px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      background: "var(--bg-primary)",
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      {/* Left: greeting */}
      <div>
        <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Olá, <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{displayName}</span>
        </span>
      </div>

      {/* Right: XP + streak + signout */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Streak */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Flame size={16} color="var(--amber, #F59E0B)" />
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
            {profile?.streak_days ?? 0}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>dias</span>
        </div>

        {/* XP */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--green-kiwi)",
          }} />
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--green-kiwi)" }}>
            {xp.toLocaleString()} XP
          </span>
        </div>

        {/* Level badge */}
        <span className="badge badge-green">
          Nv. {profile?.level ?? 1} — {current.title}
        </span>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="btn-ghost"
          title="Sair"
          style={{ padding: "6px" }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
