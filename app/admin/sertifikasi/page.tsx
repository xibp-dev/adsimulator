import { supabase } from "@/lib/supabase";
import ExamManagement from "@/components/admin/ExamManagement";
import type { Course, ExamQuestion, Program } from "@/types";

export default async function AdminSertifikasiPage() {
  const [{ data: programsRaw }, { data: coursesRaw }, { data: questionsRaw }] = await Promise.all([
    supabase.from("Program").select("id, title, thumbnailEmoji, sortOrder").order("sortOrder", { ascending: true }),
    supabase.from("Course").select("id, title, programId, thumbnailEmoji, level, sortOrder").order("sortOrder", { ascending: true }),
    supabase.from("ExamQuestion").select("*").order("sortOrder", { ascending: true }),
  ]);

  const programs = (programsRaw || []) as Program[];
  const courses = (coursesRaw || []) as Course[];

  // Grouping by Class (Program)
  const classesList = programs.map((p) => {
    const progCourses = courses.filter((c) => c.programId === p.id);
    return {
      id: p.id,
      title: p.title,
      thumbnailEmoji: p.thumbnailEmoji,
      courses: progCourses.map((c) => ({ id: c.id, title: c.title })),
    };
  });

  // Fallback for courses not assigned to any Program
  const unassignedCourses = courses.filter((c) => !c.programId);
  if (unassignedCourses.length > 0) {
    classesList.push({
      id: "unassigned",
      title: "Kelas Umum / Lainnya",
      thumbnailEmoji: "📚",
      courses: unassignedCourses.map((c) => ({ id: c.id, title: c.title })),
    });
  }

  return (
    <ExamManagement
      initialClasses={classesList}
      initialQuestions={(questionsRaw || []) as ExamQuestion[]}
    />
  );
}
