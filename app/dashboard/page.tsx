import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelInfo } from "@/lib/utils/xp";
import Link from "next/link";
import { Zap, Target, BookOpen, TrendingUp, ChevronRight, Lock, Flame, Star } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: simResults },
    { data: missions },
    { data: modules },
    { data: lessonProgress },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_simulation_results").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(5),
    supabase.from("daily_missions").select("*, user_daily_missions(*)").limit(3),
    supabase.from("modules").select("*").order("order_index"),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
  ]);

  const xp = profile?.xp ?? 0;
  const { current, next, percentage, progressXp, neededXp } = getLevelInfo(xp);
  const today = new Date().toISOString().split("T")[0];
  const todayMissions = missions?.map(m => {
    const userMission = (m.user_daily_missions as { date: string; completed: boolean }[])?.find(
      (um) => um.date === today
    );
    return { ...m, completed: userMission?.completed ?? false };
  });
  const completedMissionsToday = todayMissions?.filter(m => m.completed).length ?? 0;
  const totalSimulations = simResults?.length ?? 0;
  const avgScore = simResults && simResults.length > 0
    ? Math.round(simResults.reduce((acc, r) => acc + r.total_score, 0) / simResults.length)
    : 0;

  const sdrModules = modules?.filter(m => m.role === "SDR") ?? [];
  const totalLessons = sdrModules.reduce((acc, m) => acc + m.total_lessons, 0);
  const completedLessons = lessonProgress?.filter(p => p.completed).length ?? 0;
  const sdrProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Streak calendar (last 7 days)
  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  const streak = profile?.streak_days ?? 0;

  const lockedModules = [
    { title: "Closers", color: "#6366F1" },
    { title: "Gestores", color: "#8B5CF6" },
    { title: "Playbook", color: "#EC4899" },
    { title: "Análise de Calls", color: "#F59E0B" },
    { title: "CRM & Performance", color: "#06B6D4" },
  ];

  return (
    <div className="stagger">
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Seu painel de treinamento e performance comercial
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {/* XP */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>XP Total</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--green-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={14} color="var(--green-kiwi)" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--green-kiwi)", letterSpacing: "-0.02em" }}>
            {xp.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>pontos acumulados</div>
        </div>

        {/* Nível */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Nível</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--green-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color="var(--green-kiwi)" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            {profile?.level ?? 1}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{current.title}</div>
        </div>

        {/* Missões */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Missões Hoje</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--green-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={14} color="var(--green-kiwi)" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            {completedMissionsToday}<span style={{ color: "var(--text-muted)", fontSize: "18px" }}>/{todayMissions?.length ?? 0}</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>concluídas hoje</div>
        </div>

        {/* Simulações */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Simulações</span>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--green-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="var(--green-kiwi)" />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            {totalSimulations}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {avgScore > 0 ? `Nota média: ${avgScore}` : "Nenhuma ainda"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "24px" }}>
        {/* XP Progress + SDR Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Level progress */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>{current.title}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {progressXp.toLocaleString()} / {neededXp.toLocaleString()} XP para o próximo nível
                </div>
              </div>
              {next && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Próximo</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--green-kiwi)" }}>{next.title}</div>
                </div>
              )}
            </div>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: `${percentage}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Nível {profile?.level ?? 1}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{percentage}%</span>
              {next && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Nível {next.level}</span>}
            </div>
          </div>

          {/* SDR Module Progress */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>Trilha SDR</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {completedLessons} de {totalLessons} lições concluídas
                </div>
              </div>
              <span className="badge badge-green">{sdrProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${sdrProgress}%` }} />
            </div>
            <div style={{ marginTop: "16px" }}>
              <Link href="/dashboard/training" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ fontSize: "13px", padding: "8px 16px" }}>
                  Continuar trilha <ChevronRight size={14} />
                </button>
              </Link>
            </div>
          </div>

          {/* Recent simulations */}
          {simResults && simResults.length > 0 && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontWeight: "700", fontSize: "15px" }}>Simulações Recentes</span>
                <Link href="/dashboard/simulation" style={{ textDecoration: "none", fontSize: "13px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                  Ver todas
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {simResults.slice(0, 3).map((result, i) => (
                  <div key={result.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>Simulação concluída</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {new Date(result.completed_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: result.total_score >= 70 ? "var(--green-kiwi)" : result.total_score >= 50 ? "#F59E0B" : "#EF4444",
                      }}>{result.total_score}/100</span>
                      <span style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600" }}>+{result.xp_earned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Streak Calendar */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Flame size={16} color="#F59E0B" />
              <span style={{ fontWeight: "700", fontSize: "14px" }}>Sequência</span>
              <span className="badge badge-amber" style={{ marginLeft: "auto" }}>{streak} dias</span>
            </div>
            <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
              {days.map((day, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600" }}>{day}</span>
                  <div className={`streak-day ${i < streak % 7 ? "completed" : ""} ${i === (streak % 7) ? "today" : ""}`}>
                    {i < streak % 7 ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Missions */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>Missões do dia</span>
              <Link href="/dashboard/missions" style={{ textDecoration: "none", fontSize: "12px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                Ver todas
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(todayMissions ?? []).slice(0, 3).map((mission) => (
                <div key={mission.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    border: `1px solid ${mission.completed ? "var(--green-kiwi)" : "var(--border)"}`,
                    background: mission.completed ? "var(--green-muted)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}>
                    {mission.completed && <span style={{ fontSize: "10px", color: "var(--green-kiwi)" }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: mission.completed ? "var(--text-muted)" : "var(--text-primary)", textDecoration: mission.completed ? "line-through" : "none" }}>
                      {mission.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600" }}>+{mission.xp_reward} XP</div>
                  </div>
                </div>
              ))}
            </div>
            {completedMissionsToday === 0 && (
              <Link href="/dashboard/missions" style={{ textDecoration: "none", marginTop: "14px", display: "block" }}>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "13px", padding: "9px" }}>
                  Começar missões
                </button>
              </Link>
            )}
          </div>

          {/* Quick action: Start simulation */}
          <Link href="/dashboard/simulation" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "20px",
              background: "var(--green-subtle)",
              border: "1px solid rgba(125,200,50,0.2)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <Zap size={18} color="var(--green-kiwi)" />
                <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--green-kiwi)" }}>Simular agora</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Treine com leads reais e receba feedback imediato sobre sua abordagem.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Future modules preview */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontWeight: "700", fontSize: "16px", marginBottom: "2px" }}>Plataforma Completa</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Módulos em desenvolvimento para expandir sua operação</p>
          </div>
          <Link href="/dashboard/modules" style={{ textDecoration: "none", fontSize: "13px", color: "var(--green-kiwi)", fontWeight: "600" }}>
            Ver todos
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {lockedModules.map((mod) => (
            <div key={mod.title} className="card" style={{ padding: "16px", position: "relative", opacity: 0.6 }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: `${mod.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}>
                <Lock size={14} color={mod.color} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{mod.title}</div>
              <div className="badge badge-lock" style={{ fontSize: "10px" }}>Em breve</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
