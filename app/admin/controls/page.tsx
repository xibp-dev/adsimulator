"use client";

import { useState } from "react";
import { Sliders, Play, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export default function AdminControlsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const triggerAction = async (action: string, url: string, method: string = "POST") => {
    setLoading(action);
    setStatusMessage(null);
    try {
      const res = await fetch(url, { method });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`Sukses: ${data.message || "Aksi berhasil dieksekusi."}`);
      } else {
        setStatusMessage(`Error: ${data.error || "Gagal mengeksekusi aksi."}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: Terjadi kesalahan koneksi (${e.message})`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-[#1c2b33]">Kontrol Simulasi</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kendalikan mesin simulasi, evaluasi otomatis, dan pergerakan hari pada iklan aktif.</p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border text-sm font-medium ${
          statusMessage.startsWith("Sukses") 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Review Ticking Engine */}
        <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0866FF] flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#1c2b33] text-sm">Mesin Evaluasi Iklan (Tick)</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Menjalankan evaluasi otomatis terhadap iklan yang saat ini berada di status <span className="font-semibold text-amber-600">IN_REVIEW</span>. Sistem akan menyaring kata-kata terlarang berdasarkan kebijakan iklan Meta.
            </p>
          </div>
          <button
            onClick={() => triggerAction("review", "/api/simulator/tick", "GET")}
            disabled={!!loading}
            className="w-full bg-[#0866FF] hover:bg-blue-750 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            {loading === "review" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Jalankan Evaluasi Kebijakan (Tick)
          </button>
        </div>

        {/* 2. Daily Stats Progression */}
        <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#1c2b33] text-sm">Simulasi Pergerakan Hari (Daily Progress)</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Menghasilkan data performa baru (Reach, Impressions, Conversions, spent) untuk seluruh iklan berstatus <span className="font-semibold text-emerald-600">ACTIVE</span> seolah-olah waktu berjalan 1 hari ke depan. Saldo user akan dipotong secara proporsional.
            </p>
          </div>
          <button
            onClick={() => triggerAction("progress", "/api/admin/simulator/progress", "POST")}
            disabled={!!loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            {loading === "progress" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sliders className="w-4 h-4" />
            )}
            Simulasikan Progres Hari Baru (+1 Hari)
          </button>
        </div>

        {/* 3. Reset Simulation */}
        <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4 md:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-650 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#1c2b33] text-sm">Bersihkan / Reset Seluruh Metrik</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Menghapus total statistik visual, diagram, dan riwayat metrics (Reach, CTR, spent) dari database untuk seluruh campaign aktif. Opsi ini berguna untuk membersihkan riwayat sebelum kelas simulator baru dimulai. <span className="font-bold text-red-500">Iklan dan campaign user tetap tersimpan sebagai DRAFT/ACTIVE namun grafiknya akan kosong.</span>
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat metrik diagram simulator? Aksi ini tidak dapat dibatalkan!")) {
                triggerAction("reset", "/api/admin/simulator/reset", "POST");
              }
            }}
            disabled={!!loading}
            className="w-full bg-red-600 hover:bg-red-755 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            {loading === "reset" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            Bersihkan Seluruh Grafik & Metrik Simulator
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-50 border border-[#dddfe2] rounded-xl p-4 flex gap-3 items-start">
        <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-500 space-y-1.5">
          <p className="font-bold text-gray-700">Petunjuk Pembelajaran:</p>
          <p>
            Gunakan <strong>Mesin Evaluasi Iklan</strong> setelah mahasiswa mempublikasikan kampanye iklan mereka agar statusnya berubah menjadi aktif/ditolak.
          </p>
          <p>
            Gunakan <strong>Simulasi Pergerakan Hari</strong> secara berkala (misal setiap akhir sesi kuliah atau hari berikutnya) agar grafik ads manager di dashboard masing-masing mahasiswa bergerak naik dan menayangkan metrik performa.
          </p>
        </div>
      </div>
    </div>
  );
}
