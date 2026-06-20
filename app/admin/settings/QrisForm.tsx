"use client";

import { useState, useTransition } from "react";
import { QRCodeSVG } from "qrcode.react";
import { isValidQris, generateDynamicQris } from "@/lib/qris";
import { updateSiteSettings } from "@/lib/siteSettings";
import { CheckCircle2, AlertCircle, QrCode, Save, Eye, RotateCcw, Upload, Trash2, Loader2 } from "lucide-react";

interface Props {
  initialQris: string;
  initialQrisImageUrl: string;
}

export default function QrisForm({ initialQris, initialQrisImageUrl }: Props) {
  const [qrisInput, setQrisInput] = useState(initialQris);
  const [qrisImageUrl, setQrisImageUrl] = useState(initialQrisImageUrl);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [previewQris, setPreviewQris] = useState(initialQris);
  const [showPreview, setShowPreview] = useState(!!initialQris);
  const [uploading, setUploading] = useState(false);

  const isValid = qrisInput ? isValidQris(qrisInput) : true;

  function handlePreview() {
    if (!qrisInput || !isValid) return;
    setPreviewQris(qrisInput);
    setShowPreview(true);
  }

  function handleSave() {
    if (qrisInput && !isValid) {
      setError("QRIS tidak valid. Periksa kembali string QRIS Anda.");
      return;
    }
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await updateSiteSettings({ 
        qrisString: qrisInput.trim().toUpperCase(),
        qrisImageUrl: qrisImageUrl.trim()
      });
      if (res.success) {
        setSaved(true);
        if (qrisInput) {
          setPreviewQris(qrisInput.trim().toUpperCase());
          setShowPreview(true);
        } else {
          setShowPreview(false);
        }
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error ?? "Gagal menyimpan.");
      }
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mengunggah file");
      }

      setQrisImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah");
    } finally {
      setUploading(false);
    }
  }

  // Preview dengan nominal contoh Rp 10.000
  let previewDynamic = "";
  try {
    if (previewQris && isValidQris(previewQris)) {
      previewDynamic = generateDynamicQris(previewQris, 10000);
    }
  } catch {
    previewDynamic = "";
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
          String QRIS Statis
        </label>
        <p className="text-xs text-gray-400 mb-2.5 leading-relaxed">
          Paste string QRIS statis (teks) dari aplikasi dompet digitalmu. Terlihat seperti:{" "}
          <code className="bg-gray-100 text-gray-600 px-1 rounded text-[11px]">
            00020101021226...6304XXXX
          </code>
        </p>
        <textarea
          value={qrisInput}
          onChange={(e) => {
            setQrisInput(e.target.value.trim());
            setError("");
            setSaved(false);
          }}
          rows={4}
          placeholder="00020101021226570..."
          className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent resize-none bg-gray-50"
          spellCheck={false}
        />
        {/* Validation status */}
        <div className="mt-2 flex items-center gap-2">
          {qrisInput.length > 10 ? (
            isValid ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Format QRIS valid ✓
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Format QRIS tidak dikenali
              </span>
            )
          ) : null}
        </div>
      </div>

      {/* Upload QRIS Image */}
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">
          Atau Unggah Photo / Gambar QRIS
        </label>
        <p className="text-xs text-gray-400 mb-2.5 leading-relaxed">
          Unggah gambar QRIS statis (screenshot atau file cetak QRIS) sebagai cadangan jika QRIS dinamis tidak dapat di-generate.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={qrisImageUrl}
            onChange={(e) => setQrisImageUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]/40 focus:border-[#0866FF] bg-gray-50 focus:bg-white transition-colors"
          />
          
          <label className="flex items-center gap-2 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors flex-shrink-0">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0866FF]" />
            ) : (
              <Upload className="w-4 h-4 text-gray-500" />
            )}
            <span>{uploading ? "Mengunggah..." : "Pilih Gambar"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {qrisImageUrl && (
            <button
              type="button"
              onClick={() => setQrisImageUrl("")}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors flex-shrink-0"
              title="Hapus gambar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {qrisImageUrl && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl inline-block">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Preview Photo QRIS</p>
            <img src={qrisImageUrl} alt="QRIS Uploaded" className="max-h-36 object-contain rounded border border-gray-200" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Saved */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Konfigurasi QRIS berhasil disimpan!
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreview}
          disabled={!qrisInput || !isValid}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[#dddfe2] rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Eye className="w-4 h-4" />
          Preview QR Dinamis
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isPending || uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Menyimpan..." : "Simpan Pengaturan QRIS"}
        </button>
        {(qrisInput || qrisImageUrl) && (
          <button
            onClick={() => { setQrisInput(""); setQrisImageUrl(""); setShowPreview(false); setError(""); }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Preview QR */}
      {showPreview && previewDynamic && (
        <div className="border border-[#dddfe2] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#dddfe2] bg-white">
            <QrCode className="w-4 h-4 text-[#0866FF]" />
            <p className="text-sm font-semibold text-[#1c2b33]">Preview QR Dinamis</p>
            <span className="text-xs text-gray-400 ml-auto">Contoh nominal: Rp 10.000</span>
          </div>
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#dddfe2]">
              <QRCodeSVG
                value={previewDynamic}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500">
                Scan QR ini dengan aplikasi dompet digital
              </p>
              <p className="text-xs font-mono text-gray-300 max-w-xs break-all px-4">
                {previewDynamic.slice(0, 40)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cara mendapatkan QRIS string */}
      <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-4 text-xs text-amber-800 leading-relaxed space-y-1">
        <p className="font-semibold text-amber-900">💡 Cara mendapatkan string QRIS statis:</p>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>Buka aplikasi dompet digital (GoPay, OVO, DANA, ShopeePay, dll.)</li>
          <li>Buka fitur "Terima Uang" / "QR Saya"</li>
          <li>Tap "Bagikan" → pilih opsi "Salin kode QRIS" atau screenshot</li>
          <li>Jika hanya bisa screenshot: upload ke <a href="https://zxing.org/w/decode.jspx" target="_blank" rel="noopener noreferrer" className="underline font-medium">zxing.org</a> untuk decode teks</li>
        </ol>
      </div>
    </div>
  );
}
