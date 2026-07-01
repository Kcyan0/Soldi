"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getXpForSimulation, getScoreLabel } from "@/lib/utils/xp";
import Link from "next/link";
import { ChevronLeft, User, Star, ChevronRight, RotateCcw } from "lucide-react";
import type { SimulationOption } from "@/types/supabase";

interface Simulation {
  id: string;
  title: string;
  context: string;
  lead_name: string;
  lead_company: string;
  lead_role: string;
  channel: string;
  difficulty: string;
}

interface Turn {
  id: string;
  turn_index: number;
  lead_message: string;
  options: SimulationOption[];
}

interface Props {
  simulation: Simulation;
  turns: Turn[];
  userId: string;
}

export default function SimulationEngine({ simulation, turns, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [currentTurn, setCurrentTurn] = useState(0);
  const [selectedOption, setSelectedOption] = useState<SimulationOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<{ turnIndex: number; option: SimulationOption }[]>([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const turn = turns[currentTurn];
  const progress = ((currentTurn) / turns.length) * 100;
  const isLastTurn = currentTurn === turns.length - 1;

  function handleSelect(option: SimulationOption) {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
  }

  async function handleNext() {
    if (!selectedOption) return;

    const newAnswers = [...answers, { turnIndex: currentTurn, option: selectedOption }];
    setAnswers(newAnswers);

    if (isLastTurn) {
      // Calculate final score
      const rawScore = newAnswers.reduce((acc, a) => acc + a.option.score, 0);
      const maxPossible = turns.length * 100;
      const finalScore = Math.round((rawScore / maxPossible) * 100);
      const xp = getXpForSimulation(finalScore);

      setSaving(true);
      setTotalScore(finalScore);
      setXpEarned(xp);

      // Build feedback
      const scoreLabel = getScoreLabel(finalScore);
      let feedbackText = `Nota: ${finalScore}/100 (${scoreLabel.label})\n\n`;
      feedbackText += newAnswers.map((a, i) =>
        `Turno ${i + 1}: "${a.option.text}" — ${a.option.feedback}`
      ).join("\n\n");

      // Save result
      await supabase.from("user_simulation_results").insert({
        user_id: userId,
        simulation_id: simulation.id,
        total_score: finalScore,
        xp_earned: xp,
        feedback: feedbackText,
        answers: newAnswers.map(a => ({ turnIndex: a.turnIndex, optionId: a.option.id, score: a.option.score })),
      });

      // Update XP in profile
      const { data: profile } = await supabase.from("profiles").select("xp").eq("id", userId).single();
      if (profile) {
        await supabase.from("profiles").update({ xp: profile.xp + xp }).eq("id", userId);
      }

      setSaving(false);
      setFinished(true);
      router.refresh();
    } else {
      setCurrentTurn(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  }

  function handleRestart() {
    setCurrentTurn(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setAnswers([]);
    setFinished(false);
    setTotalScore(0);
    setXpEarned(0);
  }

  const scoreInfo = getScoreLabel(totalScore);

  // Results screen
  if (finished) {
    return (
      <div className="stagger" style={{ maxWidth: "600px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="score-circle" style={{ margin: "0 auto 20px", width: "100px", height: "100px", fontSize: "28px" }}>
            {totalScore}
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>{scoreInfo.label}!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Simulação concluída — {simulation.title}</p>
        </div>

        {/* XP card */}
        <div className="card" style={{ padding: "20px", textAlign: "center", marginBottom: "20px", borderColor: "rgba(125,200,50,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Star size={20} color="var(--green-kiwi)" />
            <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--green-kiwi)" }}>+{xpEarned} XP</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>adicionados ao seu perfil</p>
        </div>

        {/* Answers review */}
        <div className="card" style={{ padding: "24px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px" }}>Análise das suas respostas</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {answers.map((answer, i) => {
              const turn = turns[answer.turnIndex];
              const bestOption = turn.options.find(o => o.is_best);
              const isCorrect = answer.option.score >= 80;

              return (
                <div key={i} style={{ paddingBottom: "16px", borderBottom: i < answers.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                    Turno {i + 1}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px", fontStyle: "italic" }}>
                    "{turn.lead_message.slice(0, 80)}..."
                  </div>
                  <div style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: isCorrect ? "var(--green-muted)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${isCorrect ? "rgba(125,200,50,0.2)" : "rgba(239,68,68,0.2)"}`,
                    marginBottom: "8px",
                  }}>
                    <div style={{ fontSize: "12px", color: isCorrect ? "var(--green-kiwi)" : "#EF4444", fontWeight: "600", marginBottom: "4px" }}>
                      Sua resposta ({answer.option.score}/100)
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{answer.option.text}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                    💬 {answer.option.feedback}
                  </div>
                  {!isCorrect && bestOption && (
                    <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "8px", background: "var(--green-subtle)", border: "1px solid rgba(125,200,50,0.15)" }}>
                      <div style={{ fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600", marginBottom: "4px", textTransform: "uppercase" }}>
                        Melhor resposta
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{bestOption.text}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleRestart} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
            <RotateCcw size={14} /> Refazer
          </button>
          <Link href="/dashboard/simulation" style={{ textDecoration: "none", flex: 1 }}>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Próxima simulação <ChevronRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stagger" style={{ maxWidth: "680px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/dashboard/simulation" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
          <ChevronLeft size={16} /> Simulações
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>{simulation.title}</h1>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {currentTurn + 1}/{turns.length}
          </span>
        </div>
        <div className="progress-bar" style={{ marginTop: "12px", height: "3px" }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Lead context card */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <User size={18} color="var(--text-muted)" />
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "14px" }}>{simulation.lead_name}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {simulation.lead_role} · {simulation.lead_company}
          </div>
        </div>
        {currentTurn === 0 && (
          <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", maxWidth: "200px", textAlign: "right", lineHeight: "1.4" }}>
            {simulation.context.slice(0, 80)}...
          </div>
        )}
      </div>

      {/* Lead message */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
          {simulation.lead_name} diz:
        </div>
        <div style={{
          padding: "16px 20px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          fontSize: "15px",
          color: "var(--text-primary)",
          lineHeight: "1.6",
          fontStyle: "italic",
        }}>
          "{turn.lead_message}"
        </div>
      </div>

      {/* Options */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
          Sua resposta:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {turn.options.map((option) => {
            let borderColor = "var(--border)";
            let bg = "var(--bg-elevated)";
            let color = "var(--text-primary)";

            if (showFeedback) {
              if (option.id === selectedOption?.id) {
                if (option.score >= 80) {
                  borderColor = "rgba(125,200,50,0.5)";
                  bg = "var(--green-muted)";
                  color = "var(--green-kiwi)";
                } else {
                  borderColor = "rgba(239,68,68,0.4)";
                  bg = "rgba(239,68,68,0.06)";
                  color = "#EF4444";
                }
              } else if (option.is_best) {
                borderColor = "rgba(125,200,50,0.3)";
                bg = "var(--green-subtle)";
                color = "var(--text-secondary)";
              }
            } else if (option.id === selectedOption?.id) {
              borderColor = "var(--green-kiwi)";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={showFeedback}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "10px",
                  padding: "14px 16px",
                  color: color,
                  fontSize: "14px",
                  cursor: showFeedback ? "default" : "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                }}
              >
                {option.text}
                {showFeedback && option.id === selectedOption?.id && (
                  <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.85, lineHeight: "1.5", fontStyle: "normal" }}>
                    {option.score >= 80 ? "✓ " : "✗ "}{option.feedback}
                  </div>
                )}
                {showFeedback && option.is_best && option.id !== selectedOption?.id && (
                  <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                    ← Melhor resposta
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score indicator & Next */}
      {showFeedback && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              fontSize: "14px",
              fontWeight: "700",
              color: (selectedOption?.score ?? 0) >= 80 ? "var(--green-kiwi)" : (selectedOption?.score ?? 0) >= 50 ? "#F59E0B" : "#EF4444",
            }}>
              {selectedOption?.score}/100
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>neste turno</div>
          </div>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={saving}
            style={{ fontSize: "14px" }}
          >
            {saving ? "Salvando..." : isLastTurn ? "Ver resultado" : "Próximo turno"}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
