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
    question: "Como um SDR deve agir diante de uma objeção logo nos primeiros segundos da ligação?",
    options: [
      "Ignorar a objeção e continuar lendo o script",
      "Escutar ativamente, validar a objeção e contornar fazendo uma pergunta",
      "Desligar imediatamente para não perder tempo",
      "Tentar vender e empurrar o produto a todo custo",
    ],
    correct: 1,
    explanation: "A objeção inicial muitas vezes é apenas um reflexo de defesa. O SDR de sucesso escuta, demonstra empatia (valida) e usa perguntas abertas para entender a real situação do lead.",
  },
];

export default function LessonViewer({ lesson, moduleId, moduleTitle, userId, isCompleted }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);

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

  // Render markdown-like content
  function renderContent(content: string) {
    const normalizedContent = content.replace(/\\n/g, '\n');
    return normalizedContent.split("\n").map((line, i) => {
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
        {/* Theory/Activity lesson */}
        <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
          <div style={{ lineHeight: "1.7" }}>
            {renderContent(lesson.content)}
          </div>
        </div>

        {/* Complete button */}
        <button
          onClick={() => markComplete()}
          disabled={completed || loading}
          className={completed ? "btn-secondary" : "btn-primary"}
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          {loading ? "Salvando..." : completed ? <><CheckCircle size={16} /> Concluído</> : "Marcar como concluído"}
        </button>

        {/* Navigation */}
        {completed && (
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
