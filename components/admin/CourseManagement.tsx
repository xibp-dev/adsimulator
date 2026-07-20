"use client";

import { useState } from "react";
import {
  GraduationCap, Plus, Pencil, Trash2, Loader2, X, Check,
  Lock, Eye, EyeOff, BookOpen, AlertCircle, ChevronDown, ChevronRight,
  Video, Layers, LayoutGrid, FolderOpen,
} from "lucide-react";

interface Program {
  id: string; slug: string; title: string; description: string;
  thumbnailEmoji: string; accent: string; isFree: boolean;
  published: boolean; sortOrder: number; courseCount?: number;
}
interface Course {
  id: string; slug: string; title: string; description: string; level: string;
  category: string; thumbnailEmoji: string; accent: string; isFree: boolean;
  sortOrder: number; published: boolean; createdAt: string; lessonCount?: number;
  programId?: string | null;
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
const ACCENT_COLORS: Record<string, { bg: string; text: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-600" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600" },
  pink:    { bg: "bg-pink-50",    text: "text-pink-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600" },
};
const LEVELS = ["Pemula", "Menengah", "Lanjutan"];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

const emptyProgram = (): Partial<Program> => ({
  title: "", slug: "", description: "", thumbnailEmoji: "📊", accent: "blue", isFree: false, published: true, sortOrder: 0,
});
const emptyCourse = (programId?: string): Partial<Course> => ({
  title: "", slug: "", description: "", level: "Pemula", category: "Meta Ads",
  thumbnailEmoji: "📘", accent: "blue", isFree: false, sortOrder: 0, published: true, programId: programId ?? null,
});
const emptyLesson = (courseId: string): Partial<Lesson> => ({
  courseId, section: "Umum", title: "", description: "", videoUrl: "",
  durationMin: 5, content: "", isPreview: false, sortOrder: 0,
});

export default function CourseManagement({
  initialCourses, initialLessons, initialPrograms,
}: { initialCourses: Course[]; initialLessons: Lesson[]; initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lessonsByCourse, setLessonsByCourse] = useState<Record<string, Lesson[]>>(() => {
    const map: Record<string, Lesson[]> = {};
    initialLessons.forEach((l) => { (map[l.courseId] ??= []).push(l); });
    return map;
  });

  const [expandedProgram, setExpandedProgram] = useState<string | null>(initialPrograms[0]?.id ?? null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ── Program modal ──
  type ProgramModal = { open: boolean; editing: Program | null; form: Partial<Program>; slugTouched: boolean };
  const [programModal, setProgramModal] = useState<ProgramModal>({ open: false, editing: null, form: emptyProgram(), slugTouched: false });

  // ── Course modal ──
  type CourseModal = { open: boolean; editing: Course | null; form: Partial<Course>; slugTouched: boolean };
  const [courseModal, setCourseModal] = useState<CourseModal>({ open: false, editing: null, form: emptyCourse(), slugTouched: false });

  // ── Lesson modal ──
  type LessonModal = { open: boolean; courseId: string; editing: Lesson | null; form: Partial<Lesson> };
  const [lessonModal, setLessonModal] = useState<LessonModal>({ open: false, courseId: "", editing: null, form: {} });

  // ═══ Program CRUD ═══
  async function saveProgram() {
    setSaving(true); setErr("");
    const f = programModal.form;
    try {
      const editing = programModal.editing;
      const res = await fetch(editing ? `/api/admin/programs/${editing.id}` : "/api/admin/programs", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Gagal menyimpan"); return; }
      if (editing) {
        setPrograms(prev => prev.map(p => p.id === editing.id ? { ...p, ...data } : p));
      } else {
        setPrograms(prev => [...prev, { ...data, courseCount: 0 }].sort((a, b) => a.sortOrder - b.sortOrder));
        setExpandedProgram(data.id);
      }
      setProgramModal(m => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }
  async function deleteProgram(p: Program) {
    if (!confirm(`Hapus program "${p.title}"? Modul di dalamnya tidak ikut terhapus.`)) return;
    const res = await fetch(`/api/admin/programs/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      setPrograms(prev => prev.filter(x => x.id !== p.id));
      // Unlink courses
      setCourses(prev => prev.map(c => c.programId === p.id ? { ...c, programId: null } : c));
    } else { alert("Gagal menghapus program"); }
  }

  // ═══ Course CRUD ═══
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
          programId: f.programId ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Gagal menyimpan"); return; }
      if (editing) {
        setCourses(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c));
      } else {
        setCourses(prev => [...prev, { ...data, lessonCount: 0 }]);
        setExpandedCourse(data.id);
      }
      setCourseModal(m => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }
  async function deleteCourse(c: Course) {
    if (!confirm(`Hapus modul "${c.title}" beserta semua pelajarannya?`)) return;
    const res = await fetch(`/api/admin/courses/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      setCourses(prev => prev.filter(x => x.id !== c.id));
      setLessonsByCourse(prev => { const n = { ...prev }; delete n[c.id]; return n; });
    } else { alert("Gagal menghapus modul"); }
  }

  // ═══ Lesson CRUD ═══
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
      setLessonsByCourse(prev => {
        const list = [...(prev[lessonModal.courseId] || [])];
        if (editing) {
          const i = list.findIndex(x => x.id === editing.id);
          if (i >= 0) list[i] = { ...list[i], ...data };
        } else { list.push(data); }
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...prev, [lessonModal.courseId]: list };
      });
      if (!editing) setCourses(prev => prev.map(c => c.id === lessonModal.courseId ? { ...c, lessonCount: (c.lessonCount || 0) + 1 } : c));
      setLessonModal(m => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }
  async function deleteLesson(l: Lesson) {
    if (!confirm(`Hapus pelajaran "${l.title}"?`)) return;
    const res = await fetch(`/api/admin/lessons/${l.id}`, { method: "DELETE" });
    if (res.ok) {
      setLessonsByCourse(prev => ({ ...prev, [l.courseId]: (prev[l.courseId] || []).filter(x => x.id !== l.id) }));
      setCourses(prev => prev.map(c => c.id === l.courseId ? { ...c, lessonCount: Math.max(0, (c.lessonCount || 1) - 1) } : c));
    } else { alert("Gagal menghapus pelajaran"); }
  }

  const totalCourses = courses.length;
  const totalLessons = Object.values(lessonsByCourse).reduce((a, l) => a + l.length, 0);

  return (
    <div className="space-y-5 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-[#0866FF]" /> Kelola Kelas & Program
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{programs.length} program · {totalCourses} modul · {totalLessons} pelajaran</p>
        </div>
        <button
          onClick={() => { setErr(""); setProgramModal({ open: true, editing: null, form: emptyProgram(), slugTouched: false }); }}
          className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Program
        </button>
      </div>

      {/* Program list */}
      <div className="space-y-3">
        {programs.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
            Belum ada program. Klik "Tambah Program" untuk memulai.
          </div>
        )}

        {programs.map(prog => {
          const progCourses = courses.filter(c => c.programId === prog.id).sort((a, b) => a.sortOrder - b.sortOrder);
          const isOpen = expandedProgram === prog.id;
          const ac = ACCENT_COLORS[prog.accent] ?? ACCENT_COLORS.blue;

          return (
            <div key={prog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Program row */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button onClick={() => setExpandedProgram(isOpen ? null : prog.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <div className={`w-11 h-11 rounded-xl ${ac.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {prog.thumbnailEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1c2b33]">{prog.title}</p>
                    {prog.isFree
                      ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">Gratis</span>
                      : <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-0.5"><Lock className="w-2.5 h-2.5" /> Premium</span>
                    }
                    {prog.published
                      ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> Terbit</span>
                      : <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 flex items-center gap-0.5"><EyeOff className="w-2.5 h-2.5" /> Draf</span>
                    }
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">/{prog.slug} · {progCourses.length} modul</p>
                </div>
                <button
                  onClick={() => { setErr(""); setProgramModal({ open: true, editing: prog, form: { ...prog }, slugTouched: true }); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Edit program"
                ><Pencil className="w-4 h-4" /></button>
                <button
                  onClick={() => deleteProgram(prog)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400" title="Hapus program"
                ><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* Modules inside program */}
              {isOpen && (
                <div className="border-t border-gray-50 bg-gray-50/50 p-4 space-y-2">
                  {progCourses.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4 italic">Belum ada modul di program ini.</p>
                  )}

                  {progCourses.map((c, idx) => {
                    const cAc = ACCENT_COLORS[c.accent] ?? ACCENT_COLORS.blue;
                    const lessons = lessonsByCourse[c.id] || [];
                    const isCourseOpen = expandedCourse === c.id;

                    return (
                      <div key={c.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {/* Module row */}
                        <div className="flex items-center gap-3 px-4 py-3">
                          <button onClick={() => setExpandedCourse(isCourseOpen ? null : c.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            {isCourseOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <div className={`w-8 h-8 rounded-lg ${cAc.bg} flex items-center justify-center text-base flex-shrink-0`}>{c.thumbnailEmoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-gray-400">#{idx + 1}</span>
                              <p className="text-sm font-semibold text-[#1c2b33] truncate">{c.title}</p>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{c.level}</span>
                              {c.isFree && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">Gratis</span>}
                              {!c.published && <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-gray-100 text-gray-400">Draf</span>}
                            </div>
                            <p className="text-[11px] text-gray-400">/{c.slug} · {lessons.length} pelajaran</p>
                          </div>
                          <button onClick={() => { setErr(""); setCourseModal({ open: true, editing: c, form: { ...c }, slugTouched: true }); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteCourse(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>

                        {/* Lessons inside course */}
                        {isCourseOpen && (
                          <div className="border-t border-gray-50 bg-gray-50/40 px-4 py-3 space-y-1.5">
                            {lessons.length === 0 && <p className="text-xs text-gray-400 text-center py-3 italic">Belum ada pelajaran.</p>}
                            {lessons.map((l, li) => (
                              <div key={l.id} className="flex items-center gap-2.5 bg-white rounded-lg border border-gray-100 px-3 py-2 group">
                                <span className="w-5 h-5 rounded bg-[#e7f0ff] text-[#0866FF] text-[10px] font-bold flex items-center justify-center flex-shrink-0">{li + 1}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-medium text-[#1c2b33] truncate">{l.title}</p>
                                    {l.isPreview && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0">Preview</span>}
                                    {l.videoUrl && <Video className="w-3 h-3 text-[#0866FF] flex-shrink-0" />}
                                  </div>
                                  <p className="text-[10px] text-gray-400">{l.section} · {l.durationMin}m</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setErr(""); setLessonModal({ open: true, courseId: l.courseId, editing: l, form: { ...l } }); }} className="p-1 rounded hover:bg-gray-100 text-gray-400"><Pencil className="w-3 h-3" /></button>
                                  <button onClick={() => deleteLesson(l)} className="p-1 rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => { const count = lessons.length; setErr(""); setLessonModal({ open: true, courseId: c.id, editing: null, form: { ...emptyLesson(c.id), sortOrder: count } }); }}
                              className="w-full flex items-center justify-center gap-1 border border-dashed border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-400 hover:border-[#0866FF] hover:text-[#0866FF] transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" /> Tambah Pelajaran
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add module button */}
                  <button
                    onClick={() => { setErr(""); setCourseModal({ open: true, editing: null, form: emptyCourse(prog.id), slugTouched: false }); }}
                    className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-500 hover:border-[#0866FF] hover:text-[#0866FF] hover:bg-[#f5f8ff] transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Modul ke Program Ini
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Unassigned courses */}
        {(() => {
          const unassigned = courses.filter(c => !c.programId);
          if (unassigned.length === 0) return null;
          return (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5"><FolderOpen className="w-4 h-4" /> Modul Tanpa Program ({unassigned.length})</p>
              {unassigned.map(c => (
                <div key={c.id} className="flex items-center gap-2 bg-white rounded-xl border border-amber-100 px-3 py-2">
                  <span className="text-lg">{c.thumbnailEmoji}</span>
                  <p className="text-sm flex-1 font-medium text-gray-700 truncate">{c.title}</p>
                  <button onClick={() => { setErr(""); setCourseModal({ open: true, editing: c, form: { ...c }, slugTouched: true }); }} className="p-1.5 text-gray-400 hover:text-[#0866FF]"><Pencil className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* ─── Modal: Program ─── */}
      {programModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setProgramModal(m => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2"><Layers className="w-5 h-5 text-[#0866FF]" /> {programModal.editing ? "Edit Program" : "Tambah Program Baru"}</h2>
              <button onClick={() => setProgramModal(m => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <Field label="Nama program">
                <input value={programModal.form.title ?? ""} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, title: e.target.value, slug: m.slugTouched ? m.form.slug : slugify(e.target.value) } }))} className={inputCls} placeholder="mis. Meta Ads Premium" />
              </Field>
              <Field label="Slug URL">
                <input value={programModal.form.slug ?? ""} onChange={e => setProgramModal(m => ({ ...m, slugTouched: true, form: { ...m.form, slug: e.target.value } }))} className={inputCls} placeholder="meta-ads-premium" />
              </Field>
              <Field label="Deskripsi">
                <textarea value={programModal.form.description ?? ""} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, description: e.target.value } }))} rows={3} className={inputCls} placeholder="Belajar Meta Ads dari pemula hingga mahir…" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Emoji thumbnail">
                  <input value={programModal.form.thumbnailEmoji ?? ""} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, thumbnailEmoji: e.target.value } }))} className={inputCls} maxLength={4} placeholder="📊" />
                </Field>
                <Field label="Urutan (sortOrder)">
                  <input type="number" value={programModal.form.sortOrder ?? 0} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
                </Field>
              </div>
              <Field label="Warna aksen">
                <div className="flex gap-2">{ACCENTS.map(a => <button key={a.key} onClick={() => setProgramModal(m => ({ ...m, form: { ...m.form, accent: a.key } }))} className={`w-8 h-8 rounded-lg ${a.cls} transition-all ${programModal.form.accent === a.key ? "ring-2 ring-offset-2 ring-gray-400" : "opacity-60 hover:opacity-100"}`} />)}</div>
              </Field>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={!!programModal.form.isFree} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, isFree: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Gratis (tanpa langganan)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={programModal.form.published !== false} onChange={e => setProgramModal(m => ({ ...m, form: { ...m.form, published: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Terbitkan
                </label>
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {err}</div>}
            </div>
            <ModalFooter onCancel={() => setProgramModal(m => ({ ...m, open: false }))} onSave={saveProgram} saving={saving} disabled={!programModal.form.title || !programModal.form.slug} />
          </div>
        </div>
      )}

      {/* ─── Modal: Modul/Kelas ─── */}
      {courseModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setCourseModal(m => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#0866FF]" /> {courseModal.editing ? "Edit Modul" : "Tambah Modul Baru"}</h2>
              <button onClick={() => setCourseModal(m => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <Field label="Program">
                <select value={courseModal.form.programId ?? ""} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, programId: e.target.value || null } }))} className={inputCls}>
                  <option value="">— Tanpa program —</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </Field>
              <Field label="Judul modul">
                <input value={courseModal.form.title ?? ""} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, title: e.target.value, slug: m.slugTouched ? m.form.slug : slugify(e.target.value) } }))} className={inputCls} placeholder="mis. Dasar-Dasar Meta Ads" />
              </Field>
              <Field label="Slug URL">
                <input value={courseModal.form.slug ?? ""} onChange={e => setCourseModal(m => ({ ...m, slugTouched: true, form: { ...m.form, slug: e.target.value } }))} className={inputCls} placeholder="dasar-meta-ads" />
              </Field>
              <Field label="Deskripsi">
                <textarea value={courseModal.form.description ?? ""} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, description: e.target.value } }))} rows={2} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Level">
                  <select value={courseModal.form.level} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, level: e.target.value } }))} className={inputCls}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Urutan (sortOrder)">
                  <input type="number" value={courseModal.form.sortOrder ?? 0} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Emoji thumbnail">
                  <input value={courseModal.form.thumbnailEmoji ?? ""} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, thumbnailEmoji: e.target.value } }))} className={inputCls} maxLength={4} />
                </Field>
                <Field label="Warna aksen">
                  <div className="flex gap-1.5 mt-1">{ACCENTS.map(a => <button key={a.key} onClick={() => setCourseModal(m => ({ ...m, form: { ...m.form, accent: a.key } }))} className={`w-7 h-7 rounded-lg ${a.cls} transition-all ${courseModal.form.accent === a.key ? "ring-2 ring-offset-2 ring-gray-400" : "opacity-60 hover:opacity-100"}`} />)}</div>
                </Field>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={!!courseModal.form.isFree} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, isFree: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Modul gratis
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={courseModal.form.published !== false} onChange={e => setCourseModal(m => ({ ...m, form: { ...m.form, published: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Terbitkan
                </label>
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {err}</div>}
            </div>
            <ModalFooter onCancel={() => setCourseModal(m => ({ ...m, open: false }))} onSave={saveCourse} saving={saving} disabled={!courseModal.form.title || !courseModal.form.slug} />
          </div>
        </div>
      )}

      {/* ─── Modal: Pelajaran ─── */}
      {lessonModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setLessonModal(m => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#0866FF]" /> {lessonModal.editing ? "Edit Pelajaran" : "Tambah Pelajaran"}</h2>
              <button onClick={() => setLessonModal(m => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <Field label="Judul pelajaran">
                <input value={lessonModal.form.title ?? ""} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, title: e.target.value } }))} className={inputCls} placeholder="mis. Struktur akun Meta Ads" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bagian (section)">
                  <input value={lessonModal.form.section ?? ""} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, section: e.target.value } }))} className={inputCls} placeholder="mis. Pengenalan" />
                </Field>
                <Field label="Durasi (menit)">
                  <input type="number" value={lessonModal.form.durationMin ?? 0} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, durationMin: Number(e.target.value) } }))} className={inputCls} />
                </Field>
              </div>
              <Field label="Deskripsi singkat">
                <input value={lessonModal.form.description ?? ""} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, description: e.target.value } }))} className={inputCls} placeholder="Ringkasan 1 kalimat" />
              </Field>
              <Field label="URL Media (Video YouTube / Google Slides / PDF / Word)">
                <input value={lessonModal.form.videoUrl ?? ""} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, videoUrl: e.target.value } }))} className={inputCls} placeholder="mis. https://youtu.be/... atau link Google Slides / PDF" />
                <p className="text-[10px] text-gray-400 mt-1">
                  Mendukung: Video YouTube, Google Slides (embed/sharing link), Google Drive (PDF/Doc/Slides preview), Direct PDF link (.pdf), dan Microsoft Office links (.docx/.pptx).
                </p>
              </Field>
              <Field label="Materi / konten">
                <textarea value={lessonModal.form.content ?? ""} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, content: e.target.value } }))} rows={5} className={inputCls} placeholder="Tulis materi pelajaran…" />
              </Field>
              <div className="grid grid-cols-2 gap-3 items-center">
                <Field label="Urutan (sortOrder)">
                  <input type="number" value={lessonModal.form.sortOrder ?? 0} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-5">
                  <input type="checkbox" checked={!!lessonModal.form.isPreview} onChange={e => setLessonModal(m => ({ ...m, form: { ...m.form, isPreview: e.target.checked } }))} className="w-4 h-4 accent-[#0866FF]" />
                  Pratinjau gratis
                </label>
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {err}</div>}
            </div>
            <ModalFooter onCancel={() => setLessonModal(m => ({ ...m, open: false }))} onSave={saveLesson} saving={saving} disabled={!lessonModal.form.title} />
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30 focus:border-[#0866FF]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>{children}</div>;
}

function ModalFooter({ onCancel, onSave, saving, disabled }: { onCancel: () => void; onSave: () => void; saving: boolean; disabled: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
      <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Batal</button>
      <button onClick={onSave} disabled={saving || disabled} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl disabled:opacity-50">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</> : <><Check className="w-4 h-4" /> Simpan</>}
      </button>
    </div>
  );
}
