import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Zap } from "lucide-react";

export default async function MissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: missions }, { data: userMissions }, { data: profile }] = await Promise.all([
    supabase.from("daily_missions").select("*"),
    supabase.from("user_daily_missions").select("*").eq("user_id", user.id).eq("date", today),
    supabase.from("profiles").select("streak_days, last_activity_date").eq("id", user.id).single(),
  ]);

  const missionMap = new Map(userMissions?.map(um => [um.mission_id, um]) ?? []);

  // Streak calendar — last 7 days
  const streakDays = profile?.streak_days ?? 0;
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today_d = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today_d);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const completedCount = missions?.filter(m => missionMap.get(m.id)?.completed).length ?? 0;
  const totalXpAvailable = missions?.reduce((acc, m) => acc + m.xp_reward, 0) ?? 0;
  const earnedXp = missions?.filter(m => missionMap.get(m.id)?.completed).reduce((acc, m) => acc + m.xp_reward, 0) ?? 0;

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Missões Diárias
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Complete as missões do dia para ganhar XP e manter sua sequência
        </p>
      </div>

      {/* Streak + Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "16px" }}>Sequência de dias</div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
            {last7.map((d, i) => {
              const dayDiff = Math.floor((today_d.getTime() - d.getTime()) / 86400000);
              const isActive = dayDiff < streakDays;
              const isToday = i === 6;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600" }}>
                    {weekDays[d.getDay()].slice(0,1)}
                  </span>
                  <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "600",
                    background: isActive ? "var(--green-muted)" : "var(--bg-elevated)",
                    border: `1px solid ${isActive ? "rgba(125,200,50,0.3)" : isToday ? "var(--green-kiwi)" : "var(--border)"}`,
                    color: isActive ? "var(--green-kiwi)" : isToday ? "var(--text-primary)" : "var(--text-muted)",
                  }}>
                    {isActive ? "✓" : d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
            Sequência atual: <strong style={{ color: "var(--green-kiwi)" }}>{streakDays} dias</strong>
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "12px" }}>Progresso de hoje</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: completedCount === missions?.length ? "var(--green-kiwi)" : "var(--text-primary)" }}>
              {completedCount}
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>de {missions?.length ?? 0} missões</div>
              <div style={{ fontSize: "12px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                {earnedXp}/{totalXpAvailable} XP
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${missions?.length ? (completedCount / missions.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Missions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {(missions ?? []).map((mission) => {
          const userMission = missionMap.get(mission.id);
          const isCompleted = userMission?.completed ?? false;

          return (
            <div key={mission.id} className="card" style={{
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              borderColor: isCompleted ? "rgba(125,200,50,0.15)" : undefined,
              opacity: isCompleted ? 0.7 : 1,
            }}>
              {/* Check */}
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: isCompleted ? "var(--green-muted)" : "var(--bg-elevated)",
                border: `1px solid ${isCompleted ? "rgba(125,200,50,0.3)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isCompleted
                  ? <CheckCircle size={18} color="var(--green-kiwi)" />
                  : <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--border)" }} />
                }
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "3px",
                  textDecoration: isCompleted ? "line-through" : "none",
                  color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
                }}>
                  {mission.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{mission.description}</div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: isCompleted ? "var(--text-muted)" : "var(--green-kiwi)", fontWeight: "700", fontSize: "14px" }}>
                  <Zap size={14} />
                  +{mission.xp_reward} XP
                </div>
                {!isCompleted && (
                  <Link href="/dashboard/simulation" style={{ textDecoration: "none" }}>
                    <button className="btn-primary" style={{ fontSize: "12px", padding: "6px 14px", marginTop: "8px" }}>
                      Completar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === missions?.length && missions?.length > 0 && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "var(--green-subtle)",
          border: "1px solid rgba(125,200,50,0.2)",
          borderRadius: "12px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "8px" }}>🎉</div>
          <div style={{ fontWeight: "700", marginBottom: "4px" }}>Todas as missões concluídas!</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Volte amanhã para novas missões. Sua sequência foi mantida!
          </div>
        </div>
      )}
    </div>
  );
}
