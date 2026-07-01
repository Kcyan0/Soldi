import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import LessonViewer from "@/components/training/LessonViewer";

interface PageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: lesson }, { data: mod }, { data: progress }] = await Promise.all([
    supabase.from("lessons").select("*").eq("id", lessonId).single(),
    supabase.from("modules").select("id, title, slug").eq("id", moduleId).single(),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id).eq("lesson_id", lessonId).single(),
  ]);

  if (!lesson || !mod) notFound();

  return (
    <LessonViewer
      lesson={lesson}
      moduleId={moduleId}
      moduleTitle={mod.title}
      userId={user.id}
      isCompleted={progress?.completed ?? false}
    />
  );
}
