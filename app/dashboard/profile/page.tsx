import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelInfo } from "@/lib/utils/xp";
import { Flame, Star, Zap, Target, BookOpen } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: simResults },
    { data: achievements },
    { data: userAchievements },
    { data: lessonProgress },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_simulation_results").select("*").eq("user_id", user.id),
    supabase.from("achievements").select("*"),
    supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", user.id),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id).eq("completed", true),
  ]);

  const xp = profile?.xp ?? 0;
  const { current, next, percentage, progressXp, neededXp } = getLevelInfo(xp);

  const avgScore = simResults && simResults.length > 0
    ? Math.round(simResults.reduce((a, r) => a + r.total_score, 0) / simResults.length)
    : 0;
  const bestScore = simResults?.length ? Math.max(...simResults.map(r => r.total_score)) : 0;
  const totalSimXp = simResults?.reduce((a, r) => a + r.xp_earned, 0) ?? 0;

  const unlockedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) ?? []);
  const displayName = profile?.name || user.email?.split("@")[0] || "Usuário";

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>Perfil</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Seu progresso e conquistas na Soldi</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Profile card */}
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--green-muted)",
              border: "2px solid rgba(125,200,50,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "800",
              color: "var(--green-kiwi)",
            }}>
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "800", marginBottom: "2px" }}>{displayName}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{user.email}</div>
              <span className="badge badge-green" style={{ marginTop: "6px", display: "inline-flex" }}>
                {current.title}
              </span>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>Nível {profile?.level ?? 1}</span>
              {next && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>→ Nível {next.level}: {next.title}</span>}
            </div>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: `${percentage}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600" }}>{progressXp.toLocaleString()} XP</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{neededXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Star size={14} color="var(--green-kiwi)" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>XP Total</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--green-kiwi)" }}>{xp.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Flame size={14} color="#F59E0B" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Streak</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800" }}>{profile?.streak_days ?? 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>dias seguidos</div>
          </div>
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Zap size={14} color="var(--green-kiwi)" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Simulações</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800" }}>{simResults?.length ?? 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Nota média: {avgScore > 0 ? avgScore : "—"}
            </div>
          </div>
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <BookOpen size={14} color="var(--green-kiwi)" />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Lições</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: "800" }}>{lessonProgress?.length ?? 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>concluídas</div>
          </div>
        </div>
      </div>

      {/* Simulation history */}
      {simResults && simResults.length > 0 && (
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: "700", fontSize: "15px" }}>Histórico de Simulações</span>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Melhor nota</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--green-kiwi)" }}>{bestScore}/100</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>XP de sims</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--green-kiwi)" }}>{totalSimXp}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {simResults.slice(0, 8).map((result, i) => (
              <div key={result.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
                borderBottom: i < simResults.slice(0, 8).length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: result.total_score >= 70 ? "var(--green-muted)" : result.total_score >= 50 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: result.total_score >= 70 ? "var(--green-kiwi)" : result.total_score >= 50 ? "#F59E0B" : "#EF4444",
                }}>
                  {result.total_score}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>Simulação concluída</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(result.completed_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span style={{ fontSize: "12px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                  +{result.xp_earned} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{ fontWeight: "700", fontSize: "15px" }}>Conquistas</span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {unlockedAchievementIds.size}/{achievements?.length ?? 0} desbloqueadas
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
          {(achievements ?? []).map((achievement) => {
            const isUnlocked = unlockedAchievementIds.has(achievement.id);
            return (
              <div key={achievement.id} style={{
                padding: "14px",
                borderRadius: "10px",
                background: isUnlocked ? "var(--green-subtle)" : "var(--bg-elevated)",
                border: `1px solid ${isUnlocked ? "rgba(125,200,50,0.2)" : "var(--border)"}`,
                opacity: isUnlocked ? 1 : 0.4,
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{achievement.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "3px", color: isUnlocked ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {achievement.title}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                  {achievement.description}
                </div>
                {isUnlocked && (
                  <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                    +{achievement.xp_reward} XP
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
