"use client";

import { useState, useCallback } from "react";
import {
  Video, Plus, Pencil, Trash2, Loader2, X, Check,
  AlertCircle, CheckCircle2, Award, Calendar, User, Link as LinkIcon, Eye, EyeOff, ClipboardList,
  Users, ShieldCheck, XCircle, RefreshCw
} from "lucide-react";
import type { Webinar, WebinarQuestion } from "@/types";

interface AttemptWithUser {
  id: string;
  userId: string;
  webinarId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  certNumber: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; image?: string | null };
}

interface QForm {
  question: string;
  options: string[];
  correctIndex: number;
  sortOrder: number;
}

const emptyWebinar = (): Partial<Webinar> => ({
  title: "",
  description: "",
  speaker: "",
  schedule: "",
  meetingLink: "",
  examPasscode: "",
  published: true,
  examDeadline: null,
});

const inputCls = "w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0866FF] transition-all";

function toInputDateTime(isoString?: string) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function WebinarManagement({
  initialWebinars,
  initialQuestions,
}: {
  initialWebinars: Webinar[];
  initialQuestions: WebinarQuestion[];
}) {
  const [webinars, setWebinars] = useState<Webinar[]>(initialWebinars);
  const [questionsByWebinar, setQuestionsByWebinar] = useState<Record<string, WebinarQuestion[]>>(() => {
    const map: Record<string, WebinarQuestion[]> = {};
    initialQuestions.forEach((q) => {
      (map[q.webinarId] ??= []).push(q);
    });
    return map;
  });

  const [selectedWebinarId, setSelectedWebinarId] = useState<string>(initialWebinars[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<"detail" | "exam" | "participants">("detail");

  // Attempts state per webinar
  const [attemptsByWebinar, setAttemptsByWebinar] = useState<Record<string, AttemptWithUser[]>>({});
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const fetchAttempts = useCallback(async (webinarId: string) => {
    setLoadingAttempts(true);
    try {
      const res = await fetch(`/api/admin/webinars/${webinarId}/attempts`);
      if (res.ok) {
        const data: AttemptWithUser[] = await res.json();
        setAttemptsByWebinar((prev) => ({ ...prev, [webinarId]: data }));
      }
    } catch {
      // silent fail
    } finally {
      setLoadingAttempts(false);
    }
  }, []);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Modals state
  const [webinarModal, setWebinarModal] = useState<{ open: boolean; editing: Webinar | null; form: Partial<Webinar> }>({
    open: false,
    editing: null,
    form: emptyWebinar(),
  });

  const [qModal, setQModal] = useState<{ open: boolean; editing: WebinarQuestion | null; form: QForm }>({
    open: false,
    editing: null,
    form: { question: "", options: ["", "", "", ""], correctIndex: 0, sortOrder: 0 },
  });

  const selectedWebinar = webinars.find((w) => w.id === selectedWebinarId);
  const currentQuestions = questionsByWebinar[selectedWebinarId] || [];

  // Webinar Actions
  function openNewWebinar() {
    setErr("");
    const scheduleDate = new Date();
    scheduleDate.setDate(scheduleDate.getDate() + 1); // default besok
    setWebinarModal({
      open: true,
      editing: null,
      form: { ...emptyWebinar(), schedule: scheduleDate.toISOString() },
    });
  }

  function openEditWebinar(w: Webinar) {
    setErr("");
    setWebinarModal({
      open: true,
      editing: w,
      form: { ...w },
    });
  }

  async function saveWebinar() {
    const f = webinarModal.form;
    if (!f.title?.trim()) { setErr("Judul webinar wajib diisi."); return; }
    if (!f.speaker?.trim()) { setErr("Nama pemateri wajib diisi."); return; }
    if (!f.schedule) { setErr("Jadwal wajib ditentukan."); return; }

    setSaving(true);
    setErr("");

    try {
      const editing = webinarModal.editing;
      const res = await fetch(editing ? `/api/admin/webinars/${editing.id}` : "/api/admin/webinars", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: f.title,
          description: f.description ?? "",
          speaker: f.speaker,
          schedule: f.schedule,
          meetingLink: f.meetingLink ?? "",
          examPasscode: f.examPasscode ?? "",
          published: f.published !== false,
          examDeadline: f.examDeadline || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Gagal menyimpan webinar");
        return;
      }

      if (editing) {
        setWebinars((prev) => prev.map((w) => (w.id === editing.id ? data : w)));
      } else {
        setWebinars((prev) => [data, ...prev]);
        setSelectedWebinarId(data.id);
      }
      setWebinarModal((m) => ({ ...m, open: false }));
    } catch {
      setErr("Gagal terhubung ke server");
    } finally {
      setSaving(false);
    }
  }

  async function deleteWebinar(w: Webinar) {
    if (!confirm(`Hapus webinar "${w.title}" beserta semua soal ujiannya? Tindakan ini tidak bisa dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/admin/webinars/${w.id}`, { method: "DELETE" });
      if (res.ok) {
        setWebinars((prev) => prev.filter((x) => x.id !== w.id));
        setQuestionsByWebinar((prev) => {
          const next = { ...prev };
          delete next[w.id];
          return next;
        });
        if (selectedWebinarId === w.id) {
          setSelectedWebinarId(webinars.find((x) => x.id !== w.id)?.id ?? "");
        }
      } else {
        alert("Gagal menghapus webinar");
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  }

  // Question Actions
  function openNewQuestion() {
    setErr("");
    setQModal({
      open: true,
      editing: null,
      form: {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        sortOrder: currentQuestions.length,
      },
    });
  }

  function openEditQuestion(q: WebinarQuestion) {
    let options: string[] = [];
    try {
      options = JSON.parse(q.options);
    } catch {
      options = ["", ""];
    }
    setErr("");
    setQModal({
      open: true,
      editing: q,
      form: {
        question: q.question,
        options,
        correctIndex: q.correctIndex,
        sortOrder: q.sortOrder,
      },
    });
  }

  async function saveQuestion() {
    const f = qModal.form;
    const cleanOptions = f.options.map((o) => o.trim()).filter(Boolean);

    if (!f.question.trim()) { setErr("Pertanyaan wajib diisi."); return; }
    if (cleanOptions.length < 2) { setErr("Minimal 2 pilihan jawaban."); return; }
    if (f.correctIndex >= cleanOptions.length) { setErr("Pilih jawaban benar yang valid."); return; }

    setSaving(true);
    setErr("");

    try {
      const editing = qModal.editing;
      const res = await fetch(editing ? `/api/admin/webinar-questions/${editing.id}` : "/api/admin/webinar-questions", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webinarId: selectedWebinarId,
          question: f.question,
          options: cleanOptions,
          correctIndex: f.correctIndex,
          sortOrder: Number(f.sortOrder) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Gagal menyimpan soal");
        return;
      }

      setQuestionsByWebinar((prev) => {
        const list = [...(prev[selectedWebinarId] || [])];
        if (editing) {
          const i = list.findIndex((x) => x.id === editing.id);
          if (i >= 0) list[i] = data;
        } else {
          list.push(data);
        }
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...prev, [selectedWebinarId]: list };
      });

      setQModal((m) => ({ ...m, open: false }));
    } catch {
      setErr("Gagal terhubung ke server");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuestion(q: WebinarQuestion) {
    if (!confirm("Hapus soal ujian ini?")) return;

    try {
      const res = await fetch(`/api/admin/webinar-questions/${q.id}`, { method: "DELETE" });
      if (res.ok) {
        setQuestionsByWebinar((prev) => ({
          ...prev,
          [q.webinarId]: (prev[q.webinarId] || []).filter((x) => x.id !== q.id),
        }));
      } else {
        alert("Gagal menghapus soal");
      }
    } catch {
      alert("Gagal terhubung ke server");
    }
  }

  // Question option helpers
  function setOpt(i: number, val: string) {
    setQModal((m) => {
      const options = [...m.form.options];
      options[i] = val;
      return { ...m, form: { ...m.form, options } };
    });
  }

  function addOpt() {
    setQModal((m) =>
      m.form.options.length >= 6 ? m : { ...m, form: { ...m.form, options: [...m.form.options, ""] } }
    );
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
            <Video className="w-6 h-6 text-[#0866FF]" /> Kelola Webinar
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Jadwalkan webinar gratis untuk pengguna terdaftar dan sediakan ujian kelulusan berhadiah sertifikat.
          </p>
        </div>
        <button
          onClick={openNewWebinar}
          className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Webinar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Kolom Kiri: Daftar Webinar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1c2b33]">Pilih Webinar</p>
              <p className="text-xs text-gray-400">Pilih webinar untuk mengelola soal & detail</p>
            </div>
            <span className="text-xs font-bold bg-[#e7f0ff] text-[#0866FF] px-2.5 py-1 rounded-full">
              {webinars.length} webinar
            </span>
          </div>

          <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
            {webinars.map((w) => {
              const active = w.id === selectedWebinarId;
              const qCount = (questionsByWebinar[w.id] || []).length;
              const formattedDate = new Date(w.schedule).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWebinarId(w.id)}
                  className={`w-full flex items-start gap-3.5 px-5 py-4 text-left transition-colors ${
                    active ? "bg-[#e7f0ff]/50 border-l-4 border-[#0866FF]" : "hover:bg-gray-50/70"
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${active ? "bg-[#0866FF] text-white" : "bg-gray-50 text-gray-400"}`}>
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-bold leading-tight ${active ? "text-[#0866FF]" : "text-[#1c2b33]"}`}>
                      {w.title}
                    </span>
                    <span className="block text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> {w.speaker}
                    </span>
                    <span className="block text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formattedDate} WIB
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        w.published ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {w.published ? "Terbit" : "Draf"}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        qCount === 10 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {qCount}/10 Soal
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {webinars.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-12">Belum ada webinar. Tambah untuk membuat baru.</p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Detail & Soal Ujian */}
        <div className="lg:col-span-2 space-y-4">
          {selectedWebinar ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("detail")}
                  className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all ${
                    activeTab === "detail" ? "border-[#0866FF] text-[#0866FF]" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Informasi & Jadwal
                </button>
                <button
                  onClick={() => setActiveTab("exam")}
                  className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                    activeTab === "exam" ? "border-[#0866FF] text-[#0866FF]" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Ujian Sertifikat ({currentQuestions.length}/10)
                </button>
                <button
                  onClick={() => {
                    setActiveTab("participants");
                    if (!attemptsByWebinar[selectedWebinarId]) {
                      fetchAttempts(selectedWebinarId);
                    }
                  }}
                  className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 ${
                    activeTab === "participants" ? "border-[#0866FF] text-[#0866FF]" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Users className="w-4 h-4" /> Peserta & Sertifikat
                </button>
              </div>

              {/* TAB CONTENT: DETAIL */}
              {activeTab === "detail" && (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1c2b33]">{selectedWebinar.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">Dibuat oleh Admin · Klik tombol edit untuk memperbarui data.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditWebinar(selectedWebinar)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600"
                        title="Edit Webinar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWebinar(selectedWebinar)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500"
                        title="Hapus Webinar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Pemateri / Pembicara</span>
                      <p className="text-sm font-bold text-[#1c2b33] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#0866FF]" /> {selectedWebinar.speaker}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Jadwal Acara</span>
                      <p className="text-sm font-bold text-[#1c2b33] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#0866FF]" />
                        {new Date(selectedWebinar.schedule).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })} WIB
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Tautan Video / Meeting Webinar</span>
                      {selectedWebinar.meetingLink ? (
                        <p className="text-sm font-semibold text-[#0866FF] flex items-center gap-1.5 break-all">
                          <LinkIcon className="w-4 h-4" />
                          <a href={selectedWebinar.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {selectedWebinar.meetingLink}
                          </a>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                          <LinkIcon className="w-4 h-4" /> Belum diisi.
                        </p>
                      )}
                    </div>
                     <div className="p-4 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Kode Akses Ujian (Passcode)</span>
                      {selectedWebinar.examPasscode ? (
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-mono">{selectedWebinar.examPasscode}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                          Tanpa kode (Terbuka bebas)
                        </p>
                      )}
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Batas Waktu Ujian (Deadline)</span>
                      {selectedWebinar.examDeadline ? (
                        <p className="text-sm font-bold text-red-650 flex items-center gap-1.5 text-red-600">
                          <Calendar className="w-4 h-4 text-red-500" />
                          {new Date(selectedWebinar.examDeadline).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })} WIB
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                          Tanpa batas waktu (Selalu terbuka)
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deskripsi / Topik Bahasan</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl whitespace-pre-line leading-relaxed">
                      {selectedWebinar.description || "Belum ada deskripsi untuk webinar ini."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: EXAM */}
              {activeTab === "exam" && (
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#1c2b33] flex items-center gap-1.5">
                        <ClipboardList className="w-5 h-5 text-amber-500" /> Kelola Soal Ujian
                      </h3>
                      <p className="text-xs text-gray-400">Minimal disarankan 10 soal ujian untuk webinar ini. Nilai kelulusan &gt;= 80.</p>
                    </div>
                    <button
                      onClick={openNewQuestion}
                      className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Soal
                    </button>
                  </div>

                  {currentQuestions.length !== 10 && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold">Perhatian</p>
                        <p className="mt-0.5">Sesuai ketentuan, ujian harus memiliki **tepat 10 pertanyaan** agar materi sertifikasi webinar ini dapat diuji secara maksimal.</p>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-gray-100">
                    {currentQuestions.map((q, idx) => {
                      let opts: string[] = [];
                      try {
                        opts = JSON.parse(q.options);
                      } catch {}
                      return (
                        <div key={q.id} className="flex items-start gap-3.5 py-4 hover:bg-gray-50/30">
                          <span className="w-6 h-6 rounded-lg bg-violet-50 text-violet-600 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1c2b33] leading-relaxed">{q.question}</p>
                            <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              {opts[q.correctIndex] ?? "?"}
                              <span className="text-gray-300">|</span>
                              <span className="text-gray-400 font-normal">{opts.length} opsi</span>
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => openEditQuestion(q)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteQuestion(q)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {currentQuestions.length === 0 && (
                      <div className="text-center py-16">
                        <p className="text-sm text-gray-400">Belum ada soal ujian untuk webinar ini.</p>
                        <button
                          onClick={openNewQuestion}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#0866FF] hover:underline"
                        >
                          <Plus className="w-4 h-4" /> Tambah Soal Pertama
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* TAB CONTENT: PARTICIPANTS */}
              {activeTab === "participants" && (() => {
                const attempts = attemptsByWebinar[selectedWebinarId] || [];
                const passedList = attempts.filter((a) => a.passed);
                const failedList = attempts.filter((a) => !a.passed);
                const passRate = attempts.length > 0 ? Math.round((passedList.length / attempts.length) * 100) : 0;

                return (
                  <div className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#1c2b33] flex items-center gap-1.5">
                          <Users className="w-5 h-5 text-[#0866FF]" /> Peserta & Hasil Ujian
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">Data semua pengguna yang sudah mengikuti ujian webinar ini.</p>
                      </div>
                      <button
                        onClick={() => fetchAttempts(selectedWebinarId)}
                        disabled={loadingAttempts}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0866FF] transition-colors disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingAttempts ? "animate-spin" : ""}`} />
                        Refresh
                      </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-[#e7f0ff] rounded-xl p-4 space-y-1">
                        <p className="text-xs text-[#0866FF] font-semibold">Total Peserta Ujian</p>
                        <p className="text-2xl font-extrabold text-[#0866FF]">{attempts.length}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 space-y-1">
                        <p className="text-xs text-emerald-600 font-semibold">Lulus & Bersertifikat</p>
                        <p className="text-2xl font-extrabold text-emerald-600">{passedList.length}</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 space-y-1">
                        <p className="text-xs text-red-500 font-semibold">Belum Lulus</p>
                        <p className="text-2xl font-extrabold text-red-500">{failedList.length}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 space-y-1">
                        <p className="text-xs text-amber-600 font-semibold">Tingkat Kelulusan</p>
                        <p className="text-2xl font-extrabold text-amber-600">{passRate}%</p>
                      </div>
                    </div>

                    {/* Table */}
                    {loadingAttempts ? (
                      <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" /> Memuat data peserta...
                      </div>
                    ) : attempts.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-400">Belum ada peserta yang mengikuti ujian webinar ini.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Peserta</th>
                              <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Skor</th>
                              <th className="text-center text-xs font-bold text-gray-400 px-4 py-3">Status</th>
                              <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">No. Sertifikat</th>
                              <th className="text-left text-xs font-bold text-gray-400 px-4 py-3">Tanggal Ujian</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {attempts.map((attempt) => (
                              <tr key={attempt.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    {attempt.user.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={attempt.user.image} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                      <div className="w-7 h-7 rounded-full bg-[#e7f0ff] flex items-center justify-center flex-shrink-0">
                                        <User className="w-3.5 h-3.5 text-[#0866FF]" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-[#1c2b33] truncate max-w-[160px]">{attempt.user.name || "Unknown"}</p>
                                      <p className="text-[10px] text-gray-400 truncate max-w-[160px]">{attempt.user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`text-sm font-extrabold ${
                                    attempt.passed ? "text-emerald-600" : "text-red-500"
                                  }`}>
                                    {attempt.score}%
                                  </span>
                                  <p className="text-[10px] text-gray-400">{attempt.correctCount}/{attempt.totalCount} benar</p>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-center">
                                    {attempt.passed ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                                        <ShieldCheck className="w-3 h-3" /> Lulus
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-50 text-red-500 px-2 py-1 rounded-lg">
                                        <XCircle className="w-3 h-3" /> Belum Lulus
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {attempt.certNumber ? (
                                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                                      {attempt.certNumber}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-300">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-xs text-gray-500">
                                    {new Date(attempt.createdAt).toLocaleDateString("id-ID", {
                                      day: "numeric", month: "short", year: "numeric"
                                    })}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {new Date(attempt.createdAt).toLocaleTimeString("id-ID", {
                                      hour: "2-digit", minute: "2-digit"
                                    })} WIB
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
              <Video className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">Belum ada webinar terpilih atau terdaftar.</p>
              <button
                onClick={openNewWebinar}
                className="mt-4 bg-[#0866FF] hover:bg-[#0757d4] text-white text-xs font-semibold px-4 py-2.5 rounded-xl"
              >
                Buat Webinar Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── MODAL WEBINAR ─── */}
      {webinarModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setWebinarModal((m) => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#0866FF]" />
                {webinarModal.editing ? "Edit Detail Webinar" : "Jadwalkan Webinar Baru"}
              </h2>
              <button onClick={() => setWebinarModal((m) => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Topik / Judul Webinar</label>
                <input
                  value={webinarModal.form.title ?? ""}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, title: e.target.value } }))}
                  className={inputCls}
                  placeholder="mis. Kupas Tuntas Pixel Facebook Ads"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nama Pemateri</label>
                <input
                  value={webinarModal.form.speaker ?? ""}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, speaker: e.target.value } }))}
                  className={inputCls}
                  placeholder="mis. Andi Wijaya (Senior Digital Marketer)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Jadwal Tanggal & Waktu</label>
                  <input
                    type="datetime-local"
                    value={toInputDateTime(webinarModal.form.schedule)}
                    onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, schedule: e.target.value } }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Status Publikasi</label>
                  <select
                    value={String(webinarModal.form.published)}
                    onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, published: e.target.value === "true" } }))}
                    className={inputCls}
                  >
                    <option value="true">Terbitkan (Tampil di User)</option>
                    <option value="false">Draf (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Tautan Webinar / Streaming (Zoom / YouTube Live)</label>
                <input
                  value={webinarModal.form.meetingLink ?? ""}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, meetingLink: e.target.value } }))}
                  className={inputCls}
                  placeholder="https://zoom.us/j/... atau https://youtube.com/live/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Kode Akses Ujian (Passcode) — Opsional</label>
                <input
                  value={webinarModal.form.examPasscode ?? ""}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, examPasscode: e.target.value } }))}
                  className={inputCls}
                  placeholder="mis. WEB100 (kosongkan jika tanpa kode)"
                />
                <p className="text-[10px] text-gray-400 mt-1">Ujian sertifikat tidak bisa diakses user sebelum memasukkan kode ini.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Batas Waktu Ujian (Deadline) — Opsional</label>
                <input
                  type="datetime-local"
                  value={toInputDateTime(webinarModal.form.examDeadline || undefined)}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, examDeadline: e.target.value || null } }))}
                  className={inputCls}
                />
                <p className="text-[10px] text-gray-400 mt-1">Setelah melewati tanggal/waktu ini, peserta tidak dapat mengakses/mengerjakan ujian lagi.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi & Topik Bahasan</label>
                <textarea
                  value={webinarModal.form.description ?? ""}
                  onChange={(e) => setWebinarModal((m) => ({ ...m, form: { ...m.form, description: e.target.value } }))}
                  className={inputCls}
                  rows={4}
                  placeholder="Jelaskan apa yang dibahas pada webinar ini..."
                />
              </div>

              {err && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {err}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setWebinarModal((m) => ({ ...m, open: false }))}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={saveWebinar}
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Simpan Webinar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL PERTANYAAN UJIAN ─── */}
      {qModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto" onClick={() => setQModal((m) => ({ ...m, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0866FF]" />
                {qModal.editing ? "Edit Soal Ujian" : "Tambah Soal Ujian"}
              </h2>
              <button onClick={() => setQModal((m) => ({ ...m, open: false }))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <p className="text-xs text-gray-400 -mt-1">
                Webinar: <b className="text-gray-600">{selectedWebinar?.title}</b>
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Pertanyaan</label>
                <textarea
                  value={qModal.form.question}
                  onChange={(e) => setQModal((m) => ({ ...m, form: { ...m.form, question: e.target.value } }))}
                  rows={3}
                  className={inputCls}
                  placeholder="Tulis pertanyaan ujian..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                  Pilihan Jawaban <span className="font-normal text-gray-400">— klik lingkaran hijau untuk jawaban benar</span>
                </label>
                <div className="space-y-2">
                  {qModal.form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQModal((m) => ({ ...m, form: { ...m.form, correctIndex: i } }))}
                        title="Tandai sebagai jawaban benar"
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                          qModal.form.correctIndex === i
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-300 text-transparent hover:border-emerald-400"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-gray-400 w-4">{String.fromCharCode(65 + i)}</span>
                      <input
                        value={opt}
                        onChange={(e) => setOpt(i, e.target.value)}
                        className={inputCls}
                        placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                      />
                      {qModal.form.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOpt(i)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {qModal.form.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOpt}
                    className="mt-2.5 text-xs font-bold text-[#0866FF] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pilihan Jawaban
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Urutan Tampil (Urutan)</label>
                  <input
                    type="number"
                    value={qModal.form.sortOrder}
                    onChange={(e) => setQModal((m) => ({ ...m, form: { ...m.form, sortOrder: Number(e.target.value) } }))}
                    className={inputCls}
                  />
                </div>
              </div>

              {err && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {err}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setQModal((m) => ({ ...m, open: false }))}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={saveQuestion}
                disabled={saving || !qModal.form.question.trim()}
                className="inline-flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan…
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Simpan Soal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
