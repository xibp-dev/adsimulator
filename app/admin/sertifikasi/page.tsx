import { supabase } from "@/lib/supabase";
import ExamManagement from "@/components/admin/ExamManagement";
import type { Course, ExamQuestion } from "@/types";

export default async function AdminSertifikasiPage() {
  const [{ data: courses }, { data: questions }] = await Promise.all([
    supabase.from("Course").select("id, title, thumbnailEmoji, level, sortOrder").order("sortOrder", { ascending: true }),
    supabase.from("ExamQuestion").select("*").order("sortOrder", { ascending: true }),
  ]);

  const coursesList = ((courses || []) as Pick<Course, "id" | "title" | "thumbnailEmoji" | "level" | "sortOrder">[]).map((c) => ({
    id: c.id, title: c.title, thumbnailEmoji: c.thumbnailEmoji, level: c.level,
  }));

  return <ExamManagement initialCourses={coursesList} initialQuestions={(questions || []) as ExamQuestion[]} />;
}
