import { supabaseAdmin } from "@/lib/supabase";
import CourseManagement from "@/components/admin/CourseManagement";
import type { Course, Lesson, Program } from "@/types";

export const metadata = { title: "Kelola Kelas & Program" };

export default async function AdminKelasPage() {
  const [{ data: programs }, { data: courses }, { data: lessons }] = await Promise.all([
    supabaseAdmin.from("Program").select("*").order("sortOrder", { ascending: true }),
    supabaseAdmin.from("Course").select("*").order("sortOrder", { ascending: true }),
    supabaseAdmin.from("Lesson").select("*").order("sortOrder", { ascending: true }),
  ]);

  const lessonsList = (lessons || []) as Lesson[];
  const counts: Record<string, number> = {};
  lessonsList.forEach((l) => { counts[l.courseId] = (counts[l.courseId] || 0) + 1; });

  const coursesList = ((courses || []) as Course[]).map((c) => ({ ...c, lessonCount: counts[c.id] || 0 }));
  const programsList = (programs || []) as Program[];

  return (
    <CourseManagement
      initialCourses={coursesList}
      initialLessons={lessonsList}
      initialPrograms={programsList}
    />
  );
}
