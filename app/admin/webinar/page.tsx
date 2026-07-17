import { supabase } from "@/lib/supabase";
import WebinarManagement from "@/components/admin/WebinarManagement";
import type { Webinar, WebinarQuestion } from "@/types";

export const metadata = { title: "Kelola Webinar" };

export default async function AdminWebinarPage() {
  const [{ data: webinars }, { data: questions }] = await Promise.all([
    supabase.from("Webinar").select("*").order("schedule", { ascending: false }),
    supabase.from("WebinarQuestion").select("*").order("sortOrder", { ascending: true }),
  ]);

  const webinarsList = (webinars || []) as Webinar[];
  const questionsList = (questions || []) as WebinarQuestion[];

  return <WebinarManagement initialWebinars={webinarsList} initialQuestions={questionsList} />;
}
