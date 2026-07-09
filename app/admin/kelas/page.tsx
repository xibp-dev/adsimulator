import { supabase } from "@/lib/supabase";
import CourseManagement from "@/components/admin/CourseManagement";
import type { Course, Lesson } from "@/types";

export default async function AdminKelasPage() {
  const [{ data: courses }, { data: lessons }] = await Promise.all([
    supabase.from("Course").select("*").order("sortOrder", { ascending: true }),
    supabase.from("Lesson").select("*").order("sortOrder", { ascending: true }),
  ]);

  const lessonsList = (lessons || []) as Lesson[];
  const counts: Record<string, number> = {};
  lessonsList.forEach((l) => { counts[l.courseId] = (counts[l.courseId] || 0) + 1; });

  const coursesList = ((courses || []) as Course[]).map((c) => ({ ...c, lessonCount: counts[c.id] || 0 }));

  return <CourseManagement initialCourses={coursesList} initialLessons={lessonsList} />;
}
