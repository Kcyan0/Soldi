import { Lock } from "lucide-react";

const FUTURE_MODULES = [
  {
    title: "Closers",
    description: "Técnicas de negociação avançada, fechamento, proposta de valor e gestão de objeções para closers.",
    icon: "🎯",
    color: "#6366F1",
    role: "CLOSER",
    lessons: 8,
  },
  {
    title: "Gestores Comerciais",
    description: "Gestão de pipeline, coaching de time, análise de métricas e previsibilidade de receita.",
    icon: "📊",
    color: "#8B5CF6",
    role: "GESTOR",
    lessons: 6,
  },
  {
    title: "Playbook Comercial",
    description: "Construa e documente o playbook de vendas da sua operação com templates e frameworks prontos.",
    icon: "📋",
    color: "#EC4899",
    role: "PLAYBOOK",
    lessons: 5,
  },
  {
    title: "Análise de Calls",
    description: "Analise suas calls de vendas com feedback automático e identifique pontos de melhoria.",
    icon: "🎤",
    color: "#F59E0B",
    role: "CALLS",
    lessons: 4,
  },
  {
    title: "CRM & Performance",
    description: "Acompanhe métricas de pipeline, taxa de conversão, forecast e performance individual.",
    icon: "💹",
    color: "#06B6D4",
    role: "CRM",
    lessons: 7,
  },
  {
    title: "Onboarding",
    description: "Trilhas de onboarding estruturadas para integrar novos vendedores em menos tempo.",
    icon: "🚀",
    color: "#10B981",
    role: "ONBOARDING",
    lessons: 5,
  },
  {
    title: "Ranking de Times",
    description: "Gamificação avançada com ranking de times, campanhas de incentivo e metas coletivas.",
    icon: "🏆",
    color: "#F97316",
    role: "RANKING",
    lessons: 3,
  },
  {
    title: "Ops de Vendas",
    description: "Automações, integrações e processos para escalar sua operação de vendas com eficiência.",
    icon: "⚙️",
    color: "#64748B",
    role: "OPS",
    lessons: 6,
  },
];

export default function ModulesPage() {
  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Plataforma Completa
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          A Soldi está sendo construída para cobrir toda a jornada comercial do seu time
        </p>
      </div>

      {/* Active module */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Disponível agora
        </p>
        <div style={{
          padding: "24px",
          background: "var(--green-subtle)",
          border: "1px solid rgba(125,200,50,0.25)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "var(--green-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
          }}>
            📞
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "17px", fontWeight: "800" }}>Módulo SDR</span>
              <span className="badge badge-green">Ativo</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Treinamento completo para SDRs: abordagem, qualificação, objeções, follow-up, agendamento e passagem para o closer.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
              <span>7 módulos</span>
              <span>·</span>
              <span>21 lições</span>
              <span>·</span>
              <span>5 simulações</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future modules */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Em desenvolvimento
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {FUTURE_MODULES.map((mod) => (
            <div key={mod.title} className="card" style={{
              padding: "20px",
              opacity: 0.55,
              position: "relative",
              transition: "opacity 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `${mod.color}14`,
                  border: `1px solid ${mod.color}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700" }}>{mod.title}</span>
                    <Lock size={12} color="var(--text-muted)" />
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "10px" }}>
                    {mod.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{mod.lessons} lições planejadas</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      background: "var(--bg-elevated)",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      border: "1px solid var(--border)",
                    }}>Em breve</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: "28px",
        padding: "24px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
          Quer ser avisado quando novos módulos lançarem?
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Continue treinando no módulo SDR e você será notificado em primeira mão.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "var(--bg-elevated)", border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-muted)" }}>
          🔔 Notificações ativadas automaticamente
        </div>
      </div>
    </div>
  );
}
