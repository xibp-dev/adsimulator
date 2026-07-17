import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import WebinarDetailClient from "@/components/lms/WebinarDetailClient";
import type { Webinar, WebinarQuestion, WebinarAttempt } from "@/types";

export const metadata = { title: "Detail Webinar" };

export default async function WebinarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  // Query webinar detail
  const { data: webinar } = await supabase.from("Webinar").select("*").eq("id", id).single();
  if (!webinar) notFound();

  // Query questions, attempts, and registration status in parallel
  const [{ data: questions }, { data: attempts }, { data: registration }] = await Promise.all([
    supabase.from("WebinarQuestion").select("*").eq("webinarId", id).order("sortOrder", { ascending: true }),
    supabase.from("WebinarAttempt").select("*").eq("userId", session.user.id).eq("webinarId", id).order("createdAt", { ascending: false }),
    supabase.from("WebinarRegistration").select("id, createdAt").eq("userId", session.user.id).eq("webinarId", id).maybeSingle(),
  ]);

  return (
    <WebinarDetailClient
      webinar={webinar as Webinar}
      questions={(questions || []) as WebinarQuestion[]}
      attempts={(attempts || []) as WebinarAttempt[]}
      isRegistered={!!registration}
    />
  );
}
