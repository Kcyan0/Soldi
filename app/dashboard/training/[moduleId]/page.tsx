import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, BookOpen, FileQuestion, Zap, Star } from "lucide-react";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { moduleId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: mod }, { data: lessonProgress }] = await Promise.all([
    supabase.from("modules").select("*, lessons(*)").eq("id", moduleId).single(),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
  ]);

  if (!mod || mod.is_locked) notFound();

  const lessons = ((mod.lessons as { id: string; title: string; lesson_type: string; xp_reward: number; order_index: number; content: string }[]) ?? [])
    .sort((a, b) => a.order_index - b.order_index);

  const completedIds = new Set(lessonProgress?.filter(p => p.completed).map(p => p.lesson_id) ?? []);
  const completedCount = lessons.filter(l => completedIds.has(l.id)).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const typeIcon = (type: string) => {
    if (type === "theory") return BookOpen;
    if (type === "quiz") return FileQuestion;
    return Zap;
  };

  const typeLabel = (type: string) => {
    if (type === "theory") return "Teoria";
    if (type === "quiz") return "Quiz";
    return "Simulação";
  };

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard/training" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
          <ChevronLeft size={16} /> Voltar à trilha
        </Link>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          {mod.title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
          {mod.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, maxWidth: "300px" }}>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{completedCount}/{lessons.length} lições</span>
          {progress === 100 && <span className="badge badge-green"><CheckCircle size={10} /> Concluído</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {lessons.map((lesson, index) => {
          const Icon = typeIcon(lesson.lesson_type);
          const isDone = completedIds.has(lesson.id);
          const isSimulation = lesson.lesson_type === "simulation";

          return (
            <Link
              key={lesson.id}
              href={isSimulation ? "/dashboard/simulation" : `/dashboard/training/${mod.id}/${lesson.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="card"
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.15s",
                  cursor: "pointer",
                  borderColor: isDone ? "rgba(125,200,50,0.15)" : undefined,
                }}
              >
                {/* Number/Check */}
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: isDone ? "var(--green-muted)" : "var(--bg-elevated)",
                  border: `1px solid ${isDone ? "rgba(125,200,50,0.3)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "13px",
                  fontWeight: "700",
                  color: isDone ? "var(--green-kiwi)" : "var(--text-muted)",
                }}>
                  {isDone ? <CheckCircle size={16} color="var(--green-kiwi)" /> : index + 1}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: isDone ? "var(--text-secondary)" : "var(--text-primary)", marginBottom: "3px" }}>
                    {lesson.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                      <Icon size={11} /> {typeLabel(lesson.lesson_type)}
                    </span>
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--text-muted)", display: "inline-block" }} />
                    <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "var(--green-kiwi)", fontWeight: "600" }}>
                      <Star size={10} /> {lesson.xp_reward} XP
                    </span>
                  </div>
                </div>

                {isDone
                  ? <span className="badge badge-green">Feito</span>
                  : <button className="btn-primary" style={{ fontSize: "12px", padding: "7px 14px" }}>
                      {lesson.lesson_type === "simulation" ? "Simular" : "Estudar"}
                    </button>
                }
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
