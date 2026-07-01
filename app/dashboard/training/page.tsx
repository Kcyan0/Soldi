import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Lock, ChevronRight, BookOpen, FileQuestion, Zap } from "lucide-react";

export default async function TrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: modules }, { data: lessonProgress }] = await Promise.all([
    supabase.from("modules").select("*, lessons(*)").eq("role", "SDR").order("order_index"),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
  ]);

  const completedLessonIds = new Set(lessonProgress?.filter(p => p.completed).map(p => p.lesson_id) ?? []);

  return (
    <div className="stagger">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Trilha SDR
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Domine as habilidades essenciais de prospecção e qualificação
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {(modules ?? []).map((mod, index) => {
          const lessons = (mod.lessons as { id: string; title: string; lesson_type: string; xp_reward: number; order_index: number }[]) ?? [];
          const completedCount = lessons.filter(l => completedLessonIds.has(l.id)).length;
          const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
          const isLocked = mod.is_locked;
          const isCompleted = completedCount === lessons.length && lessons.length > 0;

          return (
            <div
              key={mod.id}
              className="card"
              style={{
                padding: "24px",
                opacity: isLocked ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                {/* Order number */}
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: isCompleted ? "var(--green-muted)" : isLocked ? "var(--bg-elevated)" : "var(--bg-elevated)",
                  border: `1px solid ${isCompleted ? "rgba(125,200,50,0.3)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontWeight: "800",
                  fontSize: "14px",
                  color: isCompleted ? "var(--green-kiwi)" : "var(--text-muted)",
                }}>
                  {isCompleted ? <CheckCircle size={18} color="var(--green-kiwi)" /> : isLocked ? <Lock size={16} /> : index + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700" }}>{mod.title}</h3>
                    {isCompleted && <span className="badge badge-green">Concluído</span>}
                    {isLocked && <span className="badge badge-lock"><Lock size={8} /> Bloqueado</span>}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "14px" }}>
                    {mod.description}
                  </p>

                  {/* Progress */}
                  {!isLocked && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ flex: 1 }}>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                          {completedCount}/{lessons.length} lições
                        </span>
                      </div>

                      {/* Lessons preview */}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {lessons.sort((a,b) => a.order_index - b.order_index).map((lesson) => {
                          const Icon = lesson.lesson_type === "theory" ? BookOpen : lesson.lesson_type === "quiz" ? FileQuestion : Zap;
                          const isLessonDone = completedLessonIds.has(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                background: isLessonDone ? "var(--green-muted)" : "var(--bg-elevated)",
                                border: `1px solid ${isLessonDone ? "rgba(125,200,50,0.2)" : "var(--border)"}`,
                                fontSize: "12px",
                                color: isLessonDone ? "var(--green-kiwi)" : "var(--text-muted)",
                              }}
                            >
                              <Icon size={11} />
                              {lesson.title}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                {!isLocked && (
                  <Link href={`/dashboard/training/${mod.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                    <button className={isCompleted ? "btn-secondary" : "btn-primary"} style={{ fontSize: "13px", padding: "9px 16px" }}>
                      {isCompleted ? "Revisar" : completedCount > 0 ? "Continuar" : "Começar"}
                      <ChevronRight size={14} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
