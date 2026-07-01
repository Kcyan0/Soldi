import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, Link2, MessageCircle, Zap, ChevronRight } from "lucide-react";


const channelConfig = {
  cold_call: { label: "Cold Call", icon: Phone, color: "#7DC832" },
  email: { label: "Cold Email", icon: Mail, color: "#6366F1" },
  linkedin: { label: "LinkedIn", icon: Link2, color: "#06B6D4" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "#10B981" },
};


const difficultyConfig = {
  easy: { label: "Iniciante", color: "#10B981" },
  medium: { label: "Intermediário", color: "#F59E0B" },
  hard: { label: "Avançado", color: "#EF4444" },
};

export default async function SimulationListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: simulations }, { data: results }] = await Promise.all([
    supabase.from("simulations").select("*").order("difficulty"),
    supabase.from("user_simulation_results").select("*").eq("user_id", user.id),
  ]);

  const resultsBySimId = (results ?? []).reduce((acc, r) => {
    if (!acc[r.simulation_id] || r.total_score > acc[r.simulation_id].total_score) {
      acc[r.simulation_id] = r;
    }
    return acc;
  }, {} as Record<string, { total_score: number; xp_earned: number; completed_at: string }>);

  const totalDone = Object.keys(resultsBySimId).length;
  const avgScore = results && results.length > 0
    ? Math.round(results.reduce((a, r) => a + r.total_score, 0) / results.length)
    : 0;

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Simulações
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Treine com situações reais de vendas e receba feedback detalhado
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Concluídas</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--green-kiwi)" }}>{totalDone}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>de {simulations?.length ?? 0} disponíveis</div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Nota Média</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: avgScore >= 70 ? "var(--green-kiwi)" : avgScore >= 50 ? "#F59E0B" : "var(--text-primary)" }}>
            {avgScore > 0 ? avgScore : "—"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{avgScore > 0 ? "pontos" : "Nenhuma feita"}</div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>XP de Simulações</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--green-kiwi)" }}>
            {results?.reduce((a, r) => a + r.xp_earned, 0) ?? 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>XP acumulado</div>
        </div>
      </div>

      {/* Simulations list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {(simulations ?? []).map((sim) => {
          const channel = channelConfig[sim.channel as keyof typeof channelConfig];
          const difficulty = difficultyConfig[sim.difficulty as keyof typeof difficultyConfig];
          const bestResult = resultsBySimId[sim.id];
          const Icon = channel.icon;

          return (
            <Link key={sim.id} href={`/dashboard/simulation/${sim.id}`} style={{ textDecoration: "none" }}>
              <div
                className="card"
                style={{
                  padding: "24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  transition: "all 0.15s",
                  cursor: "pointer",
                  borderColor: bestResult ? "rgba(125,200,50,0.12)" : undefined,
                }}
              >
                {/* Channel icon */}
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${channel.color}14`,
                  border: `1px solid ${channel.color}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={18} color={channel.color} />
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700" }}>{sim.title}</h3>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px", lineHeight: "1.5" }}>
                    {sim.context.slice(0, 100)}...
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      background: `${channel.color}14`,
                      color: channel.color,
                      border: `1px solid ${channel.color}28`,
                    }}>
                      <Icon size={10} /> {channel.label}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      background: `${difficulty.color}14`,
                      color: difficulty.color,
                      border: `1px solid ${difficulty.color}28`,
                    }}>
                      {difficulty.label}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {sim.lead_name} · {sim.lead_company}
                    </span>
                  </div>
                </div>

                {/* Result or CTA */}
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  {bestResult ? (
                    <div>
                      <div style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: bestResult.total_score >= 70 ? "var(--green-kiwi)" : bestResult.total_score >= 50 ? "#F59E0B" : "#EF4444",
                      }}>
                        {bestResult.total_score}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>melhor nota</div>
                      <div style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600", marginTop: "4px" }}>
                        Refazer
                      </div>
                    </div>
                  ) : (
                    <button className="btn-primary" style={{ fontSize: "13px", padding: "9px 16px" }}>
                      Simular <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
