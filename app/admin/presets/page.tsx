"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Database, Info, Globe, Calendar, Tag } from "lucide-react";

interface Preset {
  id: string;
  type: string;
  name: string;
  data: string;
  createdAt: string;
}

export default function AdminPresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"AUDIENCE" | "FANSPAGE" | "PIXEL">("AUDIENCE");
  
  // Form states
  const [name, setName] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Audience detailed form states
  const [location, setLocation] = useState("Indonesia");
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(65);
  const [gender, setGender] = useState("ALL");
  const [interests, setInterests] = useState("");

  // Fanspage detailed form states
  const [category, setCategory] = useState("Local Business");
  const [bio, setBio] = useState("");

  // Pixel detailed form states
  const [websiteUrl, setWebsiteUrl] = useState("https://");

  const fetchPresets = async () => {
    try {
      const res = await fetch("/api/presets");
      if (res.ok) {
        const data = await res.json();
        setPresets(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const handleCreatePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setActionLoading(true);

    let dataStr = "";
    if (activeTab === "AUDIENCE") {
      const interestsArray = interests
        ? interests.split(",").map((i) => i.trim()).filter((i) => i.length > 0)
        : [];
      dataStr = JSON.stringify({
        locations: [location],
        ageMin,
        ageMax,
        genders: gender === "ALL" ? ["MALE", "FEMALE"] : [gender],
        detailedTargeting: interestsArray,
      });
    } else if (activeTab === "FANSPAGE") {
      dataStr = JSON.stringify({ category, bio });
    } else if (activeTab === "PIXEL") {
      dataStr = JSON.stringify({ websiteUrl });
    }

    try {
      const res = await fetch("/api/admin/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, name, data: dataStr }),
      });
      if (res.ok) {
        const newPreset = await res.json();
        setPresets([newPreset, ...presets]);
        setName("");
        setInterests("");
        setBio("");
        setWebsiteUrl("https://");
        alert("Preset berhasil ditambahkan!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    if (!confirm("Hapus preset ini?")) return;
    try {
      const res = await fetch(`/api/admin/presets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPresets(presets.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentPresets = presets.filter((p) => p.type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#1c2b33]">Preset Target & Aset</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola preset global yang dapat digunakan mahasiswa saat menyusun iklan.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["AUDIENCE", "FANSPAGE", "PIXEL"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 px-6 font-semibold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? "border-[#0866FF] text-[#0866FF]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab === "AUDIENCE" ? "Target Audiens" : tab === "FANSPAGE" ? "Fanspage" : "Pixel / Dataset"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4 self-start">
          <h3 className="font-bold text-[#1c2b33] text-sm">
            Tambah Preset {activeTab === "AUDIENCE" ? "Audiens" : activeTab === "FANSPAGE" ? "Fanspage" : "Pixel"} Baru
          </h3>
          <form onSubmit={handleCreatePreset} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Nama Preset</label>
              <input
                type="text"
                placeholder={
                  activeTab === "AUDIENCE"
                    ? "Contoh: Pecinta Kopi & Kuliner"
                    : activeTab === "FANSPAGE"
                    ? "Contoh: Butik Mode Wanita"
                    : "Contoh: Pixel Landing Page Utama"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                required
              />
            </div>

            {/* AUDIENCE SPECIFIC FIELDS */}
            {activeTab === "AUDIENCE" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Lokasi Penargetan</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Usia Min</label>
                    <input
                      type="number"
                      value={ageMin}
                      onChange={(e) => setAgeMin(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                      min={13}
                      max={65}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Usia Max</label>
                    <input
                      type="number"
                      value={ageMax}
                      onChange={(e) => setAgeMax(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                      min={ageMin}
                      max={65}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Jenis Kelamin (Gender)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                  >
                    <option value="ALL">Semua Gender</option>
                    <option value="MALE">Laki-laki saja</option>
                    <option value="FEMALE">Perempuan saja</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Minat (Detailed Targeting) - Pisahkan koma</label>
                  <textarea
                    placeholder="Contoh: Kopi, Kafe, Restoran, Shopee"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800 h-20"
                  />
                </div>
              </>
            )}

            {/* FANSPAGE SPECIFIC FIELDS */}
            {activeTab === "FANSPAGE" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Kategori Halaman</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Bio / Deskripsi Singkat</label>
                  <textarea
                    placeholder="Deskripsi singkat halaman..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800 h-20"
                  />
                </div>
              </>
            )}

            {/* PIXEL SPECIFIC FIELDS */}
            {activeTab === "PIXEL" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Domain / URL Target Utama</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800 font-mono"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-[#0866FF] hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Tambah Preset
            </button>
          </form>
        </div>

        {/* Presets List */}
        <div className="lg:col-span-2 bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50 flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-500" />
            <h3 className="font-bold text-[#1c2b33] text-sm">Daftar Preset Aktif</h3>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
              <span>Memuat data preset...</span>
            </div>
          ) : currentPresets.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              Belum ada preset untuk kategori ini.
            </div>
          ) : (
            <div className="divide-y divide-gray-150 text-xs">
              {currentPresets.map((preset) => {
                const data = JSON.parse(preset.data);
                return (
                  <div key={preset.id} className="p-4 flex items-start justify-between hover:bg-slate-50 transition-colors gap-4">
                    <div className="space-y-1.5 flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{preset.name}</h4>
                      
                      {activeTab === "AUDIENCE" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Lokasi: {data.locations?.join(", ")}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Usia: {data.ageMin} - {data.ageMax} tahun</span>
                          <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Gender: {data.genders?.join(", ")}</span>
                          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Minat: {data.detailedTargeting?.join(", ") || "—"}</span>
                        </div>
                      )}

                      {activeTab === "FANSPAGE" && (
                        <div className="text-gray-500 mt-1 space-y-1">
                          <p><strong className="text-gray-700">Kategori:</strong> {data.category}</p>
                          {data.bio && <p><strong className="text-gray-700">Bio:</strong> {data.bio}</p>}
                        </div>
                      )}

                      {activeTab === "PIXEL" && (
                        <div className="text-gray-500 mt-1">
                          <p><strong className="text-gray-700">Target Website:</strong> <code className="bg-slate-50 px-1 py-0.5 rounded border">{data.websiteUrl}</code></p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeletePreset(preset.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors mt-0.5"
                      title="Hapus Preset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
