"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Star } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  xp_reward: number;
}

interface Props {
  lesson: Lesson;
  moduleId: string;
  moduleTitle: string;
  userId: string;
  isCompleted: boolean;
}

const QUIZ_QUESTIONS = [
  {
    question: "Qual é o principal objetivo do SDR na operação de vendas?",
    options: [
      "Fechar contratos com leads qualificados",
      "Qualificar leads e agendar reuniões para os closers",
      "Gerenciar o CRM da equipe",
      "Criar campanhas de marketing",
    ],
    correct: 1,
    explanation: "O SDR é responsável pela prospecção e qualificação de leads, não pelo fechamento. O objetivo é entregar leads qualificados para os closers.",
  },
  {
    question: "No framework BANT, o que significa a letra 'A'?",
    options: ["Amount (Valor)", "Authority (Autoridade)", "Ability (Capacidade)", "Awareness (Conscientização)"],
    correct: 1,
    explanation: "BANT = Budget, Authority, Need, Timeline. 'A' representa Authority — se o lead tem poder de decisão.",
  },
  {
    question: "Qual canal tende a ter a maior taxa de resposta?",
    options: ["Cold Email", "Cold Call", "WhatsApp", "LinkedIn"],
    correct: 2,
    explanation: "O WhatsApp tem taxas de resposta de 40-60% quando usado corretamente, pois é um canal mais pessoal e direto.",
  },
];

export default function LessonViewer({ lesson, moduleId, moduleTitle, userId, isCompleted }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const isQuiz = lesson.lesson_type === "quiz";

  async function markComplete(score?: number) {
    if (completed) return;
    setLoading(true);

    // Upsert progress
    await supabase.from("user_lesson_progress").upsert({
      user_id: userId,
      lesson_id: lesson.id,
      completed: true,
      score: score ?? null,
      completed_at: new Date().toISOString(),
    });

    // Update XP in profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", userId)
      .single();

    if (profile) {
      const newXp = (profile.xp ?? 0) + lesson.xp_reward;
      await supabase.from("profiles").update({ xp: newXp }).eq("id", userId);
    }

    setCompleted(true);
    setLoading(false);
    router.refresh();
  }

  function handleQuizAnswer(optionIndex: number) {
    if (showAnswer) return;
    setSelected(optionIndex);
    setShowAnswer(true);
    const q = QUIZ_QUESTIONS[quizStep];
    if (optionIndex === q.correct) {
      setQuizScore(prev => prev + 1);
    }
  }

  async function handleNextQuestion() {
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setQuizDone(true);
      const pct = Math.round((quizScore + (selected === QUIZ_QUESTIONS[quizStep].correct ? 1 : 0)) / QUIZ_QUESTIONS.length * 100);
      await markComplete(pct);
    }
  }

  const finalScore = Math.round((quizScore / QUIZ_QUESTIONS.length) * 100);

  // Render markdown-like content
  function renderContent(content: string) {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", marginTop: "24px" }}>{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px", marginTop: "20px", color: "var(--text-primary)" }}>{line.slice(4)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: "700", marginBottom: "6px", color: "var(--green-kiwi)" }}>{line.slice(2, -2)}</p>;
      if (line.startsWith("- ")) return <li key={i} style={{ marginLeft: "20px", marginBottom: "6px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>{line.slice(2)}</li>;
      if (line.startsWith("| ") && !line.startsWith("| ---")) {
        const cols = line.split("|").filter(c => c.trim()).map(c => c.trim());
        return <div key={i} style={{ display: "flex", gap: "1px", marginBottom: "1px" }}>
          {cols.map((col, j) => <div key={j} style={{ flex: 1, padding: "8px 12px", background: "var(--bg-elevated)", fontSize: "13px" }}>{col}</div>)}
        </div>;
      }
      if (line.startsWith("> ")) return <blockquote key={i} style={{ borderLeft: "3px solid var(--green-kiwi)", paddingLeft: "12px", margin: "12px 0", color: "var(--text-secondary)", fontStyle: "italic", fontSize: "14px" }}>{line.slice(2)}</blockquote>;
      if (line === "") return <br key={i} />;
      return <p key={i} style={{ marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7" }}>{line}</p>;
    });
  }

  return (
    <div className="stagger">
      <div style={{ marginBottom: "24px" }}>
        <Link href={`/dashboard/training/${moduleId}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
          <ChevronLeft size={16} /> {moduleTitle}
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", flex: 1 }}>{lesson.title}</h1>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--green-kiwi)", fontWeight: "700" }}>
            <Star size={14} /> +{lesson.xp_reward} XP
          </span>
          {completed && <span className="badge badge-green"><CheckCircle size={10} /> Concluído</span>}
        </div>
      </div>

      <div style={{ maxWidth: "680px" }}>
        {/* Theory lesson */}
        {!isQuiz && (
          <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
            <div style={{ lineHeight: "1.7" }}>
              {renderContent(lesson.content)}
            </div>
          </div>
        )}

        {/* Quiz lesson */}
        {isQuiz && !quizDone && (
          <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Pergunta {quizStep + 1} de {QUIZ_QUESTIONS.length}
              </span>
              <div className="progress-bar" style={{ width: "120px" }}>
                <div className="progress-bar-fill" style={{ width: `${((quizStep) / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
            </div>

            <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "24px", lineHeight: "1.4" }}>
              {QUIZ_QUESTIONS[quizStep].question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => {
                let bgColor = "var(--bg-elevated)";
                let borderColor = "var(--border)";
                let textColor = "var(--text-primary)";

                if (showAnswer) {
                  if (i === QUIZ_QUESTIONS[quizStep].correct) {
                    bgColor = "var(--green-muted)";
                    borderColor = "rgba(125,200,50,0.4)";
                    textColor = "var(--green-kiwi)";
                  } else if (i === selected && i !== QUIZ_QUESTIONS[quizStep].correct) {
                    bgColor = "rgba(239,68,68,0.08)";
                    borderColor = "rgba(239,68,68,0.3)";
                    textColor = "#EF4444";
                  }
                } else if (i === selected) {
                  borderColor = "var(--green-kiwi)";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={showAnswer}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "10px",
                      padding: "14px 16px",
                      color: textColor,
                      fontSize: "14px",
                      cursor: showAnswer ? "default" : "pointer",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showAnswer && (
              <div style={{ padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: "8px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Explicação: </strong>
                  {QUIZ_QUESTIONS[quizStep].explanation}
                </p>
              </div>
            )}

            {showAnswer && (
              <button className="btn-primary" onClick={handleNextQuestion} style={{ fontSize: "14px" }}>
                {quizStep < QUIZ_QUESTIONS.length - 1 ? "Próxima pergunta" : "Ver resultado"}
              </button>
            )}
          </div>
        )}

        {/* Quiz done */}
        {isQuiz && quizDone && (
          <div className="card" style={{ padding: "40px", textAlign: "center", marginBottom: "24px" }}>
            <div className="score-circle" style={{ margin: "0 auto 20px" }}>
              {finalScore}
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Quiz concluído!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              Você acertou {quizScore} de {QUIZ_QUESTIONS.length} perguntas.
            </p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--green-kiwi)", fontWeight: "700", fontSize: "16px" }}>
              <Star size={18} /> +{lesson.xp_reward} XP ganhos!
            </span>
          </div>
        )}

        {/* Complete button for theory */}
        {!isQuiz && (
          <button
            onClick={() => markComplete()}
            disabled={completed || loading}
            className={completed ? "btn-secondary" : "btn-primary"}
            style={{ fontSize: "14px", padding: "12px 24px" }}
          >
            {loading ? "Salvando..." : completed ? <><CheckCircle size={16} /> Concluído</> : "Marcar como concluído"}
          </button>
        )}

        {/* Navigation */}
        {(completed || quizDone) && (
          <div style={{ marginTop: "16px" }}>
            <Link href={`/dashboard/training/${moduleId}`} style={{ textDecoration: "none" }}>
              <button className="btn-secondary" style={{ fontSize: "13px" }}>
                <ChevronLeft size={14} /> Voltar ao módulo
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
