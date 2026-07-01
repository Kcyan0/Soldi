import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelInfo } from "@/lib/utils/xp";
import { Crown, Flame } from "lucide-react";

// Mock leaderboard data for demo
const MOCK_USERS = [
  { id: "mock-1", name: "Ana Ferreira", xp: 4200, level: 4, streak_days: 12 },
  { id: "mock-2", name: "Bruno Almeida", xp: 3800, level: 3, streak_days: 8 },
  { id: "mock-3", name: "Carla Souza", xp: 3100, level: 3, streak_days: 15 },
  { id: "mock-4", name: "Diego Costa", xp: 2600, level: 3, streak_days: 5 },
  { id: "mock-5", name: "Elena Martins", xp: 2100, level: 2, streak_days: 3 },
  { id: "mock-6", name: "Felipe Santos", xp: 1700, level: 2, streak_days: 7 },
  { id: "mock-7", name: "Gabriela Lima", xp: 1200, level: 2, streak_days: 2 },
  { id: "mock-8", name: "Henrique Reis", xp: 800, level: 2, streak_days: 1 },
  { id: "mock-9", name: "Isabela Nunes", xp: 500, level: 1, streak_days: 4 },
];

export default async function RankingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const userXp = profile?.xp ?? 0;
  const { current } = getLevelInfo(userXp);

  // Merge real user into mock data and sort
  const allUsers = [
    {
      id: user.id,
      name: profile?.name || user.email?.split("@")[0] || "Você",
      xp: userXp,
      level: profile?.level ?? 1,
      streak_days: profile?.streak_days ?? 0,
      isCurrentUser: true,
    },
    ...MOCK_USERS.map(u => ({ ...u, isCurrentUser: false })),
  ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, position: i + 1 }));

  const userPosition = allUsers.find(u => u.isCurrentUser)?.position ?? 0;

  const podiumColors = ["#F59E0B", "#AAAAAA", "#CD7F32"];
  const podiumIcons = ["🥇", "🥈", "🥉"];

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Ranking
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Sua posição no time · Atualizado em tempo real
        </p>
      </div>

      {/* Your position banner */}
      <div style={{
        padding: "20px 24px",
        background: "var(--green-subtle)",
        border: "1px solid rgba(125,200,50,0.2)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "24px",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "var(--green-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "800",
          color: "var(--green-kiwi)",
        }}>
          #{userPosition}
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "14px" }}>Sua posição atual</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {userXp.toLocaleString()} XP · {current.title}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          {userPosition > 1 && (
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              <span style={{ color: "var(--green-kiwi)", fontWeight: "600" }}>
                {(allUsers[userPosition - 2].xp - userXp).toLocaleString()} XP
              </span>
              {" "}para o #{userPosition - 1}
            </div>
          )}
          {userPosition === 1 && (
            <div style={{ fontSize: "13px", color: "var(--green-kiwi)", fontWeight: "600" }}>
              🏆 Líder do ranking!
            </div>
          )}
        </div>
      </div>

      {/* Podium top 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {allUsers.slice(0, 3).map((u, i) => (
          <div key={u.id} className="card" style={{
            padding: "20px",
            textAlign: "center",
            borderColor: u.isCurrentUser ? "rgba(125,200,50,0.3)" : undefined,
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{podiumIcons[i]}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>
              {u.name}
              {u.isCurrentUser && <span style={{ fontSize: "11px", color: "var(--green-kiwi)", display: "block", fontWeight: "600" }}>Você</span>}
            </div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: podiumColors[i], marginBottom: "4px" }}>
              {u.xp.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>XP · Nível {u.level}</div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontWeight: "700", fontSize: "14px" }}>Todos os participantes</span>
        </div>
        {allUsers.map((u) => (
          <div key={u.id} style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            borderBottom: "1px solid var(--border)",
            background: u.isCurrentUser ? "var(--green-subtle)" : "transparent",
            transition: "background 0.15s",
          }}>
            {/* Position */}
            <div style={{
              width: "28px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "800",
              color: u.position <= 3 ? podiumColors[u.position - 1] : "var(--text-muted)",
              flexShrink: 0,
            }}>
              {u.position <= 3 ? podiumIcons[u.position - 1] : `#${u.position}`}
            </div>

            {/* Avatar */}
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: u.isCurrentUser ? "var(--green-muted)" : "var(--bg-elevated)",
              border: `1px solid ${u.isCurrentUser ? "rgba(125,200,50,0.3)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "700",
              color: u.isCurrentUser ? "var(--green-kiwi)" : "var(--text-muted)",
              flexShrink: 0,
            }}>
              {(u.name ?? "?")[0].toUpperCase()}
            </div>

            {/* Name */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: u.isCurrentUser ? "700" : "500" }}>
                {u.name}
                {u.isCurrentUser && <span style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600", marginLeft: "6px" }}>você</span>}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Nível {u.level}</div>
            </div>

            {/* Streak */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
              <Flame size={13} color="#F59E0B" />
              {u.streak_days}
            </div>

            {/* XP */}
            <div style={{ textAlign: "right", fontWeight: "700", fontSize: "14px", color: u.isCurrentUser ? "var(--green-kiwi)" : "var(--text-primary)" }}>
              {u.xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
