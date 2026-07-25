"use client";

import { useState } from "react";
import {
  ClipboardList, Plus, Pencil, Trash2, Loader2, X, Check, AlertCircle, CheckCircle2, Award, BookOpen,
} from "lucide-react";

interface ClassLite {
  id: string;
  title: string;
  thumbnailEmoji: string;
  courses: { id: string; title: string }[];
}

interface Question {
  id: string; courseId: string; question: string; options: string; correctIndex: number; sortOrder: number; createdAt: string;
}

interface QForm { question: string; options: string[]; correctIndex: number; sortOrder: number; targetCourseId?: string; }

export default function ExamManagement({
  initialClasses, initialQuestions,
}: { initialClasses: ClassLite[]; initialQuestions: Question[] }) {
  // Map courseId ke classId
  const courseToClassMap = new Map<string, string>();
  initialClasses.forEach((cls) => {
    cls.courses.forEach((c) => courseToClassMap.set(c.id, cls.id));
  });

  const [questionsByClass, setQuestionsByClass] = useState<Record<string, Question[]>>(() => {
    const map: Record<string, Question[]> = {};
    initialQuestions.forEach((q) => {
      const classId = courseToClassMap.get(q.courseId) || q.courseId;
      (map[classId] ??= []).push(q);
    });
    return map;
  });

  const [selectedClassId, setSelectedClassId] = useState<string>(initialClasses[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [qModal, setQModal] = useState<{ open: boolean; editing: Question | null; form: QForm }>({
    open: false, editing: null, form: { question: "", options: ["", "", "", ""], correctIndex: 0, sortOrder: 0 },
  });

  const selectedClass = initialClasses.find((c) => c.id === selectedClassId);
  const questions = questionsByClass[selectedClassId] || [];
  const totalQuestions = Object.values(questionsByClass).reduce((a, l) => a + l.length, 0);

  function openNew() {
    setErr("");
    const defaultCourseId = selectedClass?.courses[0]?.id || "";
    setQModal({
      open: true,
      editing: null,
      form: { question: "", options: ["", "", "", ""], correctIndex: 0, sortOrder: questions.length, targetCourseId: defaultCourseId },
    });
  }

  function openEdit(q: Question) {
    let options: string[] = [];
    try { options = JSON.parse(q.options); } catch { options = ["", ""]; }
    setErr("");
    setQModal({
      open: true,
      editing: q,
      form: { question: q.question, options, correctIndex: q.correctIndex, sortOrder: q.sortOrder, targetCourseId: q.courseId },
    });
  }

  async function save() {
    const f = qModal.form;
    const cleanOptions = f.options.map((o) => o.trim()).filter((o) => o !== "");
    if (!f.question.trim()) { setErr("Pertanyaan wajib diisi."); return; }
    if (cleanOptions.length < 2) { setErr("Minimal 2 pilihan jawaban."); return; }
    if (f.correctIndex >= cleanOptions.length) { setErr("Pilih jawaban benar yang valid."); return; }

    const targetCourseId = f.targetCourseId || selectedClass?.courses[0]?.id;
    if (!targetCourseId) { setErr("Tidak ditemukan materi target di kelas ini."); return; }

    setSaving(true); setErr("");
    try {
      const editing = qModal.editing;
      const res = await fetch(editing ? `/api/admin/exam-questions/${editing.id}` : "/api/admin/exam-questions", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: targetCourseId, question: f.question, options: cleanOptions,
          correctIndex: f.correctIndex, sortOrder: Number(f.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Gagal menyimpan soal"); return; }
      setQuestionsByClass((prev) => {
        const list = [...(prev[selectedClassId] || [])];
        if (editing) {
          const i = list.findIndex((x) => x.id === editing.id);
          if (i >= 0) list[i] = data;
        } else {
          list.push(data);
        }
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...prev, [selectedClassId]: list };
      });
      setQModal((m) => ({ ...m, open: false }));
    } catch { setErr("Gagal terhubung ke server"); }
    finally { setSaving(false); }
  }

  async function remove(q: Question) {
    if (!confirm("Hapus soal ini?")) return;
    const res = await fetch(`/api/admin/exam-questions/${q.id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestionsByClass((prev) => ({
        ...prev,
        [selectedClassId]: (prev[selectedClassId] || []).filter((x) => x.id !== q.id),
      }));
    } else { alert("Gagal menghapus soal"); }
  }

  function setOpt(i: number, val: string) {
    setQModal((m) => { const options = [...m.form.options]; options[i] = val; return { ...m, form: { ...m.form, options } }; });
  }
  function addOpt() {
    setQModal((m) => m.form.options.length >= 6 ? m : { ...m, form: { ...m.form, options: [...m.form.options, ""] } });
  }
  function removeOpt(i: number) {
    setQModal((m) => {
      if (m.form.options.length <= 2) return m;
      const options = m.form.options.filter((_, idx) => idx !== i);
      let correctIndex = m.form.correctIndex;
      if (i === correctIndex) correctIndex = 0;
      else if (i < correctIndex) correctIndex -= 1;
      return { ...m, form: { ...m.form, options, correctIndex } };
    });
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1c2b33] flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" /> Kelola Ujian Sertifikasi Kelas
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalQuestions} soal di {initialClasses.length} kelas · nilai lulus di atas 85.</p>
        </div>
        <button onClick={openNew} disabled={!selectedClassId} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
          <Plus className="w-4 h-4" /> Tambah Soal Ujian
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daftar Kelas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-bold text-[#1c2b33]">Pilih Kelas</p>
            <p className="text-xs text-gray-400">Soal ujian dikelola per kelas/program</p>
          </div>
          <div className="divide-y divide-gray-50">
            {initialClasses.map((c) => {
              const n = (questionsByClass[c.id] || []).length;
              const active = c.id === selectedClassId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${active ? "bg-[#e7f0ff]" : "hover:bg-gray-50/70"}`}
                >
                  <span className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">{c.thumbnailEmoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-semibold truncate ${active ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>{c.title}</span>
                    <span className="block text-xs text-gray-400">{c.courses.length} modul materi</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${n > 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                    {n} soal
                  </span>
                </button>
              );
            })}
            {initialClasses.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-10">Belum ada kelas. Buat di Kelola Kelas dulu.</p>
            )}
          </div>
        </div>

        {/* Daftar Soal Kelas Terpilih */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 min-w-0">
              <ClipboardList className="w-4 h-4 text-[#0866FF] flex-shrink-0" />
              <p className="text-sm font-bold text-[#1c2b33] truncate">Ujian Sertifikasi: {selectedClass ? selectedClass.title : "—"}</p>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full flex-shrink-0">{questions.length} soal</span>
          </div>
          <div className="divide-y divide-gray-50">
            {questions.map((q, i) => {
              let opts: string[] = [];
              try { opts = JSON.parse(q.options); } catch {}
              return (
                <div key={q.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/50">
                  <span className="w-6 h-6 rounded-md bg-violet-50 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1c2b33]">{q.question}</p>
                    <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {opts[q.correctIndex] ?? "?"} <span className="text-gray-400">· {opts.length} pilihan</span>
                    </p>
                  </div>
                  <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(q)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              );
            })}
            {questions.length === 0 && (
              <div className="text-center py-12 px-6">
                <p className="text-sm text-gray-400 mb-3">Belum ada soal untuk kelas ini. Tanpa soal, ujian tidak muncul di menu Sertifikasi user.</p>
                <button onClick={openNew} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0866FF] hover:underline">
                  <Plus className="w-4 h-4" /> Tambah soal pertama
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Soal */}
      {qModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setQModal((m) => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0866FF]" /> {qModal.editing ? "Edit Soal Ujian" : "Tambah Soal Ujian"}
              </h2>
              <button onClick={() => setQModal((m) => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <p className="text-xs text-gray-400 -mt-1">Kelas: <b className="text-gray-600">{selectedClass?.title}</b></p>

              {/* Modul Target */}
              {selectedClass && selectedClass.courses.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Modul / Materi Terkait</label>
                  <select
                    value={qModal.form.targetCourseId}
                    onChange={(e) => setQModal((m) => ({ ...m, form: { ...m.form, targetCourseId: e.target.value } }))}
                    className={inputCls}
                  >
                    {selectedClass.courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pertanyaan</label>
                <textarea value={qModal.form.question} onChange={(e) => setQModal((m) => ({ ...m, form: { ...m.form, question: e.target.value } }))} rows={2} className={inputCls} placeholder="Tulis pertanyaan…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pilihan jawaban <span className="font-normal text-gray-400">— klik lingkaran untuk menandai jawaban benar</span></label>
                <div className="space-y-2">
                  {qModal.form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQModal((m) => ({ ...m, form: { ...m.form, correctIndex: i } }))}
                        title="Tandai sebagai jawaban benar"
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${qModal.form.correctIndex === i ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 text-transparent hover:border-emerald-400"}`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + i)}</span>
                      <input value={opt} onChange={(e) => setOpt(i, e.target.value)} className={inputCls} placeholder={`Pilihan ${String.fromCharCode(65 + i)}`} />
                      {qModal.form.options.length > 2 && (
                        <button type="button" onClick={() => removeOpt(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
                {qModal.form.options.length < 6 && (
                  <button type="button" onClick={addOpt} className="mt-2 text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah pilihan</button>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Urutan (sortOrder)</label>
                <input type="number" value={qModal.form.sortOrder} onChange={(e) => setQModal((m) => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))} className={inputCls} />
              </div>
              {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}</div>}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setQModal((m) => ({ ...m, open: false }))} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Batal</button>
              <button onClick={save} disabled={saving || !qModal.form.question.trim()} className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…</> : <><Check className="w-4 h-4" /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/30 focus:border-[#0866FF]";

