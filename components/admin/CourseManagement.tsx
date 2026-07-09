"use client";

import { useState } from "react";
import {
  GraduationCap, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader2, X, Check,
  Lock, Eye, EyeOff, BookOpen, AlertCircle,
} from "lucide-react";

interface Course {
  id: string; slug: string; title: string; description: string; level: string;
  category: string; thumbnailEmoji: string; accent: string; isFree: boolean;
  sortOrder: number; published: boolean; createdAt: string; lessonCount?: number;
}
interface Lesson {
  id: string; courseId: string; section: string; title: string; description: string;
  videoUrl: string; durationMin: number; content: string; isPreview: boolean; sortOrder: number; createdAt: string;
}

const ACCENTS = [
  { key: "blue", cls: "bg-blue-500" }, { key: "violet", cls: "bg-violet-500" },
  { key: "pink", cls: "bg-pink-500" }, { key: "emerald", cls: "bg-emerald-500" },
  { key: "amber", cls: "bg-amber-500" }, { key: "indigo", cls: "bg-indigo-500" },
];
const LEVELS = ["Pemula", "Menengah", "Lanjutan"];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

const emptyCourse = (): Partial<Course> => ({
  title: "", slug: "", description: "", level: "Pemula", category: "Meta Ads",
  thumbnailEmoji: "📘", accent: "blue", isFree: false, sortOrder: 0, published: true,
});
const emptyLesson = (courseId: string): Partial<Lesson> => ({
  courseId, section: "Umum", title: "", description: "", videoUrl: "",
  durationMin: 5, content: "", isPreview: false, sortOrder: 0,
});

export default function CourseManagement({
  initialCourses, initialLessons,
}: { initialCourses: Course[]; initialLessons: Lesson[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, Lesson[]>>(() => {
    const map: Record<string, Lesson[]> = {};
    initialLessons.forEach((l) => { (map[l.courseId] ??= []).push(l); });
    return map;
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  // Modal kelas
  const [courseModal, setCourseModal] = useState<{ open: boolean; editing: Course | null; form: Partial<Course>; slugTouched: boolean }>({ open: false, editing: null, form: emptyCourse(), slugTouched: false });
  // Modal pelajaran
  const [lessonModal, setLessonModal] = useState<{ open: boolean; courseId: string; editing: Lesson | null; form: Partial<Lesson> }>({ open: false, courseId: "", editing: null, form: {} });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ─── Kelas ───
  function openNewCourse() {
    setErr(""); setCourseModal({ open: true, editing: null, form: emptyCourse(), slugTouched: false });
  }
  function openEditCourse(c: Course) {
    setErr(""); setCourseModal({ open: true, editing: c, form: { ...c }, slugTouched: true });
  }
  async function saveCourse() {
    setSaving(true); setErr("");
    const f = courseModal.form;
    try {
      const editing = courseModal.editing;
      const res = await fetch(editing ? `/api/admin/courses/${editing.id}` : "/api/admin/courses", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: f.title, slug: f.slug, description: f.description, level: f.level,
          category: f.category, thumbnailEmoji: f.thumbnailEmoji, accent: f.accent,
          isFree: !!f.isFree, sortOrder: Number(f.sortOrder) || 0, published: f.published !== false,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Gagal menyimpan"); return; }
      if (editing) {
        setCourses((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c)));
      } else {
        setCourses((prev) => [...prev, { ...data, lessonCount: 0 }].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      setCourseModal((m) => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }
  async function deleteCourse(c: Course) {
    if (!confirm(`Hapus kelas "${c.title}" beserta semua pelajarannya? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await fetch(`/api/admin/courses/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      setCourses((prev) => prev.filter((x) => x.id !== c.id));
      setLessonsByCourse((prev) => { const n = { ...prev }; delete n[c.id]; return n; });
    } else { alert("Gagal menghapus kelas"); }
  }

  // ─── Pelajaran ───
  function openNewLesson(courseId: string) {
    const count = (lessonsByCourse[courseId] || []).length;
    setErr(""); setLessonModal({ open: true, courseId, editing: null, form: { ...emptyLesson(courseId), sortOrder: count } });
  }
  function openEditLesson(l: Lesson) {
    setErr(""); setLessonModal({ open: true, courseId: l.courseId, editing: l, form: { ...l } });
  }
  async function saveLesson() {
    setSaving(true); setErr("");
    const f = lessonModal.form;
    try {
      const editing = lessonModal.editing;
      const res = await fetch(editing ? `/api/admin/lessons/${editing.id}` : "/api/admin/lessons", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: lessonModal.courseId, section: f.section || "Umum", title: f.title,
          description: f.description, videoUrl: f.videoUrl, durationMin: Number(f.durationMin) || 0,
          content: f.content, isPreview: !!f.isPreview, sortOrder: Number(f.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Gagal menyimpan"); return; }
      setLessonsByCourse((prev) => {
        const list = [...(prev[lessonModal.courseId] || [])];
        if (editing) {
          const i = list.findIndex((x) => x.id === editing.id);
          if (i >= 0) list[i] = { ...list[i], ...data };
        } else {
          list.push(data);
        }
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...prev, [lessonModal.courseId]: list };
      });
      if (!editing) setCourses((prev) => prev.map((c) => (c.id === lessonModal.courseId ? { ...c, lessonCount: (c.lessonCount || 0) + 1 } : c)));
      setLessonModal((m) => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }
  async function deleteLesson(l: Lesson) {
    if (!confirm(`Hapus pelajaran "${l.title}"?`)) return;
    const res = await fetch(`/api/admin/lessons/${l.id}`, { method: "DELETE" });
    if (res.ok) {
      setLessonsByCourse((prev) => ({ ...prev, [l.courseId]: (prev[l.courseId] || []).filter((x) => x.id !== l.id) }));
      setCourses((prev) => prev.map((c) => (c.id === l.courseId ? { ...c, lessonCount: Math.max(0, (c.lessonCount || 1) - 1) } : c)));
    } else { alert("Gagal menghapus pelajaran"); }
  }

  const totalLessons = Object.values(lessonsByCourse).reduce((a, l) => a + l.length, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#0866FF]" /> Kelola Kelas (LMS)
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{courses.length} kelas · {totalLessons} pelajaran. Kelola konten Kelas Premium di sini.</p>
        </div>
        <button onClick={openNewCourse} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Tambah Kelas
        </button>
      </div>

      {/* Daftar kelas */}
      <div className="space-y-3">
        {courses.map((c) => {
          const isOpen = expanded === c.id;
          const lessons = lessonsByCourse[c.id] || [];
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <button onClick={() => setExpanded(isOpen ? null : c.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">{c.thumbnailEmoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1c2b33] truncate">{c.title}</p>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c.level}</span>
                    {c.isFree ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">Gratis</span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Premium</span>
                    )}
                    {c.published ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> Terbit</span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 flex items-center gap-0.5"><EyeOff className="w-2.5 h-2.5" /> Draf</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">/{c.slug} · {c.category} · {lessons.length} pelajaran</p>
                </div>
                <button onClick={() => openEditCourse(c)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Edit kelas"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteCourse(c)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Hapus kelas"><Trash2 className="w-4 h-4" /></button>
              </div>

              {isOpen && (
                <div className="border-t border-gray-50 bg-gray-50/40 p-4 space-y-2">
                  {lessons.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Belum ada pelajaran.</p>}
                  {lessons.map((l, i) => (
                    <div key={l.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-2.5">
                      <span className="w-6 h-6 rounded-md bg-[#e7f0ff] text-[#0866FF] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#1c2b33] truncate">{l.title}</p>
                          {l.isPreview && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">Pratinjau</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{l.section} · {l.durationMin} menit</p>
                      </div>
                      <button onClick={() => openEditLesson(l)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteLesson(l)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => openNewLesson(c.id)} className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-500 hover:border-[#0866FF] hover:text-[#0866FF] transition-colors mt-2">
                    <Plus className="w-4 h-4" /> Tambah Pelajaran
                  </button>
                  <p className="text-[11px] text-gray-400 text-center pt-1">Soal ujian kelas ini dikelola di menu <b>Sertifikasi &amp; Ujian</b>.</p>
                </div>
              )}
            </div>
          );
        })}
        {courses.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            Belum ada kelas. Klik "Tambah Kelas" untuk membuat yang pertama.
          </div>
        )}
      </div>

      {/* ─── Modal Kelas ─── */}
      {courseModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setCourseModal((m) => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33]">{courseModal.editing ? "Edit Kelas" : "Tambah Kelas Baru"}</h2>
              <button onClick={() => setCourseModal((m) => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <Field label="Judul kelas">
                <input value={courseModal.form.title ?? ""} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, title: e.target.value, slug: m.slugTouched ? m.form.slug : slugify(e.target.value) } }))} className={inputCls} placeholder="mis. Dasar-Dasar Meta Ads" />
              </Field>
              <Field label="Slug URL">
                <input value={courseModal.form.slug ?? ""} onChange={(e) => setCourseModal((m) => ({ ...m, slugTouched: true, form: { ...m.form, slug: e.target.value } }))} className={inputCls} placeholder="dasar-meta-ads" />
              </Field>
              <Field label="Deskripsi">
                <textarea value={courseModal.form.description ?? ""} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, description: e.target.value } }))} rows={2} className={inputCls} placeholder="Ringkasan isi kelas…" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Level">
                  <select value={courseModal.form.level} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, level: e.target.value } }))} className={inputCls}>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Kategori">
                  <input value={courseModal.form.category ?? ""} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, category: e.target.value } }))} className={inputCls} placeholder="mis. Targeting" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Emoji thumbnail">
                  <input value={courseModal.form.thumbnailEmoji ?? ""} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, thumbnailEmoji: e.target.value } }))} className={inputCls} placeholder="📘" maxLength={4} />
                </Field>
                <Field label="Urutan (sortOrder)">
                  <input type="number" value={courseModal.form.sortOrder ?? 0} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
                </Field>
              </div>
              <Field label="Warna aksen">
                <div className="flex gap-2">
                  {ACCENTS.map((a) => (
                    <button key={a.key} onClick={() => setCourseModal((m) => ({ ...m, form: { ...m.form, accent: a.key } }))} className={`w-8 h-8 rounded-lg ${a.cls} transition-all ${courseModal.form.accent === a.key ? "ring-2 ring-offset-2 ring-gray-400" : "opacity-60 hover:opacity-100"}`} title={a.key} />
                  ))}
                </div>
              </Field>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={!!courseModal.form.isFree} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, isFree: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Kelas gratis (tanpa langganan)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={courseModal.form.published !== false} onChange={(e) => setCourseModal((m) => ({ ...m, form: { ...m.form, published: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Terbitkan
                </label>
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}</div>}
            </div>
            <ModalFooter onCancel={() => setCourseModal((m) => ({ ...m, open: false }))} onSave={saveCourse} saving={saving} disabled={!courseModal.form.title || !courseModal.form.slug} />
          </div>
        </div>
      )}

      {/* ─── Modal Pelajaran ─── */}
      {lessonModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setLessonModal((m) => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#0866FF]" /> {lessonModal.editing ? "Edit Pelajaran" : "Tambah Pelajaran"}</h2>
              <button onClick={() => setLessonModal((m) => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <Field label="Judul pelajaran">
                <input value={lessonModal.form.title ?? ""} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, title: e.target.value } }))} className={inputCls} placeholder="mis. Struktur akun Meta Ads" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bagian (section)">
                  <input value={lessonModal.form.section ?? ""} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, section: e.target.value } }))} className={inputCls} placeholder="mis. Pengenalan" />
                </Field>
                <Field label="Durasi (menit)">
                  <input type="number" value={lessonModal.form.durationMin ?? 0} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, durationMin: Number(e.target.value) } }))} className={inputCls} />
                </Field>
              </div>
              <Field label="Deskripsi singkat">
                <input value={lessonModal.form.description ?? ""} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, description: e.target.value } }))} className={inputCls} placeholder="Ringkasan 1 kalimat" />
              </Field>
              <Field label="URL Video YouTube (opsional)">
                <input value={lessonModal.form.videoUrl ?? ""} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, videoUrl: e.target.value } }))} className={inputCls} placeholder="mis. https://youtu.be/xxxx atau link watch?v=…" />
                <p className="text-[11px] text-gray-400 mt-1">Tempel link YouTube. Kosongkan bila belum ada video. Disarankan set video sebagai <b>Unlisted</b> di YouTube.</p>
              </Field>
              <Field label="Materi / konten">
                <textarea value={lessonModal.form.content ?? ""} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, content: e.target.value } }))} rows={5} className={inputCls} placeholder="Tulis materi pelajaran. Pisahkan paragraf dengan baris kosong." />
              </Field>
              <div className="grid grid-cols-2 gap-3 items-center">
                <Field label="Urutan (sortOrder)">
                  <input type="number" value={lessonModal.form.sortOrder ?? 0} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-5">
                  <input type="checkbox" checked={!!lessonModal.form.isPreview} onChange={(e) => setLessonModal((m) => ({ ...m, form: { ...m.form, isPreview: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Pratinjau gratis
                </label>
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}</div>}
            </div>
            <ModalFooter onCancel={() => setLessonModal((m) => ({ ...m, open: false }))} onSave={saveLesson} saving={saving} disabled={!lessonModal.form.title} />
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30 focus:border-[#0866FF]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ModalFooter({ onCancel, onSave, saving, disabled }: { onCancel: () => void; onSave: () => void; saving: boolean; disabled: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
      <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Batal</button>
      <button onClick={onSave} disabled={saving || disabled} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</> : <><Check className="w-4 h-4" /> Simpan</>}
      </button>
    </div>
  );
}
