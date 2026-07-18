"use client";

import { useState } from "react";
import { saveSurveyConfig } from "./actions";
import { DEFAULT_SURVEY_CONFIG, type SurveyConfig } from "@/lib/siteSettings";
import {
  Save, Loader2, CheckCircle2, Plus, Trash2, GripVertical,
  Megaphone, Briefcase, Phone, Globe, Share2, RotateCcw
} from "lucide-react";

interface Props {
  initialConfig: SurveyConfig;
}

export default function SurveyConfigForm({ initialConfig }: Props) {
  const [config, setConfig] = useState<SurveyConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof SurveyConfig>(key: K, value: SurveyConfig[K]) {
    setConfig(c => ({ ...c, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await saveSurveyConfig(config);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error ?? "Gagal menyimpan.");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefault() {
    if (confirm("Reset semua pertanyaan ke default?")) {
      setConfig(DEFAULT_SURVEY_CONFIG);
      setSaved(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Q1 */}
      <QuestionCard
        number={1}
        icon={<Megaphone className="w-4 h-4 text-[#0866FF]" />}
        color="blue"
        title="Pertanyaan 1 — Pengalaman Beriklan"
      >
        <LabelInput label="Teks Pertanyaan" value={config.q1Label} onChange={v => setField("q1Label", v)} />
        <OptionsEditor
          label="Pilihan Jawaban"
          options={config.q1Options.map(o => o.display)}
          onChangeOptions={opts => setField("q1Options", opts.map((d, i) => ({
            value: config.q1Options[i]?.value ?? d.replace(/^[^\w]*/, "").trim(),
            display: d
          })))}
          optionValues={config.q1Options.map(o => o.value)}
          onChangeValues={vals => setField("q1Options", config.q1Options.map((o, i) => ({ ...o, value: vals[i] ?? o.value })))}
          showValues
        />
      </QuestionCard>

      {/* Q2 */}
      <QuestionCard
        number={2}
        icon={<Briefcase className="w-4 h-4 text-purple-600" />}
        color="purple"
        title="Pertanyaan 2 — Profesi"
      >
        <LabelInput label="Teks Pertanyaan" value={config.q2Label} onChange={v => setField("q2Label", v)} />
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pilihan Profesi</label>
          <div className="space-y-1.5">
            {config.q2Options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <input
                  value={opt}
                  onChange={e => {
                    const next = [...config.q2Options];
                    next[i] = e.target.value;
                    setField("q2Options", next);
                  }}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                />
                <button
                  onClick={() => setField("q2Options", config.q2Options.filter((_, j) => j !== i))}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setField("q2Options", [...config.q2Options, "Pilihan Baru"])}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866FF] hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Pilihan
          </button>
        </div>
      </QuestionCard>

      {/* Q3 */}
      <QuestionCard
        number={3}
        icon={<Phone className="w-4 h-4 text-green-600" />}
        color="green"
        title="Pertanyaan 3 — WhatsApp"
      >
        <LabelInput label="Teks Pertanyaan" value={config.q3Label} onChange={v => setField("q3Label", v)} />
        <LabelInput label="Placeholder Input" value={config.q3Placeholder} onChange={v => setField("q3Placeholder", v)} />
        <RequiredToggle label="Wajib diisi" checked={config.q3Required} onChange={v => setField("q3Required", v)} />
      </QuestionCard>

      {/* Q4 */}
      <QuestionCard
        number={4}
        icon={<Globe className="w-4 h-4 text-amber-600" />}
        color="amber"
        title="Pertanyaan 4 — Website"
      >
        <LabelInput label="Teks Pertanyaan" value={config.q4Label} onChange={v => setField("q4Label", v)} />
        <OptionsEditor
          label="Pilihan Jawaban"
          options={config.q4Options.map(o => o.display)}
          onChangeOptions={opts => setField("q4Options", opts.map((d, i) => ({
            value: config.q4Options[i]?.value ?? d,
            display: d
          })))}
          optionValues={config.q4Options.map(o => o.value)}
          onChangeValues={vals => setField("q4Options", config.q4Options.map((o, i) => ({ ...o, value: vals[i] ?? o.value })))}
          showValues
        />
      </QuestionCard>

      {/* Q5 */}
      <QuestionCard
        number={5}
        icon={<Share2 className="w-4 h-4 text-pink-500" />}
        color="pink"
        title="Pertanyaan 5 — Media Sosial"
      >
        <LabelInput label="Teks Pertanyaan" value={config.q5Label} onChange={v => setField("q5Label", v)} />
        <LabelInput label="Sub-label / Hint" value={config.q5Sublabel} onChange={v => setField("q5Sublabel", v)} />
        <LabelInput label="Placeholder Input" value={config.q5Placeholder} onChange={v => setField("q5Placeholder", v)} />
        <RequiredToggle label="Wajib diisi" checked={config.q5Required} onChange={v => setField("q5Required", v)} />
      </QuestionCard>

      {/* Actions */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow shadow-[#0866FF]/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
        <button
          onClick={resetToDefault}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset ke Default
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function QuestionCard({
  number, icon, color, title, children
}: {
  number: number;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "amber" | "pink";
  title: string;
  children: React.ReactNode;
}) {
  const colorMap = {
    blue:   "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    green:  "bg-green-50 border-green-100",
    amber:  "bg-amber-50 border-amber-100",
    pink:   "bg-pink-50 border-pink-100",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${colorMap[color]}`}>
        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function LabelInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0866FF] bg-gray-50 text-gray-800 transition-all"
      />
    </div>
  );
}

function RequiredToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-[#0866FF]" : "bg-gray-200"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function OptionsEditor({
  label, options, onChangeOptions, optionValues, onChangeValues, showValues
}: {
  label: string;
  options: string[];
  onChangeOptions: (opts: string[]) => void;
  optionValues: string[];
  onChangeValues: (vals: string[]) => void;
  showValues?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Tampilan (emoji+teks)</p>
              <input
                value={opt}
                onChange={e => { const n = [...options]; n[i] = e.target.value; onChangeOptions(n); }}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white"
                placeholder="✅ Ya, Pernah"
              />
            </div>
            {showValues && (
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Nilai tersimpan di DB</p>
                <input
                  value={optionValues[i] ?? ""}
                  onChange={e => { const n = [...optionValues]; n[i] = e.target.value; onChangeValues(n); }}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white font-mono"
                  placeholder="Pernah"
                />
              </div>
            )}
            <button
              onClick={() => {
                onChangeOptions(options.filter((_, j) => j !== i));
                onChangeValues(optionValues.filter((_, j) => j !== i));
              }}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          onChangeOptions([...options, "Pilihan Baru"]);
          onChangeValues([...optionValues, "pilihan_baru"]);
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0866FF] hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Pilihan
      </button>
    </div>
  );
}
